const CrowdinApi = require('../utilities/crowdin-api');
const { crowdinBranchName } = require('../utilities/branch-name');
const sourceFilesPromise = require('../utilities/source-files-promise');
const COLORS = require('../utilities/colors');
const config = require('../utilities/config');


async function triggerAutoTranslation() {
  if (config.disableAutoTranslation) {
    console.log(`Crowdin: Auto-translation is disabled by "crowdin-helper.json"`);

    return;
  }

  console.log(`Crowdin: Triggering auto-translation of a branch: ${ crowdinBranchName }`);

  const sourceFilesWithBranchName = (await sourceFilesPromise)
    .map(fileName => crowdinBranchName + '/' + fileName);

  return CrowdinApi.preTranslate(sourceFilesWithBranchName)
    .then((json) => {
      if (!json.success) {
        console.log(`Crowdin: ${ COLORS.RED }Error:`);
        console.log(json, COLORS.WHITE);
      }
      if (config.pretranslateMachineEngine) {
          console.log(`Crowdin: Triggering auto-machine-translation of a branch: ${ crowdinBranchName }`);
          return CrowdinApi.preTranslateMachine(sourceFilesWithBranchName)
            .then((json) => {
              if (!json.success) {
                console.log(`Crowdin: ${ COLORS.RED }Error:`);
                console.log(json, COLORS.WHITE);
              }
            })
            .catch(e => {
              console.log(`Crowdin: ${ COLORS.RED }Error: Failed to machine auto-translate branch ${ crowdinBranchName }${ COLORS.WHITE }`);
              console.log(`Original error: ${ e }`);
            });
      }
    })
    .catch(e => {
      console.log(`Crowdin: ${ COLORS.RED }Error: Failed to auto-translate branch ${ crowdinBranchName }${ COLORS.WHITE }`);
      console.log(`Original error: ${ e }`);
    });
}


module.exports = triggerAutoTranslation;
