const preorder = require('./preorder');
const inorder = require('./inorder');
const postorder = require('./postorder');
const levelOrder = require('./level-order');
const bstInsert = require('./bst-insert');
const bstSearch = require('./bst-search');
const bstDelete = require('./bst-delete');
const maxDepth = require('./max-depth');
const isBalanced = require('./is-balanced');
const lca = require('./lca');
const isSymmetric = require('./is-symmetric');
const invertTree = require('./invert-tree');
const diameter = require('./diameter');
const pathSum = require('./path-sum');
const zigzag = require('./zigzag');
const rightSideView = require('./right-side-view');
const validateBst = require('./validate-bst');
const kthSmallest = require('./kth-smallest');

const algorithms = [
  preorder,
  inorder,
  postorder,
  levelOrder,
  bstInsert,
  bstSearch,
  bstDelete,
  maxDepth,
  isBalanced,
  lca,
  isSymmetric,
  invertTree,
  diameter,
  pathSum,
  zigzag,
  rightSideView,
  validateBst,
  kthSmallest
];

module.exports = algorithms;
