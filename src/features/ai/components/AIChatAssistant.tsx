'use client';

import { useChat } from 'ai/react';

export function AIChatAssistant() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai/chat',
  });

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto border rounded-xl bg-white shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="text-lg font-bold text-black">AI Tutor</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-black'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-500 p-3 rounded-lg animate-pulse">Thinking...</div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <input
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
          value={input}
          placeholder="Ask me anything about your subjects..."
          onChange={handleInputChange}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
