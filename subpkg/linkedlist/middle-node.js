const meta = {
  id: 'middle-of-linked-list',
  name: '链表中点',
  nameEn: 'Middle of the Linked List',
  difficulty: 'easy',
  category: 'linkedlist',
  tags: ['链表', '快慢指针'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  description: '使用快慢指针找到链表中间节点。快指针每次走两步，慢指针每次走一步，快指针到达末尾时慢指针正好在中间。',
  defaultInput: {
    type: 'linkedlist',
    value: {
      head: 0,
      nodes: [
        { val: 1, next: 1 },
        { val: 2, next: 2 },
        { val: 3, next: 3 },
        { val: 4, next: 4 },
        { val: 5, next: null }
      ]
    },
    label: '1 -> 2 -> 3 -> 4 -> 5 -> null'
  }
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function* steps(input) {
  const { head: startIdx, nodes } = input;
  const listNodes = nodes.map(n => ({ ...n }));
  let slowIdx = startIdx;
  let fastIdx = startIdx;
  let stepNum = 0;

  yield {
    data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
    highlights: {
      codeLines: [1],
      nodeIds: [slowIdx],
      pointerPositions: [
        { name: 'slow', index: slowIdx, color: '#E64340' },
        { name: 'fast', index: fastIdx, color: '#3498DB' }
      ]
    },
    variables: { slow: listNodes[slowIdx]?.val, fast: listNodes[fastIdx]?.val },
    description: '初始化：slow 和 fast 都指向头节点'
  };

  while (fastIdx !== null && listNodes[fastIdx].next !== null) {
    stepNum++;
    slowIdx = listNodes[slowIdx].next;
    fastIdx = listNodes[fastIdx].next !== null ? listNodes[listNodes[fastIdx].next].next : null;

    yield {
      data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
      highlights: {
        codeLines: [2, 3, 4],
        nodeIds: [slowIdx],
        pointerPositions: [
          { name: 'slow', index: slowIdx, color: '#E64340' },
          { name: 'fast', index: fastIdx, color: '#3498DB' }
        ]
      },
      variables: { slow: listNodes[slowIdx]?.val, fast: fastIdx !== null ? listNodes[fastIdx]?.val : null, step: stepNum },
      description: `第 ${stepNum} 步：slow 走到 ${listNodes[slowIdx].val}，fast 走到 ${fastIdx !== null ? listNodes[fastIdx].val : '末尾'}`
    };
  }

  yield {
    data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
    highlights: {
      codeLines: [5],
      nodeIds: [slowIdx],
      pointerPositions: [
        { name: 'slow', index: slowIdx, color: '#E64340' },
        { name: 'fast', index: fastIdx, color: '#3498DB' }
      ]
    },
    variables: { middle: listNodes[slowIdx]?.val },
    description: `中间节点值为 ${listNodes[slowIdx].val}`
  };
}

const code = [
  'let slow = head, fast = head;',
  'while (fast !== null && fast.next !== null) {',
  '  slow = slow.next;',
  '  fast = fast.next.next;',
  '}',
  'return slow;'
];

module.exports = { meta, steps, code };
