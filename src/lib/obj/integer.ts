import type { Obj } from "@/lib";
import { OBJ_TYPE } from "@/enums";

export class Integer implements Obj {
  public value: number;

  constructor(value: number) {
    this.value = value;
  }

  public type(): OBJ_TYPE {
    return OBJ_TYPE.INTEGER;
  }

  public inspect(): string {
    return String(this.value);
  }
}
