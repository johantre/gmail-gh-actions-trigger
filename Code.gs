const GITHUB_TOKEN = PropertiesService.getScriptProperties().getProperty('GH_CONNXPT_PAT');
const REPO_OWNER = 'johantre';
const REPO_NAME = 'msword-properties-generator';
const WORKFLOW_FILENAME = 'generate-send-email.yml';
const BRANCH = 'master';

function processNewEmails() {
  const threads = GmailApp.search('is:unread subject:"Connecting-Expertise notificaties"', 0, 30);
  const regexes = [
    / U ontving een aanvraag voor een (.+?) (\S+?) - .*? - van (.+?) te/g,
    / De aanvraag (.+?) (\S+?) .*? van (.+?) werd gewijzigd/g
  ];

  for (const thread of threads) {
    const messages = thread.getMessages();
    for (const message of messages) {
      const body = message.getPlainBody();
      for (const regex of regexes) {
        regexMatcher(body, regex, message);
      }
      message.markRead();
    }
  }
}

function regexMatcher(body, regex, message) {
  let match;

  while ((match = regex.exec(body)) !== null) {
    if (!message.isInInbox()) {
      continue;
    }
    const jobTitle = match[1].trim();
    const jobRef = match[2].trim();
    const klantNaam = match[3].trim();

    if (!/scrum|agile|coach/i.test(jobTitle)) {
      Logger.log(`Job "${jobTitle}" ❌ ignored! (no scrum/agile found in jobTitle) for pattern "${regex}"`);
      continue;
    }

    Logger.log(`Job "${jobTitle}" ✅ found! (scrum/agile found in jobTitle) for pattern "${regex}"`);
    labelEmail(message);
    sendGitHubDispatch(jobTitle, jobRef, klantNaam);
  }
}

function sanitizeFilename(input) {
  if (!input) return '';
  return input
    .replace(/[\/\\?%*:|"<>]/g, '')  // remove illegal filename characters
    .replace(/\s{2,}/g, ' ')         // remove double spaces
    .trim();
}

function sanitizeKlantNaam(input) {
  if (!input) return '';
  const noBraces = input.replace(/\s*\(.*?\)\s*/g, '');
  return sanitizeFilename(noBraces);
}

function labelEmail(message) {
  const labelName = 'ConnXpt/Processed';
  const label = GmailApp.getUserLabelByName(labelName);

  if (label) {
    message.getThread().addLabel(label);
  } else {
    Logger.log(`Label "${labelName}" bestaat niet.`);
  }
}

function sendGitHubDispatch(klantJobTitle, klantJobReference, klantNaam) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/workflows/${WORKFLOW_FILENAME}/dispatches`;

  const payload = JSON.stringify({
    ref: BRANCH,
    inputs: {
      klantNaam: sanitizeKlantNaam(klantNaam),
      klantJobTitle: sanitizeFilename(klantJobTitle),
      klantJobReference: sanitizeFilename(klantJobReference),
      sendEmail: true,
      leverancierEmail: 'johan.tre@telenet.be',
      uploadDropbox: true,
      setLogLevelDebug: false
    }
  });

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json'
    },
    payload: payload,
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  Logger.log(response.getResponseCode());
  Logger.log(response.getContentText());
}