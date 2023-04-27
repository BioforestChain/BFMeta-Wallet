import "@bfmeta/wallet-typings";

import "./@types";
import { BFM_PEERS, BfmApi } from "./core/bfmApi";
import { Resolve, ModuleStroge } from "@bnqkl/util-node";
export const BFMWalletFactory = (config: BFChainWallet.Config["bfm"], parentMap?: ModuleStroge) => {
    if (config && config.enable) {
        const bfmApi = Resolve(
            BfmApi,
            new ModuleStroge(
                [
                    [BFM_PEERS.host, config.host],
                    [BFM_PEERS.browser, config.browserPath],
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
