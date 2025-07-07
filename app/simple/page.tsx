'use client';

import { useChat } from 'ai/react';

export default function SimpleChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/simple-chat',
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          💙 ADHD Memory Agent
        </h1>
        <p className="text-gray-600">
          Your supportive AI memory companion
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <p>Hi! I'm here to help you remember things.</p>
              <p className="text-sm mt-2">Try saying "Remember that I left my keys on the kitchen counter"</p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          value={input}
          placeholder="Tell me something to remember or ask me to recall something..."
          onChange={handleInputChange}
          className="flex-1 min-w-0 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
      
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => handleInputChange({ target: { value: 'Remember that I left my wallet in my jacket pocket' } } as any)}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full"
        >
          💳 Remember wallet location
        </button>
        <button
          onClick={() => handleInputChange({ target: { value: 'Where did I put my keys?' } } as any)}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full"
        >
          🔑 Find my keys
        </button>
      </div>
    </div>
  );
}