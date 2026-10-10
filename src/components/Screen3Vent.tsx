import React, { useState } from 'react';
import { Sparkles, Maximize2, Minimize2, Trash2, Bookmark, Shield, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { checkSafety } from '../services/safety';

interface Screen3VentProps {
  initialText: string;
  onProceedToConfirm: (text: string) => void;
  onSaveDraft: (text: string) => void;
  onTriggerSafety: (reasons: string[]) => void;
  onClear: () => void;
}

const INSPIRATION_PROMPTS = [
  'Điều gì vừa xảy ra khiến bạn thấy tức giận hoặc hụt hẫng nhất?',
  'Ai đã nói hoặc làm hành động cụ thể gì?',
  'Bạn đã ước gì họ phản ứng hoặc làm khác đi như thế nào?',
  'Điều bạn thực sự cần lúc này là gì?'
];

export const Screen3Vent: React.FC<Screen3VentProps> = ({
  initialText,
  onProceedToConfirm,
  onSaveDraft,
  onTriggerSafety,
  onClear
}) => {
  const [text, setText] = useState<string>(initialText || '');
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [showPrompts, setShowPrompts] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const handleProceed = () => {
    if (!text.trim()) return;

    // Kiểm tra an toàn trước khi vào phân tích
    const safety = checkSafety(text);
    if (safety.isEmergency) {
      onTriggerSafety(safety.reasons);
      return;
    }

    onProceedToConfirm(text);
  };

  const handleInsertPrompt = (promptText: string) => {
    setText((prev) => {
      if (!prev.trim()) return `[${promptText}]\n`;
      return `${prev}\n\n[${promptText}]\n`;
    });
  };

  const charCount = text.length;

  return (
    <div className={`mx-auto px-4 py-6 transition-all ${isFullScreen ? 'fixed inset-0 z-50 bg-[#FAF8F5] p-6 overflow-y-auto max-w-4xl' : 'max-w-xl'}`}>
      <div className="space-y-6">
        {/* Header của màn hình */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Bước 2: Không gian xả khí
            </span>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              Chuyện gì đang xảy ra?
            </h2>
            <p className="text-sm text-slate-500">
              Bạn cứ viết đúng điều đang nghĩ. Chưa cần lịch sự, đúng chính tả hoặc hoàn chỉnh.
            </p>
          </div>

          <img
            src="/illustrations/cloud-journal.png"
            alt="Đám mây nhỏ đang viết vào sổ"
            className="hidden sm:block w-24 h-24 object-contain -mt-3"
          />

          {/* Nút phóng to toàn màn hình để tập trung */}
          <button
            type="button"
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-stone-200/60 transition-colors"
            title={isFullScreen ? 'Thu nhỏ lại' : 'Tập trung toàn màn hình'}
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Cảnh báo bảo mật thông tin nhạy cảm */}
        <div className="flex items-center space-x-2 text-xs text-slate-500 bg-stone-100/80 px-3.5 py-2 rounded-xl border border-stone-200/60">
          <Shield className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>
            Nhắc nhở riêng tư: Tránh nhập tên thật, địa chỉ nhà hoặc số điện thoại của bạn.
          </span>
        </div>

        {/* Khung soạn thảo văn bản tự do */}
        <div className="relative bg-white rounded-2xl border border-stone-200/90 shadow-xs focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Cứ trút ra tất cả những bực bội, tủi thân hay ấm ức của bạn ở đây..."
            rows={isFullScreen ? 14 : 9}
            maxLength={5000}
            className="w-full p-4 sm:p-5 text-sm sm:text-base text-slate-800 bg-transparent resize-none focus:outline-none placeholder:text-slate-400 leading-relaxed"
          />

          {/* Thanh công cụ chân ô soạn thảo */}
          <div className="flex items-center justify-between border-t border-stone-100 px-4 py-2.5 text-xs text-slate-400 bg-stone-50/50 rounded-b-2xl">
            <div className="flex items-center space-x-2">
              <span>{charCount} / 5000 ký tự</span>
              {charCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Bạn có chắc muốn xóa toàn bộ nội dung vừa viết không?')) {
                      setText('');
                      onClear();
                    }
                  }}
                  className="text-slate-400 hover:text-rose-500 transition-colors inline-flex items-center space-x-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Xóa hết</span>
                </button>
              )}
            </div>

            {/* Gợi ý khi chưa biết viết gì */}
            <button
              type="button"
              onClick={() => setShowPrompts(!showPrompts)}
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center space-x-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Gợi ý câu hỏi</span>
              {showPrompts ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Gợi ý mở rộng khi bí từ */}
        {showPrompts && (
          <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100 space-y-2 text-xs">
            <p className="font-semibold text-blue-900">Bấm vào câu hỏi để chèn vào bài viết:</p>
            <div className="space-y-1.5">
              {INSPIRATION_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleInsertPrompt(prompt)}
                  className="block w-full text-left p-2 rounded-lg bg-white/80 hover:bg-white text-slate-700 hover:text-blue-800 transition-colors border border-blue-100/50"
                >
                  + {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Nút hành động */}
        <div className="space-y-3 pt-1">
          <button
            type="button"
            disabled={!text.trim()}
            onClick={handleProceed}
            className={`w-full py-3.5 px-6 rounded-xl font-medium text-sm shadow-sm transition-all flex items-center justify-center space-x-2 ${
              text.trim()
                ? 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Giúp mình nhìn lại</span>
          </button>

          <div className="flex items-center justify-between gap-3 text-xs">
            <button
              type="button"
              onClick={() => {
                if (text.trim()) {
                  onSaveDraft(text);
                  setCopyFeedback('Đã lưu bản nháp an toàn vào máy');
                  setTimeout(() => setCopyFeedback(null), 3000);
                }
              }}
              disabled={!text.trim()}
              className="text-slate-500 hover:text-slate-800 inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-stone-200/50 transition-colors disabled:opacity-40"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Lưu bản nháp trên máy</span>
            </button>

            {copyFeedback && (
              <span className="text-emerald-700 font-medium animate-fade-in">
                ✓ {copyFeedback}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
