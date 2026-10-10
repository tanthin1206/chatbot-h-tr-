import React, { useState } from 'react';
import { RefreshCw, CheckCircle2 } from 'lucide-react';
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
