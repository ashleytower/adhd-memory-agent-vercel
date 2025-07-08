# 🧠 ADHD Memory Agent - Vercel Edition

> We Remember So You're Allowed To Forget

A supportive AI memory companion designed specifically for people with ADHD, now powered by Vercel's edge infrastructure for lightning-fast responses.

## ✨ Features

- **ADHD-Friendly Design**: Understanding, patient, and never judgmental
- **Smart Memory Storage**: Automatically categorizes and tags memories
- **Natural Language Search**: Find memories using everyday language
- **Context Switching Support**: Handles topic changes gracefully
- **Quick Actions**: Common questions at your fingertips
- **Real-time Chat**: Powered by Vercel's streaming AI SDK

## 🚀 Tech Stack

- **Next.js 14**: React framework with App Router
- **Vercel AI SDK**: For streaming chat experiences
- **Composio**: AI agent integrations, including Mem0 for memory storage
- **OpenAI GPT-4**: Conversational AI engine
- **Vercel AI SDK**: For streaming chat experiences
- **Tailwind CSS**: Beautiful, responsive design

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/adhd-memory-agent-vercel.git
cd adhd-memory-agent-vercel
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Add your API keys to `.env`:
```
COMPOSIO_API_KEY=your_composio_api_key
OPENAI_API_KEY=your_openai_api_key
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🚀 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/adhd-memory-agent-vercel)

After deploying:
1. Add your environment variables in Vercel dashboard (ensure `COMPOSIO_API_KEY` and `OPENAI_API_KEY` are set).
2. Your app will be live at `https://your-app.vercel.app`

## 🏗️ Architecture

```
app/
├── page.tsx          # Main chat interface
├── api/
│   ├── chat/         # Streaming chat endpoint with Composio memory
│   └── memories/     # Memory CRUD operations via Composio
├── lib/
│   ├── composio.ts        # Composio client setup
│   └── composio-memory.ts # Composio Memory (Mem0) service layer
└── components/       # Reusable UI components
```

## 🔧 Configuration

### Memory Categories
- **Objects**: Keys, wallet, phone locations
- **Health**: Medication reminders
- **Schedule**: Appointments and meetings
- **Tasks**: To-dos and work items
- **General**: Everything else

### Quick Actions
Customize quick action buttons in `app/page.tsx`:
```typescript
const quickActions = [
  { icon: '🔑', text: 'Where are my keys?', action: 'Where did I put my keys?' },
  // Add more...
];
```

## 🛡️ Security

- User authentication ready (implement your auth provider)
- Environment variables for sensitive data
- Secure memory storage with user isolation
- Rate limiting ready to implement

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this for your own ADHD support tools!

## 💙 Acknowledgments

Built with love for the ADHD community. Remember: different brains are not broken brains!

**Status:** ✅ AI SDK v4.3.17 - Vercel deployment ready!

---

**Need help?** Open an issue or reach out to the community. We're here to support each other!