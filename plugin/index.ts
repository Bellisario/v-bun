import { plugin } from "bun";
import { FFIFunction } from "bun:ffi";

plugin({
    name: "V Loader",
    async setup(build) {
        const { dlopen, suffix } = await import("bun:ffi");
        const { readFileSync } = await import("fs");
        const { getExported } = await import("./parser.ts");
        const { getTypeFromV } = await import("./typesParser.ts");
        const { generateDeclarations } = await import("./typeInferrer.ts");

        build.onLoad({ filter: /\.v$/ }, (args) => {
            const { success, stderr } = Bun.spawnSync({
                cmd: ['v', '-shared', args.path, '-o', `${args.path}.${suffix}`],
            });

            if (!success) {
                throw new Error(`Failed to compile ${args.path}\n${stderr.toString()}`);
            }

            const content = readFileSync(args.path, "utf-8");

            const exported = getExported(content);

            const symbols: Record<string, FFIFunction> = {}
            exported.forEach(({ name, args, returned }) => {
                symbols[name] = {
                    args: args.map(arg => getTypeFromV(arg[1])),
                    returns: getTypeFromV(returned),
                };
            });

            const dl = dlopen(`${args.path}.${suffix}`, symbols);

            generateDeclarations(args.path, Object.keys(symbols));

            return {
                loader: "object",
                exports: dl.symbols,
            };
        });
    },
});
