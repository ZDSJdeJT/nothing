import { type Obj, nullOfObj } from "@/lib";

export const log: (...args: Obj[]) => Obj = (...args) => {
  console.log(...args.map((item) => item.inspect()));
  return nullOfObj;
};
