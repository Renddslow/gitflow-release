# GitFlow Release

> Do git-flow releases magically

## Install

```
yarn add gitflow-release
```

## Usage

```js
const release = require('gitflow-release');

release('Renddslow/gitflow-release', '1.0.0', { host: 'github' }).then((version) => {
  npmRelease(version);
  notifySlack(version);
});
```

## API

### `release(repo, version, opts)`

Runs a series of git commands in keeping with standard git-flow release workflow synchronously.

#### repo

- Type: `string`
- Required: ✅

A string indicating a repo owner and repo name in the format of: `<repo-owner>/<repo-name>`. Passing in a string outside of that format will present and error.

#### version

- Type: `string`
- Required: ✅

A valid semver string indicating the version of the repo that is being released. **Note**: `giftflow-release` will clean the version such that `v1.0.1` becomes `1.0.1`.

#### opts

- Type: `object`
- Required: ❌

##### Parameters

| Name            | Type                                           | Default                              | Description                                                                                                                                                                                                                                                                          |
| --------------- | ---------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| clone           | `boolean`                                      | `true`                               | Whether or not to clone the repository from remote. If the repo is already local, you can set this to false, and `gitflow-release` will assume the repository is in the `cwd`                                                                                                        |
| cwd             | `string`                                       | `process.cwd()`                      | The directory where you would like the repository to be cloned to                                                                                                                                                                                                                    |
| host            | `'github' \| 'bitbucket'`                      |                                      | This must be included if `clone` is true.                                                                                                                                                                                                                                            |
| releaseBranch   | `string`                                       | `release/v<version>`                 | By default we will base the release-branch name on the provided version, however, you can provide your own release branch name if you have a different system.                                                                                                                       |
| releaseBranchCb | `((version: string) => void \| Promise<void>)` |                                      |                                                                                                                                                                                                                                                                                      |
| tagFormat       | `string`                                       | `'v{major}.{minor}.{patch}{suffix}'` | A tag format that will be used to tag the commit via `git tag`. Your provided version will be parsed out, making `major`, `minor`, `patch`, and any additional "`suffix`" material available as variables. If you choose not to include any of those variables, that's fine as well. |
| verbose         | `boolean`                                      | `false`                              | Mark true to include log messages and stdout messages from every command                                                                                                                                                                                                             |
