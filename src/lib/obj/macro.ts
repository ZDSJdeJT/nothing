import type { Obj, Identifier, BlockStatement, Environment } from "@/lib";
import { OBJ_TYPE, TOKEN_LITERAL } from "@/enums";

export class Macro implements Obj {
  public parameters: Identifier[];

  public body: BlockStatement;

  public environment: Environment;

  constructor(
    parameters: Identifier[],
    body: BlockStatement,
    environment: Environment,
  ) {
    this.parameters = parameters;
    this.body = body;
    this.environment = environment;
  }

  public type(): OBJ_TYPE {
    return OBJ_TYPE.MACRO;
  }

  public inspect(): string {
    return `${TOKEN_LITERAL.MACRO}${TOKEN_LITERAL.OPEN_PAREN}${this.parameters.map((item) => item.string()).join(`${TOKEN_LITERAL.COMMA} `)}${TOKEN_LITERAL.CLOSE_PAREN} ${TOKEN_LITERAL.OPEN_BRACE}
  ${this.body.string()}
${TOKEN_LITERAL.CLOSE_BRACE}`;
  }
}
