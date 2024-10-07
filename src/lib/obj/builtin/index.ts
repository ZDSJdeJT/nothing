import type { Obj } from "@/lib";
import { OBJ_TYPE, BUILTIN } from "@/enums";
import { len } from "./len";
import { first } from "./first";
import { last } from "./last";
import { rest } from "./rest";
import { push } from "./push";
import { toStr } from "./to-str";
import { serve } from "./serve";
import { log } from "./log";
import { version } from "./version";
import { exit } from "./exit";

export class BuiltIn implements Obj {
  private fn: (...args: Obj[]) => Obj;

  constructor(fn: (...args: Obj[]) => Obj) {
    this.fn = fn;
  }

  public type(): OBJ_TYPE {
    return OBJ_TYPE.BUILTIN;
  }

  public inspect(): string {
    return "builtin fn";
  }

  public call(...args: Obj[]): Obj {
    return this.fn(...args);
  }
}

export const builtins: { [key: string]: BuiltIn } = {
  [BUILTIN.LEN]: new BuiltIn(len),
  [BUILTIN.FIRST]: new BuiltIn(first),
  [BUILTIN.LAST]: new BuiltIn(last),
  [BUILTIN.REST]: new BuiltIn(rest),
  [BUILTIN.PUSH]: new BuiltIn(push),
  [BUILTIN.TO_STR]: new BuiltIn(toStr),
  [BUILTIN.SERVE]: new BuiltIn(serve),
  [BUILTIN.LOG]: new BuiltIn(log),
  [BUILTIN.VERSION]: new BuiltIn(version),
  [BUILTIN.EXIT]: new BuiltIn(exit),
};
