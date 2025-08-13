from ask_sdk_core.dispatch_components import AbstractRequestHandler
from ask_sdk_core.utils import is_intent_name
from ask_sdk_core.handler_input import HandlerInput
from ask_sdk_model import Response
from ask_sdk_model.ui import SimpleCard
import logging

from ..utils.discogs_utils import discogs_api

logger = logging.getLogger(__name__)

class RandomReleaseIntentHandler(AbstractRequestHandler):
    """Handler for RandomReleaseIntent"""
    
    def can_handle(self, handler_input: HandlerInput) -> bool:
        return is_intent_name("RandomReleaseIntent")(handler_input)
    
    def handle(self, handler_input: HandlerInput) -> Response:
        logger.info("RandomReleaseIntent triggered")
        
        try:
            release = None
            attempts = 0
            max_attempts = 5
            
            # Try to get a random release, with fallback attempts
            while not release and attempts < max_attempts:
                release = discogs_api.get_random_release()
                attempts += 1
            
            if not release:
                speak_output = "Sorry, I couldn't find a random release right now. Please try again later."
                return (
                    handler_input.response_builder
                    .speak(speak_output)
                    .response
                )
            
            title = release.get('title', 'Unknown Title')
            
            # Get artist names
            artists = release.get('artists', [])
            if artists:
                artist_names = [artist.get('name', 'Unknown Artist') for artist in artists]
                artist_text = ', '.join(artist_names)
            else:
                artist_text = 'Unknown Artist'
            
            year = release.get('year')
            year_text = f" from {year}" if year else ""
            
            genres = release.get('genres', [])
            genre_text = f" in the {', '.join(genres)} genre" if genres else ""
            
            speak_output = f"Here's a random release for you: '{title}' by {artist_text}{year_text}{genre_text}."
            card_content = f"{title}\nby {artist_text}{year_text}{genre_text}"
            
            return (
                handler_input.response_builder
                .speak(speak_output)
                .set_card(SimpleCard("Random Discogs Release", card_content))
                .response
            )
            
        except Exception as e:
            logger.error(f"Error in RandomReleaseIntentHandler: {e}")
            speak_output = "Sorry, I had trouble finding a random release. Please try again later."
            return (
                handler_input.response_builder
                .speak(speak_output)
                .response
            )