import { type Obj, Err, Arr, nullOfObj } from "@/lib";
import { BUILTIN } from "@/enums";

export const last: (...args: Obj[]) => Obj = (...args) => {
  if (args.length !== 1) {
    return new Err(`wrong number of arguments. got=${args.length}, want=1`);
  }
  if (args[0] instanceof Arr) {
    return args[0].elements[args[0].elements.length - 1] ?? nullOfObj;
  }
  return new Err(
    `argument to \`${BUILTIN.LAST}\` not supported, got ${args[0].type()}`,
  );
};
