import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ChatSession, ThinkingStep } from './types';
import { getMockResponseForInput, CHEAPER_DAY3_RESPONSE, MORE_FOOD_RESPONSE } from './data/mockData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LandingView } from './components/LandingView';
import { UserMessage } from './components/UserMessage';
import { AIMessage } from './components/AIMessage';
import { ChatInput } from './components/ChatInput';
import { ExportModal } from './components/ExportModal';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('TravAI Core');
  const [currency, setCurrency] = useState('₹ INR');
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportMessage, setExportMessage] = useState<ChatMessage | null>(null);

  const [sessions] = useState<ChatSession[]>([
    {
      id: 'sess-1',
      title: '7-Day Japan Food & Culture Trip',
      createdAt: 'Today',
      updatedAt: 'Just now',
      messageCount: 2,
      preview: 'Plan a 7-day trip to Japan for two people under ₹1.5 lakh...'
    },
    {
      id: 'sess-2',
      title: 'Bali vs Vietnam ₹80,000 Budget',
      createdAt: 'Yesterday',
      updatedAt: 'Yesterday',
      messageCount: 2,
      preview: 'Compare a 5-day holiday in Bali vs Vietnam for ₹80,000.'
    },
    {
      id: 'sess-3',
      title: 'Dubai 4-Day Weekend',
      createdAt: '3 days ago',
      updatedAt: '3 days ago',
      messageCount: 4,
      preview: '4-day luxury weekend in Dubai with top dining...'
    }
  ]);

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSendMessage = (text: string, metadata?: { budget?: string; travelers?: string }) => {
    if (isGenerating) return;

    const userMsgId = `user-${Date.now()}`;
    const assistantMsgId = `ai-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: text,
      timestamp
    };

    const initialThinkingSteps: ThinkingStep[] = [
      { id: '1', text: `Analyzing constraints (${metadata?.budget || 'Budget'} & ${metadata?.travelers || '2 Adults'})`, status: 'in_progress' },
      { id: '2', text: 'Searching flight availability', status: 'pending' },
      { id: '3', text: 'Comparing hotel locations & rates', status: 'pending' },
      { id: '4', text: 'Curating food & cultural activities', status: 'pending' },
      { id: '5', text: 'Optimizing day-by-day itinerary timing', status: 'pending' }
    ];

    const newAiMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp,
      isStreaming: true,
      thinkingSteps: initialThinkingSteps,
      thinkingTimeSeconds: 4
    };

    setMessages((prev) => [...prev, newUserMsg, newAiMsg]);
    setIsGenerating(true);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === assistantMsgId && msg.thinkingSteps) {
            return {
              ...msg,
              thinkingSteps: [
                { ...msg.thinkingSteps[0], status: 'completed' },
                { ...msg.thinkingSteps[1], status: 'completed' },
                { ...msg.thinkingSteps[2], status: 'in_progress' },
                msg.thinkingSteps[3],
                msg.thinkingSteps[4]
              ]
            };
          }
          return msg;
        })
      );
    }, 1000);

    setTimeout(() => {
      let responsePayload = getMockResponseForInput(text);

      if (text.toLowerCase().includes('cheaper')) {
        responsePayload = {
          content: CHEAPER_DAY3_RESPONSE,
          followUpSuggestions: ['Add more food spots in Osaka', 'Swap hotel to Shibuya', 'Show direct flights']
        };
      } else if (text.toLowerCase().includes('food')) {
        responsePayload = {
          content: MORE_FOOD_RESPONSE,
          followUpSuggestions: ['Make Day 3 cheaper', 'Swap hotel to Shibuya', 'Compare Japan vs Vietnam']
        };
      }

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === assistantMsgId) {
            const completedSteps = (msg.thinkingSteps || []).map((s) => ({
              ...s,
              status: 'completed' as const
            }));

            return {
              ...msg,
              ...responsePayload,
              thinkingSteps: completedSteps,
              isStreaming: true
            };
          }
          return msg;
        })
      );
    }, 2200);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === assistantMsgId ? { ...msg, isStreaming: false } : msg))
      );
      setIsGenerating(false);
    }, 3800);
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveSessionId(null);
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    const mockPayload = getMockResponseForInput('Japan');
    setMessages([
      {
        id: 'u-past',
        role: 'user',
        content: 'Plan a 7-day trip to Japan for two people under ₹1.5 lakh, focused on food and culture.',
        timestamp: '10:14 AM'
      },
      {
        id: 'ai-past',
        role: 'assistant',
        timestamp: '10:15 AM',
        isStreaming: false,
        thinkingSteps: [
          { id: '1', text: 'Understanding budget (₹1.5L) & preferences (Food & Culture)', status: 'completed' },
          { id: '2', text: 'Checking flight routes (DEL → HND/NRT)', status: 'completed' },
          { id: '3', text: 'Finding boutique hotels in Tokyo & Kyoto', status: 'completed' },
          { id: '4', text: 'Curating food tours & ramen spots', status: 'completed' }
        ],
        thinkingTimeSeconds: 4,
        ...mockPayload
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F0] text-slate-900 flex flex-col font-['Outfit','Plus_Jakarta_Sans',sans-serif] brutal-grid selection:bg-[#FFE600] selection:text-black">
      
      <Header
        onToggleSidebar={() => setSidebarOpen(true)}
        onNewChat={handleNewChat}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        isLanding={messages.length === 0}
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        currency={currency}
        onSelectCurrency={setCurrency}
      />

      <main className="flex-1 flex flex-col justify-between">
        {messages.length === 0 ? (
          <LandingView onSend={handleSendMessage} disabled={isGenerating} />
        ) : (
          <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 pt-4 pb-36">
            {messages.map((msg) =>
              msg.role === 'user' ? (
                <UserMessage key={msg.id} message={msg} />
              ) : (
                <AIMessage
                  key={msg.id}
                  message={msg}
                  onFollowUpSelect={handleSendMessage}
                  onExportItinerary={(m) => setExportMessage(m)}
                />
              )
            )}
            <div ref={chatBottomRef} />
          </div>
        )}
      </main>

      {messages.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-gradient-to-t from-[#F4F4F0] via-[#F4F4F0]/90 to-transparent">
          <ChatInput onSend={handleSendMessage} disabled={isGenerating} isLanding={false} />
        </div>
      )}

      <ExportModal
        isOpen={!!exportMessage}
        onClose={() => setExportMessage(null)}
        message={exportMessage}
      />

    </div>
  );
}
