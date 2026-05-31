const meta = {
  id: 'jump-game',
  name: '跳跃游戏',
  nameEn: 'Jump Game',
  difficulty: 'medium',
  category: 'dp',
  tags: ['跳跃游戏', '动态规划', '贪心', '数组'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  description: '跳跃游戏问题：给定一个非负整数数组，最初位于数组的第一个位置。数组中的每个元素代表在该位置可以跳跃的最大长度。判断是否能够到达最后一个位置。可以使用贪心算法维护能够到达的最远位置。',
  defaultInput: {
    type: 'array',
    value: [2, 3, 1, 1, 4],
    label: '数组: [2,3,1,1,4]'
  }
};

function* steps(input) {
  const nums = Array.isArray(input) ? input : input;
  const n = nums.length;
  let maxReach = 0;

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: { dataIndices: [0], sortedIndices: [] },
    variables: { nums: [...nums], n, maxReach, phase: 'init' },
    description: `初始化：从位置0（值=${nums[0]}）开始，最远可达位置=${nums[0]}。`
  };

  for (let i = 0; i < n; i++) {
    if (i > maxReach) {
      yield {
        data: { type: 'array', value: [...nums] },
        highlights: { dataIndices: [i], sortedIndices: [] },
        variables: {
          nums: [...nums], n, i, maxReach,
          reachable: false,
          phase: 'unreachable'
        },
        description: `位置${i}不可达！maxReach=${maxReach} < i=${i}，无法继续前进。`
      };
      break;
    }

    const prevMax = maxReach;
    maxReach = Math.max(maxReach, i + nums[i]);

    yield {
      data: { type: 'array', value: [...nums] },
      highlights: { dataIndices: [i], sortedIndices: Array.from({ length: Math.min(maxReach + 1, n) }, (_, j) => j) },
      variables: {
        nums: [...nums], n, i,
        jumpPower: nums[i],
        prevMaxReach: prevMax,
        maxReach,
        canReachEnd: maxReach >= n - 1,
        phase: 'iterate'
      },
      description: `位置${i}（跳跃力=${nums[i]}）：最远可达位置从${prevMax}更新为${maxReach}${maxReach >= n - 1 ? '，已可到达终点！' : ''}`
    };

    if (maxReach >= n - 1) break;
  }

  const result = maxReach >= n - 1;

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: {
      dataIndices: [],
      sortedIndices: result ? Array.from({ length: n }, (_, i) => i) : []
    },
    variables: {
      nums: [...nums], n,
      maxReach,
      result,
      complete: true
    },
    description: result
      ? `可以到达终点！最远可达位置=${maxReach} >= ${n - 1}。`
      : `无法到达终点！最远只能到达位置${maxReach}。`
  };
}

const code = [
  'function canJump(nums) {',
  '  let maxReach = 0;',
  '',
  '  for (let i = 0; i < nums.length; i++) {',
  '    if (i > maxReach) return false;',
  '    maxReach = Math.max(maxReach, i + nums[i]);',
  '    if (maxReach >= nums.length - 1) return true;',
  '  }',
  '',
  '  return true;',
  '}'
];

module.exports = { meta, steps, code };
