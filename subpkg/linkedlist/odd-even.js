const meta = {
  id: 'odd-even-linked-list',
  name: '奇偶链表',
  nameEn: 'Odd Even Linked List',
  difficulty: 'medium',
  category: 'linkedlist',
  tags: ['链表', '指针'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  description: '将链表中所有奇数索引节点和偶数索引节点分别组合在一起，奇数在前，偶数在后（索引从1开始计）。',
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

  // Edge case
  if (startIdx === null || listNodes[startIdx].next === null) {
    yield {
      data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
      highlights: { codeLines: [8], nodeIds: [], pointerPositions: [] },
      variables: { result: '链表为空或只有一个节点' },
      description: '链表为空或只有1个节点，直接返回'
    };
    return;
  }

  let oddIdx = startIdx;
  let evenIdx = listNodes[startIdx].next;
  const evenHeadIdx = evenIdx;
  let stepNum = 0;

  yield {
    data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
    highlights: {
      codeLines: [1, 2, 3],
      nodeIds: [oddIdx, evenIdx],
      pointerPositions: [
        { name: 'odd', index: oddIdx, color: '#E64340' },
        { name: 'even', index: evenIdx, color: '#3498DB' }
      ]
    },
    variables: { odd: listNodes[oddIdx]?.val, even: listNodes[evenIdx]?.val },
    description: '初始化奇数指针 odd 和偶数指针 even，保存偶数链表头'
  };

  while (evenIdx !== null && listNodes[evenIdx].next !== null) {
    stepNum++;

    // Link odd to odd's next
    listNodes[oddIdx].next = listNodes[evenIdx].next;
    oddIdx = listNodes[oddIdx].next;

    yield {
      data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
      highlights: {
        codeLines: [4, 5],
        nodeIds: [oddIdx],
        pointerPositions: [
          { name: 'odd', index: oddIdx, color: '#E64340' },
          { name: 'even', index: evenIdx, color: '#3498DB' }
        ]
      },
      variables: { odd: listNodes[oddIdx]?.val, even: listNodes[evenIdx]?.val, step: stepNum },
      description: `第 ${stepNum} 步：odd 指向下一个奇数节点 ${listNodes[oddIdx].val}`
    };

    // Link even to even's next
    listNodes[evenIdx].next = listNodes[oddIdx].next;
    evenIdx = listNodes[evenIdx].next;

    if (evenIdx !== null) {
      yield {
        data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
        highlights: {
          codeLines: [6, 7],
          nodeIds: [evenIdx],
          pointerPositions: [
            { name: 'odd', index: oddIdx, color: '#E64340' },
            { name: 'even', index: evenIdx, color: '#3498DB' }
          ]
        },
        variables: { odd: listNodes[oddIdx]?.val, even: listNodes[evenIdx]?.val, step: stepNum },
        description: `第 ${stepNum} 步：even 指向下一个偶数节点 ${listNodes[evenIdx].val}`
      };
    }
  }

  // Link odd tail to even head
  listNodes[oddIdx].next = evenHeadIdx;

  yield {
    data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
    highlights: {
      codeLines: [8, 9],
      nodeIds: [oddIdx, evenHeadIdx],
      pointerPositions: [
        { name: 'odd', index: oddIdx, color: '#E64340' },
        { name: 'evenHead', index: evenHeadIdx, color: '#3498DB' }
      ]
    },
    variables: { odd_tail: listNodes[oddIdx]?.val, even_head: listNodes[evenHeadIdx]?.val },
    description: '将奇数链表尾部连接到偶数链表头部'
  };

  yield {
    data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
    highlights: {
      codeLines: [10],
      nodeIds: [startIdx],
      pointerPositions: []
    },
    variables: { result: '奇偶链表重组完成' },
    description: `完成！奇数节点在前，偶数节点在后。头节点 = ${listNodes[startIdx].val}`
  };
}

const code = [
  'if (head === null) return null;',
  'let odd = head, even = head.next, evenHead = even;',
  'while (even !== null && even.next !== null) {',
  '  odd.next = even.next;',
  '  odd = odd.next;',
  '  even.next = odd.next;',
  '  even = even.next;',
  '}',
  'odd.next = evenHead;',
  'return head;'
];

module.exports = { meta, steps, code };
