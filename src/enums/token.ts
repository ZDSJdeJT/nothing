export enum TOKEN_TYPE {
  // 分隔符
  OPEN_PAREN = "(",
  CLOSE_PAREN = ")",
  OPEN_BRACE = "{",
  CLOSE_BRACE = "}",
  OPEN_BRACKET = "[",
  CLOSE_BRACKET = "]",
  COMMA = ",",
  SEMICOLON = ";",
  COLON = ":",
  // 标识符
  IDENTIFIER = "IDENTIFIER",
  INTEGER = "INTEGER",
  STR = "STR",
  // 运算符
  ASSIGN = "=",
  PLUS = "+",
  MINUS = "-",
  BANG = "!",
  ASTERISK = "*",
  SLASH = "/",
  LT = "<",
  GT = ">",
  EQ = "==",
  NOT_EQ = "!=",
  // 关键字
  LET = "LET",
  FN = "FN",
  TRUE = "TRUE",
  FALSE = "FALSE",
  IF = "IF",
  ELSE = "ELSE",
  RETURN = "RETURN",
  // 宏
  MACRO = "MACRO",
  // 未知词法单元
  ILLEGAL = "ILLEGAL",
  // 文件结尾
  EOF = "EOF",
}

export enum TOKEN_LITERAL {
  // 分隔符
  OPEN_PAREN = "(",
  CLOSE_PAREN = ")",
  OPEN_BRACE = "{",
  CLOSE_BRACE = "}",
  OPEN_BRACKET = "[",
  CLOSE_BRACKET = "]",
  COMMA = ",",
  SEMICOLON = ";",
  COLON = ":",
  // 运算符
  ASSIGN = "=",
  PLUS = "+",
  MINUS = "-",
  BANG = "!",
  ASTERISK = "*",
  SLASH = "/",
  LT = "<",
  GT = ">",
  EQ = "==",
  NOT_EQ = "!=",
  // 关键字
  LET = "let",
  FN = "fn",
  TRUE = "true",
  FALSE = "false",
  NULL = "null",
  STR = '"',
  IF = "if",
  ELSE = "else",
  RETURN = "return",
  // 宏
  MACRO = "macro",
  // 未知词法单元
  ILLEGAL = "illegal",
  // 文件结尾
  EOF = "",
}
