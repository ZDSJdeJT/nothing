import { expect, test } from "bun:test";

import {
  type Obj,
  type Macro,
  Fn,
  Str,
  Integer,
  Bool,
  Err,
  evaluator,
  Lexer,
  Parser,
  Environment,
  Arr,
  Hash,
  nullOfObj,
  Quote,
} from "@/lib";
import { OBJ_TYPE, TOKEN_TYPE, BUILTIN } from "@/enums";
import { defineMacro, expandMacros } from "@/utils";

const testEvaluator = (input: string): Obj => {
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  return evaluator(program, new Environment());
};

const testNullObj = (obj: Obj) => {
  expect(obj).toBe(nullOfObj);
};

const testIntegerObj = (obj: Obj, expected: number) => {
  expect(obj instanceof Integer).toBeTrue();
  const integer = obj as Integer;
  expect(integer.value).toBe(expected);
};

const testStrObj = (obj: Obj, expected: string) => {
  expect(obj instanceof Str).toBeTrue();
  const str = obj as Str;
  expect(str.value).toBe(expected);
};

const testBoolObj = (obj: Obj, expected: boolean) => {
  expect(obj instanceof Bool).toBeTrue();
  const bool = obj as Bool;
  expect(bool.value).toBe(expected);
};

const testErrObj = (obj: Obj, message: string) => {
  expect(obj instanceof Err).toBeTrue();
  const integer = obj as Err;
  expect(integer.message).toBe(message);
};

const testFnObj = (obj: Obj, cb: (arr: Fn) => void) => {
  expect(obj instanceof Fn).toBeTrue();
  cb(obj as Fn);
};

const testArrObj = (obj: Obj, cb: (arr: Arr) => void) => {
  expect(obj instanceof Arr).toBeTrue();
  cb(obj as Arr);
};

const testHashObj = (obj: Obj, cb: (hash: Hash) => void) => {
  expect(obj instanceof Hash).toBeTrue();
  cb(obj as Hash);
};

const testQuoteObj = (obj: Obj, excepted: string) => {
  expect(obj instanceof Quote).toBeTrue();
  const quote = obj as Quote;
  expect(quote.node.string()).toBe(excepted);
};

test(`执行 ${OBJ_TYPE.INTEGER} 表达式`, () => {
  const cases = [
    {
      input: "5",
      expected: 5,
    },
    {
      input: "10",
      expected: 10,
    },
  ];
  cases.forEach(({ input, expected }) => {
    const obj = testEvaluator(input);
    testIntegerObj(obj, expected);
  });
});

test(`执行 ${OBJ_TYPE.BOOL} 表达式`, () => {
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
    const obj = testEvaluator(input);
    testBoolObj(obj, expected);
  });
});

test(`执行 ${TOKEN_TYPE.BANG} 前缀表达式`, () => {
  const cases = [
    {
      input: "!true",
      expected: false,
    },
    {
      input: "!false",
      expected: true,
    },
    {
      input: "!5",
      expected: false,
    },
    {
      input: "!!true",
      expected: true,
    },
    {
      input: "!!false",
      expected: false,
    },
    {
      input: "!!5",
      expected: true,
    },
  ];
  cases.forEach(({ input, expected }) => {
    const obj = testEvaluator(input);
    testBoolObj(obj, expected);
  });
});

test(`执行 ${TOKEN_TYPE.MINUS} 前缀表达式`, () => {
  const cases = [
    {
      input: "5",
      expected: 5,
    },
    {
      input: "10",
      expected: 10,
    },
    {
      input: "-5",
      expected: -5,
    },
    {
      input: "-10",
      expected: -10,
    },
  ];
  cases.forEach(({ input, expected }) => {
    const obj = testEvaluator(input);
    testIntegerObj(obj, expected);
  });
});

test(`执行 ${TOKEN_TYPE.MINUS} 中缀表达式`, () => {
  const integerCases = [
    {
      input: "5 + 5 + 5 + 5 -10",
      expected: 10,
    },
    {
      input: "2 * 2 * 2 * 2 * 2",
      expected: 32,
    },
    {
      input: "-50 + 100 + -50",
      expected: 0,
    },
    {
      input: "5 * 2 + 10",
      expected: 20,
    },
    {
      input: "5 + 2 * 10",
      expected: 25,
    },
    {
      input: "20 + 2 * -10",
      expected: 0,
    },
    {
      input: "50 / 2 * 2 + 10",
      expected: 60,
    },
    {
      input: "2 * (5 + 10)",
      expected: 30,
    },
    {
      input: "3 * 3 * 3 + 10",
      expected: 37,
    },
    {
      input: "3 * (3 * 3) + 10",
      expected: 37,
    },
    {
      input: "(5 + 10 * 2 + 15 / 3) * 2 + -10",
      expected: 50,
    },
  ];
  integerCases.forEach(({ input, expected }) => {
    const obj = testEvaluator(input);
    testIntegerObj(obj, expected);
  });
  const boolCases = [
    {
      input: "1 < 2",
      expected: true,
    },
    {
      input: "1 > 2",
      expected: false,
    },
    {
      input: "1 < 1",
      expected: false,
    },
    {
      input: "1 > 1",
      expected: false,
    },
    {
      input: "1 == 1",
      expected: true,
    },
    {
      input: "1 != 1",
      expected: false,
    },
    {
      input: "1 == 2",
      expected: false,
    },
    {
      input: "1 != 2",
      expected: true,
    },
    {
      input: "true == true",
      expected: true,
    },
    {
      input: "false == false",
      expected: true,
    },
    {
      input: "true == false",
      expected: false,
    },
    {
      input: "true != false",
      expected: true,
    },
    {
      input: "false != true",
      expected: true,
    },
    {
      input: "(1 < 2) == true",
      expected: true,
    },
    {
      input: "(1 < 2) == false",
      expected: false,
    },
    {
      input: "(1 > 2) == true",
      expected: false,
    },
    {
      input: "(1 > 2) == false",
      expected: true,
    },
  ];
  boolCases.forEach(({ input, expected }) => {
    const obj = testEvaluator(input);
    testBoolObj(obj, expected);
  });
});

test(`执行 ${TOKEN_TYPE.IF} - ${TOKEN_TYPE.ELSE} 语句`, () => {
  const cases = [
    {
      input: "if (true) { 10 }",
      expected: 10,
    },
    {
      input: "if (false) { 10 }",
      expected: null,
    },
    {
      input: "if (1) { 10 }",
      expected: 10,
    },
    {
      input: "if (1 < 2) { 10 }",
      expected: 10,
    },
    {
      input: "if (1 > 2) { 10 }",
      expected: null,
    },
    {
      input: "if (1 > 2) { 10 } else { 20 }",
      expected: 20,
    },
    {
      input: "if (1 < 2) { 10 } else { 20 }",
      expected: 10,
    },
  ];
  cases.forEach(({ input, expected }) => {
    const obj = testEvaluator(input);
    expected === null ? testNullObj(obj) : testIntegerObj(obj, expected);
  });
});

test(`执行 ${TOKEN_TYPE.RETURN} 语句`, () => {
  const cases = [
    {
      input: "return 10;",
      expected: 10,
    },
    {
      input: "return 10; 9;",
      expected: 10,
    },
    {
      input: "return 2 * 5; 9;",
      expected: 10,
    },
    {
      input: "9; return 2 * 5; 9;",
      expected: 10,
    },
    {
      input: `if (10 > 1) {
        if (10 > 1) {
          return 10;
        }

        return 1;
      }`,
      expected: 10,
    },
  ];
  cases.forEach(({ input, expected }) => {
    const obj = testEvaluator(input);
    testIntegerObj(obj, expected);
  });
});

test("错误处理", () => {
  const cases = [
    {
      input: "5 + true;",
      expected: `type mismatch: ${OBJ_TYPE.INTEGER} + ${OBJ_TYPE.BOOL}`,
    },
    {
      input: "5 + true; 5;",
      expected: `type mismatch: ${OBJ_TYPE.INTEGER} + ${OBJ_TYPE.BOOL}`,
    },
    {
      input: "-true;",
      expected: `unknown operator: -${OBJ_TYPE.BOOL}`,
    },
    {
      input: "true + false;",
      expected: `unknown operator: ${OBJ_TYPE.BOOL} + ${OBJ_TYPE.BOOL}`,
    },
    {
      input: "5; true + false; 5",
      expected: `unknown operator: ${OBJ_TYPE.BOOL} + ${OBJ_TYPE.BOOL}`,
    },
    {
      input: "if (10 > 1) { true + false; }",
      expected: `unknown operator: ${OBJ_TYPE.BOOL} + ${OBJ_TYPE.BOOL}`,
    },
    {
      input: `if (10 > 1) {
          return true + false;
      }
          
      return 1;`,
      expected: `unknown operator: ${OBJ_TYPE.BOOL} + ${OBJ_TYPE.BOOL}`,
    },
    {
      input: "foobar",
      expected: "identifier not found: foobar",
    },
    {
      input: '"Hello" - "World"',
      expected: `unknown operator: ${OBJ_TYPE.STR} - ${OBJ_TYPE.STR}`,
    },
  ];
  cases.forEach(({ input, expected }) => {
    const obj = testEvaluator(input);
    testErrObj(obj, expected);
  });
});

test(`执行 ${TOKEN_TYPE.LET} 语句`, () => {
  const cases = [
    {
      input: "let a = 5; a;",
      expected: 5,
    },
    {
      input: "let a = 5 * 5; a;",
      expected: 25,
    },
    {
      input: "let a = 5; let b = a; b;",
      expected: 5,
    },
    {
      input: "let a = 5; let b = a; let c = a + b + 5; c;",
      expected: 15,
    },
  ];
  cases.forEach(({ input, expected }) => {
    const obj = testEvaluator(input);
    testIntegerObj(obj, expected);
  });
});

test(`定义 ${OBJ_TYPE.FN}`, () => {
  testFnObj(testEvaluator("fn(x) { x + 2; };"), (fn) => {
    expect(fn.parameters).toBeArrayOfSize(1);
    expect(fn.parameters[0].string()).toBe("x");
    expect(fn.body.string()).toBe("(x + 2)");
  });
});

test(`${OBJ_TYPE.FN} 调用`, () => {
  const cases = [
    {
      input: "let identity = fn(x) { x; }; identity(5);",
      expected: 5,
    },
    {
      input: "let identity = fn(x) { return x; }; identity(5);",
      expected: 5,
    },
    {
      input: "let double = fn(x) { x * 2; }; double(5);",
      expected: 10,
    },
    {
      input: "let add = fn(x, y) { x + y; }; add(5, 5);",
      expected: 10,
    },
    {
      input: "let add = fn(x, y) { x + y; }; add(5 + 5, add(5, 5));",
      expected: 20,
    },
    {
      input: "fn(x) { x; }(5)",
      expected: 5,
    },
  ];
  cases.forEach(({ input, expected }) => {
    const obj = testEvaluator(input);
    testIntegerObj(obj, expected);
  });
});

test(`定义 ${OBJ_TYPE.STR}`, () => {
  testStrObj(testEvaluator('"hello world";'), "hello world");
});

test(`${OBJ_TYPE.STR} 拼接`, () => {
  const cases = [
    {
      input: '"hello" + "world";',
      expected: "helloworld",
    },
    {
      input: '"hello" + " " + "world";',
      expected: "hello world",
    },
  ];
  cases.forEach(({ input, expected }) => {
    testStrObj(testEvaluator(input), expected);
  });
});

test(`内置 ${OBJ_TYPE.FN} - ${BUILTIN.LEN}`, () => {
  const normalCases = [
    {
      input: 'len("")',
      expected: 0,
    },
    {
      input: 'len("four")',
      expected: 4,
    },
    {
      input: 'len("hello world")',
      expected: 11,
    },
  ];
  normalCases.forEach(({ input, expected }) => {
    testIntegerObj(testEvaluator(input), expected);
  });
  const errorCases = [
    {
      input: "len(1)",
      expected: "argument to `len` not supported, got INTEGER",
    },
    {
      input: 'len("one", "two")',
      expected: "wrong number of arguments. got=2, want=1",
    },
  ];
  errorCases.forEach(({ input, expected }) => {
    testErrObj(testEvaluator(input), expected);
  });
});

test(`定义 ${OBJ_TYPE.ARR}`, () => {
  testArrObj(testEvaluator("[1, 2 * 2, 3 + 3]"), (arr) => {
    expect(arr.elements).toBeArrayOfSize(3);
    testIntegerObj(arr.elements[0], 1);
    testIntegerObj(arr.elements[1], 4);
    testIntegerObj(arr.elements[2], 6);
  });
});

test(`访问 ${OBJ_TYPE.ARR} 索引`, () => {
  const normalCases = [
    {
      input: "[1, 2, 3][0]",
      expected: 1,
    },
    {
      input: "[1, 2, 3][1]",
      expected: 2,
    },
    {
      input: "[1, 2, 3][2]",
      expected: 3,
    },
    {
      input: "let i = 0; [1][i];",
      expected: 1,
    },
    {
      input: "[1, 2, 3][1 + 1];",
      expected: 3,
    },
    {
      input: "let myArr = [1, 2, 3]; myArr[2];",
      expected: 3,
    },
    {
      input: "let myArr = [1, 2, 3]; myArr[0] + myArr[1] + myArr[2];",
      expected: 6,
    },
    {
      input: "let myArr = [1, 2, 3]; let i = myArr[0]; myArr[i]",
      expected: 2,
    },
  ];
  normalCases.forEach(({ input, expected }) => {
    testIntegerObj(testEvaluator(input), expected);
  });
  const nullCases = ["[1, 2, 3][3]", "[1, 2, 3][-1]"];
  nullCases.forEach((item) => {
    testNullObj(testEvaluator(item));
  });
});

test(`定义 ${OBJ_TYPE.HASH}`, () => {
  const input = `let two = "two";
{
  "one": 10 - 9,
  two: 1 + 1,
  "thr" + "ee": 6 / 2,
  4: 4,
  true: 5,
  false: 6,  
}`;
  testHashObj(testEvaluator(input), (hash) => {
    const expected: { key: (obj: Obj) => void; value: (obj: Obj) => void }[] = [
      {
        key: (obj) => {
          testStrObj(obj, "one");
        },
        value: (obj) => {
          testIntegerObj(obj, 1);
        },
      },
      {
        key: (obj) => {
          testStrObj(obj, "two");
        },
        value: (obj) => {
          testIntegerObj(obj, 2);
        },
      },
      {
        key: (obj) => {
          testStrObj(obj, "three");
        },
        value: (obj) => {
          testIntegerObj(obj, 3);
        },
      },
      {
        key: (obj) => {
          testIntegerObj(obj, 4);
        },
        value: (obj) => {
          testIntegerObj(obj, 4);
        },
      },
      {
        key: (obj) => {
          testBoolObj(obj, true);
        },
        value: (obj) => {
          testIntegerObj(obj, 5);
        },
      },
      {
        key: (obj) => {
          testBoolObj(obj, false);
        },
        value: (obj) => {
          testIntegerObj(obj, 6);
        },
      },
    ];
    expect(hash.pairs.size).toBe(expected.length);
    let index = 0;
    hash.pairs.forEach(({ key, value }) => {
      expected[index].key(key);
      expected[index].value(value);
      index++;
    });
  });
});

test(`访问 ${OBJ_TYPE.HASH} 索引`, () => {
  const cases = [
    {
      input: '{"foo": 5}["foo"]',
      expected: 5,
    },
    {
      input: "{5: 5}[5]",
      expected: 5,
    },
    {
      input: "{true: 5}[true]",
      expected: 5,
    },
  ];
  cases.forEach(({ input, expected }) => {
    testIntegerObj(testEvaluator(input), expected);
  });
});

test(`内置 ${OBJ_TYPE.FN} - ${BUILTIN.QUOTE}`, () => {
  const cases = [
    {
      input: "quote(5 + 8)",
      expected: "(5 + 8)",
    },
    {
      input: "quote(5)",
      expected: "5",
    },
    {
      input: "quote(foobar)",
      expected: "foobar",
    },
    {
      input: "quote(foo + bar)",
      expected: "(foo + bar)",
    },
  ];
  cases.forEach(({ input, expected }) => {
    const evaluated = testEvaluator(input);
    testQuoteObj(evaluated, expected);
  });
});

test(`内置 ${OBJ_TYPE.FN} - ${BUILTIN.UNQUOTE}`, () => {
  const cases = [
    {
      input: "quote(unquote(4))",
      expected: "4",
    },
    {
      input: "quote(unquote(4 + 4))",
      expected: "8",
    },
    {
      input: "quote(8 + unquote(4 + 4))",
      expected: "(8 + 8)",
    },
    {
      input: "quote(unquote(4 + 4) + 8)",
      expected: "(8 + 8)",
    },
    {
      input: "quote(unquote(quote(4 + 4)))",
      expected: "(4 + 4)",
    },
    {
      input: "quote(unquote(quote([1])))",
      expected: "[1]",
    },
    {
      input: "quote(unquote(quote(fn(a) {a})))",
      expected: `fn(a) {
  a
}`,
    },
    {
      input: 'quote(unquote(quote("foo")))',
      expected: "foo",
    },
    {
      input: "quote(unquote(quote({1: 2})))",
      expected: "{1: 2}",
    },
  ];
  cases.forEach(({ input, expected }) => {
    const evaluated = testEvaluator(input);
    testQuoteObj(evaluated, expected);
  });
});

test(`定义 ${OBJ_TYPE.MACRO}`, () => {
  const input = "let myMacro = macro(x, y) { x + y; };";
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  const environment = new Environment();
  defineMacro(program, environment);
  const myMacro = environment.get("myMacro") as Macro;
  expect(myMacro.parameters).toBeArrayOfSize(2);
  expect(myMacro.parameters[0].string()).toBe("x");
  expect(myMacro.body.string()).toBe("(x + y)");
});

test(`扩展 ${OBJ_TYPE.MACRO}`, () => {
  const cases = [
    {
      input: `let infixExpression = macro() { quote(1 + 2); };

infixExpression();`,
      expected: "(1 + 2)",
    },
    {
      input: `let reverse = macro(a, b) { quote(unquote(b) - unquote(a)); };

reverse(2 + 2, 10 - 5);`,
      expected: "((10 - 5) - (2 + 2))",
    },
  ];
  cases.forEach(({ input, expected }) => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    const environment = new Environment();
    defineMacro(program, environment);
    const expanded = expandMacros(program, environment);
    expect(expanded.string()).toBe(expected);
  });
});
