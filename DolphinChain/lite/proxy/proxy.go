package proxy

import (
	"context"
	"net/http"

	amino "github.com/tendermint/go-amino"
	"github.com/XuanMaoSecLab/DolphinChain/libs/log"

	rpcclient "github.com/XuanMaoSecLab/DolphinChain/rpc/client"
	"github.com/XuanMaoSecLab/DolphinChain/rpc/core"
	ctypes "github.com/XuanMaoSecLab/DolphinChain/rpc/core/types"
	rpcserver "github.com/XuanMaoSecLab/DolphinChain/rpc/lib/server"
)

const (
	wsEndpoint = "/websocket"
)

// StartProxy will start the websocket manager on the client,
// set up the rpc routes to proxy via the given client,
// and start up an http/rpc server on the location given by bind (eg. :1234)
// NOTE: This function blocks - you may want to call it in a go-routine.
func StartProxy(c rpcclient.Client, listenAddr string, logger log.Logger, maxOpenConnections int) error {
	err := c.Start()
	if err != nil {
		return err
	}

	cdc := amino.NewCodec()
	ctypes.RegisterAmino(cdc)
	r := RPCRoutes(c)

	// build the handler...
	mux := http.NewServeMux()
	rpcserver.RegisterRPCFuncs(mux, r, cdc, logger)

	unsubscribeFromAllEvents := func(remoteAddr string) {
		if err := c.UnsubscribeAll(context.Background(), remoteAddr); err != nil {
			logger.Error("Failed to unsubscribe from events", "err", err)
		}
	}
	wm := rpcserver.NewWebsocketManager(r, cdc, rpcserver.OnDisconnect(unsubscribeFromAllEvents))
	wm.SetLogger(logger)
	core.SetLogger(logger)
	mux.HandleFunc(wsEndpoint, wm.WebsocketHandler)

	config := rpcserver.DefaultConfig()
	config.MaxOpenConnections = maxOpenConnections
	l, err := rpcserver.Listen(listenAddr, config)
	if err != nil {
		return err
	}
	return rpcserver.StartHTTPServer(l, mux, logger, config)
}

// RPCRoutes just routes everything to the given client, as if it were
// a tendermint fullnode.
//
// if we want security, the client must implement it as a secure client
func RPCRoutes(c rpcclient.Client) map[string]*rpcserver.RPCFunc {
	return map[string]*rpcserver.RPCFunc{
		// Subscribe/unsubscribe are reserved for websocket events.
		"subscribe":       rpcserver.NewWSRPCFunc(c.(Wrapper).SubscribeWS, "query"),
		"unsubscribe":     rpcserver.NewWSRPCFunc(c.(Wrapper).UnsubscribeWS, "query"),
		"unsubscribe_all": rpcserver.NewWSRPCFunc(c.(Wrapper).UnsubscribeAllWS, ""),

		// info API
		"status":     rpcserver.NewRPCFunc(c.Status, ""),
		"blockchain": rpcserver.NewRPCFunc(c.BlockchainInfo, "minHeight,maxHeight"),
		"genesis":    rpcserver.NewRPCFunc(c.Genesis, ""),
		"block":      rpcserver.NewRPCFunc(c.Block, "height"),
		"commit":     rpcserver.NewRPCFunc(c.Commit, "height"),
		"tx":         rpcserver.NewRPCFunc(c.Tx, "hash,prove"),
		"validators": rpcserver.NewRPCFunc(c.Validators, "height"),

		// broadcast API
		"broadcast_tx_commit": rpcserver.NewRPCFunc(c.BroadcastTxCommit, "tx"),
		"broadcast_tx_sync":   rpcserver.NewRPCFunc(c.BroadcastTxSync, "tx"),
		"broadcast_tx_async":  rpcserver.NewRPCFunc(c.BroadcastTxAsync, "tx"),

		// abci API
		"abci_query": rpcserver.NewRPCFunc(c.ABCIQuery, "path,data"),
		"abci_info":  rpcserver.NewRPCFunc(c.ABCIInfo, ""),
	}
}
