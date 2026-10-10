import React, { useEffect, useState } from 'react';
import { X, Shield, Sparkles, Trash2, Server, Wifi, WifiOff, Key, HelpCircle, LoaderCircle, CircleCheck, CircleX, WandSparkles } from 'lucide-react';
import { CLIENT_GEMINI_MODEL, testBrowserApiKey } from '../services/analyzer';

interface SettingsModalProps {
  isOpen: boolean;
  geminiConfigured: boolean | null;
  browserApiKey: string;
  reducedMotion: boolean;
  onReducedMotionChange: (value: boolean) => void;
  onSaveBrowserApiKey: (key: string) => void;
  onClearAllData: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  geminiConfigured,
  browserApiKey,
  reducedMotion,
  onReducedMotionChange,
  onSaveBrowserApiKey,
  onClearAllData,
  onClose
}) => {
  const [tempKey, setTempKey] = useState(browserApiKey);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [testState, setTestState] = useState<{
    status: 'idle' | 'testing' | 'success' | 'error';
    message?: string;
    testedKey?: string;
    latencyMs?: number;
  }>({ status: 'idle' });

  useEffect(() => {
    if (isOpen) {
      setTempKey(browserApiKey);
      setTestState(browserApiKey
        ? { status: 'idle', message: 'Bạn có thể kiểm tra lại key đang dùng.' }
        : { status: 'idle' });
    }
  }, [browserApiKey, isOpen]);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    onSaveBrowserApiKey(tempKey);
    setSavedFeedback(true);
    window.setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleTestKey = async () => {
    const keyToTest = tempKey.trim();
    setTestState({ status: 'testing', testedKey: keyToTest });
    const result = await testBrowserApiKey(keyToTest);
    setTestState({
      status: result.ok ? 'success' : 'error',
      message: result.message,
      testedKey: keyToTest,
      latencyMs: result.latencyMs
    });
  };

  const canSaveTestedKey = testState.status === 'success' && testState.testedKey === tempKey.trim();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF8F5] w-full max-w-lg rounded-3xl border border-stone-200 shadow-xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200/70 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Cài đặt & Quyền riêng tư</h3>
              <p className="text-xs text-slate-500">Tùy chỉnh trí tuệ nhân tạo và bộ nhớ</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Đóng cài đặt"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          <div className="bg-white p-4 rounded-2xl border border-purple-100 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600"><WandSparkles className="w-4 h-4" /></div>
                <div>
                  <p className="font-semibold text-slate-800">Chuyển động dịu nhẹ</p>
                  <p className="text-xs text-slate-500 mt-0.5">Mây và các thẻ sẽ phản hồi nhẹ khi bạn tương tác.</p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={!reducedMotion}
                onClick={() => onReducedMotionChange(!reducedMotion)}
                className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${reducedMotion ? 'bg-stone-300' : 'bg-purple-500'}`}
              >
                <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${reducedMotion ? 'left-1' : 'left-6'}`} />
              </button>
            </div>
            <p className="text-[11px] text-slate-400">{reducedMotion ? 'Đang giảm chuyển động. Nội dung và chức năng vẫn giữ nguyên.' : 'Đang bật. Có thể tắt bất cứ lúc nào nếu bạn thấy khó chịu.'}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-blue-200 space-y-3">
            <div className="flex items-center space-x-2 text-slate-800 font-semibold">
              <Key className="w-4 h-4 text-blue-600" />
              <span>Dùng API key trực tiếp trong trình duyệt</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Phù hợp để chạy thử trên máy cá nhân. Khóa chỉ được giữ trong tab hiện tại và sẽ mất khi đóng tab. Người có quyền truy cập trình duyệt hoặc DevTools vẫn có thể nhìn thấy khóa này.
            </p>

            <div className="text-[11px] text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
              Model sử dụng: <code className="font-mono font-semibold">{CLIENT_GEMINI_MODEL}</code>
            </div>

            <input
              type="password"
              value={tempKey}
              onChange={(event) => {
                setTempKey(event.target.value);
                setTestState({ status: 'idle' });
              }}
              placeholder="Dán Gemini API key"
              autoComplete="off"
              spellCheck={false}
              className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 font-mono text-xs focus:outline-none focus:border-blue-500 focus:bg-white"
            />

            <div className="flex flex-wrap items-center justify-between gap-2">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline text-[11px] inline-flex items-center space-x-1"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Lấy khóa tại Google AI Studio</span>
              </a>

              <div className="flex items-center gap-2">
                {browserApiKey && (
                  <button
                    type="button"
                    onClick={() => {
                      setTempKey('');
                      onSaveBrowserApiKey('');
                    }}
                    className="px-3 py-1.5 rounded-lg border border-stone-200 text-slate-600 text-xs hover:bg-stone-50"
                  >
                    Xóa khóa
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleTestKey}
                  disabled={tempKey.trim().length < 20 || testState.status === 'testing'}
                  className="px-3.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50 disabled:bg-stone-100 disabled:text-stone-400 text-blue-700 font-medium text-xs hover:bg-blue-100 transition-colors inline-flex items-center gap-1.5"
                >
                  {testState.status === 'testing' && <LoaderCircle className="w-3.5 h-3.5 animate-spin" />}
                  <span>{testState.status === 'testing' ? 'Đang kiểm tra…' : 'Kiểm tra key'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveKey}
                  disabled={!canSaveTestedKey}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 disabled:bg-stone-300 text-white font-medium text-xs hover:bg-blue-700 transition-colors"
                >
                  {savedFeedback ? 'Đã dùng cho tab này' : 'Dùng key'}
                </button>
              </div>
            </div>

            {testState.message && (
              <div className={`p-3 rounded-xl border flex items-start gap-2 text-xs ${
                testState.status === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : testState.status === 'error'
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : 'bg-stone-50 border-stone-200 text-slate-600'
              }`}>
                {testState.status === 'success' && <CircleCheck className="w-4 h-4 shrink-0" />}
                {testState.status === 'error' && <CircleX className="w-4 h-4 shrink-0" />}
                <span>
                  {testState.message}
                  {testState.latencyMs !== undefined && ` (${testState.latencyMs} ms)`}
                </span>
              </div>
            )}
          </div>

          {/* Trạng thái Gemini phía máy chủ */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center space-x-2 text-slate-800 font-semibold">
              <Server className="w-4 h-4 text-blue-600" />
              <span>Bộ phân tích Gemini</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Khóa Gemini được bảo vệ ở máy chủ và không bao giờ được gửi xuống trình duyệt. Khi Gemini không khả dụng, ứng dụng tự chuyển sang bộ phản tư ngoại tuyến.
            </p>

            <div className={`p-3 rounded-xl border flex items-center space-x-2 ${
              browserApiKey || geminiConfigured
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-stone-50 border-stone-200 text-slate-600'
            }`}>
              {browserApiKey || geminiConfigured ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span className="text-xs font-semibold">
                {browserApiKey
                  ? 'Đang ưu tiên API key của tab này'
                  : geminiConfigured === null
                  ? 'Đang kiểm tra kết nối…'
                  : geminiConfigured
                    ? 'Gemini đã sẵn sàng'
                    : 'Đang dùng chế độ phản tư ngoại tuyến'}
              </span>
            </div>
          </div>

          {/* Dọn dẹp dữ liệu an toàn */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center space-x-2 text-slate-800 font-semibold">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Xóa sạch toàn bộ dữ liệu ứng dụng</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Thao tác này sẽ xóa sạch mọi bản nháp, lịch sử phiên và cài đặt đã lưu trong trình duyệt. Không ai có thể khôi phục lại được.
            </p>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ dữ liệu đã lưu trên trình duyệt?')) {
                  onClearAllData();
                  onClose();
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-semibold text-xs flex items-center space-x-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa sạch bộ nhớ cục bộ</span>
            </button>
          </div>

          {/* Giới thiệu ứng dụng */}
          <div className="p-4 rounded-2xl bg-stone-100/70 border border-stone-200/60 text-xs text-slate-500 space-y-2">
            <p className="font-semibold text-slate-700">Dự án &quot;Khoảng Thở&quot;</p>
            <p>
              Được thiết kế dựa trên các nguyên tắc an toàn tâm lý học đường, hỗ trợ học sinh giảm áp lực và chuẩn bị đối thoại theo mô hình Giao tiếp trắc ẩn (NVC).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
