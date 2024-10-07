export const prettyErrors = (errors: string[]): string => {
  return `Woops! We ran into some nothing business here!
  parser errors:
    ${errors.join("\n    ")}`;
};
