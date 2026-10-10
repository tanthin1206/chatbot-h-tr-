import React, { useState } from 'react';
import { ArrowRight, LockKeyhole, MessageCircleHeart, PenLine, ShieldCheck } from 'lucide-react';
import { SupportMode } from '../types';

interface ScreenChatStartProps {
  onStart: (text: string, mode: SupportMode) => void;
  onWritePrivately: () => void;
}

export const ScreenChatStart: React.FC<ScreenChatStartProps> = ({ onStart, onWritePrivately }) => {
  const [text, setText] = useState('');
  const [showPrivacy, setShowPrivacy] = useState(false);

  const start = (value = text) => {
    const clean = value.trim();
    if (clean) onStart(clean, 'understand');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-14">
      <div className="grid md:grid-cols-[1fr_240px] gap-6 items-center">
        <div className="space-y-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700">
              <MessageCircleHeart className="w-3.5 h-3.5" /> Trò chuyện cùng Mây
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Hôm nay trong lòng bạn có chuyện gì?</h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl">Kể theo cách của bạn. Mây sẽ lắng nghe trước, không vội phân tích hay đưa lời khuyên.</p>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-3 focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50 transition-all gentle-glow">
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  start();
                }
              }}
              maxLength={2000}
              rows={4}
              autoFocus
              placeholder="Bạn có thể bắt đầu bằng bất kỳ điều gì…"
              className="w-full resize-none bg-transparent p-3 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            <div className="flex items-center justify-between gap-3 border-t border-stone-100 pt-3 px-1">
              <span className="text-[11px] text-slate-400">Enter để gửi · Shift + Enter để xuống dòng</span>
              <button
                onClick={() => start()}
                disabled={!text.trim()}
                className="px-4 py-2.5 rounded-xl bg-blue-600 disabled:bg-stone-200 disabled:text-stone-400 text-white text-sm font-semibold inline-flex items-center gap-2"
              >
                Kể với Mây <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <button onClick={() => setShowPrivacy(!showPrivacy)} className="inline-flex items-center gap-1.5 hover:text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Riêng tư · Không cần tên thật
            </button>
            <span className="text-stone-300">•</span>
            <button onClick={onWritePrivately} className="inline-flex items-center gap-1.5 hover:text-blue-700">
              <PenLine className="w-4 h-4" /> Chỉ muốn viết, không trò chuyện
            </button>
          </div>

          {showPrivacy && (
            <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 text-xs text-slate-600 leading-relaxed flex gap-2">
              <LockKeyhole className="w-4 h-4 shrink-0 text-blue-600" />
              <span>Bản nháp chỉ lưu trên thiết bị khi bạn chủ động chọn lưu. Nếu dùng Gemini, nội dung đã che thông tin liên lạc sẽ được gửi tới Google để tạo phản hồi.</span>
            </div>
          )}
        </div>

        <div className="relative hidden md:block">
          <span className="sparkle left-5 top-10" />
          <span className="sparkle right-7 top-3" style={{ animationDelay: '-1.6s' }} />
          <img src="/illustrations/cloud-journal.png" alt="Mây đang mở sổ và sẵn sàng lắng nghe" className={`w-full object-contain drop-shadow-sm ${text ? 'mascot-listen' : 'mascot-float'}`} />
        </div>
      </div>
    </div>
  );
};
