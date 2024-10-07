import {
  type Obj,
  type Expression,
  type Program,
  type BlockStatement,
  type IfExpression,
  type Statement,
  type Node,
  Environment,
  Integer,
  Str,
  Bool,
  trueOfBool,
  falseOfBool,
  nullOfObj,
  ReturnValue,
  Err,
  Fn,
  BuiltIn,
  builtins,
  Arr,
  evaluator,
  Hash,
  Identifier,
  LetStatement,
  MacroLiteral,
  Macro,
  CallExpression,
  Quote,
} from "@/lib";
import { OBJ_TYPE, TOKEN_TYPE } from "@/enums";
import { modify } from "@/utils";

export const isErr = (obj: Obj) => obj instanceof Err;

export const evalProgram = (
  program: Program,
  environment: Environment,
): Obj => {
  let result = nullOfObj;
  for (let i = 0; i < program.statements.length; i++) {
    result = evaluator(program.statements[i], environment);
    if (result instanceof ReturnValue) {
      return result.value;
    }
    if (result instanceof Err) {
      return result;
    }
  }
  return result;
};

export const evalBlockStatement = (
  blockStatement: BlockStatement,
  environment: Environment,
): Obj => {
  let result = nullOfObj;
  for (let i = 0; i < blockStatement.statements.length; i++) {
    result = evaluator(blockStatement.statements[i], environment);
    if (result instanceof ReturnValue || result instanceof Err) {
      return result;
    }
  }
  return result;
};

export const isTruthy = (obj: Obj): boolean => {
  switch (obj) {
    case trueOfBool:
      return true;
    case falseOfBool:
      return false;
    case nullOfObj:
      return false;
    default:
      return true;
  }
};

export const evalIfExpression = (
  expression: IfExpression,
  environment: Environment,
): Obj => {
  const condition = evaluator(expression.condition, environment);
  if (isErr(condition)) {
    return condition;
  }
  if (isTruthy(condition)) {
    return evaluator(expression.consequence, environment);
  }
  if (expression.alternative) {
    return evaluator(expression.alternative, environment);
  }
  return nullOfObj;
};

export const evalBangOperatorExpression = (right: Obj): Obj => {
  switch (right) {
    case trueOfBool:
      return falseOfBool;
    case falseOfBool:
      return trueOfBool;
    case nullOfObj:
      return trueOfBool;
    default:
      return falseOfBool;
  }
};

export const evalMinusOperatorExpression = (right: Obj): Obj => {
  if (right instanceof Integer) {
    const integer = right as Integer;
    integer.value = -integer.value;
    return integer;
  }
  return new Err(`unknown operator: ${TOKEN_TYPE.MINUS}${right.type()}`);
};

export const evalPrefixExpression = (operator: string, right: Obj): Obj => {
  switch (operator) {
    case TOKEN_TYPE.BANG:
      return evalBangOperatorExpression(right);
    case TOKEN_TYPE.MINUS:
      return evalMinusOperatorExpression(right);
    default:
      return nullOfObj;
  }
};

export const evalIntegerInfixExpression = (
  operator: string,
  left: Integer,
  right: Integer,
): Obj => {
  switch (operator) {
    case TOKEN_TYPE.PLUS:
      return new Integer(left.value + right.value);
    case TOKEN_TYPE.MINUS:
      return new Integer(left.value - right.value);
    case TOKEN_TYPE.ASTERISK:
      return new Integer(left.value * right.value);
    case TOKEN_TYPE.SLASH:
      return new Integer(left.value / right.value);
    case TOKEN_TYPE.EQ:
      return left.value === right.value ? trueOfBool : falseOfBool;
    case TOKEN_TYPE.NOT_EQ:
      return left.value !== right.value ? trueOfBool : falseOfBool;
    case TOKEN_TYPE.LT:
      return left.value < right.value ? trueOfBool : falseOfBool;
    case TOKEN_TYPE.GT:
      return left.value > right.value ? trueOfBool : falseOfBool;
    default:
      return new Err(
        `unknown operator: ${left.type()} ${operator} ${right.type()}`,
      );
  }
};

export const evalStrInfixExpression = (
  operator: string,
  left: Str,
  right: Str,
): Obj => {
  switch (operator) {
    case TOKEN_TYPE.PLUS:
      return new Str(left.value + right.value);
    case TOKEN_TYPE.EQ:
      return left.value === right.value ? trueOfBool : falseOfBool;
    case TOKEN_TYPE.NOT_EQ:
      return left.value !== right.value ? trueOfBool : falseOfBool;
    case TOKEN_TYPE.LT:
      return left.value < right.value ? trueOfBool : falseOfBool;
    case TOKEN_TYPE.GT:
      return left.value > right.value ? trueOfBool : falseOfBool;
    default:
      return new Err(
        `unknown operator: ${left.type()} ${operator} ${right.type()}`,
      );
  }
};

export const evalBoolInfixExpression = (
  operator: string,
  left: Bool,
  right: Bool,
): Obj => {
  switch (operator) {
    case TOKEN_TYPE.EQ:
      return left.value === right.value ? trueOfBool : falseOfBool;
    case TOKEN_TYPE.NOT_EQ:
      return left.value !== right.value ? trueOfBool : falseOfBool;
    default:
      return new Err(
        `unknown operator: ${OBJ_TYPE.BOOL} ${operator} ${OBJ_TYPE.BOOL}`,
      );
  }
};

export const evalIdentifier = (
  identifier: Identifier,
  environment: Environment,
): Obj => {
  const value = environment.get(identifier.value) ?? builtins[identifier.value];
  if (value === undefined) {
    return new Err(`identifier not found: ${identifier.value}`);
  }
  return value;
};

export const evalInfixExpression = (
  operator: string,
  left: Obj,
  right: Obj,
): Obj => {
  if (left instanceof Integer && right instanceof Integer) {
    return evalIntegerInfixExpression(operator, left, right);
  }
  if (left instanceof Str && right instanceof Str) {
    return evalStrInfixExpression(operator, left, right);
  }
  if (left instanceof Bool && right instanceof Bool) {
    return evalBoolInfixExpression(operator, left, right);
  }
  const leftType = left.type();
  const rightType = right.type();
  if (leftType !== rightType) {
    return new Err(`type mismatch: ${leftType} ${operator} ${rightType}`);
  }
  return new Err(`unknown operator: ${leftType} ${operator} ${rightType}`);
};

export const evalExpression = (
  expressions: Expression[],
  environment: Environment,
): Obj[] => {
  const result: Obj[] = [];
  for (let i = 0; i < expressions.length; i++) {
    const evaluated = evaluator(expressions[i], environment);
    result.push(evaluated);
    if (isErr(evaluated)) {
      return [evaluated];
    }
  }
  return result;
};

export const canBeHashKey = (obj: Obj): boolean =>
  obj instanceof Str || obj instanceof Bool || obj instanceof Integer;

export const evalArrIndexExpression = (left: Arr, index: Integer): Obj => {
  return left.elements[index.value] ?? nullOfObj;
};

export const evalHashIndexExpression = (hash: Hash, index: Obj): Obj => {
  if (!canBeHashKey(index)) {
    return new Err(`unusable as hash key: ${index.type()}`);
  }
  const pair = hash.pairs.get(index.inspect());
  return pair ? pair.value : nullOfObj;
};

export const evalIndexExpression = (left: Obj, index: Obj): Obj => {
  if (left instanceof Arr && index instanceof Integer) {
    return evalArrIndexExpression(left, index);
  }
  if (left instanceof Hash) {
    return evalHashIndexExpression(left, index);
  }
  return new Err(`index operator not supported: ${left.type()}`);
};

export const extendedFnEnvironment = (fn: Fn, args: Obj[]): Environment => {
  const environment = new Environment(fn.environment);
  fn.parameters.forEach((item, index) => {
    environment.set(item.value, args[index]);
  });
  return environment;
};

export const unwrapReturnValue = (obj: Obj): Obj => {
  if (obj instanceof ReturnValue) {
    return obj.value;
  }
  return obj;
};

export const applyFn = (fn: Obj, args: Obj[]): Obj => {
  if (fn instanceof Fn) {
    const extendedEnv = extendedFnEnvironment(fn, args);
    const evaluated = evaluator(fn.body, extendedEnv);
    return unwrapReturnValue(evaluated);
  }
  if (fn instanceof BuiltIn) {
    return fn.call(...args);
  }
  return new Err(`not a fn: ${fn.type()}`);
};

export const isMacroDefinition = (node: Statement): boolean => {
  if (!(node instanceof LetStatement)) {
    return false;
  }
  if (!(node.value instanceof MacroLiteral)) {
    return false;
  }
  return true;
};

export const addMacro = (statement: Statement, environment: Environment) => {
  const letStatement = statement as LetStatement;
  const macroLiteral = letStatement.value as MacroLiteral;
  environment.set(
    letStatement.name!.value,
    new Macro(macroLiteral.parameters, macroLiteral.body!, environment),
  );
};

export const defineMacro = (program: Program, environment: Environment) => {
  const definitions = [];
  for (let i = 0; i < program.statements.length; i++) {
    if (isMacroDefinition(program.statements[i])) {
      addMacro(program.statements[i], environment);
      definitions.push(i);
    }
  }
  for (let i = definitions.length - 1; i >= 0; i--) {
    const definitionIndex = definitions[i];
    program.statements = [
      ...program.statements.slice(0, definitionIndex),
      ...program.statements.slice(definitionIndex + 1),
    ];
  }
};

const isMacroCall = (
  expression: CallExpression,
  environment: Environment,
): Macro | null => {
  if (!(expression.fn instanceof Identifier)) {
    return null;
  }
  const obj = environment.get(expression.fn.value);
  if (obj === undefined) {
    return null;
  }
  if (!(obj instanceof Macro)) {
    return null;
  }
  return obj;
};

const quoteArgs = (
  expression: CallExpression,
  environment: Environment,
): Quote[] => {
  return expression.args.map((item) => new Quote(item, environment));
};

const newEnclosedEnvironment = (outer: Environment) => {
  return new Environment(outer);
};

const extendMacroEnvironment = (macro: Macro, args: Quote[]): Environment => {
  const extended = newEnclosedEnvironment(macro.environment);
  macro.parameters.forEach((item, index) => {
    extended.set(item.value, args[index]);
  });
  return extended;
};

export const expandMacros = (program: Node, environment: Environment): Node => {
  return modify(program, environment, (node: Node, env: Environment): Node => {
    if (!(node instanceof CallExpression)) {
      return node;
    }
    const callExpression = node as CallExpression;
    const macro = isMacroCall(callExpression, env);
    if (!macro) {
      return node;
    }
    const args = quoteArgs(callExpression, env);
    const evalEnv = extendMacroEnvironment(macro, args);
    const evaluated = evaluator(macro.body, evalEnv);
    if (!(evaluated instanceof Quote)) {
      throw new Error("we only support returning AST-nodes from macros");
    }
    return evaluated.node;
  });
};
