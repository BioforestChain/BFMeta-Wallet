import "@bfmeta/wallet-typings";
import "@bfmeta/wallet-helpers";

import "./@types";
import { BFChainApi, BFCHAIN_PEERS } from "./core/bfchainApi";
import { Resolve, ModuleStroge } from "@bnqkl/util-node";
export const BFChainWalletFactory = (
    config: BFChainWallet.Config["bfchain"],
    parentMap?: ModuleStroge,
) => {
    if (config && config.enable) {
        const bfchainApi = Resolve(
            BFChainApi,
            new ModuleStroge(
                [
                    [BFCHAIN_PEERS.host, config.host],
                    [BFCHAIN_PEERS.browser, config.browserPath],
                ],
                parentMap,
            ),
        );
        return bfchainApi;
    } else {
        console.warn(`BFChainWalletFactory is not enable`);
    }
};
export * from "./core";
