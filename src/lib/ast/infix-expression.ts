import type { Token } from "@/types";
import type { Expression } from "@/lib";
import { TOKEN_LITERAL } from "@/enums";

export class InfixExpression implements Expression {
  // 运算符词法单元
  private token: Token;

  public operator: string;

  public left: Expression;

  public right: Expression | null = null;

  constructor(token: Token, operator: string, left: Expression) {
    this.token = token;
    this.operator = operator;
    this.left = left;
  }

  public expressionNode() {}

  public tokenLiteral(): string {
    return this.token.literal;
  }

  public string(): string {
    return `${TOKEN_LITERAL.OPEN_PAREN}${this.left!.string()} ${this.operator} ${this.right!.string()}${TOKEN_LITERAL.CLOSE_PAREN}`;
  }
}
