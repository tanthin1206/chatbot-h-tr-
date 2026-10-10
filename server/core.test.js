import test from 'node:test';
import assert from 'node:assert/strict';
import { checkSafety, normalizeChatResponse, normalizeReflection, redactPersonalData } from './core.js';

test('detects urgent self-harm language', () => {
  assert.equal(checkSafety('Mình không muốn sống nữa').level, 'urgent');
});

test('detects support-needed language', () => {
  assert.equal(checkSafety('Mình quá bế tắc và sợ về nhà').level, 'needs_support');
});

test('leaves ordinary conflict in the normal path', () => {
  assert.equal(checkSafety('Bố mẹ không cho mình đi chơi cuối tuần').level, 'normal');
});

test('redacts email, phone number and social handle', () => {
  const output = redactPersonalData('Mail a.b@example.com, gọi 0912 345 678, zalo: minh.nguyen');
  assert.equal(output.includes('a.b@example.com'), false);
  assert.equal(output.includes('0912 345 678'), false);
  assert.equal(output.includes('minh.nguyen'), false);
});

test('validates and normalizes a structured Gemini response', () => {
  const result = normalizeReflection({
    whatWeHeard: 'Bạn đang cảm thấy không được lắng nghe.',
    factsVsInterpretation: {
      facts: 'Một quyết định đã được đưa ra.',
      interpretation: 'Bạn cảm thấy ý kiến của mình không quan trọng.',
      guidance: 'Hãy tách điều quan sát được khỏi suy đoán.'
    },
    wordsToReview: [{
      word: 'lúc nào cũng',
      type: 'tuyệt_đối',
      reason: 'Đây là cách diễn đạt tuyệt đối.',
      alternativeSuggestion: 'Nêu một tình huống cụ thể.'
    }],
    clarificationQuestion: 'Điều gì vừa xảy ra?',
    alternativePerspectives: ['Có thể hai bên chưa hiểu nhu cầu của nhau.'],
    underlyingNeeds: [{ id: 'listen', label: 'Được lắng nghe', selected: true }],
    dialogueDrafts: {
      standard: 'Con cảm thấy buồn khi con chưa được hỏi ý kiến.',
      shorter: 'Con muốn được lắng nghe.',
      gentler: 'Con mong mình có thể cùng nói chuyện.',
      direct: 'Con cần được tham gia quyết định.'
    }
  }, true);

  assert.equal(result.wordsToReview[0].dismissed, false);
  assert.match(result.supportNotice, /người lớn an toàn/);
});

test('keeps a chat response concise and actionable', () => {
  const response = normalizeChatResponse({
    acknowledgement: 'Mây đang nghe bạn và hiểu rằng chuyện này đã khiến bạn rất khó chịu.',
    reflection: 'Bạn muốn được lắng nghe trước khi người khác quyết định thay mình.',
    question: 'Điều gì là quan trọng nhất bạn muốn họ hiểu?',
    quickReplies: ['Được lắng nghe', 'Bớt cãi nhau'],
    advice: [{
      title: 'Chọn một việc cụ thể',
      explanation: 'Một sự việc gần nhất sẽ dễ trao đổi hơn toàn bộ mối quan hệ.',
      firstStep: 'Viết một câu bắt đầu bằng “Khi chuyện đó xảy ra…”',
      caution: 'Chỉ trò chuyện khi bạn cảm thấy an toàn.'
    }],
    riskLevel: 'normal'
  });
  assert.equal(response.advice.length, 1);
  assert.equal(response.quickReplies.length, 2);
  assert.equal(response.riskLevel, 'normal');
});
