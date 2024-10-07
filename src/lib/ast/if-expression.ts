import type { Token } from "@/types";
import type { Expression, BlockStatement } from "@/lib";
import { TOKEN_TYPE, TOKEN_LITERAL } from "@/enums";

export class IfExpression implements Expression {
  private token: Token = { type: TOKEN_TYPE.IF, literal: TOKEN_LITERAL.IF };

  // 持有条件（可以是任何表达式）
  public condition: Expression;

  // 结果
  public consequence: BlockStatement;

  // 可替代的结果
  public alternative: BlockStatement | null;

  constructor(
    condition: Expression,
    consequence: BlockStatement,
    alternative: BlockStatement | null,
  ) {
    this.condition = condition;
    this.consequence = consequence;
    this.alternative = alternative;
  }

  public expressionNode() {}

  public tokenLiteral(): string {
    return this.token.literal;
  }

  public string(): string {
    return `${TOKEN_LITERAL.IF}${this.condition.string()} ${this.consequence.string()}${this.alternative ? `${TOKEN_LITERAL.ELSE} ${this.alternative.string()}` : ""}`;
  }
}
