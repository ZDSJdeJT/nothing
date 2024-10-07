import type { Obj } from "@/lib";
import { OBJ_TYPE, TOKEN_LITERAL } from "@/enums";

export class Arr implements Obj {
  public elements: Obj[];

  constructor(elements: Obj[]) {
    this.elements = elements;
  }

  public type(): OBJ_TYPE {
    return OBJ_TYPE.ARR;
  }

  public inspect(): string {
    return `${TOKEN_LITERAL.OPEN_BRACKET}${this.elements.map((item) => item.inspect()).join(`${TOKEN_LITERAL.COMMA} `)}${TOKEN_LITERAL.CLOSE_BRACKET}`;
  }
}
