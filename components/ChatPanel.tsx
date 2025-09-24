import React, { useState, useRef, useEffect } from 'react';
import { Project } from '../types';
import { chatWithContext } from '../services/geminiService';

interface ChatPanelProps {
  project: Project;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ project }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Build context from project items, prioritizing full fetched text
    const context = project.items.map(item => {
      if (item.type === 'paper') {
        const content = (item.content.contentStatus === 'loaded' && item.content.textContent)
          ? `Full Text: ${item.content.textContent.substring(0, 4000)}...`
          : `Summary: ${item.content.summary}`;
        return `Source Type: Academic Paper\nTitle: ${item.content.title}\n${content}`;
      }
      if (item.type === 'web') {
        const content = (item.content.contentStatus === 'loaded' && item.content.textContent)
          ? `Page Content: ${item.content.textContent.substring(0, 4000)}...`
          : `(No content fetched for this link)`;
        return `Source Type: Web Page\nTitle: ${item.content.title}\nURL: ${item.content.link}\n${content}`;
      }
      if (item.type === 'text') {
        return `Source Type: User Note\nContent: ${item.content.text}`;
      }
      return '';
    }).join('\n\n---\n\n');

    try {
      const aiResponse = await chatWithContext(context, input);
      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I had trouble responding.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-96 bg-white border-l border-slate-200 flex flex-col h-full">
      <div className="p-4 border-b border-slate-200">
        <h3 className="font-bold text-lg text-slate-800">Chat with Project</h3>
        <p className="text-sm text-slate-500">Ask questions about your research items.</p>
      </div>
      <div className="flex-grow p-4 overflow-y-auto bg-slate-50">
        <div className="space-y-4">
            {messages.length === 0 && (
                <div className="text-center text-slate-400 mt-10">
                    <p>Chat history will appear here.</p>
                </div>
            )}
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${
                  msg.sender === 'user'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-200 text-slate-800'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
                <div className="bg-slate-200 text-slate-800 px-4 py-2 rounded-xl">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse delay-75"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse delay-150"></div>
                    </div>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 border-t border-slate-200">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your message..."
            className="flex-grow bg-slate-100 border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 disabled:bg-indigo-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;