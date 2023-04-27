import "@bfmeta/wallet-typings";
import "./@types";
import { PeerListHelperParmas, TatumSymbol } from "@bfmeta/wallet-helpers";
import { TronApi, PEERS } from "./core/tronApi";
import { Resolve, ModuleStroge } from "@bnqkl/util-node";
import { CustomerPeerCheckHelper } from "./core";
export const TronWalletFactory = (
    config: BFChainWallet.Config["tron"],
    parentMap?: ModuleStroge,
) => {
    if (config && config.enable) {
        const moduleMap = new ModuleStroge(
            [
                [PEERS.host, config.host],
                [PeerListHelperParmas.checkInterval, 30 * 1000 /**config */],
            ],
            parentMap,
        );
        moduleMap.set("CustomerPeerCheckHelper", Resolve(CustomerPeerCheckHelper, moduleMap));
        const tronApi = Resolve(TronApi, moduleMap);

        return tronApi;
    } else {
        console.warn(`TronWalletFactory is not enable`);
    }
};

export * from "./core";
