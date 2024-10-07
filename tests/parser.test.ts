import { expect, test } from "bun:test";

import {
  type Expression,
  type Statement,
  type MacroLiteral,
  Lexer,
  Parser,
  Program,
  LetStatement,
  ExpressionStatement,
  Identifier,
  IntegerLiteral,
  StrLiteral,
  BoolLiteral,
  PrefixExpression,
  InfixExpression,
  IfExpression,
  FnLiteral,
  CallExpression,
  ArrLiteral,
  IndexExpression,
  HashLiteral,
} from "@/lib";
import { TOKEN_TYPE, TOKEN_LITERAL } from "@/enums";

const testLetStatement = (statement: Statement): LetStatement => {
  expect(statement instanceof LetStatement).toBeTrue();
  return statement as LetStatement;
};

const testIdentifier = (expression: Expression, value: string) => {
  expect(expression instanceof Identifier).toBeTrue();
  const identifier = expression as Identifier;
  expect(identifier.value).toBe(value);
  expect(identifier.tokenLiteral()).toBe(value);
};

const testIntegerLiteral = (expression: Expression, value: number) => {
  expect(expression instanceof IntegerLiteral).toBeTrue();
  const integerLiteral = expression as IntegerLiteral;
  expect(integerLiteral.value).toBe(value);
  expect(integerLiteral.tokenLiteral()).toBe(String(value));
};

const testStrLiteral = (expression: Expression, value: string) => {
  expect(expression instanceof StrLiteral).toBeTrue();
  const integerLiteral = expression as StrLiteral;
  expect(integerLiteral.value).toBe(value);
  expect(integerLiteral.tokenLiteral()).toBe(value);
};

const testBoolLiteral = (expression: Expression, value: boolean) => {
  expect(expression instanceof BoolLiteral).toBeTrue();
  const boolLiteral = expression as BoolLiteral;
  expect(boolLiteral.value).toBe(value);
  expect(boolLiteral.tokenLiteral()).toBe(String(value));
};

const testExpressionStatement = (statement: Statement): ExpressionStatement => {
  expect(statement instanceof ExpressionStatement).toBeTrue();
  return statement as ExpressionStatement;
};

const testPrefixExpression = (
  expression: Expression,
  operator: TOKEN_LITERAL,
  right: number,
) => {
  expect(expression instanceof PrefixExpression).toBeTrue();
  const prefix = expression as PrefixExpression;
  expect(prefix.operator).toBe(operator);
  testIntegerLiteral(prefix.right!, right);
};

const testIntegerInfixExpression = (
  expression: Expression,
  left: number,
  operator: TOKEN_LITERAL,
  right: number,
) => {
  expect(expression instanceof InfixExpression).toBeTrue();
  const infix = expression as InfixExpression;
  expect(infix.operator).toBe(operator);
  testIntegerLiteral(infix.left, left);
  testIntegerLiteral(infix.right!, right);
};

const testIdentifierInfixExpression = (
  expression: Expression,
  left: string,
  operator: TOKEN_LITERAL,
  right: string,
) => {
  expect(expression instanceof InfixExpression).toBeTrue();
  const infix = expression as InfixExpression;
  expect(infix.operator).toBe(operator);
  testIdentifier(infix.left, left);
  testIdentifier(infix.right!, right);
};

const testIfExpression = (expression: Expression): IfExpression => {
  expect(expression instanceof IfExpression).toBeTrue();
  return expression as IfExpression;
};

const testFnLiteral = (expression: Expression): FnLiteral => {
  expect(expression instanceof FnLiteral).toBeTrue();
  return expression as FnLiteral;
};

const testCallExpression = (expression: Expression): CallExpression => {
  expect(expression instanceof CallExpression).toBeTrue();
  return expression as CallExpression;
};

const testArrLiteral = (expression: Expression): ArrLiteral => {
  expect(expression instanceof ArrLiteral).toBeTrue();
  return expression as ArrLiteral;
};

const testIndexExpression = (expression: Expression): IndexExpression => {
  expect(expression instanceof IndexExpression).toBeTrue();
  return expression as IndexExpression;
};

const testHashLiteral = (expression: Expression): HashLiteral => {
  expect(expression instanceof HashLiteral).toBeTrue();
  return expression as HashLiteral;
};

const testMacroLiteral = (statement: Statement): MacroLiteral => {
  expect(statement instanceof ExpressionStatement).toBeTrue();
  return (statement as ExpressionStatement).expression as MacroLiteral;
};

test(`解析 ${TOKEN_TYPE.LET} 语句`, () => {
  const cases = [
    {
      input: "let x = 5;",
      name: "x",
      value: "5",
    },
    {
      input: "let y = true;",
      name: "y",
      value: "true",
    },
    {
      input: "let foobar = y;",
      name: "foobar",
      value: "y",
    },
  ];
  cases.forEach(({ input, name, value }) => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    expect(parser.errors).toBeArrayOfSize(0);
    expect(program.statements).toBeArrayOfSize(1);
    const statement = testLetStatement(program.statements[0]);
    expect(statement.name!.value).toBe(name);
    expect(statement.name!.tokenLiteral()).toBe(name);
    expect(statement.value!.string()).toBe(value);
    expect(statement.value!.tokenLiteral()).toBe(value);
  });
});

test(`解析 ${TOKEN_TYPE.RETURN} 语句`, () => {
  const input = `return 5;
return 10;
return 993322;
`;
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  expect(parser.errors).toBeArrayOfSize(0);
  expect(program.statements).toBeArrayOfSize(3);
  program.statements.forEach((statement) => {
    expect(statement.tokenLiteral()).toBe(TOKEN_LITERAL.RETURN);
  });
});

test(`逆向生成 ${TOKEN_TYPE.LET} 语句`, () => {
  const program = new Program();
  program.statements = [
    new LetStatement(
      { type: TOKEN_TYPE.LET, literal: "let" },
      new Identifier(
        { type: TOKEN_TYPE.IDENTIFIER, literal: "myVar" },
        "myVar",
      ),
      new Identifier(
        { type: TOKEN_TYPE.IDENTIFIER, literal: "anotherVar" },
        "anotherVar",
      ),
    ),
  ];
  expect(program.string()).toBe("let myVar = anotherVar;");
});

test(`解析 ${TOKEN_TYPE.IDENTIFIER}`, () => {
  const input = "foobar;";
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  expect(parser.errors).toBeArrayOfSize(0);
  expect(program.statements).toBeArrayOfSize(1);
  const statement = testExpressionStatement(program.statements[0]);
  testIdentifier(statement.expression!, "foobar");
});

test(`解析 ${TOKEN_TYPE.INTEGER} 字面量`, () => {
  const input = "5;";
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  expect(parser.errors).toBeArrayOfSize(0);
  expect(program.statements).toBeArrayOfSize(1);
  const statement = testExpressionStatement(program.statements[0]);
  testIntegerLiteral(statement.expression!, 5);
});

test(`${TOKEN_TYPE.INTEGER} 字面量解析错误`, () => {
  const input = "1111111111110000000000000000000111111111111111;";
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  parser.parseProgram();
  expect(parser.errors).toEqual([
    "Could not parse 1111111111110000000000000000000111111111111111 as integer.",
  ]);
});

test("解析前缀表达式", () => {
  const cases = [
    {
      input: "!5;",
      operator: TOKEN_LITERAL.BANG,
      value: 5,
    },
    {
      input: "-15;",
      operator: TOKEN_LITERAL.MINUS,
      value: 15,
    },
  ];
  cases.forEach(({ input, operator, value }) => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    expect(parser.errors).toBeArrayOfSize(0);
    expect(program.statements).toBeArrayOfSize(1);
    const statement = testExpressionStatement(program.statements[0]);
    testPrefixExpression(statement.expression!, operator, value);
  });
});

test("解析中缀表达式", () => {
  const operators = [
    TOKEN_LITERAL.PLUS,
    TOKEN_LITERAL.MINUS,
    TOKEN_LITERAL.ASTERISK,
    TOKEN_LITERAL.SLASH,
    TOKEN_LITERAL.GT,
    TOKEN_LITERAL.LT,
    TOKEN_LITERAL.EQ,
    TOKEN_LITERAL.NOT_EQ,
  ];
  const cases = operators.map((operator) => ({
    operator,
    input: `5 ${operator} 5;`,
    left: 5,
    right: 5,
  }));
  cases.forEach(({ operator, input, left, right }) => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    expect(parser.errors).toBeArrayOfSize(0);
    expect(program.statements).toBeArrayOfSize(1);
    const statement = testExpressionStatement(program.statements[0]);
    testIntegerInfixExpression(statement.expression!, left, operator, right);
  });
});

test("逆向生成中缀表达式", () => {
  const cases = [
    {
      input: "-a * b",
      expected: "((-a) * b)",
    },
    {
      input: "!-a",
      expected: "(!(-a))",
    },
    {
      input: "a + b + c",
      expected: "((a + b) + c)",
    },
    {
      input: "a + b - c",
      expected: "((a + b) - c)",
    },
    {
      input: "a * b * c",
      expected: "((a * b) * c)",
    },
    {
      input: "a * b / c",
      expected: "((a * b) / c)",
    },
    {
      input: "a + b / c",
      expected: "(a + (b / c))",
    },
    {
      input: "a + b * c + d / e - f",
      expected: "(((a + (b * c)) + (d / e)) - f)",
    },
    {
      input: "3 + 4; -5 * 5",
      expected: "(3 + 4)((-5) * 5)",
    },
    {
      input: "5 > 4 == 3 < 4",
      expected: "((5 > 4) == (3 < 4))",
    },
    {
      input: "5 < 4 != 3 > 4",
      expected: "((5 < 4) != (3 > 4))",
    },
    {
      input: "3 + 4 * 5 == 3 * 1 + 4 * 5",
      expected: "((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))",
    },
  ];
  cases.forEach(({ input, expected }) => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    expect(parser.errors).toBeArrayOfSize(0);
    expect(program.string()).toBe(expected);
  });
});

test(`解析 ${TOKEN_TYPE.TRUE} / ${TOKEN_TYPE.FALSE} 字面量`, () => {
  const cases = [
    {
      input: "true",
      expected: true,
    },
    {
      input: "false",
      expected: false,
    },
  ];
  cases.forEach(({ input, expected }) => {
    const lexer = new Lexer(`${input};`);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    expect(parser.errors).toBeArrayOfSize(0);
    expect(program.statements).toBeArrayOfSize(1);
    const statement = testExpressionStatement(program.statements[0]);
    testBoolLiteral(statement.expression!, expected);
  });
});

test("解析分组表达式", () => {
  const cases = [
    {
      input: "1 + (2 + 3) + 4",
      expected: "((1 + (2 + 3)) + 4)",
    },
    {
      input: "(5 + 5) * 2",
      expected: "((5 + 5) * 2)",
    },
    {
      input: "2 / (5 + 5)",
      expected: "(2 / (5 + 5))",
    },
    {
      input: "-(5 + 5)",
      expected: "(-(5 + 5))",
    },
    {
      input: "!(true == true)",
      expected: "(!(true == true))",
    },
    {
      input: "a * [1, 2, 3, 4][b * c] * d",
      expected: "((a * ([1, 2, 3, 4][(b * c)])) * d)",
    },
    {
      input: "add(a * b[2], b[1], 2 * [1, 2][1])",
      expected: "add((a * (b[2])), (b[1]), (2 * ([1, 2][1])))",
    },
  ];
  cases.forEach(({ input, expected }) => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    expect(parser.errors).toBeArrayOfSize(0);
    expect(program.string()).toBe(expected);
  });
});

test(`解析 ${TOKEN_TYPE.IF} 表达式`, () => {
  const input = "if (x < y) { x }";
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  expect(parser.errors).toBeArrayOfSize(0);
  expect(program.statements).toBeArrayOfSize(1);
  const expression = testIfExpression(
    testExpressionStatement(program.statements[0]).expression!,
  );
  testIdentifierInfixExpression(
    expression.condition,
    "x",
    TOKEN_LITERAL.LT,
    "y",
  );
  expect(expression.consequence.statements).toBeArrayOfSize(1);
  const statement = testExpressionStatement(
    expression.consequence.statements[0],
  );
  testIdentifier(statement.expression!, "x");
  expect(expression.alternative).toBeNull();
});

test(`解析 ${TOKEN_TYPE.IF}-${TOKEN_TYPE.ELSE} 表达式`, () => {
  const input = "if (x < y) { x } else { y }";
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  expect(parser.errors).toBeArrayOfSize(0);
  expect(program.statements).toBeArrayOfSize(1);
  const expression = testIfExpression(
    testExpressionStatement(program.statements[0]).expression!,
  );
  testIdentifierInfixExpression(
    expression.condition,
    "x",
    TOKEN_LITERAL.LT,
    "y",
  );
  expect(expression.consequence.statements).toBeArrayOfSize(1);
  const consequence = testExpressionStatement(
    expression.consequence.statements[0],
  );
  testIdentifier(consequence.expression!, "x");
  const alternative = testExpressionStatement(
    expression.alternative!.statements[0],
  );
  testIdentifier(alternative.expression!, "y");
});

test(`解析 ${TOKEN_TYPE.FN} 参数列表`, () => {
  const cases = [
    {
      input: "fn() {};",
      expected: [],
    },
    {
      input: "fn(x) {};",
      expected: ["x"],
    },
    {
      input: "fn(x, y, z) {};",
      expected: ["x", "y", "z"],
    },
  ];
  cases.forEach(({ input, expected }) => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    expect(parser.errors).toBeArrayOfSize(0);
    expect(program.statements).toBeArrayOfSize(1);
    const fn = testFnLiteral(
      testExpressionStatement(program.statements[0]).expression!,
    );
    expect(fn.parameters).toBeArrayOfSize(expected.length);
    expected.forEach((value, index) => {
      testIdentifier(fn.parameters[index], value);
    });
  });
});

test(`解析 ${TOKEN_TYPE.FN} 表达式`, () => {
  const input = "fn(x, y) { x + y; }";
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  expect(parser.errors).toBeArrayOfSize(0);
  expect(program.statements).toBeArrayOfSize(1);
  const fn = testFnLiteral(
    testExpressionStatement(program.statements[0]).expression!,
  );
  expect(fn.parameters).toBeArrayOfSize(2);
  testIdentifier(fn.parameters[0], "x");
  testIdentifier(fn.parameters[1], "y");
  expect(fn.body!.statements).toBeArrayOfSize(1);
  const statement = testExpressionStatement(fn.body!.statements[0]);
  testIdentifierInfixExpression(
    statement.expression!,
    "x",
    TOKEN_LITERAL.PLUS,
    "y",
  );
});

test(`解析 ${TOKEN_TYPE.FN} 调用表达式`, () => {
  const input = "add(1, 2 * 3, 4 + 5);";
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  expect(parser.errors).toBeArrayOfSize(0);
  expect(program.statements).toBeArrayOfSize(1);
  const expression = testCallExpression(
    testExpressionStatement(program.statements[0]).expression!,
  );
  testIdentifier(expression.fn, "add");
  expect(expression.args).toBeArrayOfSize(3);
  testIntegerLiteral(expression.args[0], 1);
  testIntegerInfixExpression(expression.args[1], 2, TOKEN_LITERAL.ASTERISK, 3);
  testIntegerInfixExpression(expression.args[2], 4, TOKEN_LITERAL.PLUS, 5);
});

test(`解析 ${TOKEN_TYPE.STR} 字面量`, () => {
  const cases = [
    {
      input: '"hello world";',
      expected: "hello world",
    },
    {
      input: '"helloworld";',
      expected: "helloworld",
    },
  ];
  cases.forEach(({ input, expected }) => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    expect(parser.errors).toBeArrayOfSize(0);
    expect(program.statements).toBeArrayOfSize(1);
    testStrLiteral(
      testExpressionStatement(program.statements[0]).expression!,
      expected,
    );
  });
});

test("解析数组字面量", () => {
  const input = "[1, 2 * 2, 3 + 3]";
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  expect(parser.errors).toBeArrayOfSize(0);
  expect(program.statements).toBeArrayOfSize(1);
  const arr = testArrLiteral(
    testExpressionStatement(program.statements[0]).expression!,
  );
  expect(arr.elements).toBeArrayOfSize(3);
  testIntegerLiteral(arr.elements[0], 1);
  testIntegerInfixExpression(arr.elements[1], 2, TOKEN_LITERAL.ASTERISK, 2);
  testIntegerInfixExpression(arr.elements[2], 3, TOKEN_LITERAL.PLUS, 3);
});

test("解析索引表达式", () => {
  const input = "myArr[1 + 1]";
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  expect(parser.errors).toBeArrayOfSize(0);
  expect(program.statements).toBeArrayOfSize(1);
  const indexExpression = testIndexExpression(
    testExpressionStatement(program.statements[0]).expression!,
  );
  testIdentifier(indexExpression.left, "myArr");
  testIntegerInfixExpression(indexExpression.index!, 1, TOKEN_LITERAL.PLUS, 1);
});

test("解析哈希字面量", () => {
  const input = '{"one": 1, "two": 2, "three": 3}';
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  expect(parser.errors).toBeArrayOfSize(0);
  expect(program.statements).toBeArrayOfSize(1);
  const hash = testHashLiteral(
    testExpressionStatement(program.statements[0]).expression!,
  );
  expect(hash.pairs.size).toBe(3);
  const expected = [
    {
      key: "one",
      value: 1,
    },
    {
      key: "two",
      value: 2,
    },
    {
      key: "three",
      value: 3,
    },
  ];
  let index = 0;
  hash.pairs.forEach((value, key) => {
    testStrLiteral(key, expected[index].key);
    testIntegerLiteral(value, expected[index].value);
    index++;
  });
});

test(`解析 ${TOKEN_TYPE.MACRO} 字面量`, () => {
  const input = "macro(x, y) { x + y; }";
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  expect(parser.errors).toBeArrayOfSize(0);
  expect(program.statements).toBeArrayOfSize(1);
  const macro = testMacroLiteral(program.statements[0]);
  expect(macro.parameters).toBeArrayOfSize(2);
  testIdentifier(macro.parameters[0], "x");
  testIdentifier(macro.parameters[1], "y");
  expect(macro.body!.statements).toBeArrayOfSize(1);
  testIdentifierInfixExpression(
    (macro.body!.statements[0] as ExpressionStatement).expression!,
    "x",
    TOKEN_LITERAL.PLUS,
    "y",
  );
});
