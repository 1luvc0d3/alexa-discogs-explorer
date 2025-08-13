from ask_sdk_core.dispatch_components import (
    AbstractRequestHandler, AbstractExceptionHandler
)
from ask_sdk_core.utils import is_request_type, is_intent_name
from ask_sdk_core.handler_input import HandlerInput
from ask_sdk_model import Response
from ask_sdk_model.ui import SimpleCard
import logging

logger = logging.getLogger(__name__)

class LaunchRequestHandler(AbstractRequestHandler):
    """Handler for Skill Launch"""
    
    def can_handle(self, handler_input: HandlerInput) -> bool:
        return is_request_type("LaunchRequest")(handler_input)
    
    def handle(self, handler_input: HandlerInput) -> Response:
        speak_output = ("Welcome to Discogs Explorer! You can ask me to list releases by an artist, "
                       "search for a specific album, or get a random music recommendation. What would you like to do?")
        
        reprompt_text = ("You can say things like 'list releases by The Beatles' or 'search for Dark Side of the Moon' "
                        "or 'give me a random release'.")
        
        return (
            handler_input.response_builder
            .speak(speak_output)
            .ask(reprompt_text)
            .set_card(SimpleCard("Discogs Explorer", 
                                "Welcome! Ask me about music releases, artists, or get random recommendations."))
            .response
        )

class HelpIntentHandler(AbstractRequestHandler):
    """Handler for Help Intent"""
    
    def can_handle(self, handler_input: HandlerInput) -> bool:
        return is_intent_name("AMAZON.HelpIntent")(handler_input)
    
    def handle(self, handler_input: HandlerInput) -> Response:
        speak_output = ("I can help you explore music using the Discogs database. Here are some things you can ask me: "
                       "'List releases by The Beatles', 'Search for Abbey Road', or 'Give me a random release'. "
                       "What would you like to try?")
        
        return (
            handler_input.response_builder
            .speak(speak_output)
            .ask(speak_output)
            .response
        )

class CancelOrStopIntentHandler(AbstractRequestHandler):
    """Single handler for Cancel and Stop Intent"""
    
    def can_handle(self, handler_input: HandlerInput) -> bool:
        return (is_intent_name("AMAZON.CancelIntent")(handler_input) or
                is_intent_name("AMAZON.StopIntent")(handler_input))
    
    def handle(self, handler_input: HandlerInput) -> Response:
        speak_output = "Thanks for using Discogs Explorer. Goodbye!"
        
        return (
            handler_input.response_builder
            .speak(speak_output)
            .response
        )

class FallbackIntentHandler(AbstractRequestHandler):
    """Handler for Fallback Intent"""
    
    def can_handle(self, handler_input: HandlerInput) -> bool:
        return is_intent_name("AMAZON.FallbackIntent")(handler_input)
    
    def handle(self, handler_input: HandlerInput) -> Response:
        speak_output = ("Sorry, I don't know about that. You can ask me to list releases by an artist, "
                       "search for an album, or get a random music recommendation. What would you like to try?")
        
        return (
            handler_input.response_builder
            .speak(speak_output)
            .ask(speak_output)
            .response
        )

class SessionEndedRequestHandler(AbstractRequestHandler):
    """Handler for Session End"""
    
    def can_handle(self, handler_input: HandlerInput) -> bool:
        return is_request_type("SessionEndedRequest")(handler_input)
    
    def handle(self, handler_input: HandlerInput) -> Response:
        logger.info(f"Session ended: {handler_input.request_envelope}")
        return handler_input.response_builder.response

class IntentReflectorHandler(AbstractRequestHandler):
    """Handler for reflecting the intent that was triggered (for debugging)"""
    
    def can_handle(self, handler_input: HandlerInput) -> bool:
        return is_request_type("IntentRequest")(handler_input)
    
    def handle(self, handler_input: HandlerInput) -> Response:
        intent_name = handler_input.request_envelope.request.intent.name
        speak_output = f"You just triggered {intent_name}"
        
        return (
            handler_input.response_builder
            .speak(speak_output)
            .response
        )

class CatchAllExceptionHandler(AbstractExceptionHandler):
    """Generic error handling to capture any syntax or routing errors"""
    
    def can_handle(self, handler_input: HandlerInput, exception: Exception) -> bool:
        return True
    
    def handle(self, handler_input: HandlerInput, exception: Exception) -> Response:
        logger.error(f"Error handled: {exception}", exc_info=True)
        
        speak_output = "Sorry, I had trouble doing what you asked. Please try again."
        
        return (
            handler_input.response_builder
            .speak(speak_output)
            .ask(speak_output)
            .response
        )