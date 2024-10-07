import {
  type Node,
  type Statement,
  type Expression,
  type Obj,
  type Identifier,
  type Environment,
  Program,
  ExpressionStatement,
  InfixExpression,
  PrefixExpression,
  IndexExpression,
  IfExpression,
  CallExpression,
  BlockStatement,
  ReturnStatement,
  LetStatement,
  FnLiteral,
  ArrLiteral,
  HashLiteral,
  Integer,
  IntegerLiteral,
  Bool,
  BoolLiteral,
  Arr,
  Quote,
  evaluator,
  Fn,
  Str,
  StrLiteral,
  Hash,
} from "@/lib";
import { TOKEN_TYPE, BUILTIN, TOKEN_LITERAL } from "@/enums";

const isUnquoteCall = (node: Node): boolean => {
  if (!(node instanceof CallExpression)) {
    return false;
  }
  return node.fn.tokenLiteral() === BUILTIN.UNQUOTE;
};

const convertObj2ASTNode = (obj: Obj): Node | null => {
  if (obj instanceof Integer) {
    return new IntegerLiteral(
      {
        type: TOKEN_TYPE.INTEGER,
        literal: obj.inspect(),
      },
      obj.value,
    );
  }
  if (obj instanceof Bool) {
    return new BoolLiteral(
      {
        type: obj.value ? TOKEN_TYPE.TRUE : TOKEN_TYPE.FALSE,
        literal: obj.inspect(),
      },
      obj.value,
    );
  }
  if (obj instanceof Arr) {
    const arrLiteral = new ArrLiteral({
      type: TOKEN_TYPE.OPEN_BRACKET,
      literal: TOKEN_LITERAL.OPEN_BRACKET,
    });
    arrLiteral.elements = obj.elements.map(
      (item) => convertObj2ASTNode(item) as Expression,
    );
    return arrLiteral;
  }
  if (obj instanceof Fn) {
    const fnLiteral = new FnLiteral({
      type: TOKEN_TYPE.FN,
      literal: TOKEN_TYPE.FN,
    });
    fnLiteral.parameters = obj.parameters;
    fnLiteral.body = obj.body;
    return fnLiteral;
  }
  if (obj instanceof Str) {
    return new StrLiteral(
      {
        type: TOKEN_TYPE.STR,
        literal: obj.value,
      },
      obj.value,
    );
  }
  if (obj instanceof Hash) {
    const hashLiteral = new HashLiteral({
      type: TOKEN_TYPE.OPEN_BRACE,
      literal: TOKEN_LITERAL.OPEN_BRACE,
    });
    obj.pairs.forEach(({ key, value }) => {
      hashLiteral.pairs.set(
        convertObj2ASTNode(key) as Expression,
        convertObj2ASTNode(value) as Expression,
      );
    });
    return hashLiteral;
  }
  if (obj instanceof Quote) {
    return obj.node;
  }
  return null;
};

export const modify = (
  node: Node,
  environment: Environment,
  modifier: (node: Node, env: Environment) => Node = (
    node: Node,
    env: Environment,
  ): Node => {
    if (!isUnquoteCall(node)) {
      return node;
    }
    if (!(node instanceof CallExpression)) {
      return node;
    }
    if (node.args.length !== 1) {
      return node;
    }
    return convertObj2ASTNode(evaluator(node.args[0], env))!;
  },
): Node => {
  if (node instanceof Program || node instanceof BlockStatement) {
    for (let i = 0; i < node.statements.length; i++) {
      node.statements[i] = modify(
        node.statements[i],
        environment,
        modifier,
      ) as Statement;
    }
  } else if (node instanceof ExpressionStatement) {
    node.expression = modify(
      node.expression!,
      environment,
      modifier,
    ) as Expression;
  } else if (node instanceof InfixExpression) {
    node.left = modify(node.left, environment, modifier) as Expression;
    node.right = modify(node.right!, environment, modifier) as Expression;
  } else if (node instanceof PrefixExpression) {
    node.right = modify(node.right!, environment, modifier) as Expression;
  } else if (node instanceof IndexExpression) {
    node.left = modify(node.left, environment, modifier) as Expression;
    node.index = modify(node.index!, environment, modifier) as Expression;
  } else if (node instanceof IfExpression) {
    node.condition = modify(
      node.condition,
      environment,
      modifier,
    ) as Expression;
    node.consequence = modify(
      node.consequence,
      environment,
      modifier,
    ) as BlockStatement;
    if (node.alternative) {
      node.alternative = modify(
        node.alternative,
        environment,
        modifier,
      ) as BlockStatement;
    }
  } else if (node instanceof ReturnStatement) {
    node.returnValue = modify(
      node.returnValue!,
      environment,
      modifier,
    ) as Expression;
  } else if (node instanceof LetStatement) {
    node.value = modify(node.value!, environment, modifier) as Expression;
  } else if (node instanceof FnLiteral) {
    for (let i = 0; i < node.parameters.length; i++) {
      node.parameters[i] = modify(
        node.parameters[i],
        environment,
        modifier,
      ) as Identifier;
    }
    node.body = modify(node.body!, environment, modifier) as BlockStatement;
  } else if (node instanceof ArrLiteral) {
    for (let i = 0; i < node.elements.length; i++) {
      node.elements[i] = modify(
        node.elements[i],
        environment,
        modifier,
      ) as Expression;
    }
  } else if (node instanceof HashLiteral) {
    const newPairs = new Map<Expression, Expression>();
    node.pairs.forEach((value, key) => {
      const newKey = modify(key, environment, modifier) as Expression;
      const newValue = modify(value, environment, modifier) as Expression;
      newPairs.set(newKey, newValue);
    });
    node.pairs = newPairs;
  }
  return modifier(node, environment);
};
