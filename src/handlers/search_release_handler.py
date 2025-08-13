from ask_sdk_core.dispatch_components import AbstractRequestHandler
from ask_sdk_core.utils import is_intent_name
from ask_sdk_core.handler_input import HandlerInput
from ask_sdk_model import Response
from ask_sdk_model.ui import SimpleCard
import logging

from ..utils.discogs_utils import discogs_api, format_release_for_speech

logger = logging.getLogger(__name__)

class SearchReleaseIntentHandler(AbstractRequestHandler):
    """Handler for SearchReleaseIntent"""
    
    def can_handle(self, handler_input: HandlerInput) -> bool:
        return is_intent_name("SearchReleaseIntent")(handler_input)
    
    def handle(self, handler_input: HandlerInput) -> Response:
        logger.info("SearchReleaseIntent triggered")
        
        # Get the release slot value
        slots = handler_input.request_envelope.request.intent.slots
        release_slot = slots.get('release')
        
        if not release_slot or not release_slot.value:
            speak_output = "Please tell me which album or release you'd like to search for. For example, say 'search for Abbey Road'."
            return (
                handler_input.response_builder
                .speak(speak_output)
                .ask(speak_output)
                .response
            )
        
        release_name = release_slot.value
        
        try:
            releases = discogs_api.search_releases(release_name, 3)
            
            if not releases:
                speak_output = f"I couldn't find any releases matching '{release_name}'. Please try a different search term."
                return (
                    handler_input.response_builder
                    .speak(speak_output)
                    .response
                )
            
            release_list = []
            for release in releases:
                title = format_release_for_speech(release)
                # Extract artist from title (format is usually "Artist - Title")
                if ' - ' in release.get('title', ''):
                    artist = release['title'].split(' - ')[0]
                    release_list.append(f"{title} by {artist}")
                else:
                    release_list.append(title)
            
            speak_output = f"I found these releases matching '{release_name}': {', '.join(release_list)}."
            card_content = f"Search results for '{release_name}':\n" + "\n".join(release_list)
            
            return (
                handler_input.response_builder
                .speak(speak_output)
                .set_card(SimpleCard("Discogs Search Results", card_content))
                .response
            )
            
        except Exception as e:
            logger.error(f"Error in SearchReleaseIntentHandler: {e}")
            speak_output = "Sorry, I had trouble searching for that release. Please try again later."
            return (
                handler_input.response_builder
                .speak(speak_output)
                .response
            )