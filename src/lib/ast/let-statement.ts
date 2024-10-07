import type { Token } from "@/types";
import type { Expression, Statement, Identifier } from "@/lib";
import { TOKEN_LITERAL } from "@/enums";

export class LetStatement implements Statement {
  private token: Token;

  public name: Identifier | null;

  public value: Expression | null;

  constructor(
    token: Token,
    name: Identifier | null = null,
    value: Expression | null = null,
  ) {
    this.token = token;
    this.name = name;
    this.value = value;
  }

  public statementNode() {}

  public tokenLiteral(): string {
    return this.token.literal;
  }

  public string(): string {
    return `${this.tokenLiteral()} ${this.name!.string()} ${TOKEN_LITERAL.ASSIGN} ${this.value!.string()}${TOKEN_LITERAL.SEMICOLON}`;
  }
}
