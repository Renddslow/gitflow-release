'use strict';
import path from 'path';
import semver from 'semver';
import pupa from 'pupa';

import Exec from './exec';
import Logger from './log';

interface Options {
  clone?: boolean;
  cwd?: string;
  host?: 'github' | 'bitbucket';
  releaseBranch?: string;
  releaseBranchCb?: (version: string) => void | Promise<void>;
  tagFormat?: string;
  verbose?: boolean;
}

const defaultOptions: Options = {
  clone: true,
  cwd: process.cwd(),
  tagFormat: 'v{major}.{minor}.{patch}{suffix}',
  verbose: false,
};

const getBaseUrl = (host: 'github' | 'bitbucket') =>
  host === 'github' ? 'https://github.com/' : 'https://bitbucket.org/';

export const release = (log = Logger, exec = Exec, cd = process.chdir) => async (
  repo: string,
  version: string,
  opts: Options = defaultOptions,
): Promise<string> => {
  const logger = log(opts.verbose);
  const run = exec(opts.verbose);
  opts = Object.assign({}, defaultOptions, opts);

  const startDir = process.cwd();

  if (opts.clone && !opts.host) {
    throw new Error('"host" must be specified in order to clone');
  }

  if (repo.split('/').length !== 2) {
    throw new Error('"repo" must be provided in the format "<repo-owner>/<repo-name>"');
  }

  if (!semver.valid(version)) {
    throw new Error('"version" must be a valid semver version');
  }

  version = semver.clean(version);
  const releaseBranch = opts.releaseBranch || `release/v${version}`;
  const repoUrl = `${getBaseUrl(opts.host)}${repo}`;
  const repoName = repo.split('/')[1];

  const [major, minor, ending] = version.split('.');
  const [, patch, suffix] = /([0-9]+)(.*)/g.exec(ending);
  const versionComponents = {
    major,
    minor,
    patch,
    suffix,
  };

  const tag = pupa(opts.tagFormat, versionComponents);

  logger(`Starting release on ${repo}. 🏗`);

  logger(`- Cloning from ${repoUrl}`);
  cd(opts.cwd);

  if (opts.clone) {
    run([`git clone ${repoUrl}`]);
  }

  cd(path.join(opts.cwd, repoName));

  run(['git checkout develop', 'git reset --hard', 'git pull origin develop']);

  logger(`- Checking out a release branch for version ${version}`);
  run([`git checkout -b ${releaseBranch}`]);

  if (opts.releaseBranchCb && typeof opts.releaseBranchCb === 'function') {
    const result = opts.releaseBranchCb(version);
    if (`${result}`.includes('Promise')) {
      await result;
    }
  }

  logger(`- Committing release changes`);
  run([`git add -A`, `git commit --allow-empty -m "Release v${version}"`]);

  logger(`- Tagging release`);
  run([`git tag ${tag}`]);

  logger(`- Merging release into master`);
  run([`git checkout master`, `git pull origin master`, `git merge ${releaseBranch}`]);

  logger(`- Pushing changes to master`);
  run([`git push origin master`, `git push --tags`]);

  logger(`- Cleaning up git environment`);
  run([
    `git branch -D ${releaseBranch}`,
    `git checkout develop`,
    `git merge master`,
    `git push origin develop`,
  ]);

  logger(`\n✨ The repo has been released.`);
  cd(startDir);

  return Promise.resolve(version);
};

export default release();
