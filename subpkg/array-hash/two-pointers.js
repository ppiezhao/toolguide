const meta = {
  id: 'two-pointers',
  name: '双指针技术',
  nameEn: 'Two Pointers Technique',
  difficulty: 'easy',
  category: 'array-hash',
  tags: ['双指针', '数组', '字符串'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  description: '双指针技术是一种常见的算法技巧，通常用于数组/字符串的遍历。使用两个指针从两端向中间移动，或使用快慢指针。这里演示用双指针验证回文串（忽略非字母数字字符）。',
  defaultInput: {
    type: 'array',
    value: ['race a car'],
    label: '验证回文串: "race a car"'
  }
};

function* steps(input) {
  const s = Array.isArray(input) ? input[0] : 'race a car';
  const clean = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const chars = clean.split('');

  let left = 0, right = chars.length - 1;

  yield {
    data: { type: 'array', value: s.split('') },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: { original: s, clean, chars: [...chars], left, right, phase: 'init' },
    description: `原字符串: "${s}"，清洗后: "${clean}"，长度=${chars.length}。双指针从两端向中间移动。`
  };

  let isPalindrome = true;

  while (left < right) {
    yield {
      data: { type: 'array', value: chars },
      highlights: { dataIndices: [left, right], sortedIndices: [] },
      variables: {
        chars: [...chars],
        clean,
        left, right,
        leftChar: chars[left],
        rightChar: chars[right],
        phase: 'compare'
      },
      description: `比较 chars[${left}]='${chars[left]}' 和 chars[${right}]='${chars[right]}'`
    };

    if (chars[left] !== chars[right]) {
      isPalindrome = false;

      yield {
        data: { type: 'array', value: chars },
        highlights: { dataIndices: [left, right], sortedIndices: [] },
        variables: {
          chars: [...chars],
          clean,
          left, right,
          leftChar: chars[left],
          rightChar: chars[right],
          match: false,
          isPalindrome,
          phase: 'mismatch'
        },
        description: `不匹配！'${chars[left]}' != '${chars[right]}'。字符串不是回文。`
      };
      break;
    }

    yield {
      data: { type: 'array', value: chars },
      highlights: { dataIndices: [left, right], sortedIndices: Array.from({ length: chars.length }, (_, i) => i) },
      variables: {
        chars: [...chars],
        clean,
        left, right,
        leftChar: chars[left],
        rightChar: chars[right],
        match: true,
        phase: 'match'
      },
      description: `匹配！'${chars[left]}' == '${chars[right]}'。左指针右移(${left}->${left + 1})，右指针左移(${right}->${right - 1})。`
    };

    left++;
    right--;
  }

  yield {
    data: { type: 'array', value: chars },
    highlights: { dataIndices: [], sortedIndices: isPalindrome ? Array.from({ length: chars.length }, (_, i) => i) : [] },
    variables: {
      chars: [...chars],
      original: s,
      clean,
      left, right,
      isPalindrome,
      complete: true
    },
    description: isPalindrome
      ? `"${s}" 是回文串（忽略非字母数字后为 "${clean}"）。`
      : `"${s}" 不是回文串。`
  };
}

const code = [
  'function isPalindrome(s) {',
  '  const clean = s.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();',
  '  let left = 0, right = clean.length - 1;',
  '',
  '  while (left < right) {',
  '    if (clean[left] !== clean[right]) return false;',
  '    left++;',
  '    right--;',
  '  }',
  '',
  '  return true;',
  '}'
];

module.exports = { meta, steps, code };
