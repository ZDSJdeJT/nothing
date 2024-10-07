import type { Obj } from "@/lib";

export class Environment {
  public store = new Map<string, Obj>();

  public outer: Environment | null;

  constructor(outer: Environment | null = null) {
    this.outer = outer;
  }

  public get(key: string): Obj | undefined {
    const value = this.store.get(key);
    return value === undefined
      ? this.outer
        ? this.outer.get(key)
        : value
      : value;
  }

  public set(key: string, value: Obj) {
    return this.store.set(key, value);
  }
}
