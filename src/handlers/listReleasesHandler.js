const Alexa = require('ask-sdk-core');
const discogsAPI = require('../utils/discogsUtils');

const ListReleasesIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ListReleasesIntent';
    },
    async handle(handlerInput) {
        const artistSlot = Alexa.getSlotValue(handlerInput.requestEnvelope, 'artist');
        
        if (!artistSlot) {
            const speakOutput = 'I need an artist name to search for releases. Try saying "list releases by The Beatles".';
            const repromptText = 'Which artist would you like me to search for?';
            
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(repromptText)
                .getResponse();
        }

        try {
            console.log(`Searching for artist: ${artistSlot}`);
            
            // Search for the artist
            const artists = await discogsAPI.searchArtist(artistSlot);
            
            if (!artists || artists.length === 0) {
                const speakOutput = `I couldn't find any artists matching "${artistSlot}". Try a different artist name.`;
                const repromptText = 'Which artist would you like me to search for?';
                
                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .reprompt(repromptText)
                    .getResponse();
            }

            // Get releases for the first matching artist
            const artist = artists[0];
            const releases = await discogsAPI.getArtistReleases(artist.id);
            
            const speakOutput = discogsAPI.formatReleasesListForSpeech(releases, artist.title);
            const repromptText = 'Would you like to search for another artist or try something else?';

            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(repromptText)
                .getResponse();

        } catch (error) {
            console.error('Error in ListReleasesIntentHandler:', error);
            
            const speakOutput = `Sorry, I had trouble finding releases for ${artistSlot}. This might be due to a network issue. Please try again later.`;
            const repromptText = 'Would you like to try searching for a different artist?';

            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(repromptText)
                .getResponse();
        }
    }
};

module.exports = ListReleasesIntentHandler;