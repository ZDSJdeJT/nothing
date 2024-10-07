import type { TOKEN_TYPE } from "@/enums";

export type Token = {
  type: TOKEN_TYPE;
  literal: string;
};
