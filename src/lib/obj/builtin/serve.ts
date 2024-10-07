import { type Obj, Err, Fn, Hash, Integer, Str } from "@/lib";
import { BUILTIN } from "@/enums";
import { applyFn } from "@/utils";
import { config } from "@/config";

type Fetch = (req: Hash) => { body: Obj; status: number };

const defaultPort = 3000;
const defaultStatus = 200;
const defaultBody = new Str(`powered by nothing ${config.version}`);
const defaultFetch: Fetch = () => ({
  body: defaultBody,
  status: defaultStatus,
});

const getOptions = (hash: Hash): { port: number; fetch: Fetch } => {
  let port = defaultPort;
  const portPair = hash.pairs.get("port");
  if (portPair) {
    if (portPair.value instanceof Integer) {
      port = portPair.value.value;
    } else {
      throw new Error(
        `port argument to \`${BUILTIN.SERVE}\` not supported, got ${portPair.value.type()}`,
      );
    }
  }
  let fetch = defaultFetch;
  const fetchPair = hash.pairs.get("fetch");
  if (fetchPair) {
    if (fetchPair.value instanceof Fn) {
      fetch = (req) => {
        let status = defaultStatus;
        let body: Obj = defaultBody;
        const resp = applyFn(fetchPair.value, [req]);
        if (resp instanceof Hash) {
          const statusPair = resp.pairs.get("status");
          if (statusPair && statusPair.value instanceof Integer) {
            status = statusPair.value.value;
          }
          const bodyPair = resp.pairs.get("body");
          if (bodyPair) {
            body = bodyPair.value;
          }
        } else {
          body = resp;
        }
        return { body, status };
      };
    } else {
      throw new Error(
        `fetch argument to \`${BUILTIN.SERVE}\` not supported, got ${fetchPair.value.type()}`,
      );
    }
  }
  return { port, fetch };
};

export const serve = (...args: Obj[]) => {
  if (args.length !== 1) {
    return new Err(`wrong number of arguments. got=${args.length}, want=1`);
  }
  if (args[0] instanceof Hash) {
    try {
      const { port, fetch } = getOptions(args[0]);
      const server = Bun.serve({
        port,
        fetch: (request) => {
          const req = new Hash();
          req.set(new Str("method"), new Str(request.method));
          const url = new URL(request.url);
          req.set(new Str("pathname"), new Str(url.pathname));
          const searchParams = new Hash();
          url.searchParams.forEach((value, key) => {
            searchParams.set(new Str(key), new Str(value));
          });
          req.set(new Str("searchParams"), searchParams);
          const { body, status } = fetch(req);
          return new Response(body.inspect(), { status });
        },
      });
      const hash = new Hash();
      hash.set(new Str("hostname"), new Str(server.hostname));
      hash.set(new Str("port"), new Integer(server.port));
      return hash;
    } catch (e) {
      return new Err((e as Error).message);
    }
  }
  return new Err(
    `argument to \`${BUILTIN.SERVE}\` not supported, got ${args[0].type()}`,
  );
};
