# v-bun

> Easily run [V](https://vlang.io) code with [Bun](https://bun.sh)

> **If you want to use this project as template:**
> ```bash
> bunx degit Bellisario/v-bun <folder>
> ```

## Getting started

Install dependencies:

```bash
bun install
```

Watch V code for changes:

```bash
bun watch
```

You can now make TS code changes inside the `src` folder and V code changes inside the `src/v` folder.

> **Warning**\
> This folder also contains all the type definitions for TS and all the built V shared libraries, but you should not worry about them: the running watcher will know the right action to perform and you can continue to work normally (ex. edit, rename, delete, etc.).

When you're ready to run the code:

```bash
bun start
```

## Technical details

### Bun Plugin

This project is possible thanks to [Bun support for Plugins](https://bun.sh/docs/bundler/plugins), which simplify a lot the process of making a custom handler for files not supported natively.

### The hard part: automating Bun FFI handling

The hard part is telling Bun to open a shared library with all the symbols ([Bun FFI](https://bun.sh/docs/api/ffi)) (function names, arguments, arguments types, returns and returns types), without manually writing all the symbols map.

To solve this issue, I "simply" parsed the imported V file and extracted the function names, arguments types and return types, all through RegEx. To convert all the extracted types to valid Bun FFI types (to use it as a symbols map), I then used a switch statement.

After successfully opening the shared library (with the given symbols map), the `symbols` object returned by Bun can be directly exported (always through the plugin system) and used in the TS code.

### TypeScript problems

The last (but not least) issue was that TypeScript didn't even know what type of file we were importing, so the solution was to create a `d.ts` file with the same name of the V file, put it on the same directory and export the same functions names extracted from the V file (if you know a better implementation, let me know, I wanted to put all V types on a different folder but I didn't find a way to do it).

The current implementation exports the functions with generic arguments and return types, just to make TypeScript happy and provide a minimal auto-completion support.\
Better types could be added in the future from the same parsing process used to extract the symbols (if you want to work on this, feel free to open an issue or a pull request).

## FAQ

### Is this project ready for production?

Yes and no.\
The current implementation works as expected, but because we're parsing all through RegEx, it's not guaranteed that it will work with all the V code. To use this, you should also be able to check what's wrong in the parsing process and fix it (or change your own V code implementation to fix that specific parser bug).

### Why didn't you release this as a Bun Plugin?

This project is kind of a proof of concept and a template for other projects.\
The current implementation requires a `bunfig.toml` file to make the plugin run automatically when needed inside the TS code ([see here](https://bun.sh/docs/bundler/plugins#preload)), a watcher to provide TS type definitions for V code on every change and adds type definitions and builds shared libraries directly inside the V folder, which is not admissible for a plugin released as a package.\
Also, as said before, because the parsing process is not perfect and errors are expected, you should be able to edit the plugin code on the fly instead of expecting a new release to fix your specific issue (anyway this doesn't mean that I won't release fixes in this repo).

## Contributing

We :heart: contributions!\
Feel free to open an [issue](https://github.com/Bellisario/v-bun/issues) or a [pull request](https://github.com/Bellisario/v-bun/pulls) but follow [Contributing Guidelines](https://github.com/Bellisario/v-bun/blob/main/CONTRIBUTING.md).

> **Tip:** if you don't know where to start, check out the [help wanted issues](https://github.com/Bellisario/v-bun/labels/help%20wanted)!

## License

MIT License [here](https://github.com/Bellisario/v-bun/blob/main/LICENSE).
