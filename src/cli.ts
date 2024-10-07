import { runFile, repl } from ".";
import { config } from "@/config";

if (process.argv[3]) {
  console.error("Error: Invalid argument provided.");
} else if (process.argv[2]) {
  if (process.argv[2] === "-h" || process.argv[2] === "--help") {
    console.info(`Usage: nothing [options]

Options:
  -v, --version  Show version information
  -h, --help     Display this help message

Example calls:
  $ nothing                  # Enter REPL mode
  $ nothing file-path        # Run the file
  $ nothing -v               # Display version information
  $ nothing --help           # Display this help message
`);
  } else if (process.argv[2] === "-v" || process.argv[2] === "--version") {
    console.info(config.version);
  } else {
    runFile(process.argv[2]);
  }
} else {
  repl();
}
