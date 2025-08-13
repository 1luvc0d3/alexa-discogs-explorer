# Discogs Music Explorer - Alexa Skill (Python)

A Python-based Alexa skill that lets you explore music releases using the comprehensive Discogs database. Search for artists, find specific albums, or discover random music recommendations through voice commands.

## Features

- **Artist Releases**: Get a list of releases by any artist
- **Album Search**: Search for specific albums or releases
- **Random Discovery**: Get random music recommendations
- **Voice-Optimized**: Responses designed for natural voice interaction

## Voice Commands

- "Alexa, ask discogs to list releases by The Beatles"
- "Alexa, ask discogs to search for Abbey Road"
- "Alexa, ask discogs for a random release"
- "Alexa, ask discogs to surprise me"

## Project Structure

```
alexa-discogs-releases-python/
├── lambda_function.py              # Main Lambda handler
├── requirements.txt                # Python dependencies
├── src/
│   ├── handlers/
│   │   ├── basic_handlers.py       # Launch, help, stop handlers
│   │   ├── list_releases_handler.py # Artist releases handler
│   │   ├── search_release_handler.py # Album search handler
│   │   └── random_release_handler.py # Random release handler
│   └── utils/
│       └── discogs_utils.py        # Discogs API utilities
├── skill-package/
│   ├── interactionModels/
│   │   └── custom/
│   │       └── en-US.json          # Voice interaction model
│   └── skill.json                  # Skill manifest
└── README.md
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd alexa-discogs-releases-python
pip install -r requirements.txt
```

### 2. Create Deployment Package

```bash
# Create a deployment directory
mkdir deployment
cp -r src/ deployment/
cp lambda_function.py deployment/
cp requirements.txt deployment/

# Install dependencies in deployment directory
cd deployment
pip install -r requirements.txt -t .

# Create ZIP file for Lambda
zip -r ../alexa-discogs-skill-python.zip .
cd ..
```

### 3. Deploy to AWS Lambda

#### Option A: Using AWS CLI

```bash
# Create Lambda function
aws lambda create-function \
    --function-name alexa-discogs-skill-python \
    --runtime python3.9 \
    --role arn:aws:iam::YOUR_ACCOUNT:role/lambda-execution-role \
    --handler lambda_function.handler \
    --zip-file fileb://alexa-discogs-skill-python.zip

# Update function code (for subsequent deployments)
aws lambda update-function-code \
    --function-name alexa-discogs-skill-python \
    --zip-file fileb://alexa-discogs-skill-python.zip
```

#### Option B: Using AWS Console

1. Go to AWS Lambda Console
2. Create new function
3. Upload `alexa-discogs-skill-python.zip`
4. Set handler to `lambda_function.handler`
5. Set runtime to Python 3.9 or later
6. Configure Alexa Skills Kit trigger

### 4. Configure Alexa Skill

1. Go to [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask)
2. Create a new skill or import the skill package
3. Set the endpoint to your Lambda function ARN
4. Build and test the skill

## Python Dependencies

- `ask-sdk-core`: Alexa Skills Kit SDK for Python
- `ask-sdk-model`: Alexa Skills Kit model definitions
- `requests`: HTTP library for API calls
- `boto3`: AWS SDK (if using other AWS services)

## API Usage

The skill uses the public Discogs API with these endpoints:

- **Search Artists**: `/database/search?type=artist`
- **Artist Releases**: `/artists/{id}/releases`
- **Search Releases**: `/database/search?type=release`
- **Random Release**: `/releases/{random_id}`

## Testing

Test the skill using:

- Alexa Developer Console simulator
- Echo device or Alexa app
- Local testing with ask-sdk-local-debug

### Example Test Phrases

```
User: "Alexa, open discogs"
Alexa: "Welcome to Discogs Explorer! You can ask me to list releases by an artist..."

User: "List releases by Pink Floyd"
Alexa: "Here are some releases by Pink Floyd: The Wall from 1979, Dark Side of the Moon from 1973..."

User: "Search for Thriller"
Alexa: "I found these releases matching Thriller: Thriller by Michael Jackson from 1982..."

User: "Give me a random release"
Alexa: "Here's a random release for you: Pet Sounds by The Beach Boys from 1966..."
```

## Development

### Local Testing

```bash
# Install development dependencies
pip install ask-sdk-local-debug

# Run local debug server
python -m ask_sdk_local_debug.local_debugger --file lambda_function.py --handler handler
```

### Code Structure

- **lambda_function.py**: Main entry point and skill builder configuration
- **handlers/**: Intent handlers for different voice commands
- **utils/**: Utility functions for Discogs API interaction
- **skill-package/**: Alexa skill configuration files

## Error Handling

The skill includes comprehensive error handling for:

- Network timeouts
- API rate limits
- Invalid search queries
- Missing data
- Service unavailability

## Rate Limits

- **Without API Key**: 60 requests per minute
- **With API Key**: 240 requests per minute
- **Authenticated**: 1000 requests per minute

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues or questions:

1. Check the [Discogs API Documentation](https://www.discogs.com/developers/)
2. Review [Alexa Skills Kit Python SDK Documentation](https://alexa-skills-kit-python-sdk.readthedocs.io/)
3. Open an issue in this repository