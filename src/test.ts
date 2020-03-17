import test from 'ava';

import { release as Release } from './index';

const noopLogger = () => () => {};
const noopExec = () => (cmds) => {};
const noopChdir = () => {};

test('release - when clone flag is true and there is no host, error', async (t) => {
    t.plan(1);

    const release = Release(noopLogger, noopExec, noopChdir);
    release('Renddslow/gitflow-release', 'v0.1.0', {
        clone: true,
    }).catch((e) => {
        t.is(e.message, '"host" must be specified in order to clone');
    })
});

test('release - when repo is the wrong format, error', async (t) => {
    t.plan(1);

    const release = Release(noopLogger, noopExec, noopChdir);
    release('gitflow-release', 'v0.1.0', {
        host: 'github',
    }).catch((e) => {
        t.is(e.message, '"repo" must be provided in the format "<repo-owner>/<repo-name>"');
    })
});

test('release - when version is not a valid semver version, error', async (t) => {
    t.plan(1);

    const release = Release(noopLogger, noopExec, noopChdir);
    release('Renddslow/gitflow-release', 'version 34', {
        host: 'github',
    }).catch((e) => {
        t.is(e.message, '"version" must be a valid semver version');
    })
});

test('release - when clone flag is false, git clone is skipped', async (t) => {
    const exec = () => (cmds) => {
        t.false(cmds.includes('git clone https://github.com/Renddslow/gitflow-release'));
    };
    const release = Release(noopLogger, exec, noopChdir);
    await release('Renddslow/gitflow-release', 'v1.1.0', {
        clone: false,
    });
});

test('release - when releaseBranchCb is present, the function is called (sync)', (t) => {
    t.plan(1);

    const cb = () => {
        t.pass();
    };

    const release = Release(noopLogger, noopExec, noopChdir);
    release('Renddslow/gitflow-release', 'v1.1.1', { clone: false, releaseBranchCb: cb });
});

test('release - when releaseBranchCb is present, the function is called (async)', async (t) => {
    t.plan(1);

    const cb = (version): Promise<void> => new Promise((resolve) => {
        t.pass();
        return resolve();
    });

    const release = Release(noopLogger, noopExec, noopChdir);
    await release('Renddslow/gitflow-release', 'v1.1.1', { clone: false, releaseBranchCb: cb });
});
