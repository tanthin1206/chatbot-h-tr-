import React from 'react';
import { X, BookOpen, Trash2, ArrowUpRight, Calendar, Heart } from 'lucide-react';
import { SavedDraft } from '../types';

interface DraftsModalProps {
  isOpen: boolean;
  drafts: SavedDraft[];
  onClose: () => void;
  onSelectDraft: (draft: SavedDraft) => void;
  onDeleteDraft: (id: string) => void;
}

export const DraftsModal: React.FC<DraftsModalProps> = ({
  isOpen,
  drafts,
  onClose,
  onSelectDraft,
  onDeleteDraft
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF8F5] w-full max-w-lg rounded-3xl border border-stone-200 shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200/70 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Bản nháp đã lưu</h3>
              <p className="text-xs text-slate-500">Chỉ lưu trữ trên trình duyệt của máy bạn</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Danh sách bản nháp */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {drafts.length === 0 ? (
            <div className="py-12 text-center space-y-2 text-slate-400 text-xs sm:text-sm">
              <BookOpen className="w-8 h-8 mx-auto text-stone-300" />
              <p>Bạn chưa lưu bản nháp nào trên thiết bị này.</p>
            </div>
          ) : (
            drafts.map((d) => (
              <div
                key={d.id}
                className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-blue-300 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{d.date}</span>
                  </span>
                  <span className="flex items-center space-x-1 text-slate-500">
                    <Heart className="w-3 h-3 text-rose-500" />
                    <span>Cảm xúc: {d.initialEmotion}/10</span>
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 line-clamp-2 font-medium">
                  {d.dialogue || d.summary}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-xs">
                  <button
                    onClick={() => {
                      onSelectDraft(d);
                      onClose();
                    }}
                    className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center space-x-1"
                  >
                    <span>Mở xem & chỉnh sửa</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => onDeleteDraft(d.id)}
                    className="text-slate-400 hover:text-rose-600 inline-flex items-center space-x-1"
                    title="Xóa bản nháp này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
