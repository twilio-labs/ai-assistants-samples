# Contributing

This project uses the [Twilio Serverless Toolkit](https://www.twilio.com/docs/labs/serverless-toolkit) for all development. Check the [documentation](https://www.twilio.com/docs/labs/serverless-toolkit/general-usage) for any general questions about the tool.

## Setup

Follow the setup instructions in the [`README`](README.md).

## Starting a local server to test your changes

```bash
twilio serverless:start
```

If you are using Functions that will reference other Functions make sure you update the `.env` file to contain a `DOMAIN_NAME` that points against the domain of your ngrok tunnel. Example:

```
DOMAIN_NAME=example.ngrok.io
```
