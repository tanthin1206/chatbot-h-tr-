import React, { useState } from 'react';
import { ShieldAlert, ArrowRight, HelpCircle, Check } from 'lucide-react';

interface Screen2CheckinProps {
  initialLevel: number;
  initialSelectedEmotions: string[];
  onSubmit: (level: number, emotions: string[]) => void;
  onOpenSafety: () => void;
}

const AVAILABLE_EMOTIONS = [
  'Tức giận',
  'Buồn',
  'Thất vọng',
  'Bất lực',
  'Sợ',
  'Cô đơn',
  'Bị kiểm soát',
  'Không được tôn trọng',
  'Bối rối',
  'Không biết gọi tên'
];

export const Screen2Checkin: React.FC<Screen2CheckinProps> = ({
  initialLevel,
  initialSelectedEmotions,
  onSubmit,
  onOpenSafety
}) => {
  const [level, setLevel] = useState<number>(initialLevel || 6);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(initialSelectedEmotions || []);

  const getLevelDescription = (val: number) => {
    if (val <= 3) return { text: 'Khó chịu nhẹ', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (val <= 6) return { text: 'Đang bị ảnh hưởng', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    if (val <= 8) return { text: 'Rất khó chịu', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { text: 'Cảm xúc đang rất mạnh', color: 'text-purple-700 bg-purple-50 border-purple-200' };
  };

  const toggleEmotion = (emotion: string) => {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions(selectedEmotions.filter((e) => e !== emotion));
    } else {
      if (selectedEmotions.length >= 3) {
        // Giới hạn tối đa 3 thẻ theo kế hoạch
        return;
      }
      setSelectedEmotions([...selectedEmotions, emotion]);
    }
  };

  const handleSkipEmotions = () => {
    onSubmit(level, selectedEmotions.length > 0 ? selectedEmotions : ['Không biết gọi tên']);
  };

  const levelInfo = getLevelDescription(level);

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-8">
      {/* Tiêu đề câu hỏi */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          Bước 1: Lắng nghe bản thân
        </span>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          Mức độ khó chịu của bạn lúc này là bao nhiêu?
        </h2>
        <p className="text-sm text-slate-500">
          Hãy chọn con số phản ánh đúng nhất trạng thái của bạn ngay bây giờ.
        </p>
      </div>

      {/* Bộ điều khiển thang đo 1-10 */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-slate-800 tracking-tight">
              {level}
            </span>
            <span className="text-slate-400 font-medium text-sm">/ 10</span>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${levelInfo.color} transition-all`}>
            {levelInfo.text}
          </span>
        </div>

        {/* Slider 1 - 10 */}
        <div className="space-y-2">
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={level}
            onChange={(e) => setLevel(parseInt(e.target.value, 10))}
            className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
            aria-label="Thang đo mức độ khó chịu từ 1 đến 10"
          />
          <div className="flex justify-between text-[11px] text-slate-400 px-0.5">
            <span>1 (Nhẹ)</span>
            <span>5 (Vừa)</span>
            <span>10 (Rất mạnh)</span>
          </div>
        </div>

        {/* Thông báo tế nhị nếu cảm xúc đạt 9-10 */}
        {level >= 9 && (
          <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-start space-x-2.5">
            <ShieldAlert className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Bạn đang có cảm xúc rất mạnh.</p>
              <p className="text-purple-800">
                Nếu bạn cảm thấy bản thân đang không an toàn hoặc có nguy cơ bị đe dọa, bạn có thể{' '}
                <button
                  onClick={onOpenSafety}
                  className="font-bold underline text-purple-950 hover:text-purple-700"
                >
                  tìm kiếm hỗ trợ khẩn cấp ngay tại đây
                </button>.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Lựa chọn cảm xúc (tối đa 3 thẻ) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-700">
            Cảm xúc nào đang hiện diện rõ nhất?
          </label>
          <span className="text-xs text-slate-400">
            {selectedEmotions.length}/3 thẻ
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {AVAILABLE_EMOTIONS.map((emotion) => {
            const isSelected = selectedEmotions.includes(emotion);
            return (
              <button
                key={emotion}
                type="button"
                onClick={() => toggleEmotion(emotion)}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-slate-700 border-stone-200 hover:border-slate-300'
                }`}
              >
                <span>{emotion}</span>
                {isSelected && <Check className="w-3.5 h-3.5 ml-1 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Nút hành động */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          onClick={() => onSubmit(level, selectedEmotions)}
          className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-medium text-sm shadow-sm transition-all flex items-center justify-center space-x-2"
        >
          <span>Tiếp tục</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={handleSkipEmotions}
          className="w-full sm:w-auto py-3 px-4 text-xs sm:text-sm text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center space-x-1"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Mình chưa biết chọn</span>
        </button>
      </div>
    </div>
  );
};
