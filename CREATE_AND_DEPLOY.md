# 🚀 Create GitHub Repo and Deploy to Vercel

## Option 1: Manual GitHub Creation + Push

### Step 1: Create GitHub Repository
1. Go to: https://github.com/new
2. Fill in:
   - Repository name: `adhd-memory-agent-vercel`
   - Description: `ADHD Memory Agent - A supportive AI memory companion`
   - Public repository
   - DON'T initialize with README

### Step 2: Push Your Code
Run these commands:
```bash
cd /Users/ashleytower/Desktop/adhd-memory-agent-vercel
git remote add origin https://github.com/ashleytower/adhd-memory-agent-vercel.git
git branch -M main
git push -u origin main
```

## Option 2: Use GitHub CLI (if installed)
```bash
gh repo create adhd-memory-agent-vercel --public --source=. --remote=origin --push
```

## Deploy to Vercel

### Step 1: Import to Vercel
1. Go to: https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `adhd-memory-agent-vercel` repo

### Step 2: Configure Environment Variables
Add these in Vercel dashboard:
- `COMPOSIO_API_KEY` = `ft195szoj65fl679hkpm4s`
- `OPENAI_API_KEY` = (your OpenAI API key)

### Step 3: Deploy
Click "Deploy" and wait ~60 seconds

### Step 4: Enable Vercel KV
1. Go to your project dashboard
2. Click "Storage" tab
3. Create a KV database (it's automatic!)

## 🎉 Your App is Live!
Visit: `https://adhd-memory-agent-vercel.vercel.app`

## Quick Deploy Link
After creating the GitHub repo, use this link:
https://vercel.com/new/clone?repository-url=https://github.com/ashleytower/adhd-memory-agent-vercel