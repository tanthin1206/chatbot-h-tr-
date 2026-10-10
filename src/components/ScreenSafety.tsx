import React from 'react';
import { PhoneCall, ShieldAlert, HeartHandshake, AlertTriangle, ArrowLeft, ExternalLink, LifeBuoy } from 'lucide-react';

interface ScreenSafetyProps {
  reasons?: string[];
  onBackToSafetyNotes: () => void;
}

export const ScreenSafety: React.FC<ScreenSafetyProps> = ({
  reasons = [],
  onBackToSafetyNotes
}) => {
  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      {/* Khối cảnh báo khẩn cấp trang trọng */}
      <div className="p-6 sm:p-8 rounded-3xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-6 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
              An toàn là ưu tiên cao nhất
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-rose-950 tracking-tight">
              Bạn không phải đối mặt một mình
            </h2>
          </div>
        </div>

        <p className="text-sm sm:text-base text-rose-900 leading-relaxed font-normal">
          Điều bạn vừa chia sẻ cho thấy tình huống hiện tại có thể đang <strong className="font-bold underline decoration-rose-400">gây nguy hiểm hoặc vượt quá khả năng chịu đựng an toàn</strong> của bạn.
        </p>

        {/* Nút gọi khẩn cấp nổi bật: Tổng đài Quốc gia Bảo vệ Trẻ em 111 */}
        <div className="p-5 rounded-2xl bg-white border border-rose-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
              Hỗ trợ 24/7 • Hoàn toàn Miễn phí • Bảo mật
            </span>
            <LifeBuoy className="w-4 h-4 text-rose-500" />
          </div>

          <a
            href="tel:111"
            className="w-full py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white text-center font-bold text-lg shadow-md transition-all flex items-center justify-center space-x-3 group"
          >
            <PhoneCall className="w-6 h-6 animate-bounce" />
            <span>Gọi ngay Tổng đài 111</span>
          </a>

          <p className="text-xs text-slate-500 text-center leading-normal">
            Tổng đài Quốc gia Bảo vệ Trẻ em (Việt Nam) tiếp nhận thông tin và bảo vệ học sinh, thanh thiếu niên trong mọi hoàn cảnh bạo lực, bế tắc hoặc xâm hại.
          </p>
        </div>

        {/* Các số khẩn cấp bổ sung */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <a
            href="tel:113"
            className="p-3 rounded-xl bg-white/80 hover:bg-white border border-rose-200 text-rose-900 font-semibold flex items-center justify-center space-x-1.5 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
            <span>Công an: 113</span>
          </a>

          <a
            href="tel:115"
            className="p-3 rounded-xl bg-white/80 hover:bg-white border border-rose-200 text-rose-900 font-semibold flex items-center justify-center space-x-1.5 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
            <span>Cấp cứu Y tế: 115</span>
          </a>
        </div>
      </div>

      {/* Những điều bạn nên làm ngay lúc này */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-3 text-xs sm:text-sm text-slate-700">
        <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
          <HeartHandshake className="w-4 h-4 text-blue-600" />
          <span>Những hướng đi an toàn bạn có thể làm ngay:</span>
        </h3>

        <ul className="space-y-2.5 list-disc pl-5 leading-relaxed text-slate-600">
          <li>
            <strong className="text-slate-800">Không bắt buộc đối thoại:</strong> Tuyệt đối không cần cố gắng nói chuyện hay đối chất nếu đối phương đang có hành vi bạo lực, xúc phạm thân thể hoặc đe dọa bạn.
          </li>
          <li>
            <strong className="text-slate-800">Tìm một người lớn an toàn:</strong> Hãy liên lạc với thầy cô bạn tin tưởng, nhân viên y tế trường học, người họ hàng thấu hiểu hoặc bạn bè thân thiết.
          </li>
          <li>
            <strong className="text-slate-800">Rời khỏi nơi nguy hiểm:</strong> Nếu cảm thấy tính mạng hoặc thân thể bị đe dọa, hãy tìm cách đến nơi công cộng hoặc nhà người thân an toàn nếu bạn có thể di chuyển an toàn.
          </li>
        </ul>
      </div>

      {/* Nút quay lại nội dung cá nhân */}
      <div className="pt-2 text-center">
        <button
          onClick={onBackToSafetyNotes}
          className="text-xs text-slate-500 hover:text-slate-800 underline inline-flex items-center space-x-1 py-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại trang xem bài viết cá nhân của bạn</span>
        </button>
      </div>
    </div>
  );
};
