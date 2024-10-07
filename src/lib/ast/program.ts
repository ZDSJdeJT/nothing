import type { Node, Statement } from "@/lib";

export class Program implements Node {
  public statements: Statement[] = [];

  public tokenLiteral(): string {
    if (this.statements.length > 0) {
      return this.statements[0].tokenLiteral();
    }
    return "";
  }

  public string(): string {
    return this.statements.map((statement) => statement.string()).join("");
  }
}
