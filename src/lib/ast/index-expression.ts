import type { Token } from "@/types";
import type { Expression } from "@/lib";
import { TOKEN_LITERAL } from "@/enums";

export class IndexExpression implements Expression {
  private token: Token;

  public left: Expression;

  public index: Expression | null = null;

  constructor(token: Token, left: Expression) {
    this.token = token;
    this.left = left;
  }

  public expressionNode() {}

  public tokenLiteral(): string {
    return this.token.literal;
  }

  public string(): string {
    return `${TOKEN_LITERAL.OPEN_PAREN}${this.left.string()}${TOKEN_LITERAL.OPEN_BRACKET}${this.index!.string()}${TOKEN_LITERAL.CLOSE_BRACKET}${TOKEN_LITERAL.CLOSE_PAREN}`;
  }
}
