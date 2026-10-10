import React from 'react';
import { Sparkles, ArrowLeft, Bookmark, CheckCircle2, ShieldCheck } from 'lucide-react';

interface Screen4ConfirmProps {
  geminiConfigured: boolean | null;
  onConfirm: () => void;
  onBackToEdit: () => void;
  onSaveOnly: () => void;
}

export const Screen4Confirm: React.FC<Screen4ConfirmProps> = ({
  geminiConfigured,
  onConfirm,
  onBackToEdit,
  onSaveOnly
}) => {
  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-sm space-y-6">
        {/* Tiêu đề & Biểu tượng */}
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">
              Sẵn sàng cùng nhìn lại?
            </h3>
            <p className="text-xs text-slate-500">
              Bước đệm ngắn để bạn nắm rõ những gì sắp diễn ra
            </p>
          </div>
        </div>

        {/* Nội dung minh bạch */}
        <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/70 text-sm text-slate-700 leading-relaxed">
          Khoảng Thở sẽ phân tích nội dung bạn vừa viết để giúp bạn nhận diện cảm xúc cốt lõi, phát hiện những cách diễn đạt tuyệt đối và gợi ý các góc nhìn khác.
        </div>

        {/* 3 điều cam đoan */}
        <div className="space-y-3 pt-1 text-xs sm:text-sm text-slate-600">
          <div className="flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Không chẩn đoán:</strong> Không dán nhãn bệnh lý tâm thần cho bạn hay gia đình bạn.
            </span>
          </div>

          <div className="flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Chỉ là gợi ý:</strong> Mọi kết quả chỉ là góc nhìn tham khảo, bạn có quyền chấp nhận hoặc bỏ qua.
            </span>
          </div>

          <div className="flex items-start space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              <strong>Minh bạch dữ liệu:</strong>{' '}
              {geminiConfigured
                ? 'Nội dung đã được che thông tin liên lạc sẽ được gửi tới Gemini để xử lý và chịu chính sách dữ liệu của Google. Máy chủ Khoảng Thở không lưu bài viết này.'
                : 'Phiên này đang dùng bộ phản tư ngoại tuyến; nội dung không được gửi tới Gemini.'}
            </span>
          </div>
        </div>

        {/* Các nút lựa chọn */}
        <div className="space-y-3 pt-4 border-t border-stone-100">
          <button
            onClick={onConfirm}
            className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-medium text-sm shadow-sm transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Tiếp tục phân tích</span>
          </button>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={onBackToEdit}
              className="flex-1 py-3 px-4 rounded-xl border border-stone-200 text-slate-600 hover:text-slate-800 hover:bg-stone-50 text-xs sm:text-sm font-medium transition-colors flex items-center justify-center space-x-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại chỉnh sửa</span>
            </button>

            <button
              onClick={onSaveOnly}
              className="flex-1 py-3 px-4 rounded-xl border border-stone-200 text-slate-600 hover:text-slate-800 hover:bg-stone-50 text-xs sm:text-sm font-medium transition-colors flex items-center justify-center space-x-1.5"
            >
              <Bookmark className="w-4 h-4" />
              <span>Chỉ lưu trên thiết bị</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
