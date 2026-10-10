export type Screen =
  | 'screen-0-splash'
  | 'screen-chat-home'
  | 'screen-chat-start'
  | 'screen-chat-conversation'
  | 'screen-1-intro'
  | 'screen-2-checkin'
  | 'screen-3-vent'
  | 'screen-4-confirm'
  | 'screen-5-analyzing'
  | 'screen-6-reflection'
  | 'screen-7-composer'
  | 'screen-8-next-actions'
  | 'screen-9-checkout'
  | 'screen-10-finish'
  | 'screen-safety';

export interface EmotionTag {
  id: string;
  label: string;
  color?: string;
}

export interface ReviewWord {
  word: string;
  type: 'tuyệt_đối' | 'gán_nhãn' | 'cảm_tính' | 'khái_niệm_nặng';
  reason: string;
  alternativeSuggestion?: string;
  dismissed?: boolean;
}

export interface ReflectionResult {
  supportNotice?: string;
  whatWeHeard: string;
  userHeardFeedback?: 'accurate' | 'partial' | 'inaccurate';
  customEmotionNotes?: string;
  factsVsInterpretation: {
    facts: string;
    interpretation: string;
    guidance: string;
  };
  wordsToReview: ReviewWord[];
  clarificationQuestion: string;
  userClarificationAnswer?: string;
  alternativePerspectives: string[];
  underlyingNeeds: {
    id: string;
    label: string;
    selected: boolean;
  }[];
  dialogueDrafts: {
    standard: string;
    shorter: string;
    gentler: string;
    direct: string;
  };
}

export type RiskLevel = 'normal' | 'needs_support' | 'urgent';

export type SupportMode = 'listen' | 'understand' | 'advice';

export interface ChatAdvice {
  title: string;
  explanation: string;
  firstStep: string;
  caution?: string;
}

export interface ChatResponse {
  acknowledgement: string;
  reflection?: string;
  question?: string;
  quickReplies: string[];
  advice: ChatAdvice[];
  riskLevel: RiskLevel;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  response?: ChatResponse;
}

export interface ChatSession {
  id: string;
  createdAt: number;
  updatedAt: number;
  title: string;
  supportMode: SupportMode;
  messages: ChatMessage[];
}

export interface AnalysisResponse {
  result: ReflectionResult | null;
  mode: 'gemini' | 'offline';
  risk: {
    level: RiskLevel;
    reasons: string[];
  };
}

export interface SessionState {
  id: string;
  createdAt: number;
  initialEmotionLevel: number;
  selectedEmotions: string[];
  rawText: string;
  reflectionResult: ReflectionResult | null;
  finalDialogue: string;
  dialogueMode: 'sms' | 'direct' | 'letter' | 'third_party';
  chosenNextAction?: string;
  finalEmotionLevel?: number;
  isSavedAsDraft: boolean;
  isAnalyzedWithAI: boolean;
}

export interface SavedDraft {
  id: string;
  title: string;
  date: string;
  dialogue: string;
  initialEmotion: number;
  finalEmotion?: number;
  summary: string;
}
