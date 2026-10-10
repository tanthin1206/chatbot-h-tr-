import React from 'react';
import { ChevronRight, Clock3, MessageCircleHeart, PenLine, Plus, ShieldCheck } from 'lucide-react';
import { ChatSession } from '../types';

interface ScreenChatHomeProps {
  sessions: ChatSession[];
  onNewChat: () => void;
  onPrivateWrite: () => void;
  onOpenChat: (session: ChatSession) => void;
}

const MODE_LABELS: Record<ChatSession['supportMode'], string> = {
  listen: 'Chỉ lắng nghe',
  understand: 'Giúp tớ hiểu',
  advice: 'Cho tớ lời khuyên'
};

const formatTime = (timestamp: number) => new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit'
}).format(timestamp);

export const ScreenChatHome: React.FC<ScreenChatHomeProps> = ({ sessions, onNewChat, onPrivateWrite, onOpenChat }) => (
  <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
    <div className="grid items-start gap-8 md:grid-cols-[1fr_210px]">
      <div className="space-y-7">
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <MessageCircleHeart className="h-3.5 w-3.5" /> Góc trò chuyện của bạn
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Mây vẫn ở đây khi bạn muốn kể</h1>
          <p className="max-w-xl text-sm leading-relaxed text-slate-600">Bạn có thể trò chuyện cùng Mây, hoặc chỉ viết ra rồi nhờ Mây giúp nhìn lại theo cách nhẹ nhàng hơn.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onNewChat}
            className="group flex min-h-28 w-full items-center gap-3 rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm"><Plus className="h-5 w-5" /></span>
            <span className="min-w-0 flex-1">
              <strong className="block text-base text-slate-900">Chat với Mây</strong>
              <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">Bắt đầu một cuộc trò chuyện mới</span>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-blue-500 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            type="button"
            onClick={onPrivateWrite}
            className="group flex min-h-28 w-full items-center gap-3 rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-50 to-rose-50 p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-md"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-sm"><PenLine className="h-5 w-5" /></span>
            <span className="min-w-0 flex-1">
              <strong className="block text-base text-slate-900">Chỉ muốn viết</strong>
              <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">Viết riêng, nhìn lại và nhận gợi ý</span>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-purple-500 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <section className="space-y-3" aria-labelledby="chat-history-title">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 id="chat-history-title" className="font-bold text-slate-900">Những lần mình đã kể</h2>
              <p className="mt-0.5 text-xs text-slate-500">Được lưu riêng trên thiết bị này.</p>
            </div>
            {sessions.length > 0 && <span className="text-xs text-slate-400">{sessions.length} cuộc trò chuyện</span>}
          </div>

          {sessions.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-stone-300 bg-white/60 px-5 py-8 text-center">
              <p className="text-sm font-medium text-slate-700">Chưa có cuộc trò chuyện cũ</p>
              <p className="mt-1 text-xs text-slate-500">Sau khi bạn nhắn, câu chuyện sẽ xuất hiện ở đây để mở lại.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map((session) => {
                const preview = [...session.messages].reverse().find((message) => message.role === 'user')?.content || session.title;
                return (
                  <button
                    key={session.id}
                    type="button"
                    onClick={() => onOpenChat(session)}
                    className="group flex w-full items-center gap-3 rounded-2xl border border-stone-200 bg-white/85 p-3.5 text-left transition-all hover:border-blue-200 hover:bg-white hover:shadow-sm"
                  >
                    <img src="/illustrations/cloud-breathe.png" alt="" className="h-11 w-11 shrink-0 object-contain" />
                    <span className="min-w-0 flex-1">
                      <strong className="block truncate text-sm text-slate-800">{session.title}</strong>
                      <span className="mt-0.5 block truncate text-xs text-slate-500">{preview}</span>
                      <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-slate-400">
                        <span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" /> {formatTime(session.updatedAt)}</span>
                        <span>•</span>
                        <span>{MODE_LABELS[session.supportMode]}</span>
                      </span>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-500" />
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <p className="flex items-center gap-1.5 text-[11px] text-slate-400"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Lịch sử không được đồng bộ sang tài khoản hay thiết bị khác.</p>
      </div>

      <div className="relative hidden md:block">
        <span className="sparkle left-3 top-10" />
        <span className="sparkle right-5 top-2" style={{ animationDelay: '-1.4s' }} />
        <img src="/illustrations/cloud-journal.png" alt="Mây đang chờ bạn trò chuyện" className="w-full object-contain drop-shadow-sm mascot-float" />
      </div>
    </div>
  </div>
);
