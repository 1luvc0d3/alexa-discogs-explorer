from ask_sdk_core.dispatch_components import AbstractRequestHandler
from ask_sdk_core.utils import is_intent_name
from ask_sdk_core.handler_input import HandlerInput
from ask_sdk_model import Response
from ask_sdk_model.ui import SimpleCard
import logging

from ..utils.discogs_utils import discogs_api, format_release_for_speech, format_artist_for_speech

logger = logging.getLogger(__name__)

class ListReleasesIntentHandler(AbstractRequestHandler):
    """Handler for ListReleasesIntent"""
    
    def can_handle(self, handler_input: HandlerInput) -> bool:
        return is_intent_name("ListReleasesIntent")(handler_input)
    
    def handle(self, handler_input: HandlerInput) -> Response:
        logger.info("ListReleasesIntent triggered")
        
        # Get the artist slot value
        slots = handler_input.request_envelope.request.intent.slots
        artist_slot = slots.get('artist')
        
        if not artist_slot or not artist_slot.value:
            speak_output = "Please tell me which artist you'd like to hear releases from. For example, say 'list releases by The Beatles'."
            return (
                handler_input.response_builder
                .speak(speak_output)
                .ask(speak_output)
                .response
            )
        
        artist_name = artist_slot.value
        
        try:
            # Search for the artist
            artists = discogs_api.search_artists(artist_name)
            
            if not artists:
                speak_output = f"I couldn't find any artist named {artist_name}. Please try a different artist name."
                return (
                    handler_input.response_builder
                    .speak(speak_output)
                    .response
                )
            
            # Get the first matching artist
            artist = artists[0]
            artist_id = artist['id']
            actual_artist_name = format_artist_for_speech(artist)
            
            # Get releases for this artist
            releases = discogs_api.get_artist_releases(artist_id, 5)
            
            if not releases:
                speak_output = f"I found {actual_artist_name}, but couldn't find any releases for them."
                return (
                    handler_input.response_builder
                    .speak(speak_output)
                    .response
                )
            
            # Format the releases for speech
            release_list = [format_release_for_speech(release) for release in releases[:5]]
            speak_output = f"Here are some releases by {actual_artist_name}: {', '.join(release_list)}."
            
            card_content = f"Releases by {actual_artist_name}:\n" + "\n".join(release_list)
            
            return (
                handler_input.response_builder
                .speak(speak_output)
                .set_card(SimpleCard("Discogs Releases", card_content))
                .response
            )
            
        except Exception as e:
            logger.error(f"Error in ListReleasesIntentHandler: {e}")
            speak_output = "Sorry, I had trouble finding releases for that artist. Please try again later."
            return (
                handler_input.response_builder
                .speak(speak_output)
                .response
            )