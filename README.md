# Discogs Music Explorer - Alexa Skill (Node.js)

A Node.js-based Alexa skill that lets you explore music releases using the comprehensive Discogs database. Search for artists, find specific albums, or discover random music recommendations through voice commands.

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
alexa-discogs-explorer/
├── index.js                        # Main Lambda handler
├── package.json                    # Node.js dependencies and scripts
├── src/
│   ├── handlers/
│   │   ├── launchHandler.js        # Launch request handler
│   │   ├── helpHandler.js          # Help intent handler
│   │   ├── cancelStopHandler.js    # Cancel/Stop handlers
│   │   ├── listReleasesHandler.js  # Artist releases handler
│   │   ├── searchReleaseHandler.js # Album search handler
│   │   ├── randomReleaseHandler.js # Random release handler
│   │   ├── fallbackHandler.js      # Fallback handler
│   │   ├── sessionEndedHandler.js  # Session ended handler
│   │   ├── intentReflectorHandler.js # Intent reflector
│   │   └── errorHandler.js         # Global error handler
│   └── utils/
│       └── discogsUtils.js         # Discogs API utilities
├── skill-package/
│   ├── interactionModels/
│   │   └── custom/
│   │       └── en-US.json          # Voice interaction model
│   └── skill.json                  # Skill manifest
├── deploy.js                       # Deployment script
├── publish-checklist.js            # Pre-publishing validation
└── README.md
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd alexa-discogs-explorer
npm install
```

### 2. Create Deployment Package

```bash
# Build and create deployment package
npm run deploy

# Or use the deployment script directly
node deploy.js
```

### 3. Deploy to AWS Lambda

#### Option A: Using AWS CLI

```bash
# Create Lambda function
aws lambda create-function \
    --function-name alexa-discogs-skill \
    --runtime nodejs18.x \
    --role arn:aws:iam::YOUR_ACCOUNT:role/lambda-execution-role \
    --handler index.handler \
    --zip-file fileb://alexa-discogs-skill-nodejs.zip

# Update function code (for subsequent deployments)
aws lambda update-function-code \
    --function-name alexa-discogs-skill \
    --zip-file fileb://alexa-discogs-skill-nodejs.zip
```

#### Option B: Using AWS Console

1. Go to AWS Lambda Console
2. Create new function
3. Upload `alexa-discogs-skill-nodejs.zip`
4. Set handler to `index.handler`
5. Set runtime to Node.js 18.x or later
6. Configure Alexa Skills Kit trigger

### 4. Configure Alexa Skill

1. Go to [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask)
2. Create a new skill or import the skill package
3. Set the endpoint to your Lambda function ARN
4. Build and test the skill

## Node.js Dependencies

- `ask-sdk-core`: Alexa Skills Kit SDK for Node.js
- `ask-sdk-model`: Alexa Skills Kit model definitions
- `axios`: HTTP client for API calls

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
npm install

# Run validation
npm run validate

# For local debugging (install ask-sdk-local-debug globally)
npm install -g ask-sdk-local-debug
ask-sdk-local-debug --file index.js --handler handler
```

### Code Structure

- **index.js**: Main entry point and skill builder configuration
- **src/handlers/**: Intent handlers for different voice commands
- **src/utils/**: Utility functions for Discogs API interaction
- **skill-package/**: Alexa skill configuration files
- **deploy.js**: Automated deployment script
- **publish-checklist.js**: Pre-publishing validation

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