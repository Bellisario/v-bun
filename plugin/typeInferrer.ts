import { writeFileSync } from "fs";

export function generateDeclarations(path: string, functionNames: string[]) {
    const declarations =
        functionNames
            .map(name => `export function ${name}(...args: any[]): any;`)
            .join("\n")

    writeFileSync(`${path}.d.ts`, declarations);
}
