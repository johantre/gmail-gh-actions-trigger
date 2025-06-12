# Gmail GitHub Actions trigger
This is a small script to build in Google Workspace that can be used to poll if there are new mails are incoming that meets certain conditions.
If the conditions are met, a GitHub Actions workflow from the [msword-properties-generator](https://github.com/johantre/msword-properties-generator) repo is triggered that generates the necessary document pair.\

This repo itself is hosting the code, and is foreseen with a workflow that pushes your changes to your Google Apps Script environment. 


## ⚠️ Dependencies ⚠️ 
### The actual code deployed at Google
- In Google Workspace: Setup a trigger that runs this script to poll for new incoming mail for that Google account.
- Add a github pat into the Project properties of Google Apps script environment with: 
  - name: "GH_CONNXPT_PAT" 
  - value: to set up in your github account: Settings > Developer Settings > Personal Access Tokens 
- [msword-properties-generator](https://github.com/johantre/msword-properties-generator), as this repo actions is triggered in this script.

### Deploying to Google
- mpn. package manager for getting clasp installed in your workflow. 
- clasp. The official tool to push code to Google Apps Script environment.\
This tool is not very stable, but the latest version allows you to get your change to Google by means of a "clasp push --force"\
It requires a github secret with credentials for google to execute though.\
Acquiring credentials happens by "clasp login" & following browser screen to allow the right permissions.\
This generates an .clasprc.json, which is to end up in your github secrets to run your workflow properly.

## Future enhancements

- remove the hard coded mail address

