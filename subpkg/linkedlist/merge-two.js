const meta = {
  id: 'merge-two-sorted-lists',
  name: '合并两个有序链表',
  nameEn: 'Merge Two Sorted Lists',
  difficulty: 'easy',
  category: 'linkedlist',
  tags: ['链表', '归并'],
  timeComplexity: 'O(n+m)',
  spaceComplexity: 'O(1)',
  description: '使用哑节点和双指针，逐个比较两个链表当前节点，将较小的节点接入结果链表。',
  defaultInput: {
    type: 'linkedlist',
    value: {
      head: 0,
      nodes: [
        { val: 1, next: 1 },
        { val: 3, next: 2 },
        { val: 5, next: null },
        { val: 2, next: 4 },
        { val: 4, next: 5 },
        { val: 6, next: null }
      ]
    },
    label: 'list1=[1,3,5], list2=[2,4,6]'
  }
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function* steps(input) {
  const { nodes } = input;
  // list1: indices 0,1,2 (1->3->5), list2: indices 3,4,5 (2->4->6)
  const listNodes = nodes.map(n => ({ ...n }));
  const dummyIdx = listNodes.length; // virtual dummy node index for display
  let list1Idx = 0;
  let list2Idx = 3;

  // Build display nodes with dummy
  const displayNodes = listNodes.map(n => ({ ...n }));

  // Track the current tail of result list
  let tailIdx = dummyIdx;

  yield {
    data: { type: 'linkedlist', value: { head: dummyIdx, nodes: deepClone(displayNodes) } },
    highlights: {
      codeLines: [1, 2],
      nodeIds: [list1Idx, list2Idx],
      pointerPositions: [
        { name: 'p1', index: list1Idx, color: '#E64340' },
        { name: 'p2', index: list2Idx, color: '#3498DB' }
      ]
    },
    variables: { p1: listNodes[list1Idx]?.val, p2: listNodes[list2Idx]?.val, merged: 'dummy -> ' },
    description: '初始化哑节点 dummy 和两个指针 p1, p2，分别指向两个链表头部'
  };

  let stepNum = 0;
  while (list1Idx !== null && list2Idx !== null) {
    stepNum++;

    if (listNodes[list1Idx].val <= listNodes[list2Idx].val) {
      // Append list1 node to result
      yield {
        data: { type: 'linkedlist', value: { head: dummyIdx, nodes: deepClone(displayNodes) } },
        highlights: {
          codeLines: [3, 4],
          nodeIds: [list1Idx],
          pointerPositions: [
            { name: 'p1', index: list1Idx, color: '#E64340' },
            { name: 'p2', index: list2Idx, color: '#3498DB' }
          ]
        },
        variables: { p1: listNodes[list1Idx]?.val, p2: listNodes[list2Idx]?.val, selected: listNodes[list1Idx].val },
        description: `第 ${stepNum} 步：${listNodes[list1Idx].val} <= ${listNodes[list2Idx].val}，选择 p1 的节点 ${listNodes[list1Idx].val}`
      };

      list1Idx = listNodes[list1Idx].next;
    } else {
      yield {
        data: { type: 'linkedlist', value: { head: dummyIdx, nodes: deepClone(displayNodes) } },
        highlights: {
          codeLines: [5, 6],
          nodeIds: [list2Idx],
          pointerPositions: [
            { name: 'p1', index: list1Idx, color: '#E64340' },
            { name: 'p2', index: list2Idx, color: '#3498DB' }
          ]
        },
        variables: { p1: listNodes[list1Idx]?.val, p2: listNodes[list2Idx]?.val, selected: listNodes[list2Idx].val },
        description: `第 ${stepNum} 步：${listNodes[list1Idx].val} > ${listNodes[list2Idx].val}，选择 p2 的节点 ${listNodes[list2Idx].val}`
      };

      list2Idx = listNodes[list2Idx].next;
    }
  }

  // Append remaining
  if (list1Idx !== null) {
    yield {
      data: { type: 'linkedlist', value: { head: dummyIdx, nodes: deepClone(displayNodes) } },
      highlights: {
        codeLines: [7, 8],
        nodeIds: [list1Idx],
        pointerPositions: [
          { name: 'p1', index: list1Idx, color: '#E64340' },
          { name: 'p2', index: null, color: '#3498DB' }
        ]
      },
      variables: { remaining: `list1 剩余节点从 ${listNodes[list1Idx].val} 开始` },
      description: 'list2 已遍历完，将 list1 剩余部分接到结果链表末尾'
    };
  }

  if (list2Idx !== null) {
    yield {
      data: { type: 'linkedlist', value: { head: dummyIdx, nodes: deepClone(displayNodes) } },
      highlights: {
        codeLines: [9, 10],
        nodeIds: [list2Idx],
        pointerPositions: [
          { name: 'p1', index: null, color: '#E64340' },
          { name: 'p2', index: list2Idx, color: '#3498DB' }
        ]
      },
      variables: { remaining: `list2 剩余节点从 ${listNodes[list2Idx].val} 开始` },
      description: 'list1 已遍历完，将 list2 剩余部分接到结果链表末尾'
    };
  }

  yield {
    data: { type: 'linkedlist', value: { head: dummyIdx, nodes: deepClone(displayNodes) } },
    highlights: {
      codeLines: [11],
      nodeIds: [],
      pointerPositions: []
    },
    variables: { result: 'dummy.next 即为合并后链表头' },
    description: '合并完成！返回 dummy.next 作为新链表的头节点'
  };
}

const code = [
  'let dummy = new ListNode(0);',
  'let p1 = list1, p2 = list2, tail = dummy;',
  'while (p1 !== null && p2 !== null) {',
  '  if (p1.val <= p2.val) { tail.next = p1; p1 = p1.next; }',
  '  else { tail.next = p2; p2 = p2.next; }',
  '  tail = tail.next;',
  '}',
  'if (p1 !== null) tail.next = p1;',
  'if (p2 !== null) tail.next = p2;',
  'return dummy.next;'
];

module.exports = { meta, steps, code };
