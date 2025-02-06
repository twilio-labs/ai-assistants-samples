const {
  getAssistantSid,
} = require(Runtime.getAssets()["/utils.js"].path);

/**
 * @param {import('@twilio-labs/serverless-runtime-types/types').Context} context
 * @param {{}} event
 * @param {import('@twilio-labs/serverless-runtime-types/types').ServerlessCallback} callback
 */
exports.handler = async function(context, event, callback) {
  const assistantSid = await getAssistantSid(context, event);
  let greeting = event.greeting;
  if (greeting == '$VOICE_GREETING') {
    // Modify this parameter to customize your Assistant's default greeting
    greeting = "Thanks for calling; how can I help you?"
  }
  const twiml = `
    <Response>
      <Connect>
      <Assistant
        id="${assistantSid}"
        welcomeGreeting="${greeting}"
        voice="en-US-Journey-O">
      </Assistant>
    </Connect>
  </Response>`;

  const response = new Twilio.Response();
  response.appendHeader('Content-Type', 'text/xml');
  response.setBody(twiml);

  return callback(null, response);
};
