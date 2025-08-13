#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { URL } = require('url');

function validateSkillConfig() {
    console.log('🎵 Validating Alexa Discogs Skill for Publishing (Node.js)...');
    console.log('='.repeat(50));
    
    const issues = [];
    const warnings = [];
    
    // Check if skill.json exists
    const skillJsonPath = path.join(__dirname, 'skill-package', 'skill.json');
    if (!fs.existsSync(skillJsonPath)) {
        issues.push('❌ skill.json not found');
        return { issues, warnings };
    }
    
    // Load skill configuration
    const skillConfig = JSON.parse(fs.readFileSync(skillJsonPath, 'utf8'));
    const manifest = skillConfig.manifest || {};
    const pubInfo = manifest.publishingInformation || {};
    const privacy = manifest.privacyAndCompliance || {};
    
    // Check publishing information
    const locales = pubInfo.locales || {};
    const enUs = locales['en-US'] || {};
    
    // Validate required fields
    const requiredFields = ['name', 'summary', 'description', 'examplePhrases', 'keywords'];
    requiredFields.forEach(field => {
        if (!enUs[field]) {
            issues.push(`❌ Missing required field: ${field}`);
        }
    });
    
    // Check icons
    const largeIcon = enUs.largeIconUri || '';
    const smallIcon = enUs.smallIconUri || '';
    
    if (largeIcon.includes('example.com') || !largeIcon) {
        issues.push('❌ Large icon URL is placeholder or missing');
    }
    if (smallIcon.includes('example.com') || !smallIcon) {
        issues.push('❌ Small icon URL is placeholder or missing');
    }
    
    // Check privacy policy and terms
    const privacyLocales = (privacy.locales || {})['en-US'] || {};
    const privacyUrl = privacyLocales.privacyPolicyUrl || '';
    const termsUrl = privacyLocales.termsOfUseUrl || '';
    
    if (privacyUrl.includes('example.com') || !privacyUrl) {
        issues.push('❌ Privacy policy URL is placeholder or missing');
    }
    if (termsUrl.includes('example.com') || !termsUrl) {
        issues.push('❌ Terms of use URL is placeholder or missing');
    }
    
    // Check interaction model
    const interactionModelPath = path.join(__dirname, 'skill-package', 'interactionModels', 'custom', 'en-US.json');
    if (!fs.existsSync(interactionModelPath)) {
        issues.push('❌ Interaction model not found');
    } else {
        const interactionModel = JSON.parse(fs.readFileSync(interactionModelPath, 'utf8'));
        const intents = (interactionModel.interactionModel?.languageModel?.intents) || [];
        const customIntents = intents.filter(i => !i.name.startsWith('AMAZON.'));
        
        if (customIntents.length < 3) {
            warnings.push('⚠️  Consider adding more custom intents for better functionality');
        }
    }
    
    // Check Node.js source files
    const requiredFiles = [
        'index.js',
        'package.json',
        'src/handlers/launchHandler.js',
        'src/handlers/listReleasesHandler.js',
        'src/handlers/searchReleaseHandler.js',
        'src/handlers/randomReleaseHandler.js',
        'src/utils/discogsUtils.js'
    ];
    
    requiredFiles.forEach(filePath => {
        if (!fs.existsSync(path.join(__dirname, filePath))) {
            issues.push(`❌ Missing required file: ${filePath}`);
        }
    });
    
    // Validate URLs (basic check)
    const urlsToCheck = [];
    if (largeIcon && !largeIcon.includes('example.com')) {
        urlsToCheck.push(['Large Icon', largeIcon]);
    }
    if (smallIcon && !smallIcon.includes('example.com')) {
        urlsToCheck.push(['Small Icon', smallIcon]);
    }
    if (privacyUrl && !privacyUrl.includes('example.com')) {
        urlsToCheck.push(['Privacy Policy', privacyUrl]);
    }
    if (termsUrl && !termsUrl.includes('example.com')) {
        urlsToCheck.push(['Terms of Use', termsUrl]);
    }
    
    urlsToCheck.forEach(([name, url]) => {
        try {
            const parsed = new URL(url);
            if (parsed.protocol !== 'https:') {
                issues.push(`❌ ${name} URL must use HTTPS: ${url}`);
            }
        } catch (error) {
            issues.push(`❌ Invalid ${name} URL: ${url}`);
        }
    });
    
    // Check package.json
    if (fs.existsSync('package.json')) {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const requiredDeps = ['ask-sdk-core', 'ask-sdk-model', 'axios'];
        
        requiredDeps.forEach(dep => {
            if (!packageJson.dependencies || !packageJson.dependencies[dep]) {
                issues.push(`❌ Missing required dependency: ${dep}`);
            }
        });
        
        if (!packageJson.engines || !packageJson.engines.node) {
            warnings.push('⚠️  Consider specifying Node.js version in package.json engines field');
        }
    }
    
    return { issues, warnings };
}

function printResults(issues, warnings) {
    console.log('\n📋 VALIDATION RESULTS');
    console.log('='.repeat(50));
    
    if (issues.length > 0) {
        console.log('🚨 CRITICAL ISSUES (Must fix before publishing):');
        issues.forEach(issue => console.log(`  ${issue}`));
    }
    
    if (warnings.length > 0) {
        console.log('\n⚠️  WARNINGS (Recommended to fix):');
        warnings.forEach(warning => console.log(`  ${warning}`));
    }
    
    if (issues.length === 0 && warnings.length === 0) {
        console.log('✅ All checks passed! Your skill is ready for publishing.');
    } else if (issues.length === 0) {
        console.log('✅ No critical issues found. Address warnings if possible.');
    } else {
        console.log(`\n❌ Found ${issues.length} critical issues that must be fixed before publishing.`);
    }
    
    console.log('\n📚 Next Steps:');
    if (issues.length > 0) {
        console.log('1. Fix all critical issues listed above');
        console.log('2. Re-run this validation script');
        console.log('3. Install dependencies: npm install');
        console.log('4. Deploy to AWS Lambda: npm run deploy');
        console.log('5. Test thoroughly in Alexa Developer Console');
        console.log('6. Submit for certification');
    } else {
        console.log('1. Install dependencies: npm install');
        console.log('2. Deploy to AWS Lambda: npm run deploy');
        console.log('3. Test thoroughly in Alexa Developer Console');
        console.log('4. Submit for certification');
    }
    
    console.log('\n📖 See PUBLISHING_GUIDE.md for detailed instructions');
}

function main() {
    const { issues, warnings } = validateSkillConfig();
    printResults(issues, warnings);
    
    return issues.length === 0;
}

if (require.main === module) {
    const success = main();
    process.exit(success ? 0 : 1);
}

module.exports = { validateSkillConfig, printResults };