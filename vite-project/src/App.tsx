import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ChatSession } from './types';
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
import {
  signInWithGoogle,
  signOutUser,
  onAuthChange,
  saveCloudSession,
  loadCloudSessions,
  loadCloudSessionMessages,
  clearCloudSessions
} from './services/firebase';
import {
  INITIAL_JAPAN_RESPONSE,
  JAPAN_TRIP_SOURCES,
  JAPAN_FLIGHTS,
  JAPAN_HOTELS,
  JAPAN_ITINERARY,
  BALI_VS_VIETNAM_COMPARISON
} from './data/mockData';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Gemini 2.0 Flash');
  const [currency, setCurrency] = useState(() => localStorage.getItem('travai_currency') || '₹ INR');
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportMessage, setExportMessage] = useState<ChatMessage | null>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setHasApiKey(!!getStoredApiKey());
  }, []);

  const refreshApiKeyStatus = () => {
    setHasApiKey(!!getStoredApiKey());
  };

  const handleSelectCurrency = (curr: string) => {
    setCurrency(curr);
    localStorage.setItem('travai_currency', curr);
  };

  // Firebase auth state tracking and cloud session loading
  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser?.uid) {
        loadCloudSessions(firebaseUser.uid).then((cloudSess) => {
          if (cloudSess && cloudSess.length > 0) {
            setSessions((prev) => {
              const combined = [...cloudSess];
              prev.forEach((p) => {
                if (!combined.some((c) => c.id === p.id)) combined.push(p);
              });
              return combined;
            });
          }
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.warn('Google sign-in error:', err);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    setUser(null);
  };

  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('travai_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return [
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
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const isGeneratingRef = useRef(false);

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSendMessage = async (
    text: string,
    metadata?: { budget?: string; travelers?: string; currency?: string; origin?: string }
  ) => {
    // Immediate synchronous lock to prevent double-firing and phantom duplicate requests
    if (isGeneratingRef.current) return;
    if (!text || !text.trim()) return;

    const currentApiKey = getStoredApiKey();

    // Prompt user for API key if missing
    if (!currentApiKey) {
      setIsApiKeyModalOpen(true);
      return;
    }

    isGeneratingRef.current = true;
    setIsGenerating(true);

    const userMsgId = `user-${Date.now()}`;
    const assistantMsgId = `ai-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: text.trim(),
      timestamp
    };

    const newAiMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp,
      isStreaming: true
    };

    setMessages((prev) => [...prev, newUserMsg, newAiMsg]);

    // Direct Gemini API Stream Call with Multi-API Grounding
    try {
      const activeCurrency = metadata?.currency || currency;
      const streamResult = await streamGeminiQuery(
        text,
        [],
        {
          budget: metadata?.budget,
          travelers: metadata?.travelers,
          currency: activeCurrency,
          origin: metadata?.origin,
        },
        selectedModel,
        currentApiKey
      );

      const groundedSources = streamResult.places && streamResult.places.length > 0
        ? streamResult.places.map((p, idx) => ({
            id: p.id || `src-osm-${idx}`,
            name: p.name,
            domain: 'openstreetmap.org',
            url: p.mapsUrl || 'https://www.openstreetmap.org',
            snippet: p.description || `${p.typeDisplayName} in ${p.address}`,
            category: 'maps' as const,
          }))
        : undefined;

      // Immediately display verified flights, hotels and sources alongside streaming text
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                flights: streamResult.flights && streamResult.flights.length > 0 ? streamResult.flights : msg.flights,
                hotels: streamResult.hotels && streamResult.hotels.length > 0 ? streamResult.hotels : msg.hotels,
                sources: groundedSources || msg.sources,
              }
            : msg
        )
      );

      let accumulatedContent = '';

      try {
        for await (const chunk of streamResult.stream) {
          accumulatedContent += chunk;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? {
                    ...msg,
                    content: accumulatedContent,
                    isStreaming: true,
                  }
                : msg
            )
          );
        }
      } catch (streamErr: any) {
        console.warn('Stream rendering encountered error, falling back:', streamErr?.message || streamErr);
      }

      const fullText = await streamResult.getFullText();
      const followUps = extractFollowUpSuggestions(fullText);

      let finalMessages: ChatMessage[] = [];
      setMessages((prev) => {
        finalMessages = prev.map((msg) => {
          if (msg.id === assistantMsgId) {
            return {
              ...msg,
              content: fullText,
              followUpSuggestions: followUps,
              flights: streamResult.flights && streamResult.flights.length > 0 ? streamResult.flights : msg.flights,
              hotels: streamResult.hotels && streamResult.hotels.length > 0 ? streamResult.hotels : msg.hotels,
              sources: groundedSources || msg.sources,
              isStreaming: false
            };
          }
          return msg;
        });
        return finalMessages;
      });

      // Update active session metadata
      const currentId = activeSessionId || `sess-${Date.now()}`;
      setActiveSessionId(currentId);
      const titleText = text.slice(0, 45);
      const updatedSess: ChatSession = {
        id: currentId,
        title: titleText.length >= 45 ? `${titleText}...` : titleText,
        createdAt: 'Today',
        updatedAt: 'Just now',
        messageCount: finalMessages.length > 0 ? finalMessages.length : 2,
        preview: text.slice(0, 80),
      };

      setSessions((prev) => {
        const exists = prev.some((s) => s.id === currentId);
        const next = exists ? prev.map((s) => s.id === currentId ? updatedSess : s) : [updatedSess, ...prev];
        localStorage.setItem('travai_sessions', JSON.stringify(next));
        return next;
      });

      // Save messages locally so sessions are hydrated immediately in offline/guest mode
      const msgsToPersist = finalMessages.length > 0 ? finalMessages : [newUserMsg, newAiMsg];
      localStorage.setItem(`travai_msgs_${currentId}`, JSON.stringify(msgsToPersist));

      if (user?.uid) {
        saveCloudSession(user.uid, updatedSess, msgsToPersist);
      }
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
                isStreaming: false
              }
            : msg
        )
      );

      if (isMissingKey || isInvalidKey) {
        setIsApiKeyModalOpen(true);
      }
    } finally {
      isGeneratingRef.current = false;
      setIsGenerating(false);
    }
  };

  const handleNewChat = () => {
    isGeneratingRef.current = false;
    setIsGenerating(false);
    // Preserve current session in history before resetting view
    if (messages.length > 0) {
      const firstUserMsg = messages.find((m) => m.role === 'user');
      const titleText = firstUserMsg?.content.slice(0, 45) || 'Custom Trip Plan';
      const currentId = activeSessionId || `sess-${Date.now()}`;
      const savedSession: ChatSession = {
        id: currentId,
        title: titleText.length >= 45 ? `${titleText}...` : titleText,
        createdAt: 'Today',
        updatedAt: 'Just now',
        messageCount: messages.length,
        preview: firstUserMsg?.content.slice(0, 80) || 'Custom itinerary...',
      };

      setSessions((prev) => {
        const exists = prev.some((s) => s.id === currentId);
        const next = exists ? prev.map((s) => s.id === currentId ? savedSession : s) : [savedSession, ...prev];
        localStorage.setItem('travai_sessions', JSON.stringify(next));
        return next;
      });

      localStorage.setItem(`travai_msgs_${currentId}`, JSON.stringify(messages));
      if (user?.uid) {
        saveCloudSession(user.uid, savedSession, messages);
      }
    }

    setMessages([]);
    setActiveSessionId(null);
  };

  const handleSelectSession = async (id: string) => {
    setActiveSessionId(id);
    setSidebarOpen(false);

    // 1. If user is signed in, load from Firestore
    if (user?.uid) {
      const cloudMsgs = await loadCloudSessionMessages(user.uid, id);
      if (cloudMsgs && cloudMsgs.length > 0) {
        setMessages(cloudMsgs);
        return;
      }
    }

    // 2. Check local storage cache
    const localMsgs = localStorage.getItem(`travai_msgs_${id}`);
    if (localMsgs) {
      try {
        const parsed = JSON.parse(localMsgs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      } catch {}
    }

    // 3. Fallback to demo sessions
    if (id === 'sess-1') {
      setMessages([
        {
          id: 'demo-user-1',
          role: 'user',
          content: 'Plan a 7-day trip to Japan for two people under ₹1.5 lakh, focused on food and culture.',
          timestamp: '10:00 AM'
        },
        {
          id: 'demo-ai-1',
          role: 'assistant',
          content: INITIAL_JAPAN_RESPONSE,
          timestamp: '10:01 AM',
          sources: JAPAN_TRIP_SOURCES,
          flights: JAPAN_FLIGHTS,
          hotels: JAPAN_HOTELS,
          itinerary: JAPAN_ITINERARY,
          followUpSuggestions: [
            '⚡ Make Day 3 cheaper',
            '🍣 Add more food experiences in Osaka',
            '🏨 Swap hotel to Shibuya area',
            '⚖️ Compare Japan with Vietnam for ₹1.5L'
          ]
        }
      ]);
    } else if (id === 'sess-2') {
      setMessages([
        {
          id: 'demo-user-2',
          role: 'user',
          content: 'Compare a 5-day holiday in Bali vs Vietnam for ₹80,000.',
          timestamp: 'Yesterday'
        },
        {
          id: 'demo-ai-2',
          role: 'assistant',
          content: 'Here is a side-by-side comparison between Bali (Indonesia) and Da Nang / Hoi An (Vietnam) for a 5-day trip under ₹80,000 for two people.',
          timestamp: 'Yesterday',
          comparison: BALI_VS_VIETNAM_COMPARISON,
          followUpSuggestions: [
            '🌴 Build 5-day Vietnam itinerary under ₹80k',
            '🌺 Build 5-day Bali itinerary under ₹80k'
          ]
        }
      ]);
    }
  };

  const handleClearAllSessions = async () => {
    if (user?.uid) {
      await clearCloudSessions(user.uid);
    }
    localStorage.removeItem('travai_sessions');
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('travai_msgs_')) {
        localStorage.removeItem(key);
      }
    });
    setSessions([]);
    setMessages([]);
    setActiveSessionId(null);
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
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        currency={currency}
        onSelectCurrency={handleSelectCurrency}
        onClearAllSessions={handleClearAllSessions}
      />

      <main className="flex-1 flex flex-col justify-between">
        {messages.length === 0 ? (
          <LandingView onSend={handleSendMessage} disabled={isGenerating} currency={currency} />
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
          <ChatInput onSend={handleSendMessage} disabled={isGenerating} isLanding={false} currency={currency} />
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
