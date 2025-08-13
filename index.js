const Alexa = require('ask-sdk-core');

// Import handlers
const LaunchRequestHandler = require('./src/handlers/launchHandler');
const ListReleasesIntentHandler = require('./src/handlers/listReleasesHandler');
const SearchReleaseIntentHandler = require('./src/handlers/searchReleaseHandler');
const RandomReleaseIntentHandler = require('./src/handlers/randomReleaseHandler');
const HelpIntentHandler = require('./src/handlers/helpHandler');
const CancelAndStopIntentHandler = require('./src/handlers/cancelStopHandler');
const FallbackIntentHandler = require('./src/handlers/fallbackHandler');
const SessionEndedRequestHandler = require('./src/handlers/sessionEndedHandler');
const IntentReflectorHandler = require('./src/handlers/intentReflectorHandler');
const ErrorHandler = require('./src/handlers/errorHandler');

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ListReleasesIntentHandler,
        SearchReleaseIntentHandler,
        RandomReleaseIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(ErrorHandler)
    .withCustomUserAgent('alexa-discogs-explorer/v1.0')
    .lambda();