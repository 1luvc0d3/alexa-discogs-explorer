const Alexa = require('ask-sdk-core');
const discogsAPI = require('../utils/discogsUtils');

const RandomReleaseIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RandomReleaseIntent';
    },
    async handle(handlerInput) {
        try {
            console.log('Getting random release...');
            
            const release = await discogsAPI.getRandomRelease();
            const speakOutput = `Here's a random release for you: ${discogsAPI.formatReleaseForSpeech(release)}. 
                ${release.genres && release.genres.length > 0 ? `It's in the ${release.genres.join(' and ')} genre${release.genres.length > 1 ? 's' : ''}.` : ''}`;
            
            const repromptText = 'Would you like another random release or try something else?';

            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(repromptText)
                .getResponse();

        } catch (error) {
            console.error('Error in RandomReleaseIntentHandler:', error);
            
            const speakOutput = 'Sorry, I had trouble finding a random release. This might be due to a network issue. Please try again later.';
            const repromptText = 'Would you like to try searching for a specific artist or album instead?';

            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(repromptText)
                .getResponse();
        }
    }
};

module.exports = RandomReleaseIntentHandler;