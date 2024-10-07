import type { Token } from "@/types";
import type { Expression } from "@/lib";
import { TOKEN_LITERAL } from "@/enums";

export class CallExpression implements Expression {
  private token: Token;

  public fn: Expression;

  public args: Expression[] = [];

  constructor(token: Token, fn: Expression) {
    this.token = token;
    this.fn = fn;
  }

  public expressionNode() {}

  public tokenLiteral(): string {
    return this.token.literal;
  }

  public string(): string {
    return `${this.fn.string()}${TOKEN_LITERAL.OPEN_PAREN}${this.args.map((arg) => arg.string()).join(`${TOKEN_LITERAL.COMMA} `)}${TOKEN_LITERAL.CLOSE_PAREN}`;
  }
}
