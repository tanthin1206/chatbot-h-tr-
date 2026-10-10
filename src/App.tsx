import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ChatMessage, Screen, SessionState, SavedDraft, ReflectionResult, SupportMode } from './types';
import { Screen0Splash } from './components/Screen0Splash';
import { ScreenChatStart } from './components/ScreenChatStart';
import { ScreenChatConversation } from './components/ScreenChatConversation';
import { Screen1Intro } from './components/Screen1Intro';
import { Screen2Checkin } from './components/Screen2Checkin';
import { Screen3Vent } from './components/Screen3Vent';
import { Screen4Confirm } from './components/Screen4Confirm';
import { Screen5Analyzing } from './components/Screen5Analyzing';
import { Screen6Reflection } from './components/Screen6Reflection';
import { Screen7Composer } from './components/Screen7Composer';
import { Screen8NextActions } from './components/Screen8NextActions';
import { Screen9Checkout } from './components/Screen9Checkout';
import { Screen10Finish } from './components/Screen10Finish';
import { ScreenSafety } from './components/ScreenSafety';
import { DraftsModal } from './components/DraftsModal';
import { SettingsModal } from './components/SettingsModal';
import { analyzeSession, analyzeTextOffline } from './services/analyzer';
import { continueConversation } from './services/conversation';

const STORAGE_KEY_DRAFTS = 'khoang_tho_saved_drafts';
const STORAGE_KEY_BROWSER_API_KEY = 'khoang_tho_browser_gemini_key';
const STORAGE_KEY_REDUCED_MOTION = 'khoang_tho_reduced_motion';
export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('screen-0-splash');
  const [geminiConfigured, setGeminiConfigured] = useState<boolean | null>(null);
  const [browserApiKey, setBrowserApiKey] = useState(() => sessionStorage.getItem(STORAGE_KEY_BROWSER_API_KEY) || '');
  const [reducedMotion, setReducedMotion] = useState(() => localStorage.getItem(STORAGE_KEY_REDUCED_MOTION) === 'true');
  const [drafts, setDrafts] = useState<SavedDraft[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_DRAFTS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isDraftsOpen, setIsDraftsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [safetyReasons, setSafetyReasons] = useState<string[]>([]);
  const [isAnalysisError, setIsAnalysisError] = useState(false);
  const analysisController = useRef<AbortController | null>(null);
  const chatController = useRef<AbortController | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [supportMode, setSupportMode] = useState<SupportMode>('understand');
  const [isChatTyping, setIsChatTyping] = useState(false);

  // Trạng thái phiên làm việc hiện tại
  const [session, setSession] = useState<SessionState>({
    id: 'session_' + Date.now(),
    createdAt: Date.now(),
    initialEmotionLevel: 6,
    selectedEmotions: [],
    rawText: '',
    reflectionResult: null,
    finalDialogue: '',
    dialogueMode: 'sms',
    chosenNextAction: 'breathe_60s',
    finalEmotionLevel: undefined,
    isSavedAsDraft: false,
    isAnalyzedWithAI: false
  });

  useEffect(() => {
    // Di chuyển khỏi cơ chế cũ từng lưu khóa API trong trình duyệt.
    localStorage.removeItem('khoang_tho_gemini_api_key');
    fetch('/api/health')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((health) => setGeminiConfigured(Boolean(health.geminiConfigured)))
      .catch(() => setGeminiConfigured(false));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = reducedMotion ? 'reduced' : 'full';
    localStorage.setItem(STORAGE_KEY_REDUCED_MOTION, String(reducedMotion));
  }, [reducedMotion]);

  const handleSaveBrowserApiKey = (key: string) => {
    const cleanKey = key.trim();
    setBrowserApiKey(cleanKey);
    if (cleanKey) sessionStorage.setItem(STORAGE_KEY_BROWSER_API_KEY, cleanKey);
    else sessionStorage.removeItem(STORAGE_KEY_BROWSER_API_KEY);
  };

  // Xóa toàn bộ dữ liệu máy
  const handleClearAllData = () => {
    localStorage.removeItem(STORAGE_KEY_DRAFTS);
    localStorage.removeItem(STORAGE_KEY_REDUCED_MOTION);
    sessionStorage.removeItem(STORAGE_KEY_BROWSER_API_KEY);
    setDrafts([]);
    setBrowserApiKey('');
    setReducedMotion(false);
    handleEmergencyExit();
  };

  // Lưu nháp vào danh sách
  const handleSaveDraft = (textToSave?: string) => {
    const newDraft: SavedDraft = {
      id: 'draft_' + Date.now(),
      title: 'Phiên nhìn lại ' + new Date().toLocaleDateString('vi-VN'),
      date: new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      dialogue: session.finalDialogue || '',
      initialEmotion: session.initialEmotionLevel,
      finalEmotion: session.finalEmotionLevel,
      summary: textToSave || session.rawText || 'Bản ghi chép cảm xúc'
    };

    const updated = [newDraft, ...drafts];
    setDrafts(updated);
    try {
      localStorage.setItem(STORAGE_KEY_DRAFTS, JSON.stringify(updated));
    } catch (e) {
      console.error('Lỗi lưu nháp:', e);
    }
  };

  // Xóa một bản nháp cụ thể
  const handleDeleteDraft = (id: string) => {
    const updated = drafts.filter((d) => d.id !== id);
    setDrafts(updated);
    localStorage.setItem(STORAGE_KEY_DRAFTS, JSON.stringify(updated));
  };

  // Mở lại bản nháp đã lưu
  const handleSelectDraft = (draft: SavedDraft) => {
    setSession({
      id: 'session_' + Date.now(),
      createdAt: Date.now(),
      initialEmotionLevel: draft.initialEmotion || 6,
      selectedEmotions: [],
      rawText: draft.summary || '',
      reflectionResult: null,
      finalDialogue: draft.dialogue || '',
      dialogueMode: 'sms',
      isSavedAsDraft: true,
      isAnalyzedWithAI: false
    });

    if (draft.dialogue) {
      setCurrentScreen('screen-7-composer');
    } else {
      setCurrentScreen('screen-3-vent');
    }
  };

  // Thoát khẩn cấp và xóa sạch bộ nhớ phiên hiện tại
  const handleEmergencyExit = () => {
    analysisController.current?.abort();
    chatController.current?.abort();
    setChatMessages([]);
    setIsChatTyping(false);
    setSession({
      id: 'session_' + Date.now(),
      createdAt: Date.now(),
      initialEmotionLevel: 5,
      selectedEmotions: [],
      rawText: '',
      reflectionResult: null,
      finalDialogue: '',
      dialogueMode: 'sms',
      isSavedAsDraft: false,
      isAnalyzedWithAI: false
    });
    setCurrentScreen('screen-chat-start');
  };

  // Kích hoạt màn hình an toàn
  const handleTriggerSafety = (reasons: string[]) => {
    setSafetyReasons(reasons);
    setCurrentScreen('screen-safety');
  };

  // Bắt đầu quy trình phân tích AI / Heuristics
  const runAnalysis = async (rawTextOverride?: string) => {
    analysisController.current?.abort();
    const controller = new AbortController();
    analysisController.current = controller;
    setIsAnalysisError(false);
    const startedAt = Date.now();
    try {
      const rawText = rawTextOverride ?? session.rawText;
      const response = await analyzeSession(rawText, session.selectedEmotions, controller.signal, browserApiKey);
      if (controller.signal.aborted) return;
      if (response.risk.level === 'urgent' || !response.result) {
        handleTriggerSafety(response.risk.reasons);
        return;
      }
      const result = response.result;
      setSession((prev) => ({
        ...prev,
        reflectionResult: result,
        finalDialogue: result.dialogueDrafts.standard,
        isAnalyzedWithAI: response.mode === 'gemini'
      }));
      const remainingDelay = Math.max(0, 2500 - (Date.now() - startedAt));
      await new Promise((resolve) => window.setTimeout(resolve, remainingDelay));
      if (!controller.signal.aborted) setCurrentScreen('screen-6-reflection');
    } catch (err) {
      if (controller.signal.aborted) return;
      console.error('Lỗi phân tích:', err);
      setIsAnalysisError(true);
    }
  };

  const sendChatMessage = async (text: string, modeOverride?: SupportMode) => {
    const activeMode = modeOverride || supportMode;
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      role: 'user',
      content: text
    };
    const nextMessages = [...chatMessages, userMessage];
    setChatMessages(nextMessages);
    setCurrentScreen('screen-chat-conversation');
    setIsChatTyping(true);
    chatController.current?.abort();
    const controller = new AbortController();
    chatController.current = controller;

    try {
      const result = await continueConversation(nextMessages, activeMode, browserApiKey, controller.signal);
      if (controller.signal.aborted) return;
      if (result.risk.level === 'urgent' || !result.response) {
        handleTriggerSafety(result.risk.reasons);
        return;
      }
      const response = result.response;
      const assistantContent = [response.acknowledgement, response.reflection, response.question].filter(Boolean).join(' ');
      setChatMessages((current) => [...current, {
        id: `assistant_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        role: 'assistant',
        content: assistantContent,
        response
      }]);
    } catch (error) {
      if (!controller.signal.aborted) console.error('Lỗi trò chuyện:', error);
    } finally {
      if (!controller.signal.aborted) setIsChatTyping(false);
    }
  };

  const summarizeConversation = () => {
    const transcript = chatMessages
      .filter((message) => message.role === 'user')
      .map((message) => message.content)
      .join('\n\n');
    if (!transcript) return;
    setSession((previous) => ({ ...previous, rawText: transcript }));
    setCurrentScreen('screen-5-analyzing');
    runAnalysis(transcript);
  };

  const getPreviousScreen = (): Screen | null => {
    switch (currentScreen) {
      case 'screen-chat-start': return 'screen-0-splash';
      case 'screen-chat-conversation': return 'screen-chat-start';
      case 'screen-1-intro': return 'screen-chat-start';
      case 'screen-2-checkin': return 'screen-1-intro';
      case 'screen-3-vent': return 'screen-2-checkin';
      case 'screen-4-confirm': return 'screen-3-vent';
      case 'screen-5-analyzing': return 'screen-3-vent';
      case 'screen-6-reflection': return chatMessages.length ? 'screen-chat-conversation' : 'screen-5-analyzing';
      case 'screen-7-composer': return 'screen-6-reflection';
      case 'screen-8-next-actions': return 'screen-7-composer';
      case 'screen-9-checkout': return 'screen-8-next-actions';
      case 'screen-10-finish': return 'screen-9-checkout';
      case 'screen-safety': return chatMessages.length ? 'screen-chat-conversation' : 'screen-chat-start';
      default: return null;
    }
  };

  return (
    <div className="relative isolate min-h-screen flex flex-col bg-[#FAF8F5]/90 text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <div className="ambient-scene" aria-hidden="true">
        <span className="ambient-orb ambient-orb-one" />
        <span className="ambient-orb ambient-orb-two" />
        <span className="ambient-orb ambient-orb-three" />
      </div>
      {/* Vùng hiển thị màn hình chính theo tiến trình */}
      <main key={currentScreen} className="relative z-10 flex-1 pb-16 screen-enter">
        {getPreviousScreen() && (
          <div className="max-w-3xl mx-auto px-4 pt-4">
            <button
              type="button"
              onClick={() => {
                const previous = getPreviousScreen();
                if (previous) setCurrentScreen(previous);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white/80 border border-stone-200 hover:border-blue-300 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại
            </button>
          </div>
        )}
        {currentScreen === 'screen-0-splash' && (
          <Screen0Splash onProceed={() => setCurrentScreen('screen-chat-start')} />
        )}

        {currentScreen === 'screen-chat-start' && (
          <ScreenChatStart
            onStart={(text, mode) => {
              setSupportMode(mode);
              sendChatMessage(text, mode);
            }}
            onWritePrivately={() => setCurrentScreen('screen-3-vent')}
          />
        )}

        {currentScreen === 'screen-chat-conversation' && (
          <ScreenChatConversation
            messages={chatMessages}
            supportMode={supportMode}
            isTyping={isChatTyping}
            onModeChange={setSupportMode}
            onSend={(text) => sendChatMessage(text)}
            onFinish={summarizeConversation}
            onOpenSafety={() => setCurrentScreen('screen-safety')}
          />
        )}

        {currentScreen === 'screen-1-intro' && (
          <Screen1Intro onStart={() => setCurrentScreen('screen-2-checkin')} />
        )}

        {currentScreen === 'screen-2-checkin' && (
          <Screen2Checkin
            initialLevel={session.initialEmotionLevel}
            initialSelectedEmotions={session.selectedEmotions}
            onSubmit={(level, emotions) => {
              setSession((prev) => ({
                ...prev,
                initialEmotionLevel: level,
                selectedEmotions: emotions
              }));
              setCurrentScreen('screen-3-vent');
            }}
            onOpenSafety={() => setCurrentScreen('screen-safety')}
          />
        )}

        {currentScreen === 'screen-3-vent' && (
          <Screen3Vent
            initialText={session.rawText}
            onProceedToConfirm={(text) => {
              setSession((prev) => ({ ...prev, rawText: text }));
              setCurrentScreen('screen-4-confirm');
            }}
            onSaveDraft={(text) => {
              setSession((prev) => ({ ...prev, rawText: text }));
              handleSaveDraft(text);
            }}
            onTriggerSafety={handleTriggerSafety}
            onClear={() => setSession((prev) => ({ ...prev, rawText: '' }))}
          />
        )}

        {currentScreen === 'screen-4-confirm' && (
          <Screen4Confirm
            geminiConfigured={Boolean(browserApiKey) || geminiConfigured}
            onConfirm={() => {
              setCurrentScreen('screen-5-analyzing');
              runAnalysis();
            }}
            onBackToEdit={() => setCurrentScreen('screen-3-vent')}
            onSaveOnly={() => {
              handleSaveDraft(session.rawText);
              setCurrentScreen('screen-10-finish');
            }}
          />
        )}

        {currentScreen === 'screen-5-analyzing' && (
          <Screen5Analyzing
            onComplete={() => setCurrentScreen('screen-6-reflection')}
            onCancel={() => {
              analysisController.current?.abort();
              setCurrentScreen('screen-3-vent');
            }}
            onErrorFallback={async () => {
              setIsAnalysisError(false);
              const fallbackResult = analyzeTextOffline(session.rawText, session.selectedEmotions);
              setSession((prev) => ({
                ...prev,
                reflectionResult: fallbackResult,
                finalDialogue: fallbackResult.dialogueDrafts.standard
              }));
              setCurrentScreen('screen-6-reflection');
            }}
            isError={isAnalysisError}
          />
        )}

        {currentScreen === 'screen-6-reflection' && session.reflectionResult && (
          <Screen6Reflection
            reflection={session.reflectionResult}
            onProceedToComposer={(chosenDialogue) => {
              setSession((prev) => ({ ...prev, finalDialogue: chosenDialogue }));
              setCurrentScreen('screen-7-composer');
            }}
            onUpdateReflection={(updated) => {
              setSession((prev) => ({ ...prev, reflectionResult: updated }));
            }}
          />
        )}

        {currentScreen === 'screen-7-composer' && (
          <Screen7Composer
            initialDialogue={session.finalDialogue}
            reflection={session.reflectionResult}
            onProceedToActions={(finalDialogue, mode) => {
              setSession((prev) => ({
                ...prev,
                finalDialogue: finalDialogue,
                dialogueMode: mode
              }));
              setCurrentScreen('screen-8-next-actions');
            }}
            onBackToReflection={() => setCurrentScreen('screen-6-reflection')}
          />
        )}

        {currentScreen === 'screen-8-next-actions' && (
          <Screen8NextActions
            dialogue={session.finalDialogue}
            dialogueMode={session.dialogueMode}
            selectedNeeds={session.reflectionResult?.underlyingNeeds.filter((need) => need.selected).map((need) => need.label) || []}
            onSelectAction={(actionKey) => {
              setSession((prev) => ({ ...prev, chosenNextAction: actionKey }));
              setCurrentScreen('screen-9-checkout');
            }}
            onOpenSafety={() => setCurrentScreen('screen-safety')}
          />
        )}

        {currentScreen === 'screen-9-checkout' && (
          <Screen9Checkout
            initialLevel={session.initialEmotionLevel}
            onSubmitCheckout={(finalLevel) => {
              setSession((prev) => ({ ...prev, finalEmotionLevel: finalLevel }));
              setCurrentScreen('screen-10-finish');
            }}
            onOpenSafety={() => setCurrentScreen('screen-safety')}
          />
        )}

        {currentScreen === 'screen-10-finish' && (
          <Screen10Finish
            session={session}
            onWipeAll={handleEmergencyExit}
            onSaveDialogueOnly={() => {
              handleSaveDraft(session.finalDialogue);
            }}
            onSaveDraftSession={() => {
              handleSaveDraft(session.rawText);
            }}
            onStartNewSession={handleEmergencyExit}
          />
        )}

        {currentScreen === 'screen-safety' && (
          <ScreenSafety
            reasons={safetyReasons}
            onBackToSafetyNotes={() => setCurrentScreen(chatMessages.length ? 'screen-chat-conversation' : 'screen-chat-start')}
          />
        )}
      </main>

      {/* Modals & Dialogs */}
      <DraftsModal
        isOpen={isDraftsOpen}
        drafts={drafts}
        onClose={() => setIsDraftsOpen(false)}
        onSelectDraft={handleSelectDraft}
        onDeleteDraft={handleDeleteDraft}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        geminiConfigured={geminiConfigured}
        browserApiKey={browserApiKey}
        reducedMotion={reducedMotion}
        onReducedMotionChange={setReducedMotion}
        onSaveBrowserApiKey={handleSaveBrowserApiKey}
        onClearAllData={handleClearAllData}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default App;
