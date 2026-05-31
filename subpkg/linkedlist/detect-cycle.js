const meta = {
  id: 'detect-cycle',
  name: '检测环',
  nameEn: 'Linked List Cycle Detection',
  difficulty: 'medium',
  category: 'linkedlist',
  tags: ['链表', '快慢指针', 'Floyd'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  description: '使用Floyd判圈算法（快慢指针），快指针每次走两步，慢指针每次走一步，若相遇则有环。',
  defaultInput: {
    type: 'linkedlist',
    value: {
      head: 0,
      nodes: [
        { val: 3, next: 1 },
        { val: 2, next: 2 },
        { val: 0, next: 3 },
        { val: -4, next: 1 }
      ]
    },
    label: '3 -> 2 -> 0 -> -4 -> (回到2, 环入口在2)'
  }
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function* steps(input) {
  const { head: startIdx, nodes } = input;
  const listNodes = nodes.map(n => ({ ...n }));
  const nodeCount = listNodes.length;

  // Step 1: Initialize pointers
  let slowIdx = startIdx;
  let fastIdx = startIdx;
  let hasCycle = false;
  let stepNum = 0;

  yield {
    data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
    highlights: {
      codeLines: [1, 2],
      nodeIds: [0],
      pointerPositions: [
        { name: 'slow', index: slowIdx, color: '#E64340' },
        { name: 'fast', index: fastIdx, color: '#3498DB' }
      ]
    },
    variables: { slow: listNodes[slowIdx]?.val, fast: listNodes[fastIdx]?.val, cycle: '检测中' },
    description: '初始化快慢指针，都指向头节点'
  };

  // Step 2-7: Traverse
  while (fastIdx !== null && listNodes[fastIdx].next !== null) {
    slowIdx = listNodes[slowIdx].next;
    fastIdx = listNodes[fastIdx].next !== null ? listNodes[listNodes[fastIdx].next].next : null;
    stepNum++;

    // Mark visited nodes
    const visitedNodes = [];
    let v = startIdx;
    for (let i = 0; i < stepNum && v !== null; i++) {
      visitedNodes.push(v);
      v = listNodes[v]?.next;
      if (v === startIdx && i > 0) break;
    }

    if (fastIdx === null) {
      yield {
        data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
        highlights: {
          codeLines: [3, 4],
          nodeIds: [slowIdx],
          pointerPositions: [
            { name: 'slow', index: slowIdx, color: '#E64340' },
            { name: 'fast', index: null, color: '#3498DB' }
          ]
        },
        variables: { slow: listNodes[slowIdx]?.val, fast: null, cycle: '无环' },
        description: '快指针到达末尾，链表无环'
      };
      break;
    }

    if (fastIdx === slowIdx) {
      hasCycle = true;
      yield {
        data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
        highlights: {
          codeLines: [5, 6],
          nodeIds: [slowIdx],
          pointerPositions: [
            { name: 'slow', index: slowIdx, color: '#E64340' },
            { name: 'fast', index: fastIdx, color: '#3498DB' }
          ]
        },
        variables: { slow: listNodes[slowIdx]?.val, fast: listNodes[fastIdx]?.val, cycle: '有环！' },
        description: `第 ${stepNum} 步：快慢指针相遇在节点 ${listNodes[slowIdx].val}，链表有环！`
      };
      break;
    }

    yield {
      data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
      highlights: {
        codeLines: [3, 4],
        nodeIds: [slowIdx, fastIdx],
        pointerPositions: [
          { name: 'slow', index: slowIdx, color: '#E64340' },
          { name: 'fast', index: fastIdx, color: '#3498DB' }
        ]
      },
      variables: { slow: listNodes[slowIdx]?.val, fast: listNodes[fastIdx]?.val, cycle: '检测中' },
      description: `第 ${stepNum} 步：慢指针到 ${listNodes[slowIdx].val}，快指针到 ${listNodes[fastIdx].val}`
    };
  }

  if (!hasCycle && fastIdx === null) {
    // No cycle
  }

  // Find cycle entry if has cycle
  if (hasCycle) {
    slowIdx = startIdx;
    yield {
      data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
      highlights: {
        codeLines: [7, 8, 9],
        nodeIds: [slowIdx],
        pointerPositions: [
          { name: 'slow', index: slowIdx, color: '#E64340' },
          { name: 'fast', index: fastIdx, color: '#3498DB' }
        ]
      },
      variables: { slow: listNodes[slowIdx]?.val, fast: listNodes[fastIdx]?.val, cycle: '找入口' },
      description: '将慢指针移回头节点，快慢指针同步前进，相遇点即为环入口'
    };

    let entryStep = 0;
    while (slowIdx !== fastIdx) {
      slowIdx = listNodes[slowIdx].next;
      fastIdx = listNodes[fastIdx].next;
      entryStep++;

      yield {
        data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
        highlights: {
          codeLines: [8],
          nodeIds: [slowIdx, fastIdx],
          pointerPositions: [
            { name: 'slow', index: slowIdx, color: '#E64340' },
            { name: 'fast', index: fastIdx, color: '#3498DB' }
          ]
        },
        variables: { slow: listNodes[slowIdx]?.val, fast: listNodes[fastIdx]?.val, cycle: '找入口' },
        description: `同步前进步 ${entryStep}：slow 到 ${listNodes[slowIdx].val}，fast 到 ${listNodes[fastIdx].val}`
      };
    }

    yield {
      data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
      highlights: {
        codeLines: [10],
        nodeIds: [slowIdx],
        pointerPositions: [
          { name: 'slow', index: slowIdx, color: '#E64340' },
          { name: 'fast', index: fastIdx, color: '#3498DB' }
        ]
      },
      variables: { slow: listNodes[slowIdx]?.val, fast: listNodes[fastIdx]?.val, cycle: `入口在${listNodes[slowIdx].val}` },
      description: `环的入口节点为 ${listNodes[slowIdx].val}`
    };
  }
}

const code = [
  'let slow = head, fast = head;',
  'while (fast !== null && fast.next !== null) {',
  '  slow = slow.next;',
  '  fast = fast.next.next;',
  '  if (slow === fast) {',
  '    return true; // 有环',
  '  }',
  '}',
  'return false; // 无环'
];

module.exports = { meta, steps, code };
