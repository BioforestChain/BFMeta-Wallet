import { Injectable } from "@bnqkl/util-node";
import { HttpHelper } from "./httpHelper";
// import type { BFMetaSDK } from "@bfmeta/node-sdk";
export const BFCHAIN_PEERS = {
    ips: Symbol("ips"),
    port: Symbol("port"),
    browser: Symbol("browser"),
};

@Injectable()
export abstract class _BaseApi {
    // private __sdk!: BFMetaSDK;
    browser!: string;
    constructor(public httpHelper: HttpHelper) {}

    async getTransactionsByBrowser(
        params: BFMetaNodeSDK.Basic.GetTransactionsParams,
    ): Promise<BFChainWallet.BCF.COMMON_RESPONSE<BFChainWallet.BCF.GetTransactionsByBrowserResp>> {
        const result = await this.httpHelper.sendPostRequest<any>(
            `${this.getBrowserUrl()}/public/queryTransaction`,
            params,
        );
        if (result.success) {
            return { success: true, result: result.data };
        } else {
            throw new Error(result.error?.message ? result.error.message : `queryTransaction error`);
        }
    }

    async getAddressBalance(
        address: string,
        magic: string,
        assetType: string,
    ): Promise<BFChainWallet.BCF.COMMON_RESPONSE<BFChainWallet.BCF.GetAddressBalanceResp>> {
        const result = await this.httpHelper.sendGetRequest<any>(`${this.getBrowserUrl()}/public/accountBalance`, {
            address,
            magic,
            assetType,
        });
        if (result.success) {
            return { success: true, result: { amount: result.data } };
        } else {
            throw new Error(result.error?.message ? result.error.message : `${this.browser} getAddressBalance error`);
        }
    }

    async getAccountInfo(
        address: string,
    ): Promise<BFChainWallet.BCF.COMMON_RESPONSE<BFChainWallet.BCF.GetAccountInfoResp | null>> {
        const result = await this.httpHelper.sendGetRequest<any>(`${this.getBrowserUrl()}/public/accountsInfo`, {
            address,
        });
        if (result.success) {
            if (result.data) {
                const { address, publicKey, secondPublicKey, isDelegate, isAcceptVote, accountStatus } = result.data;
                return {
                    success: true,
                    result: {
                        address,
                        publicKey,
                        secondPublicKey,
                        isDelegate,
                        isAcceptVote,
                        accountStatus,
                    },
                };
            } else {
                return {
                    success: true,
                    result: null,
                };
            }
        } else {
            throw new Error(result.error?.message ?? `${this.browser} getAccountInfo error`);
        }
    }

    async getBlockAverageFee(): Promise<BFChainWallet.BCF.COMMON_RESPONSE<BFChainWallet.BCF.GetBlockAverageFeeResp>> {
        const result = await this.httpHelper.sendGetRequest<any>(`${this.getBrowserUrl()}/public/blockAverageFee`, {});
        if (result.success) {
            return { success: true, result: { blockAveFee: result.data } };
        } else {
            throw new Error(result.error?.message ? result.error.message : `${this.browser} getBlockAverageFee error`);
        }
    }

    async getAccountAsset(
        address: string,
    ): Promise<BFChainWallet.BCF.COMMON_RESPONSE<BFChainWallet.BCF.GetAccountAssetResp>> {
        const result = await this.httpHelper.sendGetRequest<any>(
            `${this.getBrowserUrl()}/public/addressAccountsAssets`,
            { address },
        );
        if (result.success) {
            return { success: true, result: result.data };
        } else {
            throw new Error(
                result.error?.message ? result.error.message : `${this.browser} addressAccountsAssets error`,
            );
        }
    }

    async getAssets(
        page: number,
        pageSize: number,
        assetType?: string,
    ): Promise<BFChainWallet.BCF.COMMON_RESPONSE<BFChainWallet.BCF.GetAssetsResp>> {
        const result = await this.httpHelper.sendGetRequest<any>(`${this.getBrowserUrl()}/assets/queryAssets`, {
            page,
            pageSize,
            assetType,
        });
        if (result.success) {
            return { success: true, result: result.data };
        } else {
            throw new Error(result.error?.message ? result.error.message : `${this.browser} getAssets error`);
        }
    }

    async getAssetDetails(
        assetType: string,
    ): Promise<BFChainWallet.BCF.COMMON_RESPONSE<BFChainWallet.BCF.GetAssetDetailsResp>> {
        const result = await this.httpHelper.sendGetRequest<any>(`${this.getBrowserUrl()}/assets/queryAssetDetails`, {
            assetType,
        });
        if (result.success) {
            return { success: true, result: result.data };
        } else {
            throw new Error(result.error?.message ? result.error.message : `${this.browser} getAssetDetails error`);
        }
    }

    async getAllAccountAsset(): Promise<BFChainWallet.BCF.COMMON_RESPONSE<BFChainWallet.BCF.GetAllAccountAssetResp>> {
        const result = await this.httpHelper.sendGetRequest<any>(`${this.getBrowserUrl()}/asset/allAccounts`, {});
        if (result.success) {
            return { success: true, result: result.data };
        } else {
            throw new Error(
                result.error?.message ? result.error.message : `${this.browser} addressAccountsAssets error`,
            );
        }
    }

    abstract getBrowserUrl(): string | undefined;
}
