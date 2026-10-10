import React, { useState } from 'react';
import { Trash2, BookmarkCheck, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { SessionState } from '../types';

interface Screen10FinishProps {
  session: SessionState;
  onWipeAll: () => void;
  onSaveDialogueOnly: () => void;
  onSaveDraftSession: () => void;
  onStartNewSession: () => void;
}

export const Screen10Finish: React.FC<Screen10FinishProps> = ({
  session,
  onWipeAll,
  onSaveDialogueOnly,
  onSaveDraftSession,
  onStartNewSession
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleWipe = () => {
    onWipeAll();
    setToastMessage('Nội dung của phiên đã được xóa vĩnh viễn trên thiết bị.');
  };

  const handleSaveOnlyDialogue = () => {
    onSaveDialogueOnly();
    setToastMessage('Đã lưu câu đối thoại vào danh sách nháp. Bài tâm sự thô đã được xóa.');
  };

  const handleSaveFullDraft = () => {
    onSaveDraftSession();
    setToastMessage('Đã lưu bản nháp phiên làm việc này.');
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-8">
      {/* Toast thông báo xác nhận nếu có */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Thông điệp cảm ơn và công nhận nỗ lực */}
      <div className="text-center space-y-3">
        <div className="relative w-36 h-32 mx-auto">
          <span className="sparkle left-1 top-8" />
          <span className="sparkle right-1 top-4" style={{ animationDelay: '-1.4s' }} />
          <img src="/illustrations/cloud-untangle.png" alt="Đám mây nhỏ đã gỡ được nút thắt" className="w-32 h-28 object-contain mx-auto mascot-float" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          Bạn đã hoàn thành phiên nhìn lại
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Cảm ơn bạn đã kiên nhẫn dừng lại cùng bản thân. Bạn muốn làm gì với nội dung của phiên này?
        </p>
      </div>

      {/* Tóm tắt câu đối thoại đã chuẩn bị */}
      {session.finalDialogue && (
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Câu bạn đã chuẩn bị:
          </span>
          <p className="text-sm text-slate-800 font-medium italic leading-relaxed">
            “{session.finalDialogue}”
          </p>
        </div>
      )}

      {/* Các lựa chọn kết thúc */}
      <div className="space-y-3">
        {/* Nút Xóa toàn bộ ngay */}
        <button
          onClick={handleWipe}
          className="interactive-card w-full p-4 rounded-2xl border border-rose-200 bg-rose-50/60 hover:bg-rose-50 text-left flex items-start space-x-3.5 transition-colors group"
        >
          <div className="p-2 rounded-xl bg-rose-100 text-rose-700 shrink-0 mt-0.5 group-hover:bg-rose-200 transition-colors">
            <Trash2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-rose-900">Xóa toàn bộ ngay</h4>
            <p className="text-xs text-rose-700/80 mt-0.5">
              Xóa sạch bài viết và kết quả phân tích khỏi bộ nhớ trình duyệt để đảm bảo an toàn tuyệt đối.
            </p>
          </div>
        </button>

        {/* Nút chỉ lưu câu muốn nói */}
        <button
          onClick={handleSaveOnlyDialogue}
          className="interactive-card w-full p-4 rounded-2xl border border-stone-200 bg-white hover:border-blue-300 text-left flex items-start space-x-3.5 transition-colors group"
        >
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0 mt-0.5 group-hover:bg-blue-100 transition-colors">
            <BookmarkCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800">Chỉ lưu câu muốn nói trên thiết bị</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Lưu giữ câu giao tiếp đã chuẩn bị để khi cần có thể mở xem lại, xóa bài viết xả giận ban đầu.
            </p>
          </div>
        </button>

        {/* Nút lưu bản nháp đầy đủ */}
        <button
          onClick={handleSaveFullDraft}
          className="interactive-card w-full p-4 rounded-2xl border border-stone-200 bg-white hover:border-purple-300 text-left flex items-start space-x-3.5 transition-colors group"
        >
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 shrink-0 mt-0.5 group-hover:bg-purple-100 transition-colors">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800">Lưu bản nháp đầy đủ trên thiết bị</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Lưu toàn bộ phiên làm việc trên máy bạn để theo dõi hành trình cảm xúc theo thời gian.
            </p>
          </div>
        </button>
      </div>

      {/* Bắt đầu phiên mới */}
      <div className="pt-2 text-center">
        <button
          onClick={onStartNewSession}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-medium shadow-sm transition-all inline-flex items-center justify-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Bắt đầu một phiên mới</span>
        </button>
      </div>
    </div>
  );
};
