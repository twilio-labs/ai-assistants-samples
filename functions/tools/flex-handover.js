/**
 * @param {import('@twilio-labs/serverless-runtime-types/types').Context} context
 * @param {{}} event
 * @param {import('@twilio-labs/serverless-runtime-types/types').ServerlessCallback} callback
 */
exports.handler = async function (context, event, callback) {
  const client = context.getTwilioClient();
  const { FLEX_WORKFLOW_SID, FLEX_WORKSPACE_SID } = context;

  if (!FLEX_WORKFLOW_SID || !FLEX_WORKSPACE_SID) {
    return callback(
      new Error(
        "Missing configuration for FLEX_WORKSPACE_SID OR FLEX_WORKFLOW_SID"
      )
    );
  }

  const [_serviceSid, conversationsSid] = event.request.headers['x-session-id']?.replace('conversations__', '').split("/");
  const [_traitName, identity] = event.request.headers['x-identity']?.split(':');

  if (!identity || !conversationsSid) {
    return callback(new Error('Invalid request'));
  }

  try {
      const result = await client.flexApi.v1.interaction.create({
        channel: {
          type: "chat",
          initiated_by: "customer",
          properties: {
            media_channel_sid: conversationsSid,
          },
        },
        routing: {
          properties: {
            workspace_sid: FLEX_WORKSPACE_SID,
            workflow_sid: FLEX_WORKFLOW_SID,
            attributes: {
              from: identity,
            },
          },
        },
      });
      console.log(result.sid);
  } catch (err) {
    console.error(err);
    return callback(new Error('Failed to hand over to a human agent'));
  }

  return callback(null, 'Transferred to human agent');
};
