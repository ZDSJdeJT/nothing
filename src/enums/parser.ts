export enum PARSER_PRECEDENCE {
  LOWEST = 0,
  // ==
  EQUALS = 1,
  // > <
  LESSER_OR_GREATER = 2,
  // +
  SUM = 3,
  // *
  PRODUCT = 4,
  // -x !x
  PREFIX = 5,
  // myFn()
  CALL = 6,
  // myArr[0]
  INDEX = 7,
}
