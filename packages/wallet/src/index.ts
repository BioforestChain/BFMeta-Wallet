import type {} from "@bfmeta/wallet-typings";
export * from "@bfmeta/wallet-helpers";
import { BCFWalletFactory } from "@bfmeta/wallet-bcf";
import { TronApi, TronWalletFactory } from "@bfmeta/wallet-tron";
import type { ModuleStroge } from "@bnqkl/util-node";
import { EthApi, EthWalletFactory } from "@bfmeta/wallet-eth";
import { BscApi, BscWalletFactory } from "@bfmeta/wallet-bsc";
import { BscApiScanSymbol, EthApiScanSymbol, TatumSymbol, TronApiScanSymbol } from "@bfmeta/wallet-helpers";
// export * from "@bfmeta/wallet-test";

export class WalletFactory {
    private __TronApi: TronApi | undefined;
    private __EthApi: EthApi | undefined;
    private __BscApi: BscApi | undefined;

    get TronApi() {
        if (this.__TronApi) {
            return this.__TronApi;
        } else {
            throw new Error(`TronApi is not init`);
        }
    }

    get EthApi() {
        if (this.__EthApi) {
            return this.__EthApi;
        } else {
            throw new Error(`EthApi is not init`);
        }
    }

    get BscApi() {
        if (this.__BscApi) {
            return this.__BscApi;
        } else {
            throw new Error(`BscApi is not init`);
        }
    }

    constructor(public config: BFChainWallet.Config, public moduleMap?: ModuleStroge) {
        const { tron, eth, bsc } = config;
        if (moduleMap) {
            moduleMap.set(TatumSymbol, config.tatum);
            moduleMap.set(BscApiScanSymbol, config.bscApiScan);
            moduleMap.set(EthApiScanSymbol, config.ethApiScan);
            moduleMap.set(TronApiScanSymbol, config.tronApiScan);
        }

        if (tron && tron.enable) {
            this.__TronApi = TronWalletFactory(tron, moduleMap);
        }
        if (eth && eth.enable) {
            this.__EthApi = EthWalletFactory(eth, moduleMap);
        }
        if (bsc && bsc.enable) {
            this.__BscApi = BscWalletFactory(bsc, moduleMap);
        }
    }

    generateBCFApi(node: BFChainWallet.WalletNode) {
        return BCFWalletFactory(node);
    }
}
