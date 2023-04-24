import "@bfmeta/wallet-typings";
import "./@types";
import { Resolve, ModuleStroge } from "@bnqkl/util-node";
import { PeerListHelperParmas } from "@bfmeta/wallet-helpers";
import { BscApi, BscHealthCheckHelper, BSC_PEERS } from "./core";
export const BscWalletFactory = (config: BFChainWallet.Config["bsc"], parentMap?: ModuleStroge) => {
    if (config && config.enable) {
        const moduleMap = new ModuleStroge(
            [
                [BSC_PEERS.ips, config.ips],
                [BSC_PEERS.port, config.port],
                [BSC_PEERS.testnet, config.testnet],
                [PeerListHelperParmas.checkInterval, 30 * 1000 /**config */],
            ],
            parentMap,
        );
        moduleMap.set("CustomerPeerCheckHelper", Resolve(BscHealthCheckHelper, moduleMap));
        const bscApi = Resolve(BscApi, moduleMap);
        return bscApi;
    } else {
        console.warn(`BscWalletFactory is not enable`);
    }
};

export * from "./core";
