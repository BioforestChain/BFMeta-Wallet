import type {} from "@bfmeta/wallet-typings";
import type {} from "@bfmeta/wallet-helpers";
import { PeerListHelperParmas, TatumSymbol } from "@bfmeta/wallet-helpers";
import { TronApi, TRON_PEERS } from "./core/tronApi";
import { Resolve, ModuleStroge } from "@bnqkl/util-node";
import { CustomerPeerCheckHelper } from "./core";
export const TronWalletFactory = (config: BFChainWallet.Config["tron"], parentMap?: ModuleStroge) => {
    if (config && config.enable) {
        const moduleMap = new ModuleStroge(
            [
                [TRON_PEERS.host, config.host],
                [TRON_PEERS.headers, config.headers],
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
