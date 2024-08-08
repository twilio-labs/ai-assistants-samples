<p align="center"><img src="docs/ai-assistants.png#gh-light-mode-only" height="150" alt="Twilio AI Assistants"/><img src="docs/ai-assistants-light.png#gh-dark-mode-only" height="150" alt="Twilio AI Assistants"/></p>
<h1 align="center">Twilio AI Assistants Samples</h1>

> [!NOTE]
> Twilio AI Assistants is a [Twilio Alpha](https://twilioalpha.com) project that is currently in Developer Preview. If you would like to try AI Assistants, [join the waitlist](https://twilioalpha.com/ai-assistants).

This project contains various different Twilio Functions for common use cases like different channel integrations and common example tools you might want to use.

For more detailed documentation [visit the Twilio Docs](https://twilio.com/docs/alpha/ai-assistants/code-samples).

## Setup

Requirements: Node 18 & [Twlio CLI & Twilio Serverless Toolkit](https://twilio.com/docs/labs/serverless-toolkit)

```bash
git clone git@github.com:twilio-labs/ai-assistants-samples.git
cd ai-assistants-samples
npm install
cp .env.example .env

# optional: fill in your Assistant SID. If you don't fill it in you'll have to pass it via `?AssistantSid=<...>`

twilio serverless:deploy
```

You should get output similar to this:

```text
Deployment Details
Domain: ai-assistants-samples-1111-dev.twil.io
Service:
   ai-assistants-samples (ZSf3510841424c854e3f3b282550211111)
Environment:
   dev (ZE94900e7f2a2c330b15cf6e1c9fd11111)
Build SID:
   ZB2743d62d52d42ccd55873a0bcd511111
Runtime:
   node18
View Live Logs:
   https://www.twilio.com/console/functions/editor/ZSf3510841424c854e3f3b282550211111/environment/ZE94900e7f2a2c330b15cf6e1c9fd11111
Functions:
   [protected] https://ai-assistants-samples-1111-dev.twil.io/channels/conversations/messageAdded
   [protected] https://ai-assistants-samples-1111-dev.twil.io/channels/messaging/incoming
   https://ai-assistants-samples-1111-dev.twil.io/channels/conversations/response
   https://ai-assistants-samples-1111-dev.twil.io/channels/messaging/response
   https://ai-assistants-samples-1111-dev.twil.io/tools/flex-handover
   https://ai-assistants-samples-1111-dev.twil.io/tools/google-maps
   https://ai-assistants-samples-1111-dev.twil.io/tools/internet-search
   https://ai-assistants-samples-1111-dev.twil.io/tools/studio-handover
Assets:
```

Replace below any `<your-functions-domain>` with the output next to `Domain: ` in that output.

## Messaging Channel

### SMS

**Via the Twilio CLI:**

```bash
twilio phone_number <your-twilio-number> \
    --sms-url=https://<your-functions-domain>.twil.io/channels/messaging/incoming
```

**Using the Twilio Console:**
Open your SMS-capable phone number of choice or Messaging Service and configure the `When a message comes in` webhook to point to: `https://<your-functions-domain>.twil.io/channels/messaging/incoming`

### WhatsApp Sandbox

Configure your `When a message comes in` webhook in the [WhatsApp Sandbox Seetings](https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn?frameUrl=%2Fconsole%2Fsms%2Fwhatsapp%2Flearn%3Fx-target-region%3Dus1) to point to `https://<your-functions-domain>.twil.io/channels/messaging/incoming`

> [!NOTE]
> If you want to use the same webhook for another Assistant you can add `?AssistantSid=<id>` as query parameter to the webhook URL. Example: `https://<your-functions-domain>.twil.io/channels/messaging/incoming?AssistantSid=AI1234561231237812312`

## Conversations Channel

Setup:

1. Set up a Conversations Service or use your default Conversations Service from the Console
2. Configure the webhook on a service level using the Twilio CLI command below
3. Connect your preferred Conversations channel following the [guides in the docs](https://www.twilio.com/docs/conversations/overview).

```bash
twilio api:conversations:v1:services:configuration:webhooks:update \
    --post-webhook-url=https://<your-functions-domain>.twil.io/channels/conversations/messageAdded
    --chat-service-sid=<your-conversations-service-sid>
    --filter=onMessageAdded
```

## Tools

Below are a selection of common tools that you might want to use or modify to your own needs. Each has an example configuration but you might want to tweak it to your own needs especially the `Description` if you find your Assistant not triggering the Tool reliably.

### Google Maps

Tool to enable your Assistant to search Google Maps for the full address, phone number and opening hours for a business in a given location.

> [!IMPORTANT]
> Requires the `GOOGLE_MAPS_API_KEY` environment variable to be set

| Field           | Configuration                                                                                                                          |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**        | `Google Maps`                                                                                                                          |
| **Description** | `Use this to fetch information about the a location from Google Maps. You MUST use this tool before the "Ask User for New Data" tool.` |
| **Input**       | <pre lang="typescript"><code>{&#13; location: string;&#13; name: string;&#13;}</code></pre>                                            |
| **Method**      | `GET`                                                                                                                                  |
| **URL**         | `https://<your-functions-domain>.twil.io/tools/google-maps`                                                                            |

### Flex Handover

Tool for your AI Assistant to hand over a conversation to a human agent.

> [!IMPORTANT]
> Requires:
>
> 1. The use of [Twilio Conversations as channel](#conversations-channel)
> 2. The Assistant & these Functions to be deployed in a Flex Account
> 3. The `FLEX_WORKSPACE_SID` and `FLEX_WORKFLOW_SID` environment variables to be configured

| Field           | Configuration                                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Name**        | `Hand over Conversation`                                                                                                        |
| **Description** | `You MUST use this if you don't know how to fulfill the request to let another customer service agent handle the conversation.` |
| **Input**       | <pre lang="typescript"><code>{}</code></pre>                                                                                    |
| **Method**      | `POST`                                                                                                                          |
| **URL**         | `https://<your-functions-domain>.twil.io/tools/flex-handover`                                                                   |

### Studio Handover

Tool to hand over a conversation that the Assistant is handling to a Studio flow. While there is an example `Description` for the Tool you want to update this to match your handover criteria.

This Tool rewires the conversation from your Assistant to Studio but does not forward the last message to the Studio flow. Instead the Tool will by default respond with `Conversation handed over` which might prompt the Assistant to say something like "I handed this conversation over". If you want to manipulate this message you can pass a different message into the Tool URL using the `SuccessMessage` query parameter.

> [!IMPORTANT]
> Requires:
>
> 1. The use of [Twilio Conversations as channel](#conversations-channel)
> 2. The Assistant & these Functions to be deployed in the same account as Studio flow
> 3. You either need to configure the `STUDIO_FLOW_SID` or pass `FlowSid` as query parameter to the Tool URL.

| Field           | Configuration                                                   |
| --------------- | --------------------------------------------------------------- |
| **Name**        | `Studio Handover`                                               |
| **Description** | `You MUST use this if a customer is asking for a refund.`       |
| **Input**       | <pre lang="typescript"><code>{}</code></pre>                    |
| **Method**      | `POST`                                                          |
| **URL**         | `https://<your-functions-domain>.twil.io/tools/studio-handover` |

### Internet Search

This tool will search the internet for relevant information and optionally summarize the information using GPT-3.5 Turbo.

> [!IMPORTANT]
> Requires you to set up the `EXA_API_KEY` with a valid key from [exa.ai](https://exa.ai)

> [!CAUTION]
> This tool will fetch data from the internet and there is a risk that this can open up your Assistant for prompt injection attacks.

| Field           | Configuration                                                                                   |
| --------------- | ----------------------------------------------------------------------------------------------- |
| **Name**        | `Search Internet`                                                                               |
| **Description** | `You MUST use this for any information you are unsure about or information about recent events` |
| **Input**       | <pre lang="typescript"><code>{&#13; query: string; // a search engine query&#13;}</code></pre>  |
| **Method**      | `GET`                                                                                           |
| **URL**         | `https://<your-functions-domain>.twil.io/tools/internet-search`                                 |

Additionally to the configuration below, you can use the following query parameters to configure your search behavior. These can be put into the `input` but are recommended to passed directly into the end of the URL instead.

- `limitDomains` — You can pass multiple ones to limit search results to specific domains. For example `?limitDomains=www.segment.com&limitDomains=www.twilio.com` will only search those two domains.
- `n` — specifies the amount of search results you want to take into consideration for the response. Example: `?n=2`
- `summarize` — If set to `?summarize=true`, it will optionally run the request through OpenAI's GPT-3.5-Turbo for a proper answer that gets pushed into your Assistant. This requires the `OPENAI_API_KEY` environment variable to be set.

### UI Tools

This tool enables you to trigger functions in the web UI of your AI Assistant assuming you are using the [AI Assistants JavaScript SDK](https://github.com/twilio-labs/ai-assistants-js).

> [!IMPORTANT]
> This will only work if you are using the specific AI Assistants JavaScript SDK and not with any other Twilio Conversations SDK.

| Field           | Configuration                                                                             |
| --------------- | ----------------------------------------------------------------------------------------- |
| **Name**        | `<Any tool name you would want to use>`                                                   |
| **Description** | `Description for when this UI tool should be triggered`                                   |
| **Input**       | <pre lang="typescript"><code>{ // anything you want to send to the UI tool }</code></pre> |
| **Method**      | `GET`                                                                                     |
| **URL**         | `https://<your-functions-domain>.twil.io/tools/ui-tools?toolName=<yourUiToolFunction>`    |

## Contributing

[See contributing guide](./CONTRIBUTING.md)

## License

MIT
