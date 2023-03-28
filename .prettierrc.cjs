/**
 * 参考 https://prettier.io/docs/en/options.html
 */
module.exports = {
  printWidth: 100, // 换行的宽度
  tabWidth: 2, // 空格数
  useTabs: false, // 是否开启tab
  semi: true, // 是否在语句末尾打印分号
  singleQuote: false, // 是否使用单引号
  quoteProps: "as-needed", // 对象的key仅在需要时用引号
  jsxSingleQuote: false, // 在JSX中是否使用单引号
  trailingComma: "es5", // 多行时尽可能打印尾随逗号
  bracketSpacing: true, // 对象文字中的括号之间打印空格
  bracketSameLine: false, // 是否将 > 多行 HTML（HTML、JSX、Vue、Angular）元素的 放在最后一行的末尾，而不是单独放在下一行（不适用于自关闭元素）。
  arrowParens: "always", // 箭头函数一个参数是否给括号
  // rangeStart: 0,
  // rangeEnd: Infinity,
  // parser: "",
  // filepath: "",
  // requirePragma: false,
  // insertPragma: false,
  // proseWrap: "presserve",
  htmlWhitespaceSensitivity: "ignore", // html中换行规则
  vueIndentScriptAndStyle: false, // vue中script与style里的第一条语句是否空格
  endOfLine: "auto", // 换行符
  embeddedLanguageFormatting: "auto", // 嵌入语言的格式化
};
