import "@bfmeta/wallet-typings";

import "./@types";

export * from "@bfmeta/wallet-helpers";

import { BFChainApi, BFChainWalletFactory } from "@bfmeta/wallet-bfchain";
import { CCChainApi, CCChainWalletFactory } from "@bfmeta/wallet-ccchain";
import { BfmApi, BFMWalletFactory } from "@bfmeta/wallet-bfm";
import { PMChainApi, PMChainWalletFactory } from "@bfmeta/wallet-pmchain";
import { TronApi, TronWalletFactory } from "@bfmeta/wallet-tron";
import type { ModuleStroge } from "@bnqkl/util-node";
import { EthApi, EthWalletFactory } from "@bfmeta/wallet-eth";
import { BscApi, BscWalletFactory } from "@bfmeta/wallet-bsc";
import {
    BscApiScanSymbol,
    EthApiScanSymbol,
    TatumSymbol,
    TronApiScanSymbol,
} from "@bfmeta/wallet-helpers";
// export * from "@bfmeta/wallet-test";

export class WalletFactory {
    private __BFChainApi: BFChainApi | undefined;
    private __CCChainApi: CCChainApi | undefined;
    private __BFMApi: BfmApi | undefined;
    private __PMChainApi: PMChainApi | undefined;
    private __TronApi: TronApi | undefined;
    private __EthApi: EthApi | undefined;
    private __BscApi: BscApi | undefined;
    get BFChainApi() {
        if (this.__BFChainApi) {
            return this.__BFChainApi;
        } else {
            throw new Error(`BFChainApi is not init`);
        }
    }
    get CCChainApi() {
        if (this.__CCChainApi) {
            return this.__CCChainApi;
        } else {
            throw new Error(`CCChainApi is not init`);
        }
    }

    get BFMApi() {
        if (this.__BFMApi) {
            return this.__BFMApi;
        } else {
            throw new Error(`BFMApi is not init`);
        }
    }

    get PMChainApi() {
        if (this.__PMChainApi) {
            return this.__PMChainApi;
        } else {
            throw new Error(`PMChainApi is not init`);
        }
    }

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

    constructor(config: BFChainWallet.Config, moduleMap?: ModuleStroge) {
        const { bfchain, ccchain, bfm, pmchain, tron, eth, bsc } = config;
        if (moduleMap) {
            moduleMap.set(TatumSymbol, config.tatum);
            moduleMap.set(BscApiScanSymbol, config.bscApiScan);
            moduleMap.set(EthApiScanSymbol, config.ethApiScan);
            moduleMap.set(TronApiScanSymbol, config.tronApiScan);
        }
        if (bfchain && bfchain.enable) {
            this.__BFChainApi = BFChainWalletFactory(bfchain, moduleMap);
        }
        if (ccchain && ccchain.enable) {
            this.__CCChainApi = CCChainWalletFactory(ccchain, moduleMap);
        }
        if (bfm && bfm.enable) {
            this.__BFMApi = BFMWalletFactory(bfm, moduleMap);
        }
        if (pmchain && pmchain.enable) {
            this.__PMChainApi = PMChainWalletFactory(pmchain, moduleMap);
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
}
