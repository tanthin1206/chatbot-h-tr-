import React, { useState } from 'react';
import { ArrowRight, TrendingDown, Minus, TrendingUp, ShieldAlert } from 'lucide-react';

interface Screen9CheckoutProps {
  initialLevel: number;
  onSubmitCheckout: (finalLevel: number) => void;
  onOpenSafety: () => void;
}

export const Screen9Checkout: React.FC<Screen9CheckoutProps> = ({
  initialLevel,
  onSubmitCheckout,
  onOpenSafety
}) => {
  const [currentLevel, setCurrentLevel] = useState<number>(Math.max(1, initialLevel - 2));

  const delta = currentLevel - initialLevel;

  const getFeedback = () => {
    if (delta < 0) {
      return {
        type: 'decreased',
        icon: TrendingDown,
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        text: 'Có vẻ cảm xúc đã nhẹ hơn một chút. Một khoảng lặng nhỏ cũng đã tạo ra sự khác biệt.'
      };
    }
    if (delta === 0) {
      return {
        type: 'same',
        icon: Minus,
        color: 'text-blue-700 bg-blue-50 border-blue-200',
        text: 'Không sao nếu cảm xúc chưa thay đổi ngay. Việc gọi tên được điều mình cần và viết ra thành lời cũng đã là một bước tiến quan trọng.'
      };
    }
    return {
      type: 'increased',
      icon: TrendingUp,
      color: 'text-purple-700 bg-purple-50 border-purple-200',
      text: 'Việc nhắc lại câu chuyện có thể khiến cảm xúc mạnh hơn một chút. Điều này hoàn toàn bình thường. Bạn có muốn tạm dừng nghỉ ngơi hoặc trò chuyện với một người bạn tin tưởng không?'
    };
  };

  const feedback = getFeedback();
  const Icon = feedback.icon;

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-8">
      {/* Tiêu đề */}
      <div className="space-y-1">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          Bước 5: Nhìn lại sau phiên
        </span>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          Mức độ khó chịu của bạn hiện là bao nhiêu?
        </h2>
        <p className="text-sm text-slate-500">
          Hãy lắng nghe lại cơ thể và tâm trạng của mình sau khi đã giải tỏa và suy ngẫm.
        </p>
      </div>

      {/* Thẻ so sánh trước và sau */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Lúc mới vào:</span>
            <div className="text-lg font-bold text-slate-500">{initialLevel} / 10</div>
          </div>

          <div className="text-slate-300 text-lg">→</div>

          <div className="space-y-1 text-right">
            <span className="text-xs text-blue-600 font-semibold">Hiện tại:</span>
            <div className="text-3xl font-extrabold text-blue-600">{currentLevel} / 10</div>
          </div>
        </div>

        {/* Thanh trượt 1-10 */}
        <div className="space-y-2">
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={currentLevel}
            onChange={(e) => setCurrentLevel(parseInt(e.target.value, 10))}
            className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
            aria-label="Thang đo cảm xúc đầu ra từ 1 đến 10"
          />
          <div className="flex justify-between text-[11px] text-slate-400 px-0.5">
            <span>1 (Nhẹ nhàng)</span>
            <span>5 (Vừa phải)</span>
            <span>10 (Rất căng thẳng)</span>
          </div>
        </div>

        {/* Thông điệp phản hồi thấu cảm dựa trên biến chuyển cảm xúc */}
        <div className={`p-4 rounded-xl border flex items-start space-x-3 text-xs sm:text-sm leading-relaxed ${feedback.color}`}>
          <Icon className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">
              {delta < 0 ? 'Cảm xúc hạ nhiệt' : delta === 0 ? 'Cảm xúc giữ nguyên' : 'Cảm xúc gia tăng'}
            </p>
            <p>{feedback.text}</p>
          </div>
        </div>

        {/* Nút hỗ trợ nhanh nếu cảm xúc tăng lên 8-10 */}
        {currentLevel >= 8 && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center justify-between">
            <span>Nếu bạn cảm thấy quá tải hoặc kiệt sức:</span>
            <button
              onClick={onOpenSafety}
              className="font-bold underline text-rose-900 hover:text-rose-700"
            >
              Hỗ trợ an toàn
            </button>
          </div>
        )}
      </div>

      {/* Nút tiếp tục */}
      <div className="pt-2">
        <button
          onClick={() => onSubmitCheckout(currentLevel)}
          className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-medium text-sm shadow-sm transition-all flex items-center justify-center space-x-2"
        >
          <span>Hoàn tất phiên phản tư</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
