import type { Obj } from "@/lib";
import { OBJ_TYPE } from "@/enums";

export class Err implements Obj {
  public message: string;

  constructor(message: string) {
    this.message = message;
  }

  public type(): OBJ_TYPE {
    return OBJ_TYPE.ERR;
  }

  public inspect(): string {
    return `${this.type()}: ${this.message}`;
  }
}
