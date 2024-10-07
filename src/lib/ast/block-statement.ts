import type { Token } from "@/types";
import type { Statement } from "@/lib";

export class BlockStatement implements Statement {
  private token: Token;

  public statements: Statement[] = [];

  constructor(token: Token) {
    this.token = token;
  }

  public statementNode() {}

  public tokenLiteral(): string {
    return this.token.literal;
  }

  public string(): string {
    return this.statements.map((statement) => statement.string()).join("");
  }
}
