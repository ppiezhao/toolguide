const meta = {
  id: 'remove-duplicates',
  name: '删除重复节点',
  nameEn: 'Remove Duplicates from Sorted List',
  difficulty: 'easy',
  category: 'linkedlist',
  tags: ['链表', '去重'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  description: '在有序链表中，遍历每个节点并与下一个节点比较，若值相同则跳过下一个节点。',
  defaultInput: {
    type: 'linkedlist',
    value: {
      head: 0,
      nodes: [
        { val: 1, next: 1 },
        { val: 1, next: 2 },
        { val: 2, next: 3 },
        { val: 3, next: 4 },
        { val: 3, next: 5 },
        { val: 4, next: null }
      ]
    },
    label: '1 -> 1 -> 2 -> 3 -> 3 -> 4 -> null'
  }
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function* steps(input) {
  const { head: startIdx, nodes } = input;
  const listNodes = nodes.map(n => ({ ...n }));
  let currIdx = startIdx;
  let stepNum = 0;

  yield {
    data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
    highlights: {
      codeLines: [1],
      nodeIds: [currIdx],
      pointerPositions: [
        { name: 'curr', index: currIdx, color: '#E64340' }
      ]
    },
    variables: { curr: listNodes[currIdx]?.val },
    description: '初始化指针 curr 指向头节点'
  };

  while (currIdx !== null && listNodes[currIdx].next !== null) {
    stepNum++;
    const nextIdx = listNodes[currIdx].next;

    if (listNodes[currIdx].val === listNodes[nextIdx].val) {
      // Duplicate found: skip next node
      const dupVal = listNodes[nextIdx].val;
      listNodes[currIdx].next = listNodes[nextIdx].next;

      yield {
        data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
        highlights: {
          codeLines: [2, 3],
          nodeIds: [currIdx, nextIdx],
          pointerPositions: [
            { name: 'curr', index: currIdx, color: '#E64340' }
          ]
        },
        variables: { curr: listNodes[currIdx]?.val, duplicate: dupVal, action: '跳过重复' },
        description: `第 ${stepNum} 步：发现重复值 ${dupVal}，跳过该节点`
      };
    } else {
      currIdx = nextIdx;
      yield {
        data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
        highlights: {
          codeLines: [4],
          nodeIds: [currIdx],
          pointerPositions: [
            { name: 'curr', index: currIdx, color: '#E64340' }
          ]
        },
        variables: { curr: listNodes[currIdx]?.val },
        description: `第 ${stepNum} 步：值不同，curr 前进到 ${listNodes[currIdx].val}`
      };
    }
  }

  yield {
    data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
    highlights: {
      codeLines: [5],
      nodeIds: [startIdx],
      pointerPositions: []
    },
    variables: { result: '去重完成' },
    description: '去重完成！链表中不再有重复节点'
  };
}

const code = [
  'let curr = head;',
  'while (curr !== null && curr.next !== null) {',
  '  if (curr.val === curr.next.val) curr.next = curr.next.next;',
  '  else curr = curr.next;',
  '}',
  'return head;'
];

module.exports = { meta, steps, code };
