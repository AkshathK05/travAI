import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ChatSession, ThinkingStep } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LandingView } from './components/LandingView';
import { UserMessage } from './components/UserMessage';
import { AIMessage } from './components/AIMessage';
import { ChatInput } from './components/ChatInput';
import { ExportModal } from './components/ExportModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import {
  getStoredApiKey,
  streamGeminiQuery,
  extractFollowUpSuggestions
} from './services/geminiService';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Gemini 2.5 Flash');
  const [currency, setCurrency] = useState('₹ INR');
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportMessage, setExportMessage] = useState<ChatMessage | null>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    setHasApiKey(!!getStoredApiKey());
  }, []);

  const refreshApiKeyStatus = () => {
    setHasApiKey(!!getStoredApiKey());
  };

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

  const handleSendMessage = async (text: string, _metadata?: { budget?: string; travelers?: string }) => {
    if (isGenerating) return;

    const currentApiKey = getStoredApiKey();

    // Prompt user for API key if missing
    if (!currentApiKey) {
      setIsApiKeyModalOpen(true);
      return;
    }

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
      { id: '1', text: `Connecting to ${selectedModel}...`, status: 'in_progress' },
      { id: '2', text: 'Streaming live AI response...', status: 'pending' }
    ];

    const newAiMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp,
      isStreaming: true,
      thinkingSteps: initialThinkingSteps,
      thinkingTimeSeconds: 1
    };

    setMessages((prev) => [...prev, newUserMsg, newAiMsg]);
    setIsGenerating(true);

    // Direct Gemini API Stream Call (no context, no mock fallback)
    try {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === assistantMsgId && msg.thinkingSteps) {
            return {
              ...msg,
              thinkingSteps: [
                { ...msg.thinkingSteps[0], status: 'completed' },
                { ...msg.thinkingSteps[1], status: 'in_progress' }
              ]
            };
          }
          return msg;
        })
      );

      // Call Gemini API with raw prompt (no prior chat context passed)
      const streamResult = await streamGeminiQuery(
        text,
        [], // empty array: do not pass chat history
        undefined, // do not attach parameter metadata
        selectedModel,
        currentApiKey
      );

      let accumulatedContent = '';

      for await (const chunk of streamResult.stream) {
        accumulatedContent += chunk;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  content: accumulatedContent,
                  isStreaming: true
                }
              : msg
          )
        );
      }

      const fullText = await streamResult.getFullText();
      const followUps = extractFollowUpSuggestions(fullText);

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === assistantMsgId) {
            const completedSteps = (msg.thinkingSteps || []).map((s) => ({
              ...s,
              status: 'completed' as const
            }));
            return {
              ...msg,
              content: fullText,
              thinkingSteps: completedSteps,
              followUpSuggestions: followUps,
              isStreaming: false
            };
          }
          return msg;
        })
      );
    } catch (error: any) {
      console.error('Failed to query Gemini model:', error);
      const isMissingKey = error?.message === 'MISSING_API_KEY';
      const isInvalidKey = error?.message === 'INVALID_API_KEY';

      let errorContent = '';
      if (isMissingKey) {
        errorContent = `🔑 **Gemini API Key Required**\n\nPlease click **Set Gemini API Key** in the top navigation bar to paste your API key.`;
      } else if (isInvalidKey) {
        errorContent = `❌ **Invalid Gemini API Key**\n\nGoogle rejected the API key saved in your browser. Please click **Set Gemini API Key** in the header to update your key.`;
      } else {
        errorContent = `⚠️ **Unable to connect to Gemini API**\n\n${error?.message || 'An error occurred while connecting to the Gemini model.'}`;
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                content: errorContent,
                isStreaming: false,
                thinkingSteps: (msg.thinkingSteps || []).map((s) => ({ ...s, status: 'completed' }))
              }
            : msg
        )
      );

      if (isMissingKey || isInvalidKey) {
        setIsApiKeyModalOpen(true);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveSessionId(null);
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F0] text-slate-900 flex flex-col font-['Outfit','Plus_Jakarta_Sans',sans-serif] brutal-grid selection:bg-[#FFE600] selection:text-black">
      
      <Header
        onToggleSidebar={() => setSidebarOpen(true)}
        onNewChat={handleNewChat}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        isLanding={messages.length === 0}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasApiKey={hasApiKey}
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

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={refreshApiKeyStatus}
      />

    </div>
  );
}
