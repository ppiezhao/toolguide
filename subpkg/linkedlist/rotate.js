const meta = {
  id: 'rotate-list',
  name: '旋转链表',
  nameEn: 'Rotate List',
  difficulty: 'medium',
  category: 'linkedlist',
  tags: ['链表', '旋转'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  description: '给定一个链表，将链表向右旋转 k 个位置。先计算链表长度，将尾节点与头节点相连成环，然后在适当位置断开。',
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
    label: '1 -> 2 -> 3 -> 4 -> 5 -> null, k=2'
  }
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function* steps(input) {
  const { head: startIdx, nodes } = input;
  const listNodes = nodes.map(n => ({ ...n }));
  const k = 2;

  // Step 1: Find length
  let length = 0;
  let currIdx = startIdx;
  let tailIdx = null;

  yield {
    data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
    highlights: {
      codeLines: [1],
      nodeIds: [currIdx],
      pointerPositions: [
        { name: 'curr', index: currIdx, color: '#E64340' }
      ]
    },
    variables: { phase: '计算长度', length: 0 },
    description: '第一阶段：遍历链表计算长度'
  };

  while (currIdx !== null) {
    length++;
    tailIdx = currIdx;
    currIdx = listNodes[currIdx].next;

    if (currIdx !== null) {
      yield {
        data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
        highlights: {
          codeLines: [2],
          nodeIds: [currIdx],
          pointerPositions: [
            { name: 'curr', index: currIdx, color: '#E64340' }
          ]
        },
        variables: { phase: '计算长度', length, current: listNodes[currIdx]?.val },
        description: `遍历到节点 ${listNodes[currIdx].val}，当前长度 = ${length}`
      };
    }
  }

  yield {
    data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
    highlights: {
      codeLines: [3],
      nodeIds: [tailIdx],
      pointerPositions: [
        { name: 'tail', index: tailIdx, color: '#9B59B6' }
      ]
    },
    variables: { phase: '计算长度', length, tail: listNodes[tailIdx].val },
    description: `链表长度 = ${length}，尾节点 = ${listNodes[tailIdx].val}`
  };

  // Step 2: Connect tail to head to form a circle
  const effectiveK = k % length;
  if (effectiveK === 0) {
    yield {
      data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
      highlights: {
        codeLines: [8],
        nodeIds: [startIdx],
        pointerPositions: []
      },
      variables: { result: 'k 是长度的倍数，无需旋转' },
      description: `k = ${k} 是链表长度的倍数，无需旋转`
    };
    return;
  }

  listNodes[tailIdx].next = startIdx;

  yield {
    data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
    highlights: {
      codeLines: [4],
      nodeIds: [tailIdx, startIdx],
      pointerPositions: [
        { name: 'tail', index: tailIdx, color: '#9B59B6' }
      ]
    },
    variables: { phase: '成环', tail: listNodes[tailIdx].val, head: listNodes[startIdx].val },
    description: '将尾节点连接到头节点，形成环'
  };

  // Step 3: Find new tail and new head
  const stepsToMove = length - effectiveK;
  let newTailIdx = startIdx;
  for (let i = 1; i < stepsToMove; i++) {
    newTailIdx = listNodes[newTailIdx].next;
  }
  const newHeadIdx = listNodes[newTailIdx].next;

  yield {
    data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
    highlights: {
      codeLines: [5, 6],
      nodeIds: [newTailIdx, newHeadIdx],
      pointerPositions: [
        { name: 'newTail', index: newTailIdx, color: '#E64340' },
        { name: 'newHead', index: newHeadIdx, color: '#3498DB' }
      ]
    },
    variables: { phase: '找断点', newTail: listNodes[newTailIdx].val, newHead: listNodes[newHeadIdx].val },
    description: `新尾节点 = ${listNodes[newTailIdx].val}，新头节点 = ${listNodes[newHeadIdx].val}`
  };

  // Step 4: Break the circle
  listNodes[newTailIdx].next = null;

  yield {
    data: { type: 'linkedlist', value: { head: newHeadIdx, nodes: deepClone(listNodes) } },
    highlights: {
      codeLines: [7],
      nodeIds: [newTailIdx, newHeadIdx],
      pointerPositions: [
        { name: 'newTail', index: newTailIdx, color: '#E64340' },
        { name: 'newHead', index: newHeadIdx, color: '#3498DB' }
      ]
    },
    variables: { phase: '断开环' },
    description: `断开环，新链表头为 ${listNodes[newHeadIdx].val}`
  };

  yield {
    data: { type: 'linkedlist', value: { head: newHeadIdx, nodes: deepClone(listNodes) } },
    highlights: {
      codeLines: [8],
      nodeIds: [newHeadIdx],
      pointerPositions: []
    },
    variables: { result: `${listNodes[newHeadIdx].val}` },
    description: `旋转完成！新链表：头节点为 ${listNodes[newHeadIdx].val}`
  };
}

const code = [
  'let len = 0, curr = head;',
  'while (curr !== null) { len++; curr = curr.next; }',
  'let k = k % len; if (k === 0) return head;',
  'let tail = head; while (tail.next !== null) tail = tail.next;',
  'tail.next = head; // 成环',
  'let steps = len - k;',
  'let newTail = head; for (let i = 1; i < steps; i++) newTail = newTail.next;',
  'let newHead = newTail.next;',
  'newTail.next = null; // 断开',
  'return newHead;'
];

module.exports = { meta, steps, code };
