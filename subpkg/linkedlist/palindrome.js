const meta = {
  id: 'palindrome-linked-list',
  name: '回文链表',
  nameEn: 'Palindrome Linked List',
  difficulty: 'medium',
  category: 'linkedlist',
  tags: ['链表', '快慢指针', '反转'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  description: '使用快慢指针找中点，反转后半部分链表，然后逐一比较前后两半是否相同。',
  defaultInput: {
    type: 'linkedlist',
    value: {
      head: 0,
      nodes: [
        { val: 1, next: 1 },
        { val: 2, next: 2 },
        { val: 2, next: 3 },
        { val: 1, next: null }
      ]
    },
    label: '1 -> 2 -> 2 -> 1 -> null'
  }
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function* steps(input) {
  const { head: startIdx, nodes } = input;
  const listNodes = nodes.map(n => ({ ...n }));
  const nodeCount = listNodes.length;

  // Step 1: Find middle
  let slowIdx = startIdx;
  let fastIdx = startIdx;
  let stepNum = 0;

  yield {
    data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
    highlights: {
      codeLines: [1, 2],
      nodeIds: [startIdx],
      pointerPositions: [
        { name: 'slow', index: slowIdx, color: '#E64340' },
        { name: 'fast', index: fastIdx, color: '#3498DB' }
      ]
    },
    variables: { phase: '找中点' },
    description: '第一阶段：使用快慢指针找链表中间节点'
  };

  while (fastIdx !== null && listNodes[fastIdx].next !== null) {
    slowIdx = listNodes[slowIdx].next;
    fastIdx = listNodes[fastIdx].next.next !== undefined ? listNodes[listNodes[fastIdx].next].next : null;
    stepNum++;

    yield {
      data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
      highlights: {
        codeLines: [3, 4],
        nodeIds: [slowIdx],
        pointerPositions: [
          { name: 'slow', index: slowIdx, color: '#E64340' },
          { name: 'fast', index: fastIdx, color: '#3498DB' }
        ]
      },
      variables: { phase: '找中点', slow: listNodes[slowIdx]?.val, fast: fastIdx !== null ? listNodes[fastIdx]?.val : null },
      description: `慢指针到 ${listNodes[slowIdx].val}，快指针到 ${fastIdx !== null ? listNodes[fastIdx].val : 'null'}`
    };
  }

  // slow is now at the middle (start of second half)
  const secondHalfIdx = slowIdx;
  yield {
    data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
    highlights: {
      codeLines: [5],
      nodeIds: [secondHalfIdx],
      pointerPositions: [
        { name: 'mid', index: secondHalfIdx, color: '#9B59B6' }
      ]
    },
    variables: { phase: '找中点', middle: listNodes[secondHalfIdx]?.val },
    description: `中点找到！后半部分从节点 ${listNodes[secondHalfIdx].val} 开始`
  };

  // Step 2: Reverse second half
  let prevIdx = null;
  let currIdx = secondHalfIdx;

  yield {
    data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
    highlights: {
      codeLines: [6],
      pointerPositions: [
        { name: 'prev', index: null, color: '#9B59B6' },
        { name: 'curr', index: currIdx, color: '#E64340' }
      ]
    },
    variables: { phase: '反转后半部分' },
    description: '第二阶段：反转后半部分链表'
  };

  while (currIdx !== null) {
    const nextIdx = listNodes[currIdx].next;
    listNodes[currIdx].next = prevIdx;
    prevIdx = currIdx;
    currIdx = nextIdx;
  }

  const reversedHeadIdx = prevIdx;
  yield {
    data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
    highlights: {
      codeLines: [7],
      pointerPositions: [
        { name: 'p1', index: startIdx, color: '#E64340' },
        { name: 'p2', index: reversedHeadIdx, color: '#3498DB' }
      ]
    },
    variables: { phase: '比较前后两半' },
    description: '第三阶段：逐一比较前半部分和反转后的后半部分'
  };

  // Step 3: Compare
  let leftIdx = startIdx;
  let rightIdx = reversedHeadIdx;
  let isPalindrome = true;
  let compareStep = 0;

  while (rightIdx !== null) {
    compareStep++;
    if (listNodes[leftIdx].val !== listNodes[rightIdx].val) {
      isPalindrome = false;
      yield {
        data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
        highlights: {
          codeLines: [8, 9],
          nodeIds: [leftIdx, rightIdx],
          pointerPositions: [
            { name: 'p1', index: leftIdx, color: '#E64340' },
            { name: 'p2', index: rightIdx, color: '#3498DB' }
          ]
        },
        variables: { left: listNodes[leftIdx]?.val, right: listNodes[rightIdx]?.val, match: '否' },
        description: `第 ${compareStep} 轮比较：${listNodes[leftIdx].val} !== ${listNodes[rightIdx].val}，不是回文！`
      };
      break;
    }

    yield {
      data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
      highlights: {
        codeLines: [8],
        nodeIds: [leftIdx, rightIdx],
        pointerPositions: [
          { name: 'p1', index: leftIdx, color: '#E64340' },
          { name: 'p2', index: rightIdx, color: '#3498DB' }
        ]
      },
      variables: { left: listNodes[leftIdx]?.val, right: listNodes[rightIdx]?.val, match: '是' },
      description: `第 ${compareStep} 轮比较：${listNodes[leftIdx].val} === ${listNodes[rightIdx].val}，匹配`
    };

    leftIdx = listNodes[leftIdx].next;
    rightIdx = listNodes[rightIdx].next;
  }

  yield {
    data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
    highlights: {
      codeLines: [10],
      nodeIds: [startIdx],
      pointerPositions: []
    },
    variables: { isPalindrome: isPalindrome ? '是' : '否' },
    description: isPalindrome ? '比较完成！该链表是回文链表！' : '比较完成！该链表不是回文链表。'
  };
}

const code = [
  'let slow = head, fast = head;',
  'while (fast !== null && fast.next !== null) {',
  '  slow = slow.next;',
  '  fast = fast.next.next;',
  '}',
  'let prev = null, curr = slow;',
  'while (curr !== null) { [curr.next, prev, curr] = [prev, curr, curr.next]; }',
  'let left = head, right = prev;',
  'while (right !== null) {',
  '  if (left.val !== right.val) return false;',
  '  left = left.next;',
  '  right = right.next;',
  '}',
  'return true;'
];

module.exports = { meta, steps, code };
