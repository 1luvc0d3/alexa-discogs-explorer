#!/usr/bin/env python3
"""
Pre-publishing validation script for Alexa Discogs Skill
"""

import json
import os
import requests
from urllib.parse import urlparse

def validate_skill_config():
    """Validate skill configuration for publishing"""
    print("🎵 Validating Alexa Discogs Skill for Publishing...")
    print("=" * 50)
    
    issues = []
    warnings = []
    
    # Check if skill.json exists
    if not os.path.exists('skill-package/skill.json'):
        issues.append("❌ skill.json not found")
        return issues, warnings
    
    # Load skill configuration
    with open('skill-package/skill.json', 'r') as f:
        skill_config = json.load(f)
    
    manifest = skill_config.get('manifest', {})
    pub_info = manifest.get('publishingInformation', {})
    privacy = manifest.get('privacyAndCompliance', {})
    
    # Check publishing information
    locales = pub_info.get('locales', {})
    en_us = locales.get('en-US', {})
    
    # Validate required fields
    required_fields = ['name', 'summary', 'description', 'examplePhrases', 'keywords']
    for field in required_fields:
        if not en_us.get(field):
            issues.append(f"❌ Missing required field: {field}")
    
    # Check icons
    large_icon = en_us.get('largeIconUri', '')
    small_icon = en_us.get('smallIconUri', '')
    
    if 'example.com' in large_icon or not large_icon:
        issues.append("❌ Large icon URL is placeholder or missing")
    if 'example.com' in small_icon or not small_icon:
        issues.append("❌ Small icon URL is placeholder or missing")
    
    # Check privacy policy and terms
    privacy_locales = privacy.get('locales', {}).get('en-US', {})
    privacy_url = privacy_locales.get('privacyPolicyUrl', '')
    terms_url = privacy_locales.get('termsOfUseUrl', '')
    
    if 'example.com' in privacy_url or not privacy_url:
        issues.append("❌ Privacy policy URL is placeholder or missing")
    if 'example.com' in terms_url or not terms_url:
        issues.append("❌ Terms of use URL is placeholder or missing")
    
    # Check interaction model
    if not os.path.exists('skill-package/interactionModels/custom/en-US.json'):
        issues.append("❌ Interaction model not found")
    else:
        with open('skill-package/interactionModels/custom/en-US.json', 'r') as f:
            interaction_model = json.load(f)
        
        intents = interaction_model.get('interactionModel', {}).get('languageModel', {}).get('intents', [])
        custom_intents = [i for i in intents if not i['name'].startswith('AMAZON.')]
        
        if len(custom_intents) < 3:
            warnings.append("⚠️  Consider adding more custom intents for better functionality")
    
    # Check source files
    required_files = [
        'lambda_function.py',
        'requirements.txt',
        'src/handlers/basic_handlers.py',
        'src/handlers/list_releases_handler.py',
        'src/handlers/search_release_handler.py',
        'src/handlers/random_release_handler.py',
        'src/utils/discogs_utils.py'
    ]
    
    for file_path in required_files:
        if not os.path.exists(file_path):
            issues.append(f"❌ Missing required file: {file_path}")
    
    # Validate URLs (basic check)
    urls_to_check = []
    if large_icon and 'example.com' not in large_icon:
        urls_to_check.append(('Large Icon', large_icon))
    if small_icon and 'example.com' not in small_icon:
        urls_to_check.append(('Small Icon', small_icon))
    if privacy_url and 'example.com' not in privacy_url:
        urls_to_check.append(('Privacy Policy', privacy_url))
    if terms_url and 'example.com' not in terms_url:
        urls_to_check.append(('Terms of Use', terms_url))
    
    for name, url in urls_to_check:
        try:
            parsed = urlparse(url)
            if parsed.scheme != 'https':
                issues.append(f"❌ {name} URL must use HTTPS: {url}")
        except Exception:
            issues.append(f"❌ Invalid {name} URL: {url}")
    
    return issues, warnings

def print_results(issues, warnings):
    """Print validation results"""
    print("\n📋 VALIDATION RESULTS")
    print("=" * 50)
    
    if issues:
        print("🚨 CRITICAL ISSUES (Must fix before publishing):")
        for issue in issues:
            print(f"  {issue}")
    
    if warnings:
        print("\n⚠️  WARNINGS (Recommended to fix):")
        for warning in warnings:
            print(f"  {warning}")
    
    if not issues and not warnings:
        print("✅ All checks passed! Your skill is ready for publishing.")
    elif not issues:
        print("✅ No critical issues found. Address warnings if possible.")
    else:
        print(f"\n❌ Found {len(issues)} critical issues that must be fixed before publishing.")
    
    print("\n📚 Next Steps:")
    if issues:
        print("1. Fix all critical issues listed above")
        print("2. Re-run this validation script")
        print("3. Deploy to AWS Lambda")
        print("4. Test thoroughly in Alexa Developer Console")
        print("5. Submit for certification")
    else:
        print("1. Deploy to AWS Lambda using: python deploy.py")
        print("2. Test thoroughly in Alexa Developer Console")
        print("3. Submit for certification")
    
    print("\n📖 See PUBLISHING_GUIDE.md for detailed instructions")

def main():
    """Main validation function"""
    issues, warnings = validate_skill_config()
    print_results(issues, warnings)
    
    return len(issues) == 0

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)