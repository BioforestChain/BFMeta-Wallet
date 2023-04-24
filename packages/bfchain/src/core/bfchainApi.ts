import { Inject, Injectable } from "@bnqkl/util-node";
import { HttpHelper, _BaseApi } from "@bfmeta/wallet-helpers";
import { BFMetaSDK } from "@bfmeta/node-sdk";
export const BFCHAIN_PEERS = {
    ips: Symbol("ips"),
    port: Symbol("port"),
    browser: Symbol("browser"),
};

@Injectable()
export class BFChainApi extends _BaseApi implements BFChainWallet.BFCHAIN.API {
    private __sdk: BFMetaSDK;

    constructor(
        @Inject(BFCHAIN_PEERS.ips) public ips: string[],
        @Inject(BFCHAIN_PEERS.port) public port: number,
        public httpHelper: HttpHelper,
        @Inject(BFCHAIN_PEERS.browser, { optional: true }) public browser: string,
    ) {
        super(httpHelper);
        this.__sdk = new BFMetaSDK({
            multiNodes: {
                enable: true,
                nodes: this.ips.map((v) => {
                    return { ip: v, port: this.port };
                }),
            },
        });
    }

    get sdk() {
        return this.__sdk;
    }

    async getTransactionsByBrowser(
        params: BFMetaNodeSDK.Basic.GetTransactionsParams,
    ): Promise<
        BFChainWallet.BFCHAIN.COMMON_RESPONSE<BFChainWallet.BFCHAIN.GetTransactionsByBrowserResp>
    > {
        const result = await this.httpHelper.sendPostRequest<any>(
            `${this.getBrowserUrl()}/public/queryTransaction`,
            params,
        );
        if (result.success) {
            return { success: true, result: result.data };
        } else {
            throw new Error(
                result.error?.message ? result.error.message : `queryTransaction error`,
            );
        }
    }

    getBrowserUrl() {
        if (this.browser) {
            return this.browser;
        } else {
            throw new Error(`invaild browser path`);
        }
    }
}
