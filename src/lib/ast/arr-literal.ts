import type { Token } from "@/types";
import type { Expression } from "@/lib";
import { TOKEN_LITERAL } from "@/enums";

export class ArrLiteral implements Expression {
  private token: Token;

  public elements: Expression[] = [];

  constructor(token: Token) {
    this.token = token;
  }

  public expressionNode() {}

  public tokenLiteral(): string {
    return this.token.literal;
  }

  public string(): string {
    return `${TOKEN_LITERAL.OPEN_BRACKET}${this.elements.map((item) => item.string()).join(`${TOKEN_LITERAL.COMMA} `)}${TOKEN_LITERAL.CLOSE_BRACKET}`;
  }
}
