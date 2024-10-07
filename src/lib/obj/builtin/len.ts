import { type Obj, Err, Str, Integer, Arr } from "@/lib";
import { BUILTIN } from "@/enums";

export const len: (...args: Obj[]) => Obj = (...args) => {
  if (args.length !== 1) {
    return new Err(`wrong number of arguments. got=${args.length}, want=1`);
  }
  if (args[0] instanceof Str) {
    return new Integer(args[0].value.length);
  }
  if (args[0] instanceof Arr) {
    return new Integer(args[0].elements.length);
  }
  return new Err(
    `argument to \`${BUILTIN.LEN}\` not supported, got ${args[0].type()}`,
  );
};
