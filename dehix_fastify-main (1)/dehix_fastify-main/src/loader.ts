import { existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const extensions = ["js"],
  resolveDirs = true;

const indexFiles = resolveDirs ? extensions.map((e) => `index.${e}`) : [];
const postfixes = extensions
  .map((e) => `.${e}`)
  .concat(indexFiles.map((p) => `/${p}`));
const findPostfix = (specifier, context) =>
  (specifier.endsWith("/") ? indexFiles : postfixes).find((p) => {
    return existsSync(
      specifier.startsWith("/")
        ? specifier + p
        : join(dirname(fileURLToPath(context.parentURL)), specifier + p),
    );
  });

const prefixes = ["/", "./", "../"];
export function resolve(specifier, context, nextResolve) {
  const postfix =
    (prefixes.some((p) => specifier.startsWith(p)) &&
      //&& !extname(basename(specifier))
      findPostfix(specifier, context)) ||
    "";

  return nextResolve(specifier + postfix);
}
