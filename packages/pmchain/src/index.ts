import "@bfmeta/wallet-typings";

import "./@types";
import { PMCHAIN_PEERS, PMChainApi } from "./core/pmchainApi";
import { Resolve, ModuleStroge } from "@bnqkl/util-node";
export const PMChainWalletFactory = (
    config: BFChainWallet.Config["pmchain"],
    parentMap?: ModuleStroge,
) => {
    if (config && config.enable) {
        const pmchainApi = Resolve(
            PMChainApi,
            new ModuleStroge(
                [
                    [PMCHAIN_PEERS.ips, config.ips],
                    [PMCHAIN_PEERS.port, config.port],
                    [PMCHAIN_PEERS.browser, config.browserPath],
                ],
                parentMap,
            ),
        );
        return pmchainApi;
    } else {
        console.warn(`BFMWalletFactory is not enable`);
    }
};
export * from "./core";
