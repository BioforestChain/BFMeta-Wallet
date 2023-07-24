import "@bfmeta/wallet-typings";

import "./@types";
import { ETHM_PEERS, ETHMApi } from "./core/ethmApi";
import { Resolve, ModuleStroge } from "@bnqkl/util-node";
export const ETHMWalletFactory = (config: BFChainWallet.Config["ethm"], parentMap?: ModuleStroge) => {
    if (config && config.enable) {
        const bfmApi = Resolve(
            ETHMApi,
            new ModuleStroge(
                [
                    [ETHM_PEERS.host, config.host],
                    [ETHM_PEERS.browser, config.browserPath],
                ],
                parentMap,
            ),
        );
        return bfmApi;
    } else {
        console.warn(`BFMWalletFactory is not enable`);
    }
};
export * from "./core";
