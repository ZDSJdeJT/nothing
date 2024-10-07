import { expect, test } from "bun:test";

import { TOKEN_TYPE, TOKEN_LITERAL } from "@/enums";
import { Lexer } from "@/lib";

test("解析词法单元", () => {
  const input = `let five = 5;
let ten = 10;
let add = fn(x, y) {
    x + y;
};

let result = add(five, ten);
!-/*5;
5 < 10 > 5;

if (5 < 10) {
    return true;
} else {
    return false;
}
    
10 == 10;
10 != 9;
"foobar"
"foo bar"
[1, 2];
{"foo": "bar"}
`;
  const lexer = new Lexer(input);
  const tokens = [];
  while (true) {
    const token = lexer.nextToken();
    tokens.push(token);
    if (token.type === TOKEN_TYPE.EOF) {
      break;
    }
  }
  expect(tokens).toEqual([
    {
      type: TOKEN_TYPE.LET,
      literal: TOKEN_LITERAL.LET,
    },
    {
      type: TOKEN_TYPE.IDENTIFIER,
      literal: "five",
    },
    {
      type: TOKEN_TYPE.ASSIGN,
      literal: TOKEN_LITERAL.ASSIGN,
    },
    {
      type: TOKEN_TYPE.INTEGER,
      literal: "5",
    },
    {
      type: TOKEN_TYPE.SEMICOLON,
      literal: TOKEN_LITERAL.SEMICOLON,
    },
    {
      type: TOKEN_TYPE.LET,
      literal: TOKEN_LITERAL.LET,
    },
    {
      type: TOKEN_TYPE.IDENTIFIER,
      literal: "ten",
    },
    {
      type: TOKEN_TYPE.ASSIGN,
      literal: TOKEN_LITERAL.ASSIGN,
    },
    {
      type: TOKEN_TYPE.INTEGER,
      literal: "10",
    },
    {
      type: TOKEN_TYPE.SEMICOLON,
      literal: TOKEN_LITERAL.SEMICOLON,
    },
    {
      type: TOKEN_TYPE.LET,
      literal: TOKEN_LITERAL.LET,
    },
    {
      type: TOKEN_TYPE.IDENTIFIER,
      literal: "add",
    },
    {
      type: TOKEN_TYPE.ASSIGN,
      literal: TOKEN_LITERAL.ASSIGN,
    },
    {
      type: TOKEN_TYPE.FN,
      literal: TOKEN_LITERAL.FN,
    },
    {
      type: TOKEN_TYPE.OPEN_PAREN,
      literal: TOKEN_LITERAL.OPEN_PAREN,
    },
    {
      type: TOKEN_TYPE.IDENTIFIER,
      literal: "x",
    },
    {
      type: TOKEN_TYPE.COMMA,
      literal: TOKEN_LITERAL.COMMA,
    },
    {
      type: TOKEN_TYPE.IDENTIFIER,
      literal: "y",
    },
    {
      type: TOKEN_TYPE.CLOSE_PAREN,
      literal: TOKEN_LITERAL.CLOSE_PAREN,
    },
    {
      type: TOKEN_TYPE.OPEN_BRACE,
      literal: TOKEN_LITERAL.OPEN_BRACE,
    },
    {
      type: TOKEN_TYPE.IDENTIFIER,
      literal: "x",
    },
    {
      type: TOKEN_TYPE.PLUS,
      literal: TOKEN_LITERAL.PLUS,
    },
    {
      type: TOKEN_TYPE.IDENTIFIER,
      literal: "y",
    },
    {
      type: TOKEN_TYPE.SEMICOLON,
      literal: TOKEN_LITERAL.SEMICOLON,
    },
    {
      type: TOKEN_TYPE.CLOSE_BRACE,
      literal: TOKEN_LITERAL.CLOSE_BRACE,
    },
    {
      type: TOKEN_TYPE.SEMICOLON,
      literal: TOKEN_LITERAL.SEMICOLON,
    },
    {
      type: TOKEN_TYPE.LET,
      literal: TOKEN_LITERAL.LET,
    },
    {
      type: TOKEN_TYPE.IDENTIFIER,
      literal: "result",
    },
    {
      type: TOKEN_TYPE.ASSIGN,
      literal: TOKEN_LITERAL.ASSIGN,
    },
    {
      type: TOKEN_TYPE.IDENTIFIER,
      literal: "add",
    },
    {
      type: TOKEN_TYPE.OPEN_PAREN,
      literal: TOKEN_LITERAL.OPEN_PAREN,
    },
    {
      type: TOKEN_TYPE.IDENTIFIER,
      literal: "five",
    },
    {
      type: TOKEN_TYPE.COMMA,
      literal: TOKEN_LITERAL.COMMA,
    },
    {
      type: TOKEN_TYPE.IDENTIFIER,
      literal: "ten",
    },
    {
      type: TOKEN_TYPE.CLOSE_PAREN,
      literal: TOKEN_LITERAL.CLOSE_PAREN,
    },
    {
      type: TOKEN_TYPE.SEMICOLON,
      literal: TOKEN_LITERAL.SEMICOLON,
    },
    {
      type: TOKEN_TYPE.BANG,
      literal: TOKEN_LITERAL.BANG,
    },
    {
      type: TOKEN_TYPE.MINUS,
      literal: TOKEN_LITERAL.MINUS,
    },
    {
      type: TOKEN_TYPE.SLASH,
      literal: TOKEN_LITERAL.SLASH,
    },
    {
      type: TOKEN_TYPE.ASTERISK,
      literal: TOKEN_LITERAL.ASTERISK,
    },
    {
      type: TOKEN_TYPE.INTEGER,
      literal: "5",
    },
    {
      type: TOKEN_TYPE.SEMICOLON,
      literal: TOKEN_LITERAL.SEMICOLON,
    },
    {
      type: TOKEN_TYPE.INTEGER,
      literal: "5",
    },
    {
      type: TOKEN_TYPE.LT,
      literal: TOKEN_LITERAL.LT,
    },
    {
      type: TOKEN_TYPE.INTEGER,
      literal: "10",
    },
    {
      type: TOKEN_TYPE.GT,
      literal: TOKEN_LITERAL.GT,
    },
    {
      type: TOKEN_TYPE.INTEGER,
      literal: "5",
    },
    {
      type: TOKEN_TYPE.SEMICOLON,
      literal: TOKEN_LITERAL.SEMICOLON,
    },
    {
      type: TOKEN_TYPE.IF,
      literal: TOKEN_LITERAL.IF,
    },
    {
      type: TOKEN_TYPE.OPEN_PAREN,
      literal: TOKEN_LITERAL.OPEN_PAREN,
    },
    {
      type: TOKEN_TYPE.INTEGER,
      literal: "5",
    },
    {
      type: TOKEN_TYPE.LT,
      literal: TOKEN_LITERAL.LT,
    },
    {
      type: TOKEN_TYPE.INTEGER,
      literal: "10",
    },
    {
      type: TOKEN_TYPE.CLOSE_PAREN,
      literal: TOKEN_LITERAL.CLOSE_PAREN,
    },
    {
      type: TOKEN_TYPE.OPEN_BRACE,
      literal: TOKEN_LITERAL.OPEN_BRACE,
    },
    {
      type: TOKEN_TYPE.RETURN,
      literal: TOKEN_LITERAL.RETURN,
    },
    {
      type: TOKEN_TYPE.TRUE,
      literal: TOKEN_LITERAL.TRUE,
    },
    {
      type: TOKEN_TYPE.SEMICOLON,
      literal: TOKEN_LITERAL.SEMICOLON,
    },
    {
      type: TOKEN_TYPE.CLOSE_BRACE,
      literal: TOKEN_LITERAL.CLOSE_BRACE,
    },
    {
      type: TOKEN_TYPE.ELSE,
      literal: TOKEN_LITERAL.ELSE,
    },
    {
      type: TOKEN_TYPE.OPEN_BRACE,
      literal: TOKEN_LITERAL.OPEN_BRACE,
    },
    {
      type: TOKEN_TYPE.RETURN,
      literal: TOKEN_LITERAL.RETURN,
    },
    {
      type: TOKEN_TYPE.FALSE,
      literal: TOKEN_LITERAL.FALSE,
    },
    {
      type: TOKEN_TYPE.SEMICOLON,
      literal: TOKEN_LITERAL.SEMICOLON,
    },
    {
      type: TOKEN_TYPE.CLOSE_BRACE,
      literal: TOKEN_LITERAL.CLOSE_BRACE,
    },
    {
      type: TOKEN_TYPE.INTEGER,
      literal: "10",
    },
    {
      type: TOKEN_TYPE.EQ,
      literal: TOKEN_LITERAL.EQ,
    },
    {
      type: TOKEN_TYPE.INTEGER,
      literal: "10",
    },
    {
      type: TOKEN_TYPE.SEMICOLON,
      literal: TOKEN_LITERAL.SEMICOLON,
    },
    {
      type: TOKEN_TYPE.INTEGER,
      literal: "10",
    },
    {
      type: TOKEN_TYPE.NOT_EQ,
      literal: TOKEN_LITERAL.NOT_EQ,
    },
    {
      type: TOKEN_TYPE.INTEGER,
      literal: "9",
    },
    {
      type: TOKEN_TYPE.SEMICOLON,
      literal: TOKEN_LITERAL.SEMICOLON,
    },
    {
      type: TOKEN_TYPE.STR,
      literal: "foobar",
    },
    {
      type: TOKEN_TYPE.STR,
      literal: "foo bar",
    },
    {
      type: TOKEN_TYPE.OPEN_BRACKET,
      literal: TOKEN_LITERAL.OPEN_BRACKET,
    },
    {
      type: TOKEN_TYPE.INTEGER,
      literal: "1",
    },
    {
      type: TOKEN_TYPE.COMMA,
      literal: TOKEN_LITERAL.COMMA,
    },
    {
      type: TOKEN_TYPE.INTEGER,
      literal: "2",
    },
    {
      type: TOKEN_TYPE.CLOSE_BRACKET,
      literal: TOKEN_LITERAL.CLOSE_BRACKET,
    },
    {
      type: TOKEN_TYPE.SEMICOLON,
      literal: TOKEN_LITERAL.SEMICOLON,
    },
    {
      type: TOKEN_TYPE.OPEN_BRACE,
      literal: TOKEN_LITERAL.OPEN_BRACE,
    },
    {
      type: TOKEN_TYPE.STR,
      literal: "foo",
    },
    {
      type: TOKEN_TYPE.COLON,
      literal: TOKEN_LITERAL.COLON,
    },
    {
      type: TOKEN_TYPE.STR,
      literal: "bar",
    },
    {
      type: TOKEN_TYPE.CLOSE_BRACE,
      literal: TOKEN_LITERAL.CLOSE_BRACE,
    },
    {
      type: TOKEN_TYPE.EOF,
      literal: TOKEN_LITERAL.EOF,
    },
  ]);
});
