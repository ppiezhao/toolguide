/**
 * variable-panel 组件 - 变量状态面板
 *
 * 属性:
 *   variables - { [key: string]: any }  当前步骤的变量值
 *
 * 内部将 variables 对象转换为 variableEntries 数组用于渲染，
 * 并通过与 prevVariables 比较判断 changed 状态。
 */
Component({
  properties: {
    variables: { type: Object, value: {} }
  },

  data: {
    variableEntries: []
  },

  observers: {
    'variables': function (newVars) {
      const prevVars = this._prevVars || {};
      const entries = [];
      for (const [name, value] of Object.entries(newVars)) {
        entries.push({
          name,
          value: String(value),
          changed: prevVars[name] !== undefined && prevVars[name] !== value
        });
      }
      this.setData({ variableEntries: entries });
      this._prevVars = Object.assign({}, newVars);
    }
  }
});
