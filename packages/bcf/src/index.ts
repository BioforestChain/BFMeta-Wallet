import type {} from "@bfmeta/wallet-typings";
import { BCF_PEERS, BCFApi } from "./core/bcfApi";
import { Resolve, ModuleStroge } from "@bnqkl/util-node";
export const BCFWalletFactory = (config: BFChainWallet.WalletNode, parentMap?: ModuleStroge) => {
    const bcfApi = Resolve(
        BCFApi,
        new ModuleStroge(
            [
                [BCF_PEERS.host, config.host],
                [BCF_PEERS.browser, config.browserPath],
            ],
            parentMap,
        ),
    );
    return bcfApi;
};
export * from "./core";
