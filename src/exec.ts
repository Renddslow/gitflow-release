'use strict';
import { execSync } from 'child_process';

export default (verbose: boolean = false) => (cmds: Array<string> = []) => {
  const cmd = cmds.join(' && ');
  if (verbose) {
    console.log(cmd);
  }

  return execSync(cmd, { stdio: verbose ? 'inherit' : 'pipe' });
};
