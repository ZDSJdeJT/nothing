import { type Obj, Err, Str } from "@/lib";

export const toStr: (...args: Obj[]) => Obj = (...args) => {
  if (args.length !== 1) {
    return new Err(`wrong number of arguments. got=${args.length}, want=1`);
  }
  return new Str(args[0].inspect());
};
