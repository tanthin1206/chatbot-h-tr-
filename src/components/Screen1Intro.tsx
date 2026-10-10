import React, { useState } from 'react';
import { ShieldCheck, UserX, EyeOff, Trash2, AlertCircle, ArrowRight, Info } from 'lucide-react';

interface Screen1IntroProps {
  onStart: () => void;
}

export const Screen1Intro: React.FC<Screen1IntroProps> = ({ onStart }) => {
  const [showDataDetails, setShowDataDetails] = useState(false);

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Tiêu đề & Thông điệp mở đầu */}
      <div className="space-y-4 text-center sm:text-left">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          Không gian an toàn cho bạn
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight leading-snug">
          Ghi nhận điều bạn đang cảm thấy. Cùng nhìn lại trước khi nói hoặc hành động.
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Viết điều đang khiến bạn khó chịu. Khoảng Thở giúp gọi tên cảm xúc, tách sự việc khỏi suy đoán và chuẩn bị một câu dễ nói hơn — <strong className="text-slate-700 font-semibold">không phán xét ai đúng, ai sai</strong>.
        </p>
      </div>

      {/* Ba cam kết bảo mật & tôn trọng */}
      <div className="space-y-3 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          3 Cam kết từ Khoảng Thở
        </h3>

        <div className="space-y-3.5 pt-1">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 shrink-0 mt-0.5">
              <UserX className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800">Không cần tên thật</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Bạn không cần đăng ký tài khoản hay để lại bất kỳ danh tính nào.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0 mt-0.5">
              <EyeOff className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800">Không gửi cho bất kỳ ai</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Nội dung của bạn không bao giờ được chuyển tiếp cho cha mẹ, thầy cô hay bạn bè.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800">Quyền xóa thuộc về bạn</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Bản nháp chỉ lưu trên thiết bị và bạn có thể xóa bất cứ lúc nào.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Thông báo phạm vi ứng dụng */}
      <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start space-x-3 text-xs sm:text-sm text-amber-900 leading-relaxed">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Lưu ý quan trọng:</span> Khoảng Thở là công cụ hỗ trợ suy ngẫm, không thay thế tư vấn chuyên môn từ bác sĩ tâm lý hoặc các dịch vụ can thiệp khẩn cấp.
        </div>
      </div>

      {/* Hành động chính */}
      <div className="space-y-4 pt-2">
        <button
          onClick={onStart}
          className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-medium text-base shadow-sm transition-all flex items-center justify-center space-x-2"
        >
          <span>Bắt đầu phiên phản tư</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center">
          <button
            onClick={() => setShowDataDetails(!showDataDetails)}
            className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center space-x-1 underline decoration-dotted underline-offset-4"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Tìm hiểu dữ liệu được xử lý thế nào</span>
          </button>
        </div>

        {/* Modal/Accordion giải thích chi tiết dữ liệu */}
        {showDataDetails && (
          <div className="p-4 rounded-xl bg-stone-100 text-xs text-slate-600 space-y-2 border border-stone-200">
            <p className="font-semibold text-slate-700">Dữ liệu được lưu trữ ra sao?</p>
            <p>
              Bản nháp nằm trên thiết bị. Khi dùng Gemini, nội dung đã che thông tin liên lạc được gửi tới Google để phân tích theo chính sách của dịch vụ; máy chủ Khoảng Thở không lưu bài viết.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
