import type { Obj } from "@/lib";
import { OBJ_TYPE, TOKEN_LITERAL } from "@/enums";

export class Bool implements Obj {
  public value: boolean;

  constructor(value: boolean) {
    this.value = value;
  }

  public type(): OBJ_TYPE {
    return OBJ_TYPE.BOOL;
  }

  public inspect(): string {
    return this.value ? TOKEN_LITERAL.TRUE : TOKEN_LITERAL.FALSE;
  }
}

export const trueOfBool = new Bool(true);
export const falseOfBool = new Bool(false);
