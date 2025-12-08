import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../src/hooks/useAuth';
import { Bot, Send, User, Loader2, Paperclip, MoreHorizontal, ArrowLeft } from 'lucide-react';

interface ComponentProps {
  id: number;
  sender: 'ai' | 'user';
  text: string;
  subtext?: string;
}

const AIChat: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ComponentProps[]>([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I'm your AI Compliance Assistant. How can I help you manage your business compliance today?",
      subtext: "For example, you can ask me: 'How do I register for a Tax Identification Number (TIN)?'"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ComponentProps = {
      id: Date.now(),
      sender: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let aiResponseText = "I can help with that compliance question. ";

      const lowerInput = input.toLowerCase();
      if (lowerInput.includes('tin')) {
        aiResponseText += "To register for a TIN, you need to visit the nearest FIRS office with your Certificate of Incorporation and a valid ID, or you can apply online via the JTB portal.";
      } else if (lowerInput.includes('cac')) {
        aiResponseText += "For CAC matters, ensure your annual returns are filed to avoid penalties. You can check your status on the CAC portal.";
      } else if (lowerInput.includes('tax')) {
        aiResponseText += "Tax compliance is crucial. Depending on your business, you may need to file VAT (monthly) and CIT (annually).";
      } else {
        aiResponseText += "Could you provide more specific details about your business type so I can give tailored advice?";
      }

      const aiMessage: ComponentProps = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiResponseText
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-row min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen relative">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-200 bg-white p-4 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="bg-primary/10 p-2 rounded-lg">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">AI Compliance Assistant</h2>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <p className="text-xs font-medium text-green-600">Online</p>
              </div>
            </div>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-3xl mx-auto flex flex-col gap-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'ai' ? 'bg-primary text-white' : 'bg-navy text-white'
                  }`}>
                  {msg.sender === 'ai' ? <Bot size={18} /> : <User size={18} />}
                </div>

                {/* Message Bubble */}
                <div className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <span className="text-xs text-gray-500 mb-1 px-1">
                    {msg.sender === 'ai' ? 'AI Assistant' : currentUser?.email || 'You'}
                  </span>
                  <div className={`p-4 rounded-2xl shadow-sm text-sm ${msg.sender === 'user'
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                    }`}>
                    <p>{msg.text}</p>
                    {msg.subtext && (
                      <div className="mt-2 pt-2 border-t border-primary/20 text-xs opacity-90">
                        {msg.subtext}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                  <Bot size={18} />
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex items-center gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0">
          <div className="max-w-3xl mx-auto relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Ask a compliance question..."
              className="w-full resize-none bg-gray-50 border border-gray-300 rounded-xl pl-4 pr-24 py-3 min-h-[52px] max-h-32 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm text-gray-900 placeholder:text-gray-500"
              rows={1}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                title="Attach file"
              >
                <Paperclip size={18} />
              </button>
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className={`p-2 rounded-lg transition-colors ${input.trim()
                    ? 'bg-primary text-white hover:bg-primary/90 shadow-sm'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">
            AI can make mistakes. Please verify important compliance information.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AIChat;