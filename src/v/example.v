module example

[export: 'teapot']
fn teapot(code int) {
	println("${code} - I'm a teapot.")
}

[export: 'add']
fn add(a int, b int) int {
	return a + b
}

[export: 'sub']
fn sub(a int, b int) int {
	return a - b
}

[export: 'hello']
fn hello() string {
	return "Hello from V!"
}
