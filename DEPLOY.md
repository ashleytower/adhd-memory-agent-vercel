# 🚀 Deploy to GitHub & Vercel

## Step 1: Push to GitHub

1. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Name: `adhd-memory-agent-vercel`
   - Description: "ADHD Memory Agent - A supportive AI memory companion"
   - Make it public
   - Don't initialize with README (we already have one)

2. Push your code:
```bash
git remote add origin https://github.com/ashleytower/adhd-memory-agent-vercel.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure environment variables:
   - `COMPOSIO_API_KEY` = ft195szoj65fl679hkpm4s
   - `OPENAI_API_KEY` = (your OpenAI key)

4. Click "Deploy"

## Step 3: Enable Vercel KV

1. After deployment, go to your project dashboard
2. Click "Storage" tab
3. Click "Create Database" → "KV"
4. Follow the setup (it's automatic!)

Your app will be live at: `https://adhd-memory-agent-vercel.vercel.app`

## 🎉 That's it! 

Your ADHD Memory Agent is now:
- ✅ Globally distributed on Vercel's edge network
- ✅ Using persistent KV storage for memories
- ✅ Ready for Composio AI integrations
- ✅ Lightning fast with <100ms response times