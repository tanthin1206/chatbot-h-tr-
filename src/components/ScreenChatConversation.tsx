import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUp, CheckCircle2, Lightbulb, ShieldAlert } from 'lucide-react';
import { ChatMessage, SupportMode } from '../types';

interface ScreenChatConversationProps {
  messages: ChatMessage[];
  supportMode: SupportMode;
  isTyping: boolean;
  error: string | null;
  onSend: (text: string) => void;
  onOpenSafety: () => void;
}

const MODE_LABELS: Record<SupportMode, string> = {
  listen: 'Chỉ lắng nghe',
  understand: 'Giúp tớ hiểu',
  advice: 'Cho tớ lời khuyên'
};

export const ScreenChatConversation: React.FC<ScreenChatConversationProps> = ({
  messages,
  supportMode,
  isTyping,
  error,
  onSend,
  onOpenSafety
}) => {
  const [text, setText] = useState('');
  const chatPanelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const panel = chatPanelRef.current;
    if (!panel) return;
    // Chỉ cuộn phần lịch sử chat, không kéo cả trang theo tin nhắn mới.
    panel.scrollTo({
      top: panel.scrollHeight,
      behavior: isTyping ? 'auto' : 'smooth'
    });
  }, [messages, isTyping]);

  const send = (value = text) => {
    const clean = value.trim();
    if (!clean || isTyping) return;
    onSend(clean);
    setText('');
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 pt-4 pb-32 space-y-4">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="font-bold text-slate-900">Trò chuyện cùng Mây</h1>
          <p className="text-xs text-slate-500">Chế độ của Mây: <span className="font-semibold text-blue-700">{MODE_LABELS[supportMode]}</span></p>
        </div>
      </div>

      <div ref={chatPanelRef} className="min-h-[52vh] max-h-[62vh] overflow-y-auto overscroll-contain rounded-3xl border border-stone-200 bg-white/70 p-3 sm:p-5 space-y-4">
        <div className="flex gap-3 items-start">
          <img src="/illustrations/cloud-breathe.png" alt="Mây" className="w-10 h-10 object-contain shrink-0 mascot-listen" />
          <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-blue-50 border border-blue-100 p-3 text-sm text-slate-700 message-pop">
            Chào bạn, mình là Mây. Mình sẽ lắng nghe trước. Bạn không cần kể mọi thứ ngay một lần.
          </div>
        </div>

        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 items-start message-pop ${message.role === 'user' ? 'justify-end' : ''}`}>
            {message.role === 'assistant' && <img src="/illustrations/cloud-breathe.png" alt="Mây" className="w-10 h-10 object-contain shrink-0 mascot-listen" />}
            <div className={`max-w-[88%] sm:max-w-[78%] space-y-2 ${message.role === 'user' ? 'items-end' : ''}`}>
              <div className={`rounded-2xl p-3 sm:p-3.5 text-sm leading-relaxed ${message.role === 'user' ? 'rounded-tr-md bg-slate-800 text-white' : 'rounded-tl-md bg-blue-50 border border-blue-100 text-slate-700'}`}>
                {message.response ? (
                  <div className="space-y-2">
                    <p>{message.response.acknowledgement}</p>
                    {message.response.reflection && <p className="font-medium text-slate-800">{message.response.reflection}</p>}
                    {message.response.question && <p className="text-blue-800">{message.response.question}</p>}
                  </div>
                ) : message.content}
              </div>

              {message.response?.advice.map((advice) => (
                <div key={advice.title} className="rounded-2xl border border-purple-100 bg-purple-50/60 p-3 text-xs text-slate-700 space-y-1.5">
                  <strong className="text-sm text-purple-950 flex items-center gap-1.5"><Lightbulb className="w-4 h-4" /> {advice.title}</strong>
                  <p>{advice.explanation}</p>
                  <p className="font-medium text-blue-800 flex gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" /> Bước đầu: {advice.firstStep}</p>
                  {advice.caution && <p className="text-amber-800">Lưu ý: {advice.caution}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 items-center">
            <img src="/illustrations/cloud-breathe.png" alt="Mây đang suy nghĩ" className="w-10 h-10 object-contain mascot-think" />
            <div className="rounded-2xl rounded-tl-md bg-blue-50 border border-blue-100 px-4 py-3 flex gap-1">
              {[0, 1, 2].map((item) => <span key={item} className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${item * 120}ms` }} />)}
            </div>
          </div>
        )}

        {error && (
          <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error} Tin nhắn của bạn vẫn ở phía trên; bạn có thể gửi lại khi sẵn sàng.
          </div>
        )}
      </div>

      {createPortal(
        <div className="fixed bottom-3 left-1/2 z-[100] flex w-[calc(100%-1.5rem)] max-w-3xl -translate-x-1/2 items-end gap-2 rounded-2xl border border-stone-200 bg-[#FAF8F5]/95 p-2 shadow-xl shadow-slate-900/15 backdrop-blur-md" style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                send();
              }
            }}
            disabled={isTyping}
            maxLength={2000}
            rows={2}
            placeholder="Bạn muốn kể thêm điều gì?"
            className="flex-1 resize-none bg-transparent px-2 py-2 text-sm focus:outline-none disabled:opacity-60"
          />
          <button onClick={() => send()} disabled={!text.trim() || isTyping} aria-label="Gửi tin nhắn" className="w-10 h-10 rounded-xl bg-blue-600 disabled:bg-stone-200 text-white flex items-center justify-center shrink-0">
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>,
        document.body
      )}

      <div className="text-center">
        <button onClick={onOpenSafety} className="text-[11px] text-rose-600 hover:underline inline-flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5" /> Mình đang không an toàn</button>
      </div>
    </div>
  );
};
