import type { Obj } from "@/lib";
import { OBJ_TYPE } from "@/enums";

export class Str implements Obj {
  public value: string;

  constructor(value: string) {
    this.value = value;
  }

  public type(): OBJ_TYPE {
    return OBJ_TYPE.STR;
  }

  public inspect(): string {
    return this.value;
  }
}
