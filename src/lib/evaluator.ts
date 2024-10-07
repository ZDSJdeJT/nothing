import { BUILTIN } from "@/enums";
import {
  type Node,
  type Obj,
  type Environment,
  Program,
  BlockStatement,
  ExpressionStatement,
  ReturnStatement,
  LetStatement,
  Identifier,
  IfExpression,
  PrefixExpression,
  InfixExpression,
  FnLiteral,
  CallExpression,
  Integer,
  IntegerLiteral,
  Str,
  StrLiteral,
  BoolLiteral,
  trueOfBool,
  falseOfBool,
  nullOfObj,
  ReturnValue,
  Fn,
  Arr,
  ArrLiteral,
  Hash,
  HashLiteral,
  IndexExpression,
  Err,
  Quote,
} from "@/lib";
import {
  evalProgram,
  evalBlockStatement,
  isErr,
  evalIdentifier,
  evalIfExpression,
  evalPrefixExpression,
  evalInfixExpression,
  evalIndexExpression,
  evalExpression,
  applyFn,
  canBeHashKey,
} from "@/utils";

const evaluatorCallbacks: {
  [key: string]: (node: Node, environment: Environment) => Obj;
} = {
  [Program.name]: (node, environment) =>
    evalProgram(node as Program, environment),
  [BlockStatement.name]: (node, environment) =>
    evalBlockStatement(node as BlockStatement, environment),
  [ExpressionStatement.name]: (node, environment) =>
    evaluator((node as ExpressionStatement).expression!, environment),
  [ReturnStatement.name]: (node, environment) => {
    const value = evaluator(
      (node as ReturnStatement).returnValue!,
      environment,
    );
    if (isErr(value)) {
      return value;
    }
    return new ReturnValue(value);
  },
  [LetStatement.name]: (node, environment) => {
    const letStatement = node as LetStatement;
    const value = evaluator(letStatement.value!, environment);
    if (isErr(value)) {
      return value;
    }
    environment.set(letStatement.name!.value, value);
    return nullOfObj;
  },
  [Identifier.name]: (node, environment) =>
    evalIdentifier(node as Identifier, environment),
  [IfExpression.name]: (node, environment) =>
    evalIfExpression(node as IfExpression, environment),
  [PrefixExpression.name]: (node, environment) => {
    const prefixExpression = node as PrefixExpression;
    const right = evaluator(prefixExpression.right!, environment);
    if (isErr(right)) {
      return right;
    }
    return evalPrefixExpression(prefixExpression.operator, right);
  },
  [InfixExpression.name]: (node, environment) => {
    const infixExpression = node as InfixExpression;
    const left = evaluator(infixExpression.left, environment);
    if (isErr(left)) {
      return left;
    }
    const right = evaluator(infixExpression.right!, environment);
    if (isErr(right)) {
      return right;
    }
    return evalInfixExpression(infixExpression.operator, left, right);
  },
  [IntegerLiteral.name]: (node) => new Integer((node as IntegerLiteral).value),
  [StrLiteral.name]: (node) => new Str((node as StrLiteral).value),
  [BoolLiteral.name]: (node) =>
    (node as BoolLiteral).value ? trueOfBool : falseOfBool,
  [FnLiteral.name]: (node, environment) => {
    const fn = node as FnLiteral;
    return new Fn(fn.parameters, fn.body!, environment);
  },
  [IndexExpression.name]: (node, environment) => {
    const indexExpression = node as IndexExpression;
    const left = evaluator(indexExpression.left, environment);
    if (isErr(left)) {
      return left;
    }
    const index = evaluator(indexExpression.index!, environment);
    if (isErr(index)) {
      return index;
    }
    return evalIndexExpression(left, index);
  },
  [ArrLiteral.name]: (node, environment) => {
    const elements = evalExpression((node as ArrLiteral).elements, environment);
    if (elements.length === 1 && isErr(elements[0])) {
      return elements[0];
    }
    return new Arr(elements);
  },
  [HashLiteral.name]: (node, environment) => {
    const hash = new Hash();
    for (const pair of (node as HashLiteral).pairs) {
      const key = evaluator(pair[0], environment);
      if (isErr(key)) {
        return key;
      }
      if (!canBeHashKey(key)) {
        return new Err(`unusable as hash key: ${key.type()}`);
      }
      const value = evaluator(pair[1], environment);
      if (isErr(value)) {
        return value;
      }
      hash.pairs.set(key.inspect(), { key, value });
    }
    return hash;
  },
  [CallExpression.name]: (node, environment) => {
    const callExpression = node as CallExpression;
    if (callExpression.fn.tokenLiteral() === BUILTIN.QUOTE) {
      if (callExpression.args.length !== 1) {
        return new Err(
          `wrong number of arguments. got=${callExpression.args.length}, want=1`,
        );
      }
      return new Quote(callExpression.args[0], environment);
    }
    const fn = evaluator(callExpression.fn, environment);
    if (isErr(fn)) {
      return fn;
    }
    const args = evalExpression(callExpression.args, environment);
    if (args.length === 1 && isErr(args[0])) {
      return args[0];
    }
    return applyFn(fn, args);
  },
};

export const evaluator = (node: Node, environment: Environment): Obj =>
  evaluatorCallbacks[node.constructor.name]
    ? evaluatorCallbacks[node.constructor.name](node, environment)
    : nullOfObj;
