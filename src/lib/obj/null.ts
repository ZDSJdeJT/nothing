import type { Obj } from "@/lib";
import { OBJ_TYPE, TOKEN_LITERAL } from "@/enums";

export class Null implements Obj {
  public type(): OBJ_TYPE {
    return OBJ_TYPE.NULL;
  }

  public inspect(): string {
    return TOKEN_LITERAL.NULL;
  }
}

export const nullOfObj = new Null();
