const meta = {
  id: 'swap-nodes-in-pairs',
  name: '两两交换',
  nameEn: 'Swap Nodes in Pairs',
  difficulty: 'medium',
  category: 'linkedlist',
  tags: ['链表', '递归', '指针'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  description: '给定链表，两两交换其中相邻的节点，并返回交换后的链表。使用哑节点和指针操作。',
  defaultInput: {
    type: 'linkedlist',
    value: {
      head: 0,
      nodes: [
        { val: 1, next: 1 },
        { val: 2, next: 2 },
        { val: 3, next: 3 },
        { val: 4, next: null }
      ]
    },
    label: '1 -> 2 -> 3 -> 4 -> null'
  }
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function* steps(input) {
  const { head: startIdx, nodes } = input;
  const listNodes = nodes.map(n => ({ ...n }));

  // We'll simulate with a dummy concept
  // Since we can't add a real dummy node, we track prev
  let dummyNext = startIdx;
  let prevIdx = null;
  let stepNum = 0;

  yield {
    data: { type: 'linkedlist', value: { head: startIdx, nodes: deepClone(listNodes) } },
    highlights: {
      codeLines: [1, 2],
      nodeIds: [startIdx],
      pointerPositions: [
        { name: 'dummy', index: null, color: '#9B59B6' }
      ]
    },
    variables: { head: listNodes[startIdx]?.val },
    description: '创建哑节点 dummy，指向头节点'
  };

  let currIdx = dummyNext;
  while (currIdx !== null && listNodes[currIdx].next !== null) {
    stepNum++;
    const firstIdx = currIdx;
    const secondIdx = listNodes[currIdx].next;
    const restIdx = listNodes[secondIdx].next;

    // Swap: prev -> second -> first -> rest
    if (prevIdx !== null) {
      listNodes[prevIdx].next = secondIdx;
    } else {
      dummyNext = secondIdx; // new head
    }

    listNodes[secondIdx].next = firstIdx;
    listNodes[firstIdx].next = restIdx;

    const displayHead = prevIdx === null ? dummyNext : startIdx;

    yield {
      data: { type: 'linkedlist', value: { head: displayHead === null ? startIdx : (prevIdx === null ? dummyNext : startIdx), nodes: deepClone(listNodes) } },
      highlights: {
        codeLines: [3, 4, 5],
        nodeIds: [firstIdx, secondIdx],
        pointerPositions: [
          { name: 'prev', index: prevIdx, color: '#9B59B6' },
          { name: 'first', index: firstIdx, color: '#E64340' },
          { name: 'second', index: secondIdx, color: '#3498DB' }
        ]
      },
      variables: { pair: `(${listNodes[firstIdx].val}, ${listNodes[secondIdx].val})`, swapped: true },
      description: `第 ${stepNum} 对交换：${listNodes[firstIdx].val} 和 ${listNodes[secondIdx].val} 互换位置`
    };

    prevIdx = firstIdx;
    currIdx = restIdx;

    if (currIdx !== null) {
      yield {
        data: { type: 'linkedlist', value: { head: dummyNext, nodes: deepClone(listNodes) } },
        highlights: {
          codeLines: [6, 7],
          nodeIds: [currIdx],
          pointerPositions: [
            { name: 'prev', index: prevIdx, color: '#9B59B6' },
            { name: 'curr', index: currIdx, color: '#E64340' }
          ]
        },
        variables: { next_pair: `准备处理节点 ${listNodes[currIdx].val}` },
        description: `继续处理下一对，curr 移动到 ${listNodes[currIdx].val}`
      };
    }
  }

  yield {
    data: { type: 'linkedlist', value: { head: dummyNext, nodes: deepClone(listNodes) } },
    highlights: {
      codeLines: [8],
      nodeIds: [dummyNext],
      pointerPositions: []
    },
    variables: { result: dummyNext !== null ? `新头节点为 ${listNodes[dummyNext].val}` : '空链表' },
    description: `交换完成！新链表头为 ${dummyNext !== null ? listNodes[dummyNext].val : 'null'}`
  };
}

const code = [
  'let dummy = new ListNode(0, head);',
  'let prev = dummy, curr = head;',
  'while (curr !== null && curr.next !== null) {',
  '  let first = curr, second = curr.next;',
  '  prev.next = second; first.next = second.next; second.next = first;',
  '  prev = first;',
  '  curr = first.next;',
  '}',
  'return dummy.next;'
];

module.exports = { meta, steps, code };
