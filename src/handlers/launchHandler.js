const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = `Welcome to Discogs Explorer! I can help you discover music from the vast Discogs database. 
            You can ask me to list releases by an artist, search for a specific album, or get a random music recommendation. 
            What would you like to explore today?`;
        const repromptText = `You can say things like "list releases by The Beatles", "search for Abbey Road", or "give me a random release". What would you like to do?`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};

module.exports = LaunchRequestHandler;