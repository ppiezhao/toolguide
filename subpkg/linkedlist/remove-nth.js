const meta = {
  id: 'remove-nth-from-end',
  name: '删除倒数第N个节点',
  nameEn: 'Remove Nth Node From End of List',
  difficulty: 'medium',
  category: 'linkedlist',
  tags: ['链表', '双指针'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  description: '使用快慢双指针，快指针先走n步，然后两指针同步前进。快指针到达末尾时，慢指针指向待删除节点的前一个节点。',
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
    label: '1 -> 2 -> 3 -> 4 -> 5 -> null, n=2'
  }
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function* steps(input) {
  const { head: startIdx, nodes } = input;
  const listNodes = nodes.map(n => ({ ...n }));
  const n = 2;
  const dummyIdx = listNodes.length;
  // Add dummy node concept - we'll track prev
  let slowIdx = startIdx; // This serves as the node before the one to delete after gap
  let fastIdx = startIdx;
  let prevIdx = null;

  // We can't actually add a real dummy, so we'll track the prev manually

  yield {
    data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
    highlights: {
      codeLines: [1, 2],
      nodeIds: [fastIdx],
      pointerPositions: [
        { name: 'fast', index: fastIdx, color: '#3498DB' },
        { name: 'slow', index: dummyIdx, color: '#E64340' }
      ]
    },
    variables: { n: n, gap: '快指针先走' },
    description: `创建哑节点 dummy，让 fast 先走 ${n} 步`
  };

  // Fast steps forward n times
  for (let i = 0; i < n; i++) {
    fastIdx = listNodes[fastIdx].next;
    yield {
      data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
      highlights: {
        codeLines: [3],
        nodeIds: [fastIdx !== null ? fastIdx : startIdx],
        pointerPositions: [
          { name: 'fast', index: fastIdx, color: '#3498DB' },
          { name: 'slow', index: startIdx, color: '#E64340' }
        ]
      },
      variables: { step: i + 1, fast: fastIdx !== null ? listNodes[fastIdx]?.val : 'null' },
      description: `fast 走第 ${i + 1} 步，到达 ${fastIdx !== null ? listNodes[fastIdx].val : 'null'}`
    };
  }

  // Now move both until fast reaches end
  while (fastIdx !== null) {
    prevIdx = slowIdx;
    slowIdx = listNodes[slowIdx]?.next !== undefined ? listNodes[slowIdx].next : null;
    fastIdx = listNodes[fastIdx].next;

    if (fastIdx !== null) {
      yield {
        data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
        highlights: {
          codeLines: [4, 5],
          nodeIds: [slowIdx],
          pointerPositions: [
            { name: 'fast', index: fastIdx, color: '#3498DB' },
            { name: 'slow', index: slowIdx, color: '#E64340' }
          ]
        },
        variables: { slow: listNodes[slowIdx]?.val, fast: listNodes[fastIdx]?.val },
        description: `同步移动：slow 到 ${listNodes[slowIdx].val}，fast 到 ${listNodes[fastIdx].val}`
      };
    }
  }

  // Remove slow.next
  const removedVal = listNodes[slowIdx]?.val;
  if (prevIdx !== null) {
    listNodes[prevIdx].next = listNodes[slowIdx]?.next ?? null;
  }

  yield {
    data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
    highlights: {
      codeLines: [6, 7],
      nodeIds: [slowIdx],
      pointerPositions: [
        { name: 'slow', index: slowIdx, color: '#E64340' }
      ]
    },
    variables: { removed: removedVal },
    description: `删除节点 ${removedVal}（倒数第 ${n} 个）`
  };

  yield {
    data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
    highlights: {
      codeLines: [8],
      nodeIds: [startIdx],
      pointerPositions: []
    },
    variables: { result: `删除了值为 ${removedVal} 的节点` },
    description: `删除完成！新的链表头为 ${listNodes[startIdx]?.val}`
  };
}

const code = [
  'let dummy = new ListNode(0, head);',
  'let slow = dummy, fast = head;',
  'for (let i = 0; i < n; i++) fast = fast.next;',
  'while (fast !== null) {',
  '  slow = slow.next;',
  '  fast = fast.next;',
  '}',
  'slow.next = slow.next.next;',
  'return dummy.next;'
];

module.exports = { meta, steps, code };
