import "@bfmeta/wallet-typings";
import "./@types";
import { Resolve, ModuleStroge } from "@bnqkl/util-node";
import { EthApi, EthHealthCheckHelper, ETH_PEERS } from "./core";
import { PeerListHelperParmas } from "@bfmeta/wallet-helpers";

export const EthWalletFactory = (config: BFChainWallet.Config["eth"], parentMap?: ModuleStroge) => {
    if (config && config.enable) {
        const moduleMap = new ModuleStroge(
            [
                [ETH_PEERS.host, config.host],
                [ETH_PEERS.testnet, config.testnet],
                [PeerListHelperParmas.checkInterval, 30 * 1000 /**config */],
            ],
            parentMap,
        );
        moduleMap.set("CustomerPeerCheckHelper", Resolve(EthHealthCheckHelper, moduleMap));
        const ethApi = Resolve(EthApi, moduleMap);
        return ethApi;
    } else {
        console.warn(`EthWalletFactory is not enable`);
    }
};

export * from "./core";
