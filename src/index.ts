import { type Obj, Lexer, Parser, evaluator, Environment, Err } from "@/lib";
import { defineMacro, expandMacros, prettyErrors } from "@/utils";

export const runCode = (
  code: string,
  environment: Environment = new Environment(),
  macroEnvironment: Environment = new Environment(),
): Obj => {
  const lexer = new Lexer(code);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  if (parser.errors.length > 0) {
    throw new Error(prettyErrors(parser.errors));
  }
  defineMacro(program, macroEnvironment);
  expandMacros(program, macroEnvironment);
  return evaluator(program, environment);
};

export const runFile = async (path: string) => {
  try {
    const file = Bun.file(path);
    if (!(await file.exists())) {
      throw new Error("File not found.");
    }
    const code = await file.text();
    const evaluated = runCode(code);
    if (evaluated instanceof Err) {
      throw new Error(evaluated.inspect());
    }
  } catch (e) {
    console.error((e as Error).message);
    process.exit(1);
  }
};

export const repl = async () => {
  console.info(`Hello! This is the Nothing programming language! 
Feel free to type in commands.`);
  const prompt = ">> ";
  const environment = new Environment();
  const macroEnvironment = new Environment();
  process.stdout.write(prompt);
  for await (const line of console) {
    try {
      const evaluated = runCode(line, environment, macroEnvironment);
      if (evaluated instanceof Err) {
        throw new Error(evaluated.inspect());
      }
      console.info(evaluated.inspect());
    } catch (e) {
      console.error((e as Error).message);
    } finally {
      process.stdout.write(prompt);
    }
  }
};
