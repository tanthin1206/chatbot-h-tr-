import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

interface Screen0SplashProps {
  onProceed: () => void;
}

export const Screen0Splash: React.FC<Screen0SplashProps> = ({ onProceed }) => {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [showOfflineOption, setShowOfflineOption] = useState(false);

  const messages = [
    'Dừng lại một chút…',
    'Hít vào nhẹ nhàng…',
    'Thở ra từ từ…',
    'Bạn có thể bắt đầu khi sẵn sàng.'
  ];

  useEffect(() => {
    // Luân chuyển thông điệp nhịp thở mỗi 1.2 giây
    const interval = setInterval(() => {
      setPhaseIndex((prev) => {
        if (prev < messages.length - 1) return prev + 1;
        return prev;
      });
    }, 1200);

    // Tự động chuyển sau khoảng 4.5 giây
    const autoProceedTimer = setTimeout(() => {
      onProceed();
    }, 4500);

    // Hiển thị tùy chọn ngoại tuyến nếu chờ lâu
    const fallbackTimer = setTimeout(() => {
      setShowOfflineOption(true);
    }, 5500);

    return () => {
      clearInterval(interval);
      clearTimeout(autoProceedTimer);
      clearTimeout(fallbackTimer);
    };
  }, [onProceed]);

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-between px-6 py-10 max-w-lg mx-auto text-center">
      {/* Không gian đầu trang */}
      <div className="h-6" />

      {/* Trọng tâm: Vòng tròn hít thở & Thông điệp */}
      <div className="flex flex-col items-center space-y-8 my-auto w-full">
        {/* Mascot thở êm dịu */}
        <div className="relative flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56">
          <div className="absolute inset-0 rounded-full bg-blue-100/50 animate-breathe" />
          <div className="absolute inset-4 rounded-full bg-purple-100/60 animate-breathe" style={{ animationDelay: '0.4s' }} />
          <span className="sparkle left-2 top-12" />
          <span className="sparkle right-4 top-8" style={{ animationDelay: '-1.2s' }} />
          <span className="sparkle right-8 bottom-8" style={{ animationDelay: '-2.1s' }} />
          <img
            src="/illustrations/cloud-breathe.png"
            alt="Đám mây nhỏ đang thở chậm và bình tĩnh"
            className="relative z-10 w-44 sm:w-52 object-contain drop-shadow-sm mascot-float"
          />
        </div>

        {/* Thông điệp biến chuyển */}
        <div className="space-y-2 min-h-[64px] flex flex-col justify-center">
          <h2 key={phaseIndex} className="text-xl sm:text-2xl font-semibold text-slate-800 tracking-tight soft-pop">
            {messages[phaseIndex]}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Không gian riêng tư để gọi tên cảm xúc trước khi bạn nói hay hành động
          </p>
        </div>

        {/* Thanh tiến trình nhẹ nhàng không hiển thị phần trăm */}
        <div className="w-48 h-1.5 bg-stone-200/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${((phaseIndex + 1) / messages.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Chân trang: Cam kết không tên thật & Nút vào ngay */}
      <div className="w-full flex flex-col items-center space-y-4">
        <button
          onClick={onProceed}
          className="w-full sm:w-auto px-8 py-3 rounded-full bg-slate-800 text-white font-medium text-sm hover:bg-slate-700 active:scale-95 transition-all shadow-sm flex items-center justify-center space-x-2 gentle-glow"
        >
          <span>Vào ngay</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-1.5 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Bạn không cần cung cấp tên thật hay bất kỳ thông tin cá nhân nào.</span>
        </div>

        {/* Trạng thái dự phòng lỗi / mạng yếu */}
        {showOfflineOption && (
          <div className="pt-2 text-xs text-stone-500 flex items-center space-x-3">
            <span>Khoảng Thở hoạt động hoàn toàn ngoại tuyến.</span>
            <button
              onClick={onProceed}
              className="text-blue-600 underline hover:text-blue-800 flex items-center space-x-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Viết riêng tư ngay</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
