# Alexa Skill Publishing Guide - Discogs Music Explorer (Node.js)

## Pre-Publishing Checklist

### 1. Required Assets & Legal Documents

#### Icons (REQUIRED)
- [ ] **Small Icon**: 108x108 pixels, PNG format
- [ ] **Large Icon**: 512x512 pixels, PNG format
- [ ] Icons must be hosted on HTTPS URLs
- [ ] Icons should represent your skill's functionality (music/vinyl theme)

#### Legal Documents (REQUIRED)
- [ ] **Privacy Policy**: Must be publicly accessible HTTPS URL
- [ ] **Terms of Use**: Must be publicly accessible HTTPS URL
- [ ] Both documents must be specific to your skill

### 2. Skill Configuration Updates Needed

#### Current Issues to Fix:
1. **Replace placeholder URLs** in `skill-package/skill.json`:
   - Update `largeIconUri` and `smallIconUri` with real hosted images
   - Update `privacyPolicyUrl` and `termsOfUseUrl` with real legal documents

2. **Verify skill metadata**:
   - Skill name: "Discogs Explorer" ✅
   - Category: "MUSIC_AND_AUDIO" ✅
   - Description: Well-written ✅
   - Keywords: Relevant ✅

### 3. Technical Requirements

#### Lambda Function
- [ ] Deploy to AWS Lambda with proper IAM role
- [ ] Set runtime to Node.js 18.x or later
- [ ] Set handler to `index.handler`
- [ ] Test all intents work correctly
- [ ] Verify error handling
- [ ] Check response times (< 8 seconds)

#### Interaction Model
- [ ] Test voice recognition accuracy
- [ ] Verify all sample utterances work
- [ ] Test edge cases and error scenarios

### 4. Testing Requirements

#### Functional Testing
- [ ] Test all intents: ListReleases, SearchRelease, RandomRelease
- [ ] Test built-in intents: Help, Stop, Cancel
- [ ] Test error scenarios (no results, API failures)
- [ ] Test with various artist names and album titles

#### Voice Testing
- [ ] Test on actual Alexa device
- [ ] Test with different accents/pronunciations
- [ ] Verify speech output is natural and clear

## Step-by-Step Publishing Process

### Step 1: Prepare Assets

1. **Create Icons**:
   ```bash
   # Create two PNG files:
   # - discogs-small-icon-108x108.png
   # - discogs-large-icon-512x512.png
   # Upload to your web hosting service
   ```

2. **Create Legal Documents**:
   - Write a privacy policy explaining data usage
   - Create terms of use document
   - Host both on your website with HTTPS

### Step 2: Deploy Lambda Function

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build deployment package**:
   ```bash
   npm run deploy
   ```

3. **Deploy to AWS Lambda**:
   ```bash
   # Using AWS CLI
   aws lambda create-function \
       --function-name alexa-discogs-skill \
       --runtime nodejs18.x \
       --role arn:aws:iam::YOUR_ACCOUNT:role/lambda-execution-role \
       --handler index.handler \
       --zip-file fileb://alexa-discogs-skill-nodejs.zip
   ```

3. **Configure Alexa Skills Kit trigger** in AWS Lambda console

### Step 3: Update Skill Configuration

1. **Update skill.json** with real URLs:
   ```json
   {
     "largeIconUri": "https://yourdomain.com/icons/large-icon.png",
     "smallIconUri": "https://yourdomain.com/icons/small-icon.png",
     "privacyPolicyUrl": "https://yourdomain.com/privacy-policy",
     "termsOfUseUrl": "https://yourdomain.com/terms-of-use"
   }
   ```

### Step 4: Submit to Alexa Developer Console

1. **Go to [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask)**

2. **Create or update your skill**:
   - Import the skill package or update existing skill
   - Set Lambda ARN as endpoint
   - Build the interaction model

3. **Test thoroughly**:
   - Use the simulator
   - Test on actual devices
   - Verify all functionality works

4. **Submit for certification**:
   - Go to "Distribution" tab
   - Fill out all required fields
   - Submit for review

### Step 5: Certification Process

#### What Amazon Reviews:
- Functionality testing
- Voice interface quality
- Content appropriateness
- Legal compliance
- Icon quality
- Metadata accuracy

#### Common Rejection Reasons:
- Broken functionality
- Poor voice experience
- Missing legal documents
- Low-quality icons
- Inappropriate content

## Quick Setup Commands

### Deploy Lambda Function
```bash
# Install dependencies and build
npm install
npm run deploy

# Update existing function
aws lambda update-function-code \
    --function-name alexa-discogs-skill \
    --zip-file fileb://alexa-discogs-skill-nodejs.zip
```

### Test Locally
```bash
# Validate skill configuration
npm run validate

# Install local debug tool globally
npm install -g ask-sdk-local-debug

# Run local test server
ask-sdk-local-debug --file index.js --handler handler
```

## Sample Legal Documents

### Privacy Policy Template
```
Privacy Policy for Discogs Explorer

This skill does not collect, store, or share any personal information.
The skill uses the public Discogs API to search for music information.
No user data is retained after the session ends.

Contact: your-email@domain.com
Last updated: [DATE]
```

### Terms of Use Template
```
Terms of Use for Discogs Explorer

By using this skill, you agree to use it for personal, non-commercial purposes.
The skill provides music information from the Discogs database.
We are not responsible for the accuracy of third-party data.

Contact: your-email@domain.com
Last updated: [DATE]
```

## Timeline Expectations

- **Preparation**: 1-2 days
- **Initial submission**: 1 day
- **Amazon review**: 3-7 business days
- **Fixes (if needed)**: 1-2 days per iteration
- **Total**: 1-2 weeks typically

## Support Resources

- [Alexa Skills Kit Documentation](https://developer.amazon.com/en-US/docs/alexa/ask-overviews/what-is-the-alexa-skills-kit.html)
- [Skill Publishing Guide](https://developer.amazon.com/en-US/docs/alexa/custom-skills/steps-to-build-a-custom-skill.html)
- [Certification Requirements](https://developer.amazon.com/en-US/docs/alexa/custom-skills/certification-requirements-for-custom-skills.html)

---

**Next Action**: Update the URLs in skill.json with your real hosted assets, then proceed with Lambda deployment and testing.