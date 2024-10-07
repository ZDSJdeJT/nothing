import type { Token } from "@/types";
import type { Expression, Statement } from "@/lib";
import { TOKEN_LITERAL } from "@/enums";

export class ReturnStatement implements Statement {
  private token: Token;

  public returnValue: Expression | null = null;

  constructor(token: Token) {
    this.token = token;
  }

  public statementNode() {}

  public tokenLiteral(): string {
    return this.token.literal;
  }

  public string(): string {
    return `${this.tokenLiteral()} ${this.returnValue!.string()}${TOKEN_LITERAL.SEMICOLON}`;
  }
}
