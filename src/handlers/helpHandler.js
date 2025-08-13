const Alexa = require('ask-sdk-core');

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = `Discogs Explorer helps you discover music! Here's what you can do: 
            Say "list releases by" followed by an artist name to get their discography. 
            Say "search for" followed by an album name to find specific releases. 
            Say "give me a random release" for music discovery. 
            What would you like to try?`;
        const repromptText = `Try saying "list releases by Pink Floyd" or "search for Dark Side of the Moon". What would you like to explore?`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};

module.exports = HelpIntentHandler;