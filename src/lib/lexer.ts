import type { Token } from "@/types";
import { TOKEN_TYPE, TOKEN_LITERAL } from "@/enums";

export class Lexer {
  private input: string;

  private readPosition = 0;

  private ch = "";

  private static keywords: { [key: string]: Token } = {
    [TOKEN_LITERAL.LET]: {
      type: TOKEN_TYPE.LET,
      literal: TOKEN_LITERAL.LET,
    },
    [TOKEN_LITERAL.FN]: {
      type: TOKEN_TYPE.FN,
      literal: TOKEN_LITERAL.FN,
    },
    [TOKEN_LITERAL.TRUE]: {
      type: TOKEN_TYPE.TRUE,
      literal: TOKEN_LITERAL.TRUE,
    },
    [TOKEN_LITERAL.FALSE]: {
      type: TOKEN_TYPE.FALSE,
      literal: TOKEN_LITERAL.FALSE,
    },
    [TOKEN_LITERAL.IF]: {
      type: TOKEN_TYPE.IF,
      literal: TOKEN_LITERAL.IF,
    },
    [TOKEN_LITERAL.ELSE]: {
      type: TOKEN_TYPE.ELSE,
      literal: TOKEN_LITERAL.ELSE,
    },
    [TOKEN_LITERAL.RETURN]: {
      type: TOKEN_TYPE.RETURN,
      literal: TOKEN_LITERAL.RETURN,
    },
    [TOKEN_LITERAL.MACRO]: {
      type: TOKEN_TYPE.MACRO,
      literal: TOKEN_LITERAL.MACRO,
    },
  };

  constructor(input: string) {
    this.input = input;
    this.readChar();
  }

  private readChar() {
    if (this.readPosition === this.input.length) {
      this.ch = TOKEN_LITERAL.EOF;
    } else {
      this.ch = this.input[this.readPosition];
    }
    this.readPosition++;
  }

  private isLetter(ch: string): boolean {
    return ("a" <= ch && ch <= "z") || ("A" <= ch && ch <= "Z") || ch === "_";
  }

  private read(fn: (ch: string) => boolean): string {
    let ident = this.ch;
    while (true) {
      this.readChar();
      if (fn(this.ch)) {
        ident += this.ch;
      } else {
        break;
      }
    }
    return ident;
  }

  private readString(): string {
    let string = "";
    while (true) {
      this.readChar();
      if (this.ch === TOKEN_LITERAL.STR || !this.ch) {
        break;
      }
      string += this.ch;
    }
    return string;
  }

  private isDigit(ch: string): boolean {
    return "0" <= ch && ch <= "9";
  }

  private skipWhitespace() {
    while (
      this.ch === " " ||
      this.ch === "\t" ||
      this.ch === "\n" ||
      this.ch === "\r"
    ) {
      this.readChar();
    }
  }

  private peekChar(): string {
    if (this.readPosition === this.input.length) {
      return TOKEN_LITERAL.EOF;
    }
    return this.input[this.readPosition];
  }

  public nextToken(): Token {
    this.skipWhitespace();
    let token: Token;
    switch (this.ch) {
      case TOKEN_LITERAL.OPEN_PAREN:
        token = {
          type: TOKEN_TYPE.OPEN_PAREN,
          literal: TOKEN_LITERAL.OPEN_PAREN,
        };
        break;
      case TOKEN_LITERAL.CLOSE_PAREN:
        token = {
          type: TOKEN_TYPE.CLOSE_PAREN,
          literal: TOKEN_LITERAL.CLOSE_PAREN,
        };
        break;
      case TOKEN_LITERAL.OPEN_BRACE:
        token = {
          type: TOKEN_TYPE.OPEN_BRACE,
          literal: TOKEN_LITERAL.OPEN_BRACE,
        };
        break;
      case TOKEN_LITERAL.CLOSE_BRACE:
        token = {
          type: TOKEN_TYPE.CLOSE_BRACE,
          literal: TOKEN_LITERAL.CLOSE_BRACE,
        };
        break;
      case TOKEN_LITERAL.OPEN_BRACKET:
        token = {
          type: TOKEN_TYPE.OPEN_BRACKET,
          literal: TOKEN_LITERAL.OPEN_BRACKET,
        };
        break;
      case TOKEN_LITERAL.CLOSE_BRACKET:
        token = {
          type: TOKEN_TYPE.CLOSE_BRACKET,
          literal: TOKEN_LITERAL.CLOSE_BRACKET,
        };
        break;
      case TOKEN_LITERAL.COMMA:
        token = {
          type: TOKEN_TYPE.COMMA,
          literal: TOKEN_LITERAL.COMMA,
        };
        break;
      case TOKEN_LITERAL.SEMICOLON:
        token = {
          type: TOKEN_TYPE.SEMICOLON,
          literal: TOKEN_LITERAL.SEMICOLON,
        };
        break;
      case TOKEN_LITERAL.COLON:
        token = {
          type: TOKEN_TYPE.COLON,
          literal: TOKEN_LITERAL.COLON,
        };
        break;
      case TOKEN_LITERAL.ASSIGN:
        if (this.peekChar() === TOKEN_LITERAL.ASSIGN) {
          this.readChar();
          token = {
            type: TOKEN_TYPE.EQ,
            literal: TOKEN_LITERAL.EQ,
          };
        } else {
          token = {
            type: TOKEN_TYPE.ASSIGN,
            literal: TOKEN_LITERAL.ASSIGN,
          };
        }
        break;
      case TOKEN_LITERAL.PLUS:
        token = {
          type: TOKEN_TYPE.PLUS,
          literal: TOKEN_LITERAL.PLUS,
        };
        break;
      case TOKEN_LITERAL.MINUS:
        token = {
          type: TOKEN_TYPE.MINUS,
          literal: TOKEN_LITERAL.MINUS,
        };
        break;
      case TOKEN_LITERAL.BANG:
        if (this.peekChar() === TOKEN_LITERAL.ASSIGN) {
          this.readChar();
          token = {
            type: TOKEN_TYPE.NOT_EQ,
            literal: TOKEN_LITERAL.NOT_EQ,
          };
        } else {
          token = {
            type: TOKEN_TYPE.BANG,
            literal: TOKEN_LITERAL.BANG,
          };
        }
        break;
      case TOKEN_LITERAL.ASTERISK:
        token = {
          type: TOKEN_TYPE.ASTERISK,
          literal: TOKEN_LITERAL.ASTERISK,
        };
        break;
      case TOKEN_LITERAL.SLASH:
        token = {
          type: TOKEN_TYPE.SLASH,
          literal: TOKEN_LITERAL.SLASH,
        };
        break;
      case TOKEN_LITERAL.LT:
        token = {
          type: TOKEN_TYPE.LT,
          literal: TOKEN_LITERAL.LT,
        };
        break;
      case TOKEN_LITERAL.GT:
        token = {
          type: TOKEN_TYPE.GT,
          literal: TOKEN_LITERAL.GT,
        };
        break;
      case TOKEN_LITERAL.STR:
        token = {
          type: TOKEN_TYPE.STR,
          literal: this.readString(),
        };
        break;
      case TOKEN_LITERAL.EOF:
        token = {
          type: TOKEN_TYPE.EOF,
          literal: TOKEN_LITERAL.EOF,
        };
        break;
      default:
        if (this.isLetter(this.ch)) {
          const ident = this.read(this.isLetter);
          return (
            Lexer.keywords[ident] ?? {
              type: TOKEN_TYPE.IDENTIFIER,
              literal: ident,
            }
          );
        }
        if (this.isDigit(this.ch)) {
          return {
            type: TOKEN_TYPE.INTEGER,
            literal: this.read(this.isDigit),
          };
        }
        token = {
          type: TOKEN_TYPE.ILLEGAL,
          literal: TOKEN_LITERAL.ILLEGAL,
        };
    }
    this.readChar();
    return token;
  }
}
