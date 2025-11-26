import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Cpu } from 'lucide-react';
import { sendMessage } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIAgent: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'AIX Protocol Agent initialized. How may I assist you with system operations today?',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessage(input);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Error: Unable to establish link with neural core.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-aix-black p-6">
      <div className="flex-1 bg-aix-panel border border-aix-border rounded-sm flex flex-col overflow-hidden max-w-4xl mx-auto w-full shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-aix-border flex items-center gap-3 bg-zinc-900/50">
          <div className="w-8 h-8 bg-black border border-aix-green/30 rounded flex items-center justify-center">
            <Bot size={18} className="text-aix-green" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wider">NEURAL SUPPORT INTERFACE</h2>
            <div className="flex items-center gap-2 mt-0.5">
               <span className="w-1.5 h-1.5 rounded-full bg-aix-green animate-pulse"></span>
               <span className="text-[10px] text-zinc-500 font-mono">ONLINE // MODEL: GEMINI-2.5-FLASH</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded border flex items-center justify-center shrink-0 
                ${msg.role === 'model' ? 'bg-black border-aix-green/30 text-aix-green' : 'bg-zinc-800 border-zinc-700 text-zinc-300'}`}>
                {msg.role === 'model' ? <Cpu size={16} /> : <User size={16} />}
              </div>
              <div className={`max-w-[70%] rounded-sm p-4 text-sm leading-relaxed border
                ${msg.role === 'model' 
                  ? 'bg-black/50 border-aix-border text-zinc-300' 
                  : 'bg-zinc-900 border-zinc-700 text-white'}`}>
                {msg.text}
                <div className="mt-2 text-[10px] text-zinc-600 font-mono text-right opacity-50">
                  {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
               <div className="w-8 h-8 rounded border border-aix-green/30 bg-black flex items-center justify-center text-aix-green">
                <Cpu size={16} className="animate-spin" />
              </div>
              <div className="text-xs text-zinc-500 font-mono flex items-center h-8">
                COMPUTING RESPONSE...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-aix-border bg-black">
          <div className="relative flex items-center gap-2">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 font-mono text-xs pointer-events-none">&gt;</div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter command or query..."
              className="w-full bg-aix-panel border border-aix-border rounded-sm py-3 pl-8 pr-12 text-sm text-white focus:outline-none focus:border-zinc-600 font-mono placeholder:text-zinc-700"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAgent;
