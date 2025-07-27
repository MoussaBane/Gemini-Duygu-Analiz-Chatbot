#!/bin/bash
# Deployment script for GitHub Pages

echo "🚀 Deploying Gemini Chatbot to GitHub Pages..."

# Switch to gh-pages branch
git checkout gh-pages

# Copy production files
cp index-production.html index.html
cp js/chatbot-production.js js/chatbot.js

# Add all changes
git add .

# Commit changes
git commit -m "Deploy production version to GitHub Pages"

# Push to GitHub Pages
git push origin gh-pages

# Switch back to main branch
git checkout main

echo "✅ Deployment completed!"
echo "🌐 Your chatbot will be available at: https://moussabane.github.io/Gemini-Duygu-Analiz-Chatbot/"
