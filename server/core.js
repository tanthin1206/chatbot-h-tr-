import { z } from 'zod';

const emergencyPatterns = [
  ['self_harm', /(tự tử|tự sát|muốn chết|không muốn sống|chết cho rồi|kết thúc cuộc sống|cắt tay|tự hại|nhảy lầu|uống thuốc.*(?:để chết|quá liều))/i],
  ['immediate_violence', /(bóp cổ|đe dọa giết|hăm dọa tính mạng|đánh.*chảy máu|đánh.*nhập viện|cầm dao|cầm súng|nhốt.*không cho ăn|bỏ đói)/i],
  ['sexual_abuse', /(xâm hại|ép quan hệ|cưỡng hiếp|sờ mó.*không đồng ý|lạm dụng tình dục)/i],
  ['unsafe_home', /(đuổi khỏi nhà.*(?:đêm|tối)|không có chỗ.*an toàn|sợ.*về nhà vì.*đánh)/i]
];

const supportPatterns = [
  ['distress', /(quá bế tắc|không còn đường lui|hoảng loạn|khóc suốt đêm|cô độc|kiệt sức)/i],
  ['fear_at_home', /(sợ về nhà|sợ bố|sợ mẹ|thường xuyên bị đánh|bị đe dọa)/i],
  ['breathing_distress', /(không thở được|ngạt thở|run rẩy)/i]
];

export function checkSafety(text) {
  const emergency = emergencyPatterns.filter(([, pattern]) => pattern.test(text)).map(([reason]) => reason);
  if (emergency.length) return { level: 'urgent', reasons: emergency };
  const support = supportPatterns.filter(([, pattern]) => pattern.test(text)).map(([reason]) => reason);
  return { level: support.length ? 'needs_support' : 'normal', reasons: support };
}

export function redactPersonalData(text) {
  return text
    .replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, '[EMAIL]')
    .replace(/(?<!\d)(?:\+?84|0)(?:[ .-]?\d){9,10}(?!\d)/g, '[SỐ ĐIỆN THOẠI]')
    .replace(/(?:facebook|zalo|instagram|tiktok)\s*[:：]?\s*@?[\w.-]{3,}/gi, '[TÀI KHOẢN MẠNG XÃ HỘI]');
}

const reviewWordSchema = z.object({
  word: z.string().min(1).max(80),
  type: z.enum(['tuyệt_đối', 'gán_nhãn', 'cảm_tính', 'khái_niệm_nặng']),
  reason: z.string().min(1).max(500),
  alternativeSuggestion: z.string().max(500).optional()
});

export const reflectionSchema = z.object({
  whatWeHeard: z.string().min(1).max(1000),
  factsVsInterpretation: z.object({
    facts: z.string().min(1).max(1000),
    interpretation: z.string().min(1).max(1000),
    guidance: z.string().min(1).max(700)
  }),
  wordsToReview: z.array(reviewWordSchema).max(3),
  clarificationQuestion: z.string().min(1).max(500),
  alternativePerspectives: z.array(z.string().min(1).max(700)).min(1).max(2),
  underlyingNeeds: z.array(z.object({
    id: z.string().min(1).max(40),
    label: z.string().min(1).max(160),
    selected: z.boolean()
  })).min(1).max(6),
  dialogueDrafts: z.object({
    standard: z.string().min(1).max(1000),
    shorter: z.string().min(1).max(500),
    gentler: z.string().min(1).max(1000),
    direct: z.string().min(1).max(1000)
  })
});

export const requestSchema = z.object({
  rawText: z.string().trim().min(10).max(5000),
  selectedEmotions: z.array(z.string().trim().min(1).max(50)).max(3).default([])
});

export const chatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().trim().min(1).max(2000)
  })).min(1).max(12),
  supportMode: z.enum(['listen', 'understand', 'advice', 'prepare', 'calm'])
});

export const chatResponseSchema = z.object({
  acknowledgement: z.string().min(1).max(800),
  reflection: z.string().max(500).optional(),
  question: z.string().max(400).optional(),
  quickReplies: z.array(z.string().min(1).max(120)).max(4).optional().default([]),
  advice: z.array(z.object({
    title: z.string().min(1).max(140),
    explanation: z.string().min(1).max(500),
    firstStep: z.string().min(1).max(400),
    caution: z.string().max(300).optional()
  })).max(3).optional().default([]),
  riskLevel: z.enum(['normal', 'needs_support', 'urgent']).optional().default('normal')
});

export function normalizeChatResponse(value, riskLevel = 'normal') {
  const parsed = chatResponseSchema.parse(value);
  return {
    acknowledgement: compactText(parsed.acknowledgement, 320),
    reflection: parsed.reflection ? compactText(parsed.reflection, 240) : undefined,
    question: parsed.question ? compactText(parsed.question, 220) : undefined,
    quickReplies: parsed.quickReplies.slice(0, 4).map((item) => compactText(item, 80)),
    advice: parsed.advice.slice(0, 3).map((advice) => ({
      title: compactText(advice.title, 100),
      explanation: compactText(advice.explanation, 260),
      firstStep: compactText(advice.firstStep, 220),
      caution: advice.caution ? compactText(advice.caution, 180) : undefined
    })),
    riskLevel: riskLevel === 'normal' ? parsed.riskLevel : riskLevel
  };
}

export const chatResponseJsonSchema = {
  type: 'object', additionalProperties: false,
  required: ['acknowledgement', 'reflection', 'question', 'quickReplies', 'advice', 'riskLevel'],
  properties: {
    acknowledgement: { type: 'string' }, reflection: { type: 'string' }, question: { type: 'string' },
    quickReplies: { type: 'array', maxItems: 4, items: { type: 'string' } },
    advice: {
      type: 'array', maxItems: 3,
      items: {
        type: 'object', additionalProperties: false,
        required: ['title', 'explanation', 'firstStep'],
        properties: {
          title: { type: 'string' }, explanation: { type: 'string' }, firstStep: { type: 'string' }, caution: { type: 'string' }
        }
      }
    },
    riskLevel: { type: 'string', enum: ['normal', 'needs_support', 'urgent'] }
  }
};

export function normalizeReflection(value, needsSupport = false) {
  const parsed = reflectionSchema.parse(value);
  return {
    ...parsed,
    whatWeHeard: compactText(parsed.whatWeHeard, 360),
    factsVsInterpretation: {
      facts: compactText(parsed.factsVsInterpretation.facts, 240),
      interpretation: compactText(parsed.factsVsInterpretation.interpretation, 240),
      guidance: compactText(parsed.factsVsInterpretation.guidance, 260)
    },
    supportNotice: needsSupport
      ? 'Điều bạn chia sẻ cho thấy bạn đang chịu nhiều áp lực. Nếu có thể, hãy cân nhắc nói với một người lớn an toàn hoặc người bạn tin tưởng.'
      : undefined,
    wordsToReview: parsed.wordsToReview.map((word) => ({
      ...word,
      reason: compactText(word.reason, 220),
      alternativeSuggestion: word.alternativeSuggestion ? compactText(word.alternativeSuggestion, 220) : undefined,
      dismissed: false
    })),
    clarificationQuestion: compactText(parsed.clarificationQuestion, 220),
    alternativePerspectives: parsed.alternativePerspectives.map((item) => compactText(item, 280)),
    underlyingNeeds: parsed.underlyingNeeds.map((need) => ({ ...need, label: compactText(need.label, 100) })),
    dialogueDrafts: {
      standard: compactText(parsed.dialogueDrafts.standard, 360),
      shorter: compactText(parsed.dialogueDrafts.shorter, 180),
      gentler: compactText(parsed.dialogueDrafts.gentler, 360),
      direct: compactText(parsed.dialogueDrafts.direct, 360)
    }
  };
}

function compactText(text, maxLength) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  const chunk = clean.slice(0, maxLength);
  const sentenceEnd = Math.max(chunk.lastIndexOf('.'), chunk.lastIndexOf('!'), chunk.lastIndexOf('?'));
  const cutAt = sentenceEnd >= Math.floor(maxLength * 0.6) ? sentenceEnd + 1 : chunk.lastIndexOf(' ');
  return `${chunk.slice(0, Math.max(cutAt, 1)).trim()}…`;
}

export const responseJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['whatWeHeard', 'factsVsInterpretation', 'wordsToReview', 'clarificationQuestion', 'alternativePerspectives', 'underlyingNeeds', 'dialogueDrafts'],
  properties: {
    whatWeHeard: { type: 'string' },
    factsVsInterpretation: {
      type: 'object', additionalProperties: false,
      required: ['facts', 'interpretation', 'guidance'],
      properties: { facts: { type: 'string' }, interpretation: { type: 'string' }, guidance: { type: 'string' } }
    },
    wordsToReview: {
      type: 'array', maxItems: 3,
      items: {
        type: 'object', additionalProperties: false,
        required: ['word', 'type', 'reason', 'alternativeSuggestion'],
        properties: {
          word: { type: 'string' },
          type: { type: 'string', enum: ['tuyệt_đối', 'gán_nhãn', 'cảm_tính', 'khái_niệm_nặng'] },
          reason: { type: 'string' }, alternativeSuggestion: { type: 'string' }
        }
      }
    },
    clarificationQuestion: { type: 'string' },
    alternativePerspectives: { type: 'array', minItems: 1, maxItems: 2, items: { type: 'string' } },
    underlyingNeeds: {
      type: 'array', minItems: 1, maxItems: 6,
      items: {
        type: 'object', additionalProperties: false,
        required: ['id', 'label', 'selected'],
        properties: { id: { type: 'string' }, label: { type: 'string' }, selected: { type: 'boolean' } }
      }
    },
    dialogueDrafts: {
      type: 'object', additionalProperties: false,
      required: ['standard', 'shorter', 'gentler', 'direct'],
      properties: {
        standard: { type: 'string' }, shorter: { type: 'string' }, gentler: { type: 'string' }, direct: { type: 'string' }
      }
    }
  }
};
