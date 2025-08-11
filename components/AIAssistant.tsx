
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Loader } from 'lucide-react';
import { askAIAssistant } from '../services/geminiService';

interface Message {
  text: string;
  isUser: boolean;
}

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;
    
    const userMessage: Message = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        const responseText = await askAIAssistant(input);
        const aiMessage: Message = { text: responseText, isUser: false };
        setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
        const errorMessage: Message = { text: 'Sorry, I encountered an error.', isUser: false };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-brand-primary text-white p-4 rounded-full shadow-lg hover:bg-brand-secondary transition-transform hover:scale-110 z-50"
        aria-label="Open AI Assistant"
      >
        <Bot size={28} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[60vh] bg-white rounded-2xl shadow-2xl flex flex-col z-50 transition-all">
      <header className="bg-brand-primary text-white p-4 rounded-t-2xl flex justify-between items-center">
        <h3 className="font-bold text-lg flex items-center">
            <Bot size={22} className="mr-2"/> FleetAI Assistant
        </h3>
        <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
          <X size={24} />
        </button>
      </header>

      <div className="flex-1 p-4 overflow-y-auto bg-neutral-light/50">
         {messages.length === 0 && (
             <div className="text-center text-gray-500 mt-8">
                 <p>Pregúntame sobre tu flota.</p>
                 <p className="text-xs mt-2">Ej: "¿Qué vehículos necesitan un cambio de aceite pronto?"</p>
             </div>
         )}
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md lg:max-w-xs break-words px-4 py-2 rounded-2xl ${msg.isUser ? 'bg-brand-accent text-white' : 'bg-gray-200 text-neutral-black'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 rounded-2xl bg-gray-200 text-neutral-black flex items-center">
                <Loader size={16} className="animate-spin mr-2" />
                <span>Pensando...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu pregunta..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none"
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading || input.trim() === ''} className="bg-brand-primary text-white p-2 rounded-lg disabled:bg-gray-400">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
