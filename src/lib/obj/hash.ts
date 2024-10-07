import type { Str, Bool, Integer, Obj } from "@/lib";
import { OBJ_TYPE, TOKEN_LITERAL } from "@/enums";

export class Hash implements Obj {
  public pairs = new Map<string, { key: Obj; value: Obj }>();

  public type(): OBJ_TYPE {
    return OBJ_TYPE.HASH;
  }

  public inspect(): string {
    const pairs: string[] = [];
    this.pairs.forEach(({ key, value }) => {
      pairs.push(`${key.inspect()}${TOKEN_LITERAL.COLON} ${value.inspect()}`);
    });
    return `${TOKEN_LITERAL.OPEN_BRACE}${pairs.join(`${TOKEN_LITERAL.COMMA} `)}${TOKEN_LITERAL.CLOSE_BRACE}`;
  }

  public set(key: Str | Bool | Integer, value: Obj) {
    this.pairs.set(key.inspect(), { key, value });
  }
}
