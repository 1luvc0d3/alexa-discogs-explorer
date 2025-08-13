import logging
from ask_sdk_core.skill_builder import SkillBuilder
from ask_sdk_core.dispatch_components import AbstractRequestHandler
from ask_sdk_core.utils import is_request_type, is_intent_name
from ask_sdk_core.handler_input import HandlerInput
from ask_sdk_model import Response

# Import all handlers
from src.handlers.list_releases_handler import ListReleasesIntentHandler
from src.handlers.search_release_handler import SearchReleaseIntentHandler
from src.handlers.random_release_handler import RandomReleaseIntentHandler
from src.handlers.basic_handlers import (
    LaunchRequestHandler,
    HelpIntentHandler,
    CancelOrStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler,
    CatchAllExceptionHandler
)

# Configure logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Initialize the skill builder
sb = SkillBuilder()

# Add request handlers
sb.add_request_handler(LaunchRequestHandler())
sb.add_request_handler(ListReleasesIntentHandler())
sb.add_request_handler(SearchReleaseIntentHandler())
sb.add_request_handler(RandomReleaseIntentHandler())
sb.add_request_handler(HelpIntentHandler())
sb.add_request_handler(CancelOrStopIntentHandler())
sb.add_request_handler(FallbackIntentHandler())
sb.add_request_handler(SessionEndedRequestHandler())
sb.add_request_handler(IntentReflectorHandler())  # Make sure this is last

# Add exception handler
sb.add_exception_handler(CatchAllExceptionHandler())

# Lambda handler
lambda_handler = sb.lambda_handler()

def handler(event, context):
    """AWS Lambda handler function"""
    return lambda_handler(event, context)