module example2

import math

[export: 'square_root']
fn square_root(x f64) f64 {
	return math.sqrt(x)
}
