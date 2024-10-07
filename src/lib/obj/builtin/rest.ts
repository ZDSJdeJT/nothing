import { type Obj, Err, Arr } from "@/lib";
import { BUILTIN } from "@/enums";

export const rest: (...args: Obj[]) => Obj = (...args) => {
  if (args.length !== 1) {
    return new Err(`wrong number of arguments. got=${args.length}, want=1`);
  }
  if (args[0] instanceof Arr) {
    return new Arr(args[0].elements.slice(1));
  }
  return new Err(
    `argument to \`${BUILTIN.REST}\` not supported, got ${args[0].type()}`,
  );
};
