export function getExported(fileContent: string) {
    const lines = fileContent.split("\n");

    let lastExportName: string | null = null;
    const exportedFunctions = [];

    for (const [i, line] of lines.entries()) {
        if (lastExportName) {
            const { args, returned } = getFunctionTypes(line, i);

            exportedFunctions.push({
                name: lastExportName,
                args,
                returned,
            });

            lastExportName = null;
        } else {
            const exportedName = getExportedFunctionName(line, i);

            if (!exportedName) continue;

            lastExportName = exportedName;
        }
    }

    return exportedFunctions;
}

// https://regexr.com/7h9v2
const exportRegex = /\[export: ('|")(.+?)('|")]/;

export function getExportedFunctionName(line: string, i: number) {
    const match = exportRegex.exec(line);

    if (!match) return null;
    if (!match[2]) {
        throw new Error(`Failed to parse export name from line ${i + 1}`);
    }

    return match[2];
}

// https://regexr.com/7ha1d
const functionRegex = /fn (.+?)\((.*?)\) (.*?)[ {]+/;

export function getFunctionTypes(line: string, i: number) {
    const match = functionRegex.exec(line);

    if (!match) {
        console.log(line);
        throw new Error(`Failed to parse exported function from line ${i + 1}`);
    }

    // ex: a int, b int
    const args = match[2]
        // ex: ["a int", "b int"]
        .split(",").map(arg => arg.trim())
        // ex: [["a", "int"], ["b", "int"]]
        .map(arg => arg.split(" ").map(arg => arg.trim()))
        // filter out functions with no arguments (filter out [""])
        .filter(arg => arg[0] !== "");

    // if there is no return type, use void
    const returned = match[3].trim() || "void";

    if (!args) {
        throw new Error(`Failed to parse exported function from line ${i + 1}`);
    }

    return {
        args,
        returned,
    };
}
