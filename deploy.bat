@echo off
echo 🚀 Deploying Gemini Chatbot to GitHub Pages...

REM Switch to gh-pages branch
git checkout gh-pages

REM Copy production files
copy index-production.html index.html
copy js\chatbot-production.js js\chatbot.js

REM Add all changes
git add .

REM Commit changes
git commit -m "Deploy production version to GitHub Pages"

REM Push to GitHub Pages
git push origin gh-pages

REM Switch back to main branch
git checkout main

echo ✅ Deployment completed!
echo 🌐 Your chatbot will be available at: https://moussabane.github.io/Gemini-Duygu-Analiz-Chatbot/
