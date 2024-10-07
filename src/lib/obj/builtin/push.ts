import { type Obj, Err, Arr } from "@/lib";
import { BUILTIN } from "@/enums";

export const push: (...args: Obj[]) => Obj = (...args) => {
  if (args.length !== 2) {
    return new Err(`wrong number of arguments. got=${args.length}, want=2`);
  }
  if (args[0] instanceof Arr) {
    args[0].elements.push(args[1]);
    return args[0];
  }
  return new Err(
    `argument to \`${BUILTIN.PUSH}\` not supported, got ${args[0].type()}`,
  );
};
