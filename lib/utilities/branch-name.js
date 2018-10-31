const spawn = require('child_process').spawnSync;
const config = require('./config');

let gitBranchName = '';

if (config.branchOverrides && config.branchOverrides.length) {
    config.branchOverrides.reverse().forEach(envName => {
        if (process.env[envName]) {
            gitBranchName = process.env[envName];
        }
    })
}

if (!gitBranchName) {
    gitBranchName = spawn('git', [ 'rev-parse', '--abbrev-ref', 'HEAD' ])
      .stdout
      .toString()
      .split('\n')
      [0];
}

const crowdinBranchName = gitBranchName.replace(/\//g, '--');

console.log(`Crowdin: Working on git branch: ${ gitBranchName }`);


module.exports.gitBranchName = gitBranchName;
module.exports.crowdinBranchName = crowdinBranchName;
