/**
 * 侏儒排序 - Gnome Sort (Stupid Sort)
 *
 * 类似插入排序但通过一系列交换将元素移到正确位置。
 * 时间复杂度: O(n²)  空间复杂度: O(1)  稳定排序
 */

const meta = {
  id: 'gnome-sort',
  name: '侏儒排序',
  nameEn: 'Gnome Sort',
  difficulty: 'easy',
  category: 'sorting',
  tags: ['排序', '交换', '简单', '插入'],
  timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
  spaceComplexity: 'O(1)',
  stable: true,

  description:
    '侏儒排序（Gnome Sort），又称愚蠢排序（Stupid Sort），' +
    '是一种简单的排序算法。其工作原理类似于插入排序，' +
    '但通过一系列相邻元素的交换将元素移动到正确的位置。\n\n' +
    '算法过程：从索引 0 开始，如果当前元素大于等于前一个元素，' +
    '则前进一位；否则交换这两个元素并后退一位。' +
    '当到达数组末尾时排序完成。',

  defaultInput: {
    type: 'array',
    value: [64, 34, 25, 12, 22, 11, 90],
    label: '待排序数组'
  }
};

function* steps(input) {
  const arr = [...input.value];
  const n = arr.length;

  // 初始状态
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [0, 1], dataIndices: [] },
    variables: { pos: 0, n },
    description: `开始侏儒排序，数组长度为 ${n}，arr = [${arr.join(', ')}]`
  };

  let pos = 0;
  let stepCounter = 0;

  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [2], dataIndices: [0] },
    variables: { pos, n, step: stepCounter },
    description: `从索引 pos=0 开始`
  };

  while (pos < n) {
    if (pos === 0) {
      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [3, 4], dataIndices: [pos] },
        variables: { pos, n, step: stepCounter },
        description: `pos=${pos}，已到数组起点，前进到 pos=1`
      };

      pos++;
    } else {
      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [6], dataIndices: [pos], compareIndices: [pos - 1, pos] },
        variables: { pos, n, step: stepCounter },
        description: `比较 arr[${pos - 1}]=${arr[pos - 1]} 和 arr[${pos}]=${arr[pos]}`
      };

      if (arr[pos - 1] <= arr[pos]) {
        pos++;

        yield {
          data: { type: 'array', value: [...arr] },
          highlights: { codeLines: [11], dataIndices: [pos] },
          variables: { pos, n, step: stepCounter },
          description: `arr[${pos - 2}] ≤ arr[${pos - 1}]，顺序正确，前进到 pos=${pos}`
        };
      } else {
        [arr[pos - 1], arr[pos]] = [arr[pos], arr[pos - 1]];

        yield {
          data: { type: 'array', value: [...arr] },
          highlights: { codeLines: [7, 8], dataIndices: [], swapIndices: [pos - 1, pos] },
          variables: { pos, n, step: stepCounter },
          description: `顺序错误！交换 arr[${pos - 1}] 和 arr[${pos}] —— ${arr[pos]} ↔ ${arr[pos - 1]}，后退到 pos=${pos - 1}`
        };

        pos--;
      }
    }

    stepCounter++;

    // 每若干步标记当前已排序的前缀
    if (stepCounter % 3 === 0) {
      const sortedPrefix = [];
      for (let k = 0; k < pos; k++) sortedPrefix.push(k);

      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [6], dataIndices: [pos], sortedIndices: sortedPrefix },
        variables: { pos, n, step: stepCounter },
        description: `当前状态，已检查前缀：[${arr.slice(0, pos).join(', ')}]`
      };
    }
  }

  // 最终状态
  const allSorted = arr.map((_, idx) => idx);
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [13], dataIndices: [], sortedIndices: allSorted },
    variables: { pos: n, n, step: stepCounter },
    description: `排序完成！最终结果：[${arr.join(', ')}]`
  };
}

const code = [
  'function gnomeSort(arr) {',
  '  const n = arr.length;',
  '  let pos = 0;',
  '  while (pos < n) {',
  '    if (pos === 0) {',
  '      pos++;',
  '    } else if (arr[pos - 1] <= arr[pos]) {',
  '      pos++;',
  '    } else {',
  '      [arr[pos - 1], arr[pos]] = [arr[pos], arr[pos - 1]];',
  '      pos--;',
  '    }',
  '  }',
  '  return arr;',
  '}'
];

module.exports = { meta, steps, code };
