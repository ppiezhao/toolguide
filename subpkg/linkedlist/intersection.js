const meta = {
  id: 'intersection-of-two-linked-lists',
  name: '链表交点',
  nameEn: 'Intersection of Two Linked Lists',
  difficulty: 'medium',
  category: 'linkedlist',
  tags: ['链表', '双指针'],
  timeComplexity: 'O(n+m)',
  spaceComplexity: 'O(1)',
  description: '两个指针分别从两个链表头出发，当某个指针到达末尾时，重定向到另一个链表的头部。若相交，指针会在交点相遇。',
  defaultInput: {
    type: 'linkedlist',
    value: {
      head: 0,
      nodes: [
        { val: 4, next: 1 },
        { val: 1, next: 4 },
        { val: 8, next: 5 },
        { val: 4, next: 6 },
        { val: 5, next: null },
        { val: 5, next: 4 },
        { val: 0, next: 1 },
        { val: 1, next: 4 }
      ]
    },
    label: 'A: 4->1->8->4->5, B: 5->0->1->8->4->5 (交点在8)'
  }
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function* steps(input) {
  const { head: startA, nodes } = input;
  const listNodes = nodes.map(n => ({ ...n }));
  const startB = 5; // head of list B

  // A: 0-1-4-5-6 (4->1->8->4->5)
  // B: 7-6-4-5-6 (5->0->1->8->4->5)
  // Intersection at node val=8, index=4

  let pAIdx = startA;
  let pBIdx = startB;
  let stepNum = 0;
  let swappedA = false;
  let swappedB = false;

  yield {
    data: { type: 'linkedlist', value: { head: startA, nodes: deepClone(listNodes) } },
    highlights: {
      codeLines: [1, 2],
      nodeIds: [pAIdx, pBIdx],
      pointerPositions: [
        { name: 'pA', index: pAIdx, color: '#E64340' },
        { name: 'pB', index: pBIdx, color: '#3498DB' }
      ]
    },
    variables: { pA: listNodes[pAIdx]?.val, pB: listNodes[pBIdx]?.val },
    description: '初始化两个指针 pA 和 pB，分别指向两个链表头部'
  };

  while (pAIdx !== pBIdx) {
    stepNum++;

    if (pAIdx === null) {
      pAIdx = startB;
      swappedA = true;
      yield {
        data: { type: 'linkedlist', value: { head: startA, nodes: deepClone(listNodes) } },
        highlights: {
          codeLines: [3, 4],
          nodeIds: [pAIdx],
          pointerPositions: [
            { name: 'pA', index: pAIdx, color: '#E64340' },
            { name: 'pB', index: pBIdx, color: '#3498DB' }
          ]
        },
        variables: { pA: '从 B 开始', pB: pBIdx !== null ? listNodes[pBIdx]?.val : null },
        description: 'pA 到达末尾，重定向到 B 链表的头部'
      };
    } else if (pBIdx === null) {
      pBIdx = startA;
      swappedB = true;
      yield {
        data: { type: 'linkedlist', value: { head: startA, nodes: deepClone(listNodes) } },
        highlights: {
          codeLines: [5, 6],
          nodeIds: [pBIdx],
          pointerPositions: [
            { name: 'pA', index: pAIdx, color: '#E64340' },
            { name: 'pB', index: pBIdx, color: '#3498DB' }
          ]
        },
        variables: { pA: listNodes[pAIdx]?.val, pB: '从 A 开始' },
        description: 'pB 到达末尾，重定向到 A 链表的头部'
      };
    } else {
      pAIdx = listNodes[pAIdx].next;
      pBIdx = listNodes[pBIdx].next;

      if (pAIdx !== null && pBIdx !== null) {
        yield {
          data: { type: 'linkedlist', value: { head: startA, nodes: deepClone(listNodes) } },
          highlights: {
            codeLines: [7],
            nodeIds: [pAIdx, pBIdx],
            pointerPositions: [
              { name: 'pA', index: pAIdx, color: '#E64340' },
              { name: 'pB', index: pBIdx, color: '#3498DB' }
            ]
          },
          variables: { pA: listNodes[pAIdx]?.val, pB: listNodes[pBIdx]?.val },
          description: `第 ${stepNum} 步：pA 到 ${listNodes[pAIdx].val}，pB 到 ${listNodes[pBIdx].val}`
        };
      }
    }

    // Check again after moves
    if (pAIdx !== null && pBIdx !== null && pAIdx === pBIdx) {
      break;
    }
  }

  if (pAIdx !== null && pBIdx !== null) {
    yield {
      data: { type: 'linkedlist', value: { head: startA, nodes: deepClone(listNodes) } },
      highlights: {
        codeLines: [8],
        nodeIds: [pAIdx],
        pointerPositions: [
          { name: 'pA', index: pAIdx, color: '#E64340' },
          { name: 'pB', index: pBIdx, color: '#3498DB' }
        ]
      },
      variables: { intersection: listNodes[pAIdx]?.val },
      description: `链表在节点 ${listNodes[pAIdx].val} 处相交！`
    };
  } else {
    yield {
      data: { type: 'linkedlist', value: { head: startA, nodes: deepClone(listNodes) } },
      highlights: {
        codeLines: [8],
        nodeIds: [],
        pointerPositions: []
      },
      variables: { intersection: 'null' },
      description: '两个链表不相交'
    };
  }
}

const code = [
  'let pA = headA, pB = headB;',
  'while (pA !== pB) {',
  '  pA = pA === null ? headB : pA.next;',
  '  pB = pB === null ? headA : pB.next;',
  '}',
  'return pA;'
];

module.exports = { meta, steps, code };
