import React, { useState } from 'react';
import { ArrowRight, Check, Copy, Lightbulb, MessageCircleHeart, Sparkles, X } from 'lucide-react';
import { ReflectionResult, ReviewWord } from '../types';

interface Screen6ReflectionProps {
  reflection: ReflectionResult;
  onProceedToComposer: (chosenDialogue: string) => void;
  onUpdateReflection: (updated: ReflectionResult) => void;
}

type DialogueTone = 'standard' | 'shorter' | 'gentler' | 'direct';

const FEEDBACK = [
  { value: 'accurate', emoji: '🌤️', label: 'Đúng với mình' },
  { value: 'partial', emoji: '🌥️', label: 'Đúng một phần' },
  { value: 'inaccurate', emoji: '🌫️', label: 'Chưa đúng lắm' }
] as const;

const NEED_EMOJI = ['👂', '💬', '🫧', '🤝', '🌿'];

export const Screen6Reflection: React.FC<Screen6ReflectionProps> = ({ reflection, onProceedToComposer, onUpdateReflection }) => {
  const [feedback, setFeedback] = useState(reflection.userHeardFeedback);
  const [words, setWords] = useState<ReviewWord[]>(reflection.wordsToReview);
  const [answer, setAnswer] = useState(reflection.userClarificationAnswer || '');
  const [needs, setNeeds] = useState(reflection.underlyingNeeds);
  const [tone, setTone] = useState<DialogueTone>('standard');
  const [copied, setCopied] = useState(false);
  const dialogue = reflection.dialogueDrafts[tone] || reflection.dialogueDrafts.standard;
  const activeWords = words.filter((word) => !word.dismissed);
  const selectedNeeds = needs.filter((need) => need.selected);

  const save = (changes: Partial<ReflectionResult>) => onUpdateReflection({
    ...reflection,
    userHeardFeedback: feedback,
    userClarificationAnswer: answer,
    wordsToReview: words,
    underlyingNeeds: needs,
    ...changes
  });

  const updateFeedback = (value: 'accurate' | 'partial' | 'inaccurate') => {
    setFeedback(value);
    save({ userHeardFeedback: value });
  };

  const dismissWord = (word: string) => {
    const updated = words.map((item) => item.word === word ? { ...item, dismissed: true } : item);
    setWords(updated);
    save({ wordsToReview: updated });
  };

  const toggleNeed = (id: string) => {
    const updated = needs.map((need) => need.id === id ? { ...need, selected: !need.selected } : need);
    setNeeds(updated);
    save({ underlyingNeeds: updated });
  };

  const copyDialogue = async () => {
    await navigator.clipboard.writeText(dialogue);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-9 space-y-5">
      <section className="relative overflow-hidden rounded-[2rem] bg-[#EAF4FF] border border-blue-100 px-5 py-6 sm:px-7 sm:py-8 min-h-48">
        <div className="relative z-10 max-w-[72%] space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 text-[11px] font-bold text-blue-700"><Sparkles className="w-3.5 h-3.5" /> Mây nghe được điều này</span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">“{reflection.whatWeHeard}”</h2>
          <p className="text-xs text-slate-600">Không phải chẩn đoán hay kết luận. Bạn là người quyết định điều gì đúng với mình.</p>
        </div>
        <div className="absolute -right-3 -bottom-7 w-32 sm:w-40">
          <div className="absolute inset-4 rounded-full bg-white/60 blur-xl" />
          <img src="/illustrations/cloud-untangle.png" alt="Mây nhỏ đang gỡ nút thắt" className="relative w-full object-contain mascot-float" />
        </div>
      </section>

      <section className="rounded-3xl bg-white border border-stone-200 p-4 sm:p-5 space-y-3">
        <div>
          <p className="font-semibold text-slate-900">Mây hiểu như vậy có gần với bạn không?</p>
          <p className="text-xs text-slate-500 mt-0.5">Chạm một lựa chọn, không cần giải thích dài.</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {FEEDBACK.map((item) => (
            <button key={item.value} onClick={() => updateFeedback(item.value)} className={`interactive-card rounded-2xl border p-3 text-center transition-all ${feedback === item.value ? 'choice-pop border-blue-400 bg-blue-50 shadow-sm -translate-y-0.5' : 'border-stone-200 bg-stone-50/60 hover:bg-white'}`}>
              <span className="block text-2xl mb-1">{item.emoji}</span>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-700">{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-[#FFF9E9] border border-amber-100 p-4 sm:p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-xl shadow-sm">🧶</div>
          <div><p className="font-semibold text-slate-900">Gỡ nhẹ một nút thắt</p><p className="text-xs text-slate-500">Không phủ nhận cảm xúc — chỉ đổi cách diễn đạt để người khác dễ nghe hơn.</p></div>
        </div>
        {activeWords.length > 0 ? (
          <div className="space-y-2">
            {activeWords.slice(0, 2).map((word) => (
              <div key={word.word} className="rounded-2xl bg-white/85 border border-amber-100 p-3.5 soft-pop">
                <div className="flex justify-between gap-3">
                  <div className="space-y-1.5">
                    <p className="text-xs text-slate-500">Trong đầu đang là <strong className="text-amber-900">“{word.word}”</strong></p>
                    <p className="text-sm font-medium text-slate-800">Thử đổi thành: {word.alternativeSuggestion || word.reason}</p>
                  </div>
                  <button onClick={() => dismissWord(word.word)} aria-label={`Bỏ qua ${word.word}`} className="w-7 h-7 rounded-full bg-stone-100 text-slate-400 hover:text-slate-700 flex items-center justify-center shrink-0"><X className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-emerald-800 rounded-2xl bg-emerald-50 p-3">✨ Cách bạn kể đã khá cụ thể và không cần chỉnh nhiều.</p>}
        <div className="rounded-2xl bg-white/70 p-3.5">
          <label className="text-sm font-medium text-slate-800">{reflection.clarificationQuestion}</label>
          <input value={answer} onChange={(event) => { const value = event.target.value; setAnswer(value); save({ userClarificationAnswer: value }); }} placeholder="Có thể bỏ qua, hoặc viết một câu ngắn…" className="mt-2 w-full bg-white rounded-xl border border-amber-100 px-3 py-2.5 text-sm focus:outline-none focus:border-amber-300" />
        </div>
      </section>

      <section className="rounded-3xl bg-white border border-stone-200 p-4 sm:p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-xl">💚</div>
          <div><p className="font-semibold text-slate-900">Lúc này, bạn mong điều gì nhất?</p><p className="text-xs text-slate-500">Chọn một hoặc vài điều. Mây sẽ dùng chúng để gợi ý bước tiếp theo.</p></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {needs.map((need, index) => (
            <button key={need.id} onClick={() => toggleNeed(need.id)} className={`interactive-card p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${need.selected ? 'choice-pop bg-emerald-50 border-emerald-300 text-emerald-950 shadow-sm' : 'bg-stone-50 border-stone-200 text-slate-600 hover:bg-white'}`}>
              <span className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-lg shrink-0">{NEED_EMOJI[index % NEED_EMOJI.length]}</span>
              <span className="text-xs sm:text-sm font-medium flex-1">{need.label}</span>
              {need.selected && <Check className="w-4 h-4 text-emerald-600" />}
            </button>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-200"><MessageCircleHeart className="w-4 h-4" /> MỘT CÂU ĐỂ BẮT ĐẦU</div>
        <p className="text-base sm:text-lg leading-relaxed">“{dialogue}”</p>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {([['standard', 'Tự nhiên'], ['shorter', 'Ngắn hơn'], ['gentler', 'Mềm hơn'], ['direct', 'Rõ hơn']] as const).map(([value, label]) => (
            <button key={value} onClick={() => setTone(value)} className={`shrink-0 px-3 py-2 rounded-xl text-xs font-medium ${tone === value ? 'bg-white text-slate-900' : 'bg-white/10 text-slate-300 hover:bg-white/15'}`}>{label}</button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button onClick={copyDialogue} className="px-4 py-3 rounded-xl border border-white/15 text-sm hover:bg-white/10 inline-flex justify-center items-center gap-2"><Copy className="w-4 h-4" /> {copied ? 'Đã sao chép' : 'Giữ lại câu này'}</button>
          <button onClick={() => onProceedToComposer(dialogue)} disabled={selectedNeeds.length === 0} className="flex-1 px-4 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-40 text-sm font-semibold inline-flex justify-center items-center gap-2">Biến thành một bước nhỏ <ArrowRight className="w-4 h-4" /></button>
        </div>
        {selectedNeeds.length === 0 && <p className="text-xs text-amber-200 flex items-center gap-1.5"><Lightbulb className="w-3.5 h-3.5" /> Chọn ít nhất một điều bạn đang mong ở phía trên nhé.</p>}
      </section>
    </div>
  );
};
