import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check, ChevronDown, Edit3, Pause, Play, RotateCcw } from 'lucide-react';

interface Screen8NextActionsProps {
  onSelectAction: (actionKey: string) => void;
  onOpenSafety: () => void;
  dialogue: string;
  dialogueMode: 'sms' | 'direct' | 'letter' | 'third_party';
  selectedNeeds: string[];
}

const MODE_LABEL = { sms: 'một tin nhắn', direct: 'một cuộc nói chuyện', letter: 'một lá thư', third_party: 'nhờ người hỗ trợ' } as const;

export const Screen8NextActions: React.FC<Screen8NextActionsProps> = ({ onSelectAction, onOpenSafety, dialogue, dialogueMode, selectedNeeds }) => {
  const recommendedAction = dialogueMode === 'direct' ? 'prepare_talk' : dialogueMode === 'third_party' ? 'talk_to_adult' : 'save_draft';
  const [selectedAction, setSelectedAction] = useState(recommendedAction);
  const [showBreathingWidget, setShowBreathingWidget] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    if (!isTimerRunning || timerSeconds <= 0) return;
    const interval = window.setInterval(() => setTimerSeconds((previous) => previous - 1), 1000);
    return () => window.clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  useEffect(() => {
    if (timerSeconds === 0) setIsTimerRunning(false);
  }, [timerSeconds]);

  const actions = useMemo(() => [
    { key: 'breathe_60s', eyebrow: 'Dịu lại trước', title: 'Thở cùng Mây 60 giây', desc: 'Cho cơ thể một nhịp nghỉ trước khi quyết định.', emoji: '🌬️', tint: 'bg-blue-50 border-blue-200' },
    {
      key: recommendedAction,
      eyebrow: 'Mây gợi ý cho bạn',
      title: dialogueMode === 'direct' ? 'Chọn lúc phù hợp để mở lời' : dialogueMode === 'third_party' ? 'Chọn một người đáng tin để đồng hành' : 'Cất câu này lại, đọc lại sau',
      desc: dialogueMode === 'direct' ? 'Tìm một lúc cả hai bên không vội, rồi dùng câu bạn vừa soạn.' : dialogueMode === 'third_party' ? 'Cho họ xem câu bạn vừa soạn và nhờ họ cùng mở lời.' : 'Không cần gửi ngay. Hãy quay lại khi lòng đã nhẹ hơn.',
      emoji: dialogueMode === 'third_party' ? '🤝' : dialogueMode === 'direct' ? '💬' : '💌',
      tint: 'bg-emerald-50 border-emerald-300'
    },
    { key: 'talk_to_adult', eyebrow: 'Không cần làm một mình', title: 'Tìm một người đứng về phía an toàn', desc: 'Thầy cô, người thân hoặc chuyên gia có thể lắng nghe và làm cầu nối.', emoji: '🫶', tint: 'bg-amber-50 border-amber-200' }
  ].filter((item, index, all) => all.findIndex((candidate) => candidate.key === item.key) === index), [dialogueMode, recommendedAction]);

  const extraActions = [
    { key: 'write_more', title: 'Viết thêm một chút', desc: 'Nếu trong lòng vẫn còn điều chưa nói.', icon: Edit3 },
    { key: 'finish_now', title: 'Dừng ở đây và nghỉ ngơi', desc: 'Hôm nay như vậy đã là đủ.', icon: Check }
  ];
  const selected = [...actions, ...extraActions.map((item) => ({ ...item, eyebrow: '', emoji: '', tint: '' }))].find((item) => item.key === selectedAction);

  const choose = (key: string) => {
    setSelectedAction(key);
    setShowBreathingWidget(key === 'breathe_60s');
    setIsTimerRunning(key === 'breathe_60s');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-9 space-y-5">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#F1ECFF] to-[#EAF7FF] border border-purple-100 p-5 sm:p-7 min-h-48">
        <div className="relative z-10 max-w-[72%] space-y-3">
          <span className="inline-flex px-3 py-1 rounded-full bg-white/80 text-[11px] font-bold text-purple-700">✨ TỪ LỜI NÓI ĐẾN BƯỚC NHỎ</span>
          <h2 className="text-2xl font-bold text-slate-900">Bạn không cần giải quyết mọi thứ hôm nay</h2>
          <p className="text-sm text-slate-600">Chỉ chọn một việc đủ nhỏ để làm tiếp. Mây đã dựa trên lựa chọn <strong>{MODE_LABEL[dialogueMode]}</strong> của bạn.</p>
        </div>
        <img src="/illustrations/cloud-journal.png" alt="Mây nhỏ đang cùng bạn lên kế hoạch" className="absolute -right-4 -bottom-8 w-36 sm:w-44 object-contain mascot-float" />
      </section>

      <section className="rounded-3xl bg-white border border-stone-200 p-4 sm:p-5">
        <div className="flex gap-3 items-start">
          <span className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">💭</span>
          <div className="min-w-0">
            {selectedNeeds.length > 0 && <p className="text-xs text-slate-500 mb-1">Bạn đang mong: <strong className="text-slate-700">{selectedNeeds.join(' · ')}</strong></p>}
            <p className="text-sm text-slate-800 line-clamp-3">“{dialogue}”</p>
          </div>
        </div>
      </section>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-900 px-1">Hôm nay, bước nào vừa sức với bạn?</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {actions.map((action) => {
            const active = selectedAction === action.key;
            return (
              <button key={action.key} onClick={() => choose(action.key)} className={`interactive-card relative rounded-3xl border p-4 text-left transition-all min-h-48 ${active ? `choice-pop ${action.tint} shadow-md -translate-y-1 ring-2 ring-white` : 'bg-white border-stone-200 hover:-translate-y-0.5 hover:shadow-sm'}`}>
                {action.key === recommendedAction && <span className="absolute top-3 right-3 px-2 py-1 rounded-full bg-emerald-600 text-[9px] font-bold text-white">HỢP VỚI BẠN</span>}
                <span className="text-3xl block mb-5">{action.emoji}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{action.eyebrow}</span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{action.title}</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{action.desc}</p>
                {active && <span className="absolute bottom-3 right-3 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center"><Check className="w-3.5 h-3.5" /></span>}
              </button>
            );
          })}
        </div>
      </div>

      {showBreathingWidget && (
        <section className="rounded-3xl bg-blue-50 border border-blue-100 p-5 text-center space-y-4">
          <div className="relative flex items-center justify-center w-28 h-28 mx-auto">
            <div className={`absolute inset-0 rounded-full bg-blue-200/70 ${isTimerRunning ? 'animate-breathe' : ''}`} />
            <div className="relative text-2xl font-bold text-blue-950">{timerSeconds}s</div>
          </div>
          <p className="text-sm text-blue-900">{timerSeconds ? 'Hít vào chậm… rồi thở ra dài hơn một chút.' : 'Bạn vừa dành trọn một phút cho mình 🌿'}</p>
          <div className="flex justify-center gap-2">
            <button onClick={() => setIsTimerRunning(!isTimerRunning)} className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold inline-flex items-center gap-1.5">{isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}{isTimerRunning ? 'Tạm dừng' : 'Tiếp tục'}</button>
            <button onClick={() => { setTimerSeconds(60); setIsTimerRunning(false); }} aria-label="Đặt lại đồng hồ" className="w-9 h-9 rounded-xl border border-blue-200 text-blue-700 flex items-center justify-center"><RotateCcw className="w-4 h-4" /></button>
          </div>
        </section>
      )}

      <section className="rounded-3xl border border-dashed border-stone-300 bg-white/60 overflow-hidden">
        <button onClick={() => setShowMore(!showMore)} className="w-full p-4 flex items-center justify-between text-sm font-medium text-slate-600"><span>Chưa hợp? Mình muốn một lựa chọn nhẹ hơn</span><ChevronDown className={`w-4 h-4 transition-transform ${showMore ? 'rotate-180' : ''}`} /></button>
        {showMore && <div className="grid sm:grid-cols-2 gap-2 px-4 pb-4">{extraActions.map(({ key, title, desc, icon: Icon }) => <button key={key} onClick={() => choose(key)} className={`rounded-2xl border p-3 text-left flex gap-3 ${selectedAction === key ? 'bg-stone-100 border-slate-400' : 'bg-white border-stone-200'}`}><Icon className="w-4 h-4 mt-0.5 text-slate-500" /><span><strong className="block text-xs text-slate-800">{title}</strong><small className="text-[11px] text-slate-500">{desc}</small></span></button>)}</div>}
      </section>

      <section className="sticky bottom-3 rounded-2xl bg-slate-900 text-white p-3 pl-4 shadow-xl flex items-center gap-3">
        <div className="flex-1 min-w-0"><p className="text-[10px] uppercase tracking-wider text-slate-400">Bước mình chọn</p><p className="text-sm font-semibold truncate">{selected?.title}</p></div>
        <button onClick={() => onSelectAction(selectedAction)} className="px-4 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-sm font-semibold inline-flex items-center gap-2">Giữ bước này <ArrowRight className="w-4 h-4" /></button>
      </section>

      {selectedAction === 'talk_to_adult' && <button onClick={onOpenSafety} className="w-full text-center text-xs font-medium text-rose-600 hover:underline">Xem người hỗ trợ và Tổng đài 111</button>}
    </div>
  );
};
