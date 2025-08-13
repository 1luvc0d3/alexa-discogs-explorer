const Alexa = require('ask-sdk-core');
const discogsAPI = require('../utils/discogsUtils');

const SearchReleaseIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SearchReleaseIntent';
    },
    async handle(handlerInput) {
        const releaseSlot = Alexa.getSlotValue(handlerInput.requestEnvelope, 'release');
        
        if (!releaseSlot) {
            const speakOutput = 'I need an album or release name to search for. Try saying "search for Abbey Road".';
            const repromptText = 'What album or release would you like me to search for?';
            
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(repromptText)
                .getResponse();
        }

        try {
            console.log(`Searching for release: ${releaseSlot}`);
            
            // Search for releases
            const releases = await discogsAPI.searchReleases(releaseSlot);
            
            const speakOutput = discogsAPI.formatSearchResultsForSpeech(releases, releaseSlot);
            const repromptText = 'Would you like to search for another release or try something else?';

            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(repromptText)
                .getResponse();

        } catch (error) {
            console.error('Error in SearchReleaseIntentHandler:', error);
            
            const speakOutput = `Sorry, I had trouble searching for "${releaseSlot}". This might be due to a network issue. Please try again later.`;
            const repromptText = 'Would you like to try searching for a different release?';

            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(repromptText)
                .getResponse();
        }
    }
};

module.exports = SearchReleaseIntentHandler;