package proxy

import (
	abci "github.com/XuanMaoSecLab/DolphinChain/abci/types"
	"github.com/XuanMaoSecLab/DolphinChain/version"
)

// RequestInfo contains all the information for sending
// the abci.RequestInfo message during handshake with the app.
// It contains only compile-time version information.
var RequestInfo = abci.RequestInfo{
	Version:      version.Version,
	BlockVersion: version.BlockProtocol.Uint64(),
	P2PVersion:   version.P2PProtocol.Uint64(),
}
