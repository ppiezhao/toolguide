const meta = {
  id: 'group-anagrams',
  name: '字母异位词分组',
  nameEn: 'Group Anagrams',
  difficulty: 'medium',
  category: 'array-hash',
  tags: ['哈希表', '字符串', '排序', '数组'],
  timeComplexity: 'O(n * k log k)',
  spaceComplexity: 'O(n * k)',
  description: '字母异位词分组问题：给定一个字符串数组，将字母异位词组合在一起。字母异位词指字母相同但排列不同的字符串。将每个字符串排序后的结果作为哈希表的键，将原字符串加入对应的组中。',
  defaultInput: {
    type: 'array',
    value: ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'],
    label: '字符串: ["eat","tea","tan","ate","nat","bat"]'
  }
};

function* steps(input) {
  const strs = ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'];
  const map = {};

  yield {
    data: { type: 'array', value: strs.map(s => `"${s}"`) },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: { strs: [...strs], map: { ...map }, phase: 'init' },
    description: `字符串数组: ["${strs.join('", "')}"]。将每个单词排序后分组。`
  };

  for (let i = 0; i < strs.length; i++) {
    const sorted = strs[i].split('').sort().join('');
    if (!map[sorted]) {
      map[sorted] = [];
    }
    map[sorted].push(strs[i]);

    const groups = Object.entries(map).map(([k, v]) => `"${k}": [${v.map(s => `"${s}"`).join(', ')}]`);

    yield {
      data: { type: 'array', value: strs.map(s => `"${s}"`) },
      highlights: { dataIndices: [i], sortedIndices: [] },
      variables: {
        strs: [...strs],
        map: Object.fromEntries(Object.entries(map).map(([k, v]) => [k, [...v]])),
        i,
        word: strs[i],
        sortedKey: sorted,
        groups,
        phase: 'process'
      },
      description: `"${strs[i]}" 排序后="${sorted}"，加入对应分组。`
    };
  }

  const result = Object.values(map);

  yield {
    data: { type: 'array', value: result.map(g => `[${g.map(s => `"${s}"`).join(',')}]`) },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: {
      strs: [...strs],
      map: Object.fromEntries(Object.entries(map).map(([k, v]) => [k, [...v]])),
      result: result.map(g => [...g]),
      groupCount: result.length,
      complete: true
    },
    description: `分组完成！分为 ${result.length} 组: ${result.map(g => `[${g.join(', ')}]`).join(', ')}`
  };
}

const code = [
  'function groupAnagrams(strs) {',
  '  const map = {};',
  '',
  '  for (const str of strs) {',
  '    const sorted = str.split("").sort().join("");',
  '    if (!map[sorted]) map[sorted] = [];',
  '    map[sorted].push(str);',
  '  }',
  '',
  '  return Object.values(map);',
  '}'
];

module.exports = { meta, steps, code };
