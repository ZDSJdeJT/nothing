import type { Token } from "@/types";
import type { Expression, Identifier, BlockStatement } from "@/lib";
import { TOKEN_LITERAL } from "@/enums";

export class MacroLiteral implements Expression {
  private token: Token;

  public parameters: Identifier[] = [];

  public body: BlockStatement | null = null;

  constructor(token: Token) {
    this.token = token;
  }

  public expressionNode() {}

  public tokenLiteral(): string {
    return this.token.literal;
  }

  public string(): string {
    return `${this.tokenLiteral()}${TOKEN_LITERAL.OPEN_PAREN}${this.parameters.map((parameter) => parameter.string()).join(`${TOKEN_LITERAL.COMMA} `)}${TOKEN_LITERAL.CLOSE_PAREN} ${TOKEN_LITERAL.OPEN_BRACE}
  ${this.body!.string()}
${TOKEN_LITERAL.CLOSE_BRACE}`;
  }
}
