import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Edit3, HeartHandshake } from 'lucide-react';

interface Screen5AnalyzingProps {
  onComplete: () => void;
  onCancel: () => void;
  onErrorFallback: () => void;
  isError?: boolean;
}

const PROGRESS_STAGES = [
  'Đang lắng nghe điều bạn chia sẻ…',
  'Đang nhận diện cảm xúc…',
  'Đang tách sự việc và cách diễn giải…',
  'Đang chuẩn bị một cách nói rõ ràng hơn…'
];

export const Screen5Analyzing: React.FC<Screen5AnalyzingProps> = ({
  onComplete,
  onCancel,
  onErrorFallback,
  isError = false
}) => {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (isError) return;

    const interval = setInterval(() => {
      setStageIndex((prev) => {
        if (prev < PROGRESS_STAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isError]);

  if (isError) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
          <HeartHandshake className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-800">
            Khoảng Thở chưa thể kết nối AI lúc này
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Những gì bạn đã viết vẫn được giữ an toàn trên thiết bị của bạn. Bạn có thể thử lại hoặc tiếp tục phản tư bằng bộ khung mẫu tự động.
          </p>
        </div>

        <div className="space-y-2.5 pt-2">
          <button
            onClick={onErrorFallback}
            className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Tiếp tục với phản tư ngoại tuyến</span>
          </button>

          <button
            onClick={onCancel}
            className="w-full py-3 px-5 rounded-xl border border-stone-200 text-slate-600 hover:bg-stone-50 font-medium text-xs sm:text-sm transition-all flex items-center justify-center space-x-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>Quay lại bài viết của bạn</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-between px-4 py-12 max-w-lg mx-auto text-center">
      <div className="h-4" />

      {/* Hiệu ứng thở nhẹ nhàng trong khi chờ đợi */}
      <div className="flex flex-col items-center space-y-8 my-auto w-full">
        <div className="relative flex items-center justify-center w-40 h-40 sm:w-48 sm:h-48">
          <div className="absolute inset-0 rounded-full bg-blue-100/60 animate-breathe" />
          <div
            className="absolute inset-3 rounded-full bg-purple-100/70 animate-breathe"
            style={{ animationDelay: '0.5s' }}
          />
          <img
            src="/illustrations/cloud-breathe.png"
            alt="Đám mây nhỏ đang thở trong lúc chờ"
            className="relative z-10 w-36 sm:w-44 object-contain drop-shadow-sm"
          />
        </div>

        {/* Thông điệp theo từng giai đoạn tiến trình */}
        <div className="space-y-2 min-h-[56px]">
          <p className="text-base sm:text-lg font-semibold text-slate-800 transition-all duration-300">
            {PROGRESS_STAGES[stageIndex]}
          </p>
          <p className="text-xs text-slate-400">
            Hít thở đều một nhịp, kết quả sẽ sẵn sàng ngay…
          </p>
        </div>

        {/* Lời nhắc trao quyền cho người dùng */}
        <div className="p-3.5 rounded-xl bg-stone-100/80 border border-stone-200/50 max-w-sm text-xs text-slate-500">
          “Bạn vẫn là người toàn quyền quyết định điều gì phù hợp với bản thân mình.”
        </div>
      </div>

      {/* Nút hủy nếu muốn quay lại */}
      <div className="pt-4">
        <button
          onClick={onCancel}
          className="text-xs text-slate-400 hover:text-slate-600 inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg hover:bg-stone-200/40 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          <span>Hủy và quay lại</span>
        </button>
      </div>
    </div>
  );
};
