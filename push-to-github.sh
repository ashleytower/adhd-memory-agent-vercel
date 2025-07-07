#!/bin/bash

echo "🚀 Push ADHD Memory Agent to GitHub"
echo "===================================="
echo ""
echo "First, create a new repository on GitHub:"
echo "1. Go to: https://github.com/new"
echo "2. Repository name: adhd-memory-agent-vercel"
echo "3. Description: ADHD Memory Agent - A supportive AI memory companion"
echo "4. Make it Public"
echo "5. DON'T initialize with README"
echo ""
echo "Press Enter when you've created the repository..."
read

echo ""
echo "Now I'll push your code to GitHub..."
echo ""

# Add remote origin
git remote add origin https://github.com/ashleytower/adhd-memory-agent-vercel.git

# Push to main branch
git branch -M main
git push -u origin main

echo ""
echo "✅ Done! Your code is now on GitHub!"
echo ""
echo "Next steps:"
echo "1. Go to https://vercel.com/new"
echo "2. Import your GitHub repository"
echo "3. Add environment variables:"
echo "   - COMPOSIO_API_KEY = ft195szoj65fl679hkpm4s"
echo "   - OPENAI_API_KEY = your-openai-key"
echo "4. Click Deploy!"
echo ""
echo "Your app will be live in ~60 seconds! 🎉"