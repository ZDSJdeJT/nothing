import type { Token } from "@/types";
import {
  type Lexer,
  type Statement,
  type Expression,
  Program,
  LetStatement,
  ReturnStatement,
  ExpressionStatement,
  Identifier,
  IntegerLiteral,
  StrLiteral,
  BoolLiteral,
  PrefixExpression,
  InfixExpression,
  IfExpression,
  BlockStatement,
  FnLiteral,
  CallExpression,
  ArrLiteral,
  IndexExpression,
  HashLiteral,
  MacroLiteral,
} from "@/lib";
import { TOKEN_TYPE, PARSER_PRECEDENCE } from "@/enums";

export class Parser {
  private lexer: Lexer;

  private curToken: Token;

  private peekToken: Token;

  // 优先级表
  private static precedences: { [key: string]: number } = {
    [TOKEN_TYPE.EQ]: PARSER_PRECEDENCE.EQUALS,
    [TOKEN_TYPE.NOT_EQ]: PARSER_PRECEDENCE.EQUALS,
    [TOKEN_TYPE.LT]: PARSER_PRECEDENCE.LESSER_OR_GREATER,
    [TOKEN_TYPE.GT]: PARSER_PRECEDENCE.LESSER_OR_GREATER,
    [TOKEN_TYPE.PLUS]: PARSER_PRECEDENCE.SUM,
    [TOKEN_TYPE.MINUS]: PARSER_PRECEDENCE.SUM,
    [TOKEN_TYPE.SLASH]: PARSER_PRECEDENCE.PRODUCT,
    [TOKEN_TYPE.ASTERISK]: PARSER_PRECEDENCE.PRODUCT,
    [TOKEN_TYPE.OPEN_PAREN]: PARSER_PRECEDENCE.CALL,
    [TOKEN_TYPE.OPEN_BRACKET]: PARSER_PRECEDENCE.INDEX,
  };

  private prefixParseFns: { [key: string]: () => Expression | null } = {};

  private infixParseFns: {
    [key: string]: (expression: Expression) => Expression | null;
  } = {};

  public errors: string[] = [];

  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.curToken = this.lexer.nextToken();
    this.peekToken = this.lexer.nextToken();
    // 注册前缀处理函数
    this.registerPrefix(TOKEN_TYPE.IDENTIFIER, this.parseIdentifier);
    this.registerPrefix(TOKEN_TYPE.INTEGER, this.parseIntegerLiteral);
    this.registerPrefix(TOKEN_TYPE.STR, this.parseStrLiteral);
    this.registerPrefix(TOKEN_TYPE.BANG, this.parsePrefixExpression);
    this.registerPrefix(TOKEN_TYPE.MINUS, this.parsePrefixExpression);
    this.registerPrefix(TOKEN_TYPE.TRUE, this.parseBoolLiteral);
    this.registerPrefix(TOKEN_TYPE.FALSE, this.parseBoolLiteral);
    this.registerPrefix(TOKEN_TYPE.OPEN_PAREN, this.parseGroupedExpression);
    this.registerPrefix(TOKEN_TYPE.IF, this.parseIfExpression);
    this.registerPrefix(TOKEN_TYPE.FN, this.parseFnLiteral);
    this.registerPrefix(TOKEN_TYPE.MACRO, this.parseMacroLiteral);
    this.registerPrefix(TOKEN_TYPE.OPEN_BRACKET, this.parseArrLiteral);
    this.registerPrefix(TOKEN_TYPE.OPEN_BRACE, this.parseHashLiteral);
    // 注册中缀处理函数
    this.registerInfix(TOKEN_TYPE.PLUS, this.parseInfixExpression);
    this.registerInfix(TOKEN_TYPE.MINUS, this.parseInfixExpression);
    this.registerInfix(TOKEN_TYPE.SLASH, this.parseInfixExpression);
    this.registerInfix(TOKEN_TYPE.ASTERISK, this.parseInfixExpression);
    this.registerInfix(TOKEN_TYPE.EQ, this.parseInfixExpression);
    this.registerInfix(TOKEN_TYPE.NOT_EQ, this.parseInfixExpression);
    this.registerInfix(TOKEN_TYPE.LT, this.parseInfixExpression);
    this.registerInfix(TOKEN_TYPE.GT, this.parseInfixExpression);
    this.registerInfix(TOKEN_TYPE.OPEN_PAREN, this.parseCallExpression);
    this.registerInfix(TOKEN_TYPE.OPEN_BRACKET, this.parseIndexExpression);
  }

  private nextToken() {
    this.curToken = this.peekToken;
    this.peekToken = this.lexer.nextToken();
  }

  public parseProgram(): Program {
    const program = new Program();
    while (this.curToken.type !== TOKEN_TYPE.EOF) {
      const statement = this.parseStatement();
      if (statement) {
        program.statements.push(statement);
      }
      this.nextToken();
    }
    return program;
  }

  private parseStatement(): Statement | null {
    switch (this.curToken.type) {
      case TOKEN_TYPE.LET:
        return this.parseLetStatement();
      case TOKEN_TYPE.RETURN:
        return this.parseReturnStatement();
      default:
        return this.parseExpressionStatement();
    }
  }

  private curTokenIs(type: TOKEN_TYPE): boolean {
    return this.curToken.type === type;
  }

  private peekTokenIs(type: TOKEN_TYPE): boolean {
    return this.peekToken.type === type;
  }

  private expectPeek(type: TOKEN_TYPE): boolean {
    if (this.peekTokenIs(type)) {
      this.nextToken();
      return true;
    }
    this.errors.push(
      `Expected next token to be ${type}, got ${this.peekToken.type} instead.`,
    );
    return false;
  }

  private parseLetStatement(): LetStatement | null {
    const statement = new LetStatement(this.curToken);
    if (!this.expectPeek(TOKEN_TYPE.IDENTIFIER)) {
      return null;
    }
    statement.name = new Identifier(this.curToken, this.curToken.literal);
    if (!this.expectPeek(TOKEN_TYPE.ASSIGN)) {
      return null;
    }
    this.nextToken();
    statement.value = this.parseExpression();
    if (this.peekTokenIs(TOKEN_TYPE.SEMICOLON)) {
      this.nextToken();
    }
    return statement;
  }

  private parseReturnStatement(): ReturnStatement {
    const statement = new ReturnStatement(this.curToken);
    this.nextToken();
    statement.returnValue = this.parseExpression();
    if (this.peekTokenIs(TOKEN_TYPE.SEMICOLON)) {
      this.nextToken();
    }
    return statement;
  }

  private parseExpressionStatement(): ExpressionStatement {
    const statement = new ExpressionStatement(this.curToken);
    statement.expression = this.parseExpression();
    if (this.peekTokenIs(TOKEN_TYPE.SEMICOLON)) {
      this.nextToken();
    }
    return statement;
  }

  private parseExpression(
    precedence: number = PARSER_PRECEDENCE.LOWEST,
  ): Expression | null {
    const prefix = this.prefixParseFns[this.curToken.type];
    if (!prefix) {
      this.errors.push(`No prefix parse fn for ${this.curToken.type} found.`);
      return null;
    }
    let left = prefix.call(this);
    while (
      !this.peekTokenIs(TOKEN_TYPE.SEMICOLON) &&
      precedence < this.peekPrecedence()
    ) {
      const infix = this.infixParseFns[this.peekToken.type];
      if (!infix) {
        return left;
      }
      this.nextToken();
      left = infix.call(this, left!);
    }
    return left;
  }

  private parseIdentifier(): Expression {
    return new Identifier(this.curToken, this.curToken.literal);
  }

  private parseIntegerLiteral(): Expression | null {
    const value = Number(this.curToken.literal);
    if (value > Number.MAX_SAFE_INTEGER) {
      this.errors.push(`Could not parse ${this.curToken.literal} as integer.`);
      return null;
    }
    return new IntegerLiteral(this.curToken, value);
  }

  private parseStrLiteral(): Expression | null {
    return new StrLiteral(this.curToken, this.curToken.literal);
  }

  private parseBoolLiteral(): Expression {
    return new BoolLiteral(this.curToken, this.curTokenIs(TOKEN_TYPE.TRUE));
  }

  private parsePrefixExpression(): Expression {
    const expression = new PrefixExpression(
      this.curToken,
      this.curToken.literal,
    );
    this.nextToken();
    expression.right = this.parseExpression(PARSER_PRECEDENCE.PREFIX);
    return expression;
  }

  private parseInfixExpression(left: Expression): Expression {
    const expression = new InfixExpression(
      this.curToken,
      this.curToken.literal,
      left,
    );
    const precedence = this.curPrecedence();
    this.nextToken();
    expression.right = this.parseExpression(precedence);
    return expression;
  }

  private parseGroupedExpression(): Expression | null {
    this.nextToken();
    const expression = this.parseExpression();
    if (!this.expectPeek(TOKEN_TYPE.CLOSE_PAREN)) {
      return null;
    }
    return expression;
  }

  private parseIfExpression(): Expression | null {
    if (!this.expectPeek(TOKEN_TYPE.OPEN_PAREN)) {
      return null;
    }
    this.nextToken();
    const condition = this.parseExpression();
    if (!this.expectPeek(TOKEN_TYPE.CLOSE_PAREN)) {
      return null;
    }
    if (!this.expectPeek(TOKEN_TYPE.OPEN_BRACE)) {
      return null;
    }
    const consequence = this.parseBlockStatement();
    if (this.peekTokenIs(TOKEN_TYPE.ELSE)) {
      this.nextToken();
      if (!this.expectPeek(TOKEN_TYPE.OPEN_BRACE)) {
        return null;
      }
      return new IfExpression(
        condition!,
        consequence,
        this.parseBlockStatement(),
      );
    }
    return new IfExpression(condition!, consequence, null);
  }

  private parseFnLiteral(): Expression | null {
    const literal = new FnLiteral(this.curToken);
    if (!this.expectPeek(TOKEN_TYPE.OPEN_PAREN)) {
      return null;
    }
    literal.parameters = this.parseFnParameters()!;
    if (!this.expectPeek(TOKEN_TYPE.OPEN_BRACE)) {
      return null;
    }
    literal.body = this.parseBlockStatement();
    return literal;
  }

  private parseMacroLiteral(): Expression | null {
    const literal = new MacroLiteral(this.curToken);
    if (!this.expectPeek(TOKEN_TYPE.OPEN_PAREN)) {
      return null;
    }
    literal.parameters = this.parseFnParameters()!;
    if (!this.expectPeek(TOKEN_TYPE.OPEN_BRACE)) {
      return null;
    }
    literal.body = this.parseBlockStatement();
    return literal;
  }

  private parseArrLiteral(): Expression | null {
    const literal = new ArrLiteral(this.curToken);
    literal.elements = this.parseExpressionList(TOKEN_TYPE.CLOSE_BRACKET)!;
    return literal;
  }

  private parseHashLiteral(): Expression | null {
    const literal = new HashLiteral(this.curToken);
    while (!this.peekTokenIs(TOKEN_TYPE.CLOSE_BRACE)) {
      this.nextToken();
      const key = this.parseExpression();
      if (!this.expectPeek(TOKEN_TYPE.COLON)) {
        return null;
      }
      this.nextToken();
      const value = this.parseExpression();
      literal.pairs.set(key!, value!);
      if (
        !this.peekTokenIs(TOKEN_TYPE.CLOSE_BRACE) &&
        !this.expectPeek(TOKEN_TYPE.COMMA)
      ) {
        return null;
      }
    }
    if (!this.expectPeek(TOKEN_TYPE.CLOSE_BRACE)) {
      return null;
    }
    return literal;
  }

  private parseExpressionList(end: TOKEN_TYPE): Expression[] | null {
    const list: Expression[] = [];
    if (this.peekTokenIs(end)) {
      this.nextToken();
      return list;
    }
    this.nextToken();
    list.push(this.parseExpression()!);
    while (this.peekTokenIs(TOKEN_TYPE.COMMA)) {
      this.nextToken();
      this.nextToken();
      list.push(this.parseExpression()!);
    }
    if (!this.expectPeek(end)) {
      return null;
    }
    return list;
  }

  private parseFnParameters(): Identifier[] | null {
    const identifiers: Identifier[] = [];
    if (this.peekTokenIs(TOKEN_TYPE.CLOSE_PAREN)) {
      this.nextToken();
      return identifiers;
    }
    this.nextToken();
    identifiers.push(new Identifier(this.curToken, this.curToken.literal));
    while (this.peekTokenIs(TOKEN_TYPE.COMMA)) {
      this.nextToken();
      this.nextToken();
      identifiers.push(new Identifier(this.curToken, this.curToken.literal));
    }
    if (!this.expectPeek(TOKEN_TYPE.CLOSE_PAREN)) {
      return null;
    }
    return identifiers;
  }

  private parseCallExpression(fn: Expression): Expression {
    const expression = new CallExpression(this.curToken, fn);
    expression.args = this.parseExpressionList(TOKEN_TYPE.CLOSE_PAREN)!;
    return expression;
  }

  private parseIndexExpression(left: Expression): Expression | null {
    const expression = new IndexExpression(this.curToken, left);
    this.nextToken();
    expression.index = this.parseExpression()!;
    if (!this.expectPeek(TOKEN_TYPE.CLOSE_BRACKET)) {
      return null;
    }
    return expression;
  }

  private parseBlockStatement(): BlockStatement {
    const block = new BlockStatement(this.curToken);
    this.nextToken();
    while (
      !this.curTokenIs(TOKEN_TYPE.CLOSE_BRACE) &&
      !this.curTokenIs(TOKEN_TYPE.EOF)
    ) {
      const statement = this.parseStatement();
      if (statement) {
        block.statements.push(statement);
      }
      this.nextToken();
    }
    return block;
  }

  private curPrecedence(): number {
    return Parser.precedences[this.curToken.type] ?? PARSER_PRECEDENCE.LOWEST;
  }

  private peekPrecedence(): number {
    return Parser.precedences[this.peekToken.type] ?? PARSER_PRECEDENCE.LOWEST;
  }

  private registerPrefix(
    type: TOKEN_TYPE,
    prefixParseFn: () => Expression | null,
  ) {
    this.prefixParseFns[type] = prefixParseFn;
  }

  private registerInfix(
    type: TOKEN_TYPE,
    infixParseFn: (expression: Expression) => Expression | null,
  ) {
    this.infixParseFns[type] = infixParseFn;
  }
}
