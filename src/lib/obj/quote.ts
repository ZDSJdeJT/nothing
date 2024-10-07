import type { Obj, Node, Environment } from "@/lib";
import { OBJ_TYPE, TOKEN_LITERAL } from "@/enums";
import { modify } from "@/utils";

export class Quote implements Obj {
  public node: Node;

  constructor(node: Node, environment: Environment) {
    this.node = this.evalUnquoteCalls(node, environment);
  }

  public type(): OBJ_TYPE {
    return OBJ_TYPE.QUOTE;
  }

  public inspect(): string {
    return `${this.type()}${TOKEN_LITERAL.OPEN_PAREN}${this.node.string()}${TOKEN_LITERAL.CLOSE_PAREN}`;
  }

  private evalUnquoteCalls(quoted: Node, environment: Environment): Node {
    return modify(quoted, environment)!;
  }
}
