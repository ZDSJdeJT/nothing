export enum BUILTIN {
  // 返回字符串或数组的长度
  LEN = "len",
  // 返回数组第一个元素
  FIRST = "first",
  // 返回数组最后一个元素
  LAST = "last",
  // 返回包含原数组除第一个元素之外的所有元素的新数组
  REST = "rest",
  // 向数组尾部添加元素
  PUSH = "push",
  // 将类型转换为字符串
  TO_STR = "toStr",
  // 启动 http 服务
  SERVE = "serve",
  // 打印信息
  LOG = "log",
  // 返回版本号
  VERSION = "version",
  // 退出程序
  EXIT = "exit",
  // 宏相关
  QUOTE = "quote",
  UNQUOTE = "unquote",
}
