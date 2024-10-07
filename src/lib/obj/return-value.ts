import type { Obj } from "@/lib";
import { OBJ_TYPE } from "@/enums";

export class ReturnValue implements Obj {
  value: Obj;

  constructor(value: Obj) {
    this.value = value;
  }

  public type(): OBJ_TYPE {
    return OBJ_TYPE.RETURN_VALUE;
  }

  public inspect(): string {
    return this.value.inspect();
  }
}
