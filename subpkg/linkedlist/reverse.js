const meta = {
  id: 'reverse-linked-list',
  name: '反转链表',
  nameEn: 'Reverse Linked List',
  difficulty: 'easy',
  category: 'linkedlist',
  tags: ['链表', '指针'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  description: '使用三个指针（prev, curr, next）迭代反转链表，逐个改变节点的指向。',
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
  let headIdx = startIdx;

  // Step 1: Initialize
  let prevIdx = null;
  let currIdx = headIdx;
  yield {
    data: { type: 'linkedlist', value: { head: headIdx, nodes: deepClone(listNodes) } },
    highlights: {
      codeLines: [1, 2],
      nodeIds: [currIdx],
      pointerPositions: [
        { name: 'prev', index: null, color: '#9B59B6' },
        { name: 'curr', index: currIdx, color: '#E64340' },
        { name: 'next', index: null, color: '#3498DB' }
      ]
    },
    variables: { prev: null, curr: listNodes[currIdx]?.val ?? null, next: null },
    description: '初始化三个指针：prev = null, curr = head, next = null'
  };

  // Step 2-6: Iterate through the list
  let stepCount = 0;
  while (currIdx !== null) {
    const nextIdx = listNodes[currIdx].next;
    stepCount++;

    // Show the next pointer assignment
    yield {
      data: { type: 'linkedlist', value: { head: headIdx, nodes: deepClone(listNodes) } },
      highlights: {
        codeLines: [3, 4],
        nodeIds: [currIdx, nextIdx].filter(i => i !== null),
        pointerPositions: [
          { name: 'prev', index: prevIdx, color: '#9B59B6' },
          { name: 'curr', index: currIdx, color: '#E64340' },
          { name: 'next', index: nextIdx, color: '#3498DB' }
        ]
      },
      variables: { prev: prevIdx !== null ? listNodes[prevIdx]?.val : null, curr: listNodes[currIdx]?.val, next: nextIdx !== null ? listNodes[nextIdx]?.val : null },
      description: `第 ${stepCount} 步：保存下一个节点 next = ${nextIdx !== null ? listNodes[nextIdx].val : 'null'}`
    };

    // Reverse the link: curr.next = prev
    listNodes[currIdx].next = prevIdx;

    yield {
      data: { type: 'linkedlist', value: { head: headIdx, nodes: deepClone(listNodes) } },
      highlights: {
        codeLines: [5],
        nodeIds: [currIdx],
        pointerPositions: [
          { name: 'prev', index: prevIdx, color: '#9B59B6' },
          { name: 'curr', index: currIdx, color: '#E64340' },
          { name: 'next', index: nextIdx, color: '#3498DB' }
        ]
      },
      variables: { prev: prevIdx !== null ? listNodes[prevIdx]?.val : null, curr: listNodes[currIdx]?.val, next: nextIdx !== null ? listNodes[nextIdx]?.val : null },
      description: `将 curr.next 指向 prev (${prevIdx !== null ? listNodes[prevIdx].val : 'null'})`
    };

    // Move pointers forward
    prevIdx = currIdx;
    currIdx = nextIdx;

    if (currIdx !== null) {
      yield {
        data: { type: 'linkedlist', value: { head: headIdx, nodes: deepClone(listNodes) } },
        highlights: {
          codeLines: [6, 7],
          nodeIds: [prevIdx, currIdx],
          pointerPositions: [
            { name: 'prev', index: prevIdx, color: '#9B59B6' },
            { name: 'curr', index: currIdx, color: '#E64340' },
            { name: 'next', index: null, color: '#3498DB' }
          ]
        },
        variables: { prev: listNodes[prevIdx]?.val, curr: listNodes[currIdx]?.val, next: null },
        description: '移动指针：prev = curr, curr = next, 继续下一轮循环'
      };
    }
  }

  // Final: new head is prev
  headIdx = prevIdx;
  yield {
    data: { type: 'linkedlist', value: { head: headIdx, nodes: deepClone(listNodes) } },
    highlights: {
      codeLines: [8, 9],
      nodeIds: headIdx !== null ? [headIdx] : [],
      pointerPositions: [
        { name: 'prev', index: prevIdx, color: '#9B59B6' },
        { name: 'curr', index: currIdx, color: '#E64340' },
        { name: 'next', index: null, color: '#3498DB' }
      ]
    },
    variables: { prev: prevIdx !== null ? listNodes[prevIdx]?.val : null, curr: null, next: null },
    description: `链表反转完成！新的头节点为 ${headIdx !== null ? listNodes[headIdx].val : 'null'}`
  };
}

const code = [
  'let prev = null, curr = head, next = null;',
  'while (curr !== null) {',
  '  next = curr.next;',
  '  curr.next = prev;',
  '  prev = curr;',
  '  curr = next;',
  '}',
  'return prev;'
];

module.exports = { meta, steps, code };
