import { type Obj, Err, Integer } from "@/lib";
import { BUILTIN } from "@/enums";

export const exit: (...args: Obj[]) => Obj = (...args) => {
  if (args.length === 0) {
    process.exit();
  }
  if (args.length !== 1) {
    return new Err(
      `wrong number of arguments. got=${args.length}, want=0 or =1`,
    );
  }
  if (args[0] instanceof Integer) {
    process.exit(args[0].value);
  }
  return new Err(
    `argument to \`${BUILTIN.EXIT}\` not supported, got ${args[0].type()}`,
  );
};
