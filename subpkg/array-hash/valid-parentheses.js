const meta = {
  id: 'valid-parentheses',
  name: '有效括号',
  nameEn: 'Valid Parentheses',
  difficulty: 'easy',
  category: 'array-hash',
  tags: ['栈', '字符串', '括号匹配'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)',
  description: '有效括号问题：给定一个只包含 "(", ")", "{", "}", "[", "]" 的字符串，判断字符串是否有效。左括号必须用相同类型的右括号闭合，且必须按正确的顺序闭合。使用栈来解决。',
  defaultInput: {
    type: 'array',
    value: ['()[]{}'],
    label: '括号字符串: "()[]{}"'
  }
};

function* steps(input) {
  const s = Array.isArray(input) ? input[0] : input;
  const stack = [];
  const pairs = { '(': ')', '{': '}', '[': ']' };
  const chars = s.split('');

  yield {
    data: { type: 'array', value: chars },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: { s, stack: [...stack], phase: 'init', chars: chars.join(', ') },
    description: `检查括号字符串 "${s}"，使用栈来匹配。`
  };

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];

    if (ch in pairs) {
      stack.push(ch);

      yield {
        data: { type: 'array', value: chars },
        highlights: { dataIndices: [i], sortedIndices: [] },
        variables: {
          s, i, ch,
          stack: [...stack],
          phase: 'push',
          stackDisplay: stack.join(' ')
        },
        description: `左括号 '${ch}'：压入栈中。栈: [${stack.join(', ')}]`
      };
    } else {
      if (stack.length === 0) {
        yield {
          data: { type: 'array', value: chars },
          highlights: { dataIndices: [i], sortedIndices: [] },
          variables: {
            s, i, ch,
            stack: [...stack],
            phase: 'error_empty',
            error: '栈为空，无法匹配'
          },
          description: `错误！右括号 '${ch}' 但栈为空，无效。`
        };
        break;
      }

      const top = stack.pop();

      if (pairs[top] === ch) {
        yield {
          data: { type: 'array', value: chars },
          highlights: { dataIndices: [i], sortedIndices: [] },
          variables: {
            s, i, ch,
            stack: [...stack],
            phase: 'match',
            top,
            stackDisplay: stack.join(' '),
            matched: `${top}${ch}`
          },
          description: `右括号 '${ch}'：与栈顶 '${top}' 匹配成功。弹出栈顶。栈: [${stack.join(', ')}]`
        };
      } else {
        yield {
          data: { type: 'array', value: chars },
          highlights: { dataIndices: [i], sortedIndices: [] },
          variables: {
            s, i, ch,
            stack: [...stack],
            phase: 'error_mismatch',
            top,
            error: `'${top}' 与 '${ch}' 不匹配`,
            expected: pairs[top]
          },
          description: `错误！栈顶 '${top}' 与 '${ch}' 不匹配，期望的是 '${pairs[top]}'。`
        };
        break;
      }
    }
  }

  const isValid = stack.length === 0;

  yield {
    data: { type: 'array', value: chars },
    highlights: { dataIndices: [], sortedIndices: isValid ? Array.from({ length: s.length }, (_, i) => i) : [] },
    variables: {
      s,
      stack: [...stack],
      isValid,
      complete: true
    },
    description: isValid
      ? `有效括号！"${s}" 中的括号全部正确匹配。`
      : `无效括号！栈中还有 ${stack.length} 个未匹配的左括号: [${stack.join(', ')}]`
  };
}

const code = [
  'function isValid(s) {',
  '  const stack = [];',
  '  const pairs = { "(": ")", "{": "}", "[": "]" };',
  '',
  '  for (const ch of s) {',
  '    if (ch in pairs) {',
  '      stack.push(ch);',
  '    } else {',
  '      if (stack.length === 0) return false;',
  '      const top = stack.pop();',
  '      if (pairs[top] !== ch) return false;',
  '    }',
  '  }',
  '',
  '  return stack.length === 0;',
  '}'
];

module.exports = { meta, steps, code };
