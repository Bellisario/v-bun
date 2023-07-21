import { teapot, add, sub, hello } from "./v/example.v";
import { square_root } from "./v/sqrt.v";


teapot(
    add(1, 3) * 100 +
    sub(2, 1) * 10 +
    square_root(64)
)

console.log(hello())
