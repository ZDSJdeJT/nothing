import type { Token } from "@/types";
import type { Expression } from "@/lib";

export class StrLiteral implements Expression {
  private token: Token;

  public value: string;

  constructor(token: Token, value: string) {
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
