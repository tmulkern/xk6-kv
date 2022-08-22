package kv

import (
	"github.com/dgzlopes/xk6-kv/kv"
	"go.k6.io/k6/js/modules"
)

// Register the extension on module initialization, available to
// import from JS as "k6/x/redis".
func init() {
	modules.Register("k6/x/kv", new(kv.RootModule))
}