import React from 'react';
import { Wind, ShieldAlert, BookOpen, Settings, Trash2 } from 'lucide-react';
import { Screen } from '../types';

interface HeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onEmergencyExit: () => void;
  onOpenDrafts: () => void;
  onOpenSettings: () => void;
  onOpenSafety: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onEmergencyExit,
  onOpenDrafts,
  onOpenSettings,
  onOpenSafety
}) => {
  // Bản đồ tiến trình tinh tế theo spec: Cảm xúc → Chia sẻ → Nhìn lại → Hành động
  const getStepStatus = () => {
    switch (currentScreen) {
      case 'screen-2-checkin':
        return 1;
      case 'screen-chat-start':
      case 'screen-chat-conversation':
        return 2;
      case 'screen-3-vent':
      case 'screen-4-confirm':
      case 'screen-5-analyzing':
        return 2;
      case 'screen-6-reflection':
      case 'screen-7-composer':
        return 3;
      case 'screen-8-next-actions':
      case 'screen-9-checkout':
      case 'screen-10-finish':
        return 4;
      default:
        return 0;
    }
  };

  const step = getStepStatus();
  const showProgress = step > 0 && currentScreen !== 'screen-safety';

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/60 px-4 py-3">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        {/* Logo Khoảng Thở */}
        <button
          onClick={() => onNavigate('screen-chat-start')}
          className="flex items-center space-x-2 text-left group focus:outline-none"
          title="Về màn hình chính"
        >
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors">
            <Wind className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="font-semibold text-slate-800 text-base tracking-tight block leading-tight">
              Khoảng Thở
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:block">
              Nơi bạn có thể kể chuyện
            </span>
          </div>
        </button>

        {/* Thanh tiến trình tối giản (không gây áp lực như bài thi) */}
        {showProgress && (
          <div className="hidden md:flex items-center space-x-2 text-xs font-medium text-slate-500">
            <span className={`px-2 py-0.5 rounded-full transition-all ${step === 2 ? 'choice-pop bg-blue-100 text-blue-700 font-semibold' : ''}`}>Trò chuyện</span>
            <span className={`text-sm ${step === 3 ? 'progress-cloud' : 'text-slate-300'}`}>{step === 3 ? '☁️' : '→'}</span>
            <span className={`px-2 py-0.5 rounded-full transition-all ${step === 3 ? 'choice-pop bg-purple-100 text-purple-700 font-semibold' : ''}`}>Nhìn lại</span>
            <span className={`text-sm ${step === 4 ? 'progress-cloud' : 'text-slate-300'}`}>{step === 4 ? '☁️' : '→'}</span>
            <span className={`px-2 py-0.5 rounded-full transition-all ${step === 4 ? 'choice-pop bg-emerald-100 text-emerald-700 font-semibold' : ''}`}>Hành động</span>
          </div>
        )}

        {/* Các nút tiện ích & Thoát an toàn */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Nút Hỗ trợ An toàn */}
          <button
            onClick={onOpenSafety}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
            title="Hỗ trợ an toàn & Tổng đài 111"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">An toàn (111)</span>
          </button>

          {/* Bản nháp đã lưu */}
          <button
            onClick={onOpenDrafts}
            className="p-2 rounded-lg text-slate-600 hover:bg-stone-200/60 transition-colors"
            title="Bản nháp đã lưu trên máy"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* Cài đặt / API Key */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-slate-600 hover:bg-stone-200/60 transition-colors"
            title="Cài đặt AI & Riêng tư"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Nút Thoát khẩn cấp (Xóa phiên ngay lập tức) */}
          {showProgress && (
            <button
              onClick={onEmergencyExit}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Xóa phiên ngay và thoát ra"
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-rose-500" />
              <span className="hidden sm:inline">Xóa phiên</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
