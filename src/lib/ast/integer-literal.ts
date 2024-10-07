import type { Token } from "@/types";
import type { Expression } from "@/lib";

export class IntegerLiteral implements Expression {
  private token: Token;

  public value: number;

  constructor(token: Token, value: number) {
    this.token = token;
    this.value = value;
  }

  public expressionNode() {}

  public tokenLiteral(): string {
    return this.token.literal;
  }

  public string(): string {
    return this.token.literal;
  }
}
