// Safety detection for Child Protection & Emergency Crisis

export interface SafetyCheckResult {
  isEmergency: boolean;
  needsSupport: boolean;
  reasons: string[];
}

const EMERGENCY_KEYWORDS = [
  'tự tử', 'muốn chết', 'tự hại', 'cắt tay', 'uống thuốc ngủ', 'kết thúc cuộc sống',
  'không muốn sống', 'chết cho rồi', 'nhảy lầu', 'chết quách', 'tự sát',
  'đánh đập', 'bóp cổ', 'dùng thắt lưng', 'chảy máu', 'bạo lực', 'xâm hại',
  'lạm dụng', 'đánh nhập viện', 'đe dọa giết', 'ép quan hệ', 'nhốt không cho ăn',
  'bỏ đói', 'đuổi khỏi nhà trong đêm', 'hăm dọa tính mạng'
];

const SUPPORT_NEEDED_KEYWORDS = [
  'quá bế tắc', 'không còn đường lui', 'sợ về nhà', 'hoảng loạn', 'run rẩy',
  'khóc suốt đêm', 'không thở được', 'ngạt thở', 'cô độc', 'trầm cảm nặng'
];

export function checkSafety(text: string): SafetyCheckResult {
  const normalized = text.toLowerCase();
  const foundEmergency: string[] = [];
  const foundSupport: string[] = [];

  for (const kw of EMERGENCY_KEYWORDS) {
    if (normalized.includes(kw)) {
      foundEmergency.push(kw);
    }
  }

  for (const kw of SUPPORT_NEEDED_KEYWORDS) {
    if (normalized.includes(kw)) {
      foundSupport.push(kw);
    }
  }

  return {
    isEmergency: foundEmergency.length > 0,
    needsSupport: foundSupport.length > 0,
    reasons: foundEmergency.length > 0 ? foundEmergency : foundSupport,
  };
}
