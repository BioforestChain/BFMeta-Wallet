export {};
declare global {
    export namespace BFChainWallet {
        /**BCF */
        export namespace BCF {
            export type COMMON_RESPONSE<T> = {
                success: boolean;
                result: T;
            };
            export type GetAddressBalanceResp = { amount: string };
            export type GetAccountInfoResp = {
                address: string;
                publicKey: string;
                secondPublicKey: string;
                isDelegate: boolean;
                isAcceptVote: boolean;
                accountStatus: number;
                equityInfo: {
                    round: number;
                    equity: string;
                    fixedEquity: string;
                };
            };
            export type GetBlockAverageFeeResp = { blockAveFee: string };

            export type GetAccountAssetResp = {
                address: string;
                assets: {
                    [magic: string]: {
                        [assetType: string]: {
                            sourceChainMagic: string;
                            assetType: string;
                            sourceChainName: string;
                            assetNumber: string;
                        };
                    };
                };
                forgingRewards: string;
                votingRewards: string;
            };

            export type GetAllAccountAssetReq = {
                filter: {
                    [assetType: string]: string;
                };
            };

            export type GetAllAccountAssetResp = {
                [address: string]: {
                    [assetType: string]: string;
                };
            }[];

            export type GetTransactionsByBrowserResp = {
                page: number;
                pageSize: number;
                total: number;
                hasMore: boolean;
                dataList: BFMetaNodeSDK.Basic.TransactionInBlockJSON[];
            };

            export type GetAssetsResp = {
                page: number;
                pageSzie: number;
                total: number;
                hasMore: boolean;
                dataList: GetAssetsData[];
            };

            export type GetAssetsData = {
                assetType: string;
                sourceChainMagic: string;
                applyAddress: string;
                sourceChainName: string;
                iconUrl: string;
            };

            export interface GetAssetDetailsResp extends AssetInfo {
                // 图标url
                iconUrl: string;
            }

            export interface AssetInfo extends Asset {
                /**活跃地址数 */
                addressQty: number;
            }

            /**Asset */
            export interface Asset {
                // 资产名称
                assetType: string;
                // 发行地址
                applyAddress: string;
                // 创世地址
                genesisAddress: string;
                // 归属链名称
                sourceChainName: string;
                // 发行总量
                issuedAssetPrealnum: string;
                // 当前总量
                remainAssetPrealnum: string;
                // 冻结主资产量
                frozenMainAssetPrealnum: string;
                // 发行时间
                dateCreated: number;
                // 跨链字段
                sourceChainMagic: string;
            }

            export interface API {
                sdk: import("@bfmeta/node-sdk").BFMetaSDK;

                getAddressBalance(
                    address: string,
                    magic: string,
                    assetType: string,
                ): Promise<COMMON_RESPONSE<GetAddressBalanceResp>>;
                getAccountInfo(address: string): Promise<COMMON_RESPONSE<GetAccountInfoResp | null>>;
                getBlockAverageFee(): Promise<COMMON_RESPONSE<GetBlockAverageFeeResp>>;
                getAccountAsset(
                    address: string,
                ): Promise<BFChainWallet.BCF.COMMON_RESPONSE<BFChainWallet.BCF.GetAccountAssetResp>>;
                getAssets(page: number, pageSize: number, assetType?: string): Promise<COMMON_RESPONSE<GetAssetsResp>>;
                getAssetDetails(assetType: string): Promise<COMMON_RESPONSE<GetAssetDetailsResp>>;
            }
        }
    }
}
