export interface Node {
  tokenLiteral: () => string;

  string: () => string;
}

export interface Expression extends Node {
  expressionNode: () => void;
}

export interface Statement extends Node {
  statementNode: () => void;
}

export * from "./program";
export * from "./identifier";
export * from "./integer-literal";
export * from "./str-literal";
export * from "./bool-literal";
export * from "./arr-literal";
export * from "./prefix-expression";
export * from "./infix-expression";
export * from "./if-expression";
export * from "./let-statement";
export * from "./return-statement";
export * from "./expression-statement";
export * from "./block-statement";
export * from "./fn-literal";
export * from "./macro-literal";
export * from "./call-expression";
export * from "./index-expression";
export * from "./hash-literal";
