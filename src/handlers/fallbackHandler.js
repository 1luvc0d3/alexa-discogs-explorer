const Alexa = require('ask-sdk-core');

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = `Sorry, I didn't understand that. I can help you explore music from the Discogs database. 
            You can ask me to list releases by an artist, search for an album, or get a random music recommendation. 
            What would you like to try?`;
        const repromptText = `Try saying "list releases by The Beatles" or "search for Abbey Road". What would you like to explore?`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};

module.exports = FallbackIntentHandler;