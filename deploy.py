#!/usr/bin/env python3
"""
Deployment script for Alexa Discogs Skill (Python)
"""

import os
import shutil
import subprocess
import zipfile
from pathlib import Path

def create_deployment_package():
    """Create deployment package for AWS Lambda"""
    print("🎵 Creating Alexa Discogs Music Explorer deployment package...")
    
    # Clean up previous deployment
    if os.path.exists('deployment'):
        shutil.rmtree('deployment')
    
    if os.path.exists('alexa-discogs-skill-python.zip'):
        os.remove('alexa-discogs-skill-python.zip')
    
    # Create deployment directory
    os.makedirs('deployment')
    
    # Copy source files
    print("📦 Copying source files...")
    shutil.copytree('src', 'deployment/src')
    shutil.copy('lambda_function.py', 'deployment/')
    shutil.copy('requirements.txt', 'deployment/')
    
    # Install dependencies
    print("📦 Installing dependencies...")
    subprocess.run([
        'pip', 'install', '-r', 'requirements.txt', '-t', 'deployment/'
    ], check=True)
    
    # Create ZIP file
    print("📦 Creating ZIP package...")
    with zipfile.ZipFile('alexa-discogs-skill-python.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk('deployment'):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, 'deployment')
                zipf.write(file_path, arcname)
    
    # Clean up deployment directory
    shutil.rmtree('deployment')
    
    print("✅ Deployment package created: alexa-discogs-skill-python.zip")
    print("")
    print("🎯 Next steps:")
    print("1. Upload the ZIP file to AWS Lambda")
    print("2. Set the handler to: lambda_function.handler")
    print("3. Set the runtime to: Python 3.9 or later")
    print("4. Configure Alexa Skills Kit trigger")
    print("5. Test your skill in the Alexa Developer Console")

if __name__ == "__main__":
    create_deployment_package()