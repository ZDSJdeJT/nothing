import { type Obj, Err, Str } from "@/lib";
import { config } from "@/config";

export const version: (...args: Obj[]) => Obj = (...args) => {
  if (args.length !== 0) {
    return new Err(`wrong number of arguments. got=${args.length}, want=0`);
  }
  return new Str(config.version);
};
