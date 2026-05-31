/**
 * SyntaxHighlight - 伪代码语法高亮工具
 *
 * 将代码行文本解析为分段的 token 数组，供 WXML 渲染时着色。
 * 支持 JavaScript 关键字、字符串、注释等基础语法元素。
 */

// JavaScript 关键字
const KEYWORDS = [
  'function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'do',
  'return', 'break', 'continue', 'class', 'new', 'this', 'true', 'false',
  'null', 'undefined', 'typeof', 'instanceof', 'try', 'catch', 'finally',
  'throw', 'switch', 'case', 'default', 'export', 'import', 'from', 'async', 'await'
];

/**
 * 对单行代码进行语法高亮分词
 * @param {string} line - 单行代码文本
 * @returns {Array<{text: string, type: string}>} token 数组
 *   type: 'keyword' | 'string' | 'comment' | 'number' | 'operator' | 'plain'
 */
function tokenizeLine(line) {
  const tokens = [];
  let i = 0;
  const len = line.length;

  while (i < len) {
    // 空白
    if (line[i] === ' ' || line[i] === '\t') {
      let start = i;
      while (i < len && (line[i] === ' ' || line[i] === '\t')) i++;
      tokens.push({ text: line.slice(start, i), type: 'plain' });
      continue;
    }

    // 单行注释 //
    if (line[i] === '/' && line[i + 1] === '/') {
      tokens.push({ text: line.slice(i), type: 'comment' });
      i = len;
      continue;
    }

    // 多行注释 /* */
    if (line[i] === '/' && line[i + 1] === '*') {
      let start = i;
      let end = line.indexOf('*/', i + 2);
      if (end === -1) {
        tokens.push({ text: line.slice(i), type: 'comment' });
        i = len;
      } else {
        tokens.push({ text: line.slice(i, end + 2), type: 'comment' });
        i = end + 2;
      }
      continue;
    }

    // 字符串 (单引号)
    if (line[i] === "'") {
      let start = i;
      i++;
      while (i < len && line[i] !== "'") i++;
      if (i < len) i++;
      tokens.push({ text: line.slice(start, i), type: 'string' });
      continue;
    }

    // 字符串 (双引号)
    if (line[i] === '"') {
      let start = i;
      i++;
      while (i < len && line[i] !== '"') {
        if (line[i] === '\\') i++;
        i++;
      }
      if (i < len) i++;
      tokens.push({ text: line.slice(start, i), type: 'string' });
      continue;
    }

    // 模板字符串 ``
    if (line[i] === '`') {
      let start = i;
      i++;
      while (i < len && line[i] !== '`') i++;
      if (i < len) i++;
      tokens.push({ text: line.slice(start, i), type: 'string' });
      continue;
    }

    // 数字
    if (/[0-9]/.test(line[i])) {
      let start = i;
      while (i < len && /[0-9.]/.test(line[i])) i++;
      tokens.push({ text: line.slice(start, i), type: 'number' });
      continue;
    }

    // 操作符
    if (/[+\-*/%=<>!&|^~?:;,.(){}\[\]]/.test(line[i])) {
      let start = i;
      // 多字符操作符
      if (i + 1 < len && /[=<>]/.test(line[i + 1])) {
        i += 2;
      } else {
        i++;
      }
      tokens.push({ text: line.slice(start, i), type: 'operator' });
      continue;
    }

    // 标识符（可能是关键字）
    if (/[a-zA-Z_$]/.test(line[i])) {
      let start = i;
      while (i < len && /[a-zA-Z0-9_$]/.test(line[i])) i++;
      const word = line.slice(start, i);
      tokens.push({
        text: word,
        type: KEYWORDS.includes(word) ? 'keyword' : 'plain'
      });
      continue;
    }

    // 其他字符
    tokens.push({ text: line[i], type: 'plain' });
    i++;
  }

  return tokens;
}

/**
 * 对多行代码进行高亮
 * @param {string[]} codeLines - 代码行数组
 * @returns {Array<Array<{text: string, type: string}>>} 每行的 token 数组
 */
function highlight(codeLines) {
  return codeLines.map(line => tokenizeLine(line));
}

/**
 * Token type 到 WXSS class 的映射
 */
const CLASS_MAP = {
  keyword:  'token-keyword',
  string:   'token-string',
  comment:  'token-comment',
  number:   'token-number',
  operator: 'token-operator',
  plain:    'token-plain'
};

module.exports = {
  tokenizeLine,
  highlight,
  CLASS_MAP
};
