import type { Token } from "@/types";
import type { Expression } from "@/lib";
import { TOKEN_LITERAL } from "@/enums";

export class PrefixExpression implements Expression {
  // 前缀词法单元
  private token: Token;

  public operator: string;

  public right: Expression | null = null;

  constructor(token: Token, operator: string) {
    this.token = token;
    this.operator = operator;
  }

  public expressionNode() {}

  public tokenLiteral(): string {
    return this.token.literal;
  }

  public string(): string {
    return `${TOKEN_LITERAL.OPEN_PAREN}${this.operator}${this.right!.string()}${TOKEN_LITERAL.CLOSE_PAREN}`;
  }
}
