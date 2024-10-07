import type { Token } from "@/types";
import type { Expression } from "@/lib";
import { TOKEN_LITERAL } from "@/enums";

export class HashLiteral implements Expression {
  private token: Token;

  public pairs = new Map<Expression, Expression>();

  constructor(token: Token) {
    this.token = token;
  }

  public expressionNode() {}

  public tokenLiteral(): string {
    return this.token.literal;
  }

  public string(): string {
    const pairs: string[] = [];
    this.pairs.forEach((value, key) => {
      pairs.push(`${key.string()}${TOKEN_LITERAL.COLON} ${value.string()}`);
    });
    return `${TOKEN_LITERAL.OPEN_BRACE}${pairs.join(`${TOKEN_LITERAL.COMMA} `)}${TOKEN_LITERAL.CLOSE_BRACE}`;
  }
}
