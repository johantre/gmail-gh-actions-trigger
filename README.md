# Gmail GitHub Actions trigger
This is a small script to build in Google Workspace that can be used to poll if there are new mails are incoming that meets certain conditions.
If the conditions are met, a GitHub Actions workflow from the [msword-properties-generator](https://github.com/johantre/msword-properties-generator) repo is triggered that generates the necessary document pair. 

## ⚠️ Dependencies ⚠️ 

- In Google Workspace: Setup a trigger that runs this script to poll for new incoming mail for that Google account.
- Add a github pat into the Project properties with the name "GH_CONNXPT_PAT" and value to a value that allows access to the GitHub Actions. 
- [msword-properties-generator](https://github.com/johantre/msword-properties-generator), as this repo actions is triggered in this script.

## Future enhancements

- remove the hard coded mail address

