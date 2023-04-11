import "@bfmeta/wallet-typings";

import "./@types";
import { CCChainApi, CCCHAIN_PEERS } from "./core/ccchainApi";
import { Resolve, ModuleStroge } from "@bfchain/util-dep-inject";
export const CCChainWalletFactory = (
    config: BFChainWallet.Config["ccchain"],
    parentMap?: ModuleStroge,
) => {
    if (config && config.enable) {
        const ccchainApi = Resolve(
            CCChainApi,
            new ModuleStroge(
                [
                    [CCCHAIN_PEERS.ips, config.ips],
                    [CCCHAIN_PEERS.port, config.port],
                    [CCCHAIN_PEERS.browser, config.browserPath],
                ],
                parentMap,
            ),
        );
        return ccchainApi;
    } else {
        console.warn(`CCChainWalletFactory is not enable`);
    }
};
export * from "./core";
