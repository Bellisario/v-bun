import { watch } from "fs";
import { join } from "path";
import { readFileSync } from "fs";

import { getExported } from "./parser.ts";
import { generateDeclarations } from "./typeInferrer.ts";

const dir = process.argv[2];

watch(dir, { recursive: true }, async (event, filename) => {
    if (!(event === "change" || event === "rename")) return;

    if (!filename || filename instanceof Error) return;

    if (!filename.endsWith(".v")) return;
    
    const path = join(dir, filename);

    if (event === 'rename') {
        const { unlinkSync, existsSync } = await import("fs");
        const { suffix } = await import("bun:ffi");

            _try(() => unlinkSync(`${path}.d.ts`));
            _try(() => unlinkSync(`${path}.${suffix}`));

        if (!existsSync(path)) return;
    }

    console.log(`File "${filename}" changed, regenerating declarations...`);

    const fileContent = readFileSync(path, "utf-8");

    let names: string[] = [];
    try {
        names = getExported(fileContent).map(({ name }) => name);
    } catch (e) {
        console.error(`Failed to parse file "${filename}"`);
        console.error(e);
        console.info("Waiting for next change...")
        return;
    }

    generateDeclarations(path, names);
})

console.log(`Watching directory "${dir}" for changes...`);

/**
 * Try to execute a function, ignoring any errors.
 */
function _try(fn: () => void): void {
    try {
        fn();
    } catch (e) {}
}
