const meta = {
  id: 'add-two-numbers',
  name: '两数相加',
  nameEn: 'Add Two Numbers',
  difficulty: 'medium',
  category: 'linkedlist',
  tags: ['链表', '数学'],
  timeComplexity: 'O(max(m,n))',
  spaceComplexity: 'O(max(m,n))',
  description: '两个非空链表表示两个非负整数，数字按逆序存储。将两个数相加并以相同形式返回结果链表。',
  defaultInput: {
    type: 'linkedlist',
    value: {
      head: 0,
      nodes: [
        { val: 2, next: 1 },
        { val: 4, next: 2 },
        { val: 3, next: null },
        { val: 5, next: 4 },
        { val: 6, next: 5 },
        { val: 4, next: null }
      ]
    },
    label: 'l1=[2,4,3] (342), l2=[5,6,4] (465), 结果=[7,0,8] (807)'
  }
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function* steps(input) {
  const { nodes } = input;
  const listNodes = nodes.map(n => ({ ...n }));

  // l1: indices 0,1,2 (2->4->3)
  // l2: indices 3,4,5 (5->6->4)
  let l1Idx = 0;
  let l2Idx = 3;
  let carry = 0;
  let sum = 0;

  // Build result nodes
  const resultNodes = [];
  let resultHeadIdx = null;
  let resultPrevIdx = null;
  let stepNum = 0;

  yield {
    data: { type: 'linkedlist', value: { head: 0, nodes: deepClone(listNodes) } },
    highlights: {
      codeLines: [1, 2],
      nodeIds: [l1Idx, l2Idx],
      pointerPositions: [
        { name: 'l1', index: l1Idx, color: '#E64340' },
        { name: 'l2', index: l2Idx, color: '#3498DB' }
      ]
    },
    variables: { l1_val: listNodes[l1Idx]?.val, l2_val: listNodes[l2Idx]?.val, carry: 0 },
    description: '初始化指针 l1, l2 和进位 carry = 0'
  };

  while (l1Idx !== null || l2Idx !== null || carry > 0) {
    stepNum++;
    const v1 = l1Idx !== null ? listNodes[l1Idx].val : 0;
    const v2 = l2Idx !== null ? listNodes[l2Idx].val : 0;
    sum = v1 + v2 + carry;
    carry = Math.floor(sum / 10);
    const digit = sum % 10;

    // Create result node
    const newNodeIdx = resultNodes.length;
    resultNodes.push({ val: digit, next: null });
    if (resultHeadIdx === null) {
      resultHeadIdx = newNodeIdx;
    }
    if (resultPrevIdx !== null) {
      resultNodes[resultPrevIdx].next = newNodeIdx;
    }
    resultPrevIdx = newNodeIdx;

    yield {
      data: { type: 'linkedlist', value: { head: resultHeadIdx, nodes: deepClone(resultNodes) } },
      highlights: {
        codeLines: [3, 4, 5, 6],
        nodeIds: [l1Idx, l2Idx].filter(i => i !== null),
        pointerPositions: [
          { name: 'l1', index: l1Idx, color: '#E64340' },
          { name: 'l2', index: l2Idx, color: '#3498DB' }
        ]
      },
      variables: { v1, v2, carry_before: sum - digit, digit, carry_after: carry, sum },
      description: `第 ${stepNum} 位：${v1} + ${v2} + ${sum - v1 - v2} = ${sum}，本位=${digit}，进位=${carry}`
    };

    // Advance pointers
    l1Idx = l1Idx !== null ? listNodes[l1Idx].next : null;
    l2Idx = l2Idx !== null ? listNodes[l2Idx].next : null;
  }

  yield {
    data: { type: 'linkedlist', value: { head: resultHeadIdx, nodes: deepClone(resultNodes) } },
    highlights: {
      codeLines: [7],
      nodeIds: [resultHeadIdx],
      pointerPositions: []
    },
    variables: { result: resultNodes.map(n => n.val).join(' -> ') },
    description: `计算完成！结果链表：${resultNodes.map(n => n.val).join(' -> ')}`
  };
}

const code = [
  'let l1 = head1, l2 = head2, carry = 0, dummy = new ListNode(0);',
  'let curr = dummy;',
  'while (l1 !== null || l2 !== null || carry > 0) {',
  '  let sum = (l1?.val || 0) + (l2?.val || 0) + carry;',
  '  carry = Math.floor(sum / 10);',
  '  curr.next = new ListNode(sum % 10);',
  '  curr = curr.next;',
  '  l1 = l1?.next || null;',
  '  l2 = l2?.next || null;',
  '}',
  'return dummy.next;'
];

module.exports = { meta, steps, code };
