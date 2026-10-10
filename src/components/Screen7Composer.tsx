import React, { useState } from 'react';
import { Copy, ArrowRight, MessageCircle, Mic, Mail, Users, Check, Sparkles, Edit3 } from 'lucide-react';
import { ReflectionResult } from '../types';

interface Screen7ComposerProps {
  initialDialogue: string;
  reflection: ReflectionResult | null;
  onProceedToActions: (finalDialogue: string, mode: 'sms' | 'direct' | 'letter' | 'third_party') => void;
  onBackToReflection: () => void;
}

export const Screen7Composer: React.FC<Screen7ComposerProps> = ({
  initialDialogue,
  reflection,
  onProceedToActions,
  onBackToReflection
}) => {
  const [dialogue, setDialogue] = useState<string>(initialDialogue);
  const [mode, setMode] = useState<'sms' | 'direct' | 'letter' | 'third_party'>('sms');
  const [copied, setCopied] = useState(false);
  const selectedNeeds = reflection?.underlyingNeeds.filter((need) => need.selected).map((need) => need.label) || [];

  // Template hỗ trợ theo mô hình NVC
  const nvcGuide = [
    { label: 'Khi...', hint: 'sự việc cụ thể xảy ra' },
    { label: 'Con cảm thấy...', hint: 'cảm xúc chân thật của con' },
    { label: 'Vì con cần...', hint: 'nhu cầu được lắng nghe / tôn trọng' },
    { label: 'Con mong...', hint: 'đề xuất cụ thể tiếp theo' }
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(dialogue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getModeDescription = () => {
    switch (mode) {
      case 'sms':
        return 'Phù hợp khi bạn thấy khó nói thành lời trực tiếp, muốn nhắn tin ngắn qua tin nhắn.';
      case 'direct':
        return 'Chuẩn bị để nói mặt đối mặt vào lúc cả hai bên đều đang có thời gian và bình tĩnh.';
      case 'letter':
        return 'Viết một bức thư tay hoặc mẩu giấy để lại trên bàn học / tủ sách.';
      case 'third_party':
        return 'Nhờ một người lớn đáng tin cậy (cô giáo, bác, người thân) ngồi cùng làm cầu nối.';
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* Tiêu đề */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 p-5 pr-24 space-y-1">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          Nhìn lại → Hành động
        </span>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          Chọn cách bạn muốn biến điều này thành hành động
        </h2>
        <p className="text-sm text-slate-500">
          Mây đã mang theo điều bạn cần từ bước trước. Bây giờ hãy chọn cách nói khiến bạn thấy an toàn nhất.
        </p>
        <img src="/illustrations/cloud-journal.png" alt="Mây nhỏ đang viết cùng bạn" className="absolute -right-2 -bottom-5 w-28 object-contain mascot-float" />
      </div>

      {reflection && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
            <Check className="w-4 h-4" /> Điều đang được mang sang bước này
          </div>
          <p className="text-sm text-slate-700 line-clamp-2">{reflection.whatWeHeard}</p>
          {selectedNeeds.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selectedNeeds.map((need) => <span key={need} className="px-2.5 py-1 rounded-full bg-white border border-blue-100 text-xs font-medium text-blue-800">Bạn cần: {need}</span>)}
            </div>
          )}
        </div>
      )}

      {/* Lựa chọn hình thức đối thoại */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
          Bạn dự định chia sẻ theo cách nào?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => setMode('sms')}
            className={`interactive-card p-3 rounded-xl border text-xs font-medium flex flex-col items-center space-y-1.5 transition-all ${
              mode === 'sms'
                ? 'choice-pop bg-blue-50 border-blue-400 text-blue-800 shadow-xs'
                : 'bg-white border-stone-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <MessageCircle className="w-4 h-4 text-blue-600" />
            <span>Tin nhắn ngắn</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('direct')}
            className={`interactive-card p-3 rounded-xl border text-xs font-medium flex flex-col items-center space-y-1.5 transition-all ${
              mode === 'direct'
                ? 'choice-pop bg-blue-50 border-blue-400 text-blue-800 shadow-xs'
                : 'bg-white border-stone-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <Mic className="w-4 h-4 text-purple-600" />
            <span>Nói trực tiếp</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('letter')}
            className={`interactive-card p-3 rounded-xl border text-xs font-medium flex flex-col items-center space-y-1.5 transition-all ${
              mode === 'letter'
                ? 'choice-pop bg-blue-50 border-blue-400 text-blue-800 shadow-xs'
                : 'bg-white border-stone-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <Mail className="w-4 h-4 text-emerald-600" />
            <span>Viết thư tay</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('third_party')}
            className={`interactive-card p-3 rounded-xl border text-xs font-medium flex flex-col items-center space-y-1.5 transition-all ${
              mode === 'third_party'
                ? 'choice-pop bg-blue-50 border-blue-400 text-blue-800 shadow-xs'
                : 'bg-white border-stone-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <Users className="w-4 h-4 text-amber-600" />
            <span>Nhờ người hỗ trợ</span>
          </button>
        </div>

        <p className="text-xs text-slate-500 italic pt-0.5">
          {getModeDescription()}
        </p>
      </div>

      {/* Khung gợi ý cấu trúc NVC */}
      <div className="p-3.5 rounded-xl bg-stone-100/70 border border-stone-200/60 text-xs text-slate-600 flex flex-wrap gap-2 items-center">
        <span className="font-semibold text-slate-700">Khung hỗ trợ:</span>
        {nvcGuide.map((item, idx) => (
          <span key={idx} className="bg-white px-2 py-1 rounded-md border border-stone-200 font-mono text-[11px] text-slate-700">
            {item.label}
          </span>
        ))}
      </div>

      {/* Ô soạn thảo trực tiếp */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs space-y-2 p-4 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-stone-100">
          <span className="flex items-center space-x-1 text-blue-600 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bản thảo có thể tùy ý sửa đổi</span>
          </span>
          <span>{dialogue.length} ký tự</span>
        </div>

        <textarea
          value={dialogue}
          onChange={(e) => setDialogue(e.target.value)}
          rows={6}
          className="w-full text-sm sm:text-base text-slate-800 bg-transparent resize-none focus:outline-none placeholder:text-slate-400 leading-relaxed font-normal"
          placeholder="Nhập hoặc sửa câu nói của bạn tại đây..."
        />
      </div>

      {/* Cam kết minh bạch */}
      <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100/60 text-xs text-slate-500 space-y-1">
        <p className="font-semibold text-blue-900">Quy tắc an toàn:</p>
        <p>• Ứng dụng không tự động gửi tin nhắn cho bất kỳ ai.</p>
        <p>• Bạn chỉ sao chép hoặc nói khi bạn cảm thấy thực sự an toàn và sẵn sàng.</p>
      </div>

      {/* Hành động chính */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className={`interactive-card flex-1 py-3.5 px-4 rounded-xl border border-stone-200 text-slate-700 hover:bg-stone-50 font-medium text-sm transition-colors flex items-center justify-center space-x-2 ${copied ? 'choice-pop bg-emerald-50 border-emerald-200' : ''}`}
          >
            <Copy className="w-4 h-4 text-slate-500" />
            <span>{copied ? 'Đã sao chép vào bộ nhớ máy!' : 'Sao chép câu này'}</span>
          </button>

          <button
            type="button"
            disabled={!dialogue.trim()}
            onClick={() => onProceedToActions(dialogue, mode)}
            className="flex-1 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>Chọn bước mình sẽ làm</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={onBackToReflection}
            className="text-xs text-slate-400 hover:text-slate-700 underline"
          >
            Quay lại chỉnh phần Nhìn lại
          </button>
        </div>
      </div>
    </div>
  );
};
