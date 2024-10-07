import type { Token } from "@/types";
import type { Expression, Statement } from "@/lib";

export class ExpressionStatement implements Statement {
  private token: Token;

  public expression: Expression | null = null;

  constructor(token: Token) {
    this.token = token;
  }

  public statementNode() {}

  public tokenLiteral(): string {
    return this.token.literal;
  }

  public string(): string {
    return this.expression ? this.expression.string() : "";
  }
}
