import type { OBJ_TYPE } from "@/enums";

export interface Obj {
  type: () => OBJ_TYPE;

  inspect: () => string;
}

export * from "./integer";
export * from "./str";
export * from "./bool";
export * from "./null";
export * from "./fn";
export * from "./macro";
export * from "./arr";
export * from "./hash";
export * from "./builtin";
export * from "./return-value";
export * from "./err";
export * from "./quote";
