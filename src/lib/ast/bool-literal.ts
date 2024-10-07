import type { Token } from "@/types";
import type { Expression } from "@/lib";

export class BoolLiteral implements Expression {
  private token: Token;

  public value: boolean;

  constructor(token: Token, value: boolean) {
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
