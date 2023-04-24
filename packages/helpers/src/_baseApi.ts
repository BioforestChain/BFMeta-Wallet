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

    async getAddressBalance(
        address: string,
        magic: string,
        assetType: string,
    ): Promise<BFChainWallet.BFCHAIN.COMMON_RESPONSE<BFChainWallet.BFCHAIN.GetAddressBalanceResp>> {
        const result = await this.httpHelper.sendGetRequest<any>(
            `${this.getBrowserUrl()}/public/accountBalance`,
            { address, magic, assetType },
        );
        if (result.success) {
            return { success: true, result: { amount: result.data } };
        } else {
            throw new Error(
                result.error?.message
                    ? result.error.message
                    : `${this.browser} getAddressBalance error`,
            );
        }
    }

    async getAccountInfo(
        address: string,
    ): Promise<
        BFChainWallet.BFCHAIN.COMMON_RESPONSE<BFChainWallet.BFCHAIN.GetAccountInfoResp | null>
    > {
        const result = await this.httpHelper.sendGetRequest<any>(
            `${this.getBrowserUrl()}/public/accountsInfo`,
            { address },
        );
        if (result.success) {
            if (result.data) {
                return {
                    success: true,
                    result: {
                        address: result.data.address,
                        publicKey: result.data.publicKey,
                        secondPublicKey: result.data.secondPublicKey,
                        isDelegate: result.data.isDelegate,
                        isAcceptVote: result.data.isAcceptVote,
                        accountStatus: result.data.accountStatus,
                    },
                };
            } else {
                return {
                    success: true,
                    result: null,
                };
            }
        } else {
            throw new Error(
                result.error?.message
                    ? result.error.message
                    : `${this.browser} getAccountInfo error`,
            );
        }
    }

    async getBlockAverageFee(): Promise<
        BFChainWallet.BFCHAIN.COMMON_RESPONSE<BFChainWallet.BFCHAIN.GetBlockAverageFeeResp>
    > {
        const result = await this.httpHelper.sendGetRequest<any>(
            `${this.getBrowserUrl()}/public/blockAverageFee`,
            {},
        );
        if (result.success) {
            return { success: true, result: { blockAveFee: result.data } };
        } else {
            throw new Error(
                result.error?.message
                    ? result.error.message
                    : `${this.browser} getBlockAverageFee error`,
            );
        }
    }

    async getAccountAsset(
        address: string,
    ): Promise<BFChainWallet.BFCHAIN.COMMON_RESPONSE<BFChainWallet.BFCHAIN.GetAccountAssetResp>> {
        const result = await this.httpHelper.sendGetRequest<any>(
            `${this.getBrowserUrl()}/public/addressAccountsAssets`,
            { address },
        );
        if (result.success) {
            return { success: true, result: result.data };
        } else {
            throw new Error(
                result.error?.message
                    ? result.error.message
                    : `${this.browser} addressAccountsAssets error`,
            );
        }
    }

    async getAssets(
        page: number,
        pageSize: number,
        assetType?: string,
    ): Promise<BFChainWallet.BFCHAIN.COMMON_RESPONSE<BFChainWallet.BFCHAIN.GetAssetsResp>> {
        const result = await this.httpHelper.sendGetRequest<any>(
            `${this.getBrowserUrl()}/assets/queryAssets`,
            { page, pageSize, assetType },
        );
        if (result.success) {
            return { success: true, result: result.data };
        } else {
            throw new Error(
                result.error?.message ? result.error.message : `${this.browser} getAssets error`,
            );
        }
    }

    async getAssetDetails(
        assetType: string,
    ): Promise<BFChainWallet.BFCHAIN.COMMON_RESPONSE<BFChainWallet.BFCHAIN.GetAssetDetailsResp>> {
        const result = await this.httpHelper.sendGetRequest<any>(
            `${this.getBrowserUrl()}/assets/queryAssetDetails`,
            { assetType },
        );
        if (result.success) {
            return { success: true, result: result.data };
        } else {
            throw new Error(
                result.error?.message
                    ? result.error.message
                    : `${this.browser} getAssetDetails error`,
            );
        }
    }

    abstract getBrowserUrl(): string | undefined;
}
