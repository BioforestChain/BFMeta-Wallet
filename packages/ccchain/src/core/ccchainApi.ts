import { Inject, Injectable } from "@bnqkl/util-node";
import { HttpHelper, _BaseApi } from "@bfmeta/wallet-helpers";
import { BFMetaSDK } from "@bfmeta/node-sdk";
export const CCCHAIN_PEERS = {
    ips: Symbol("ips"),
    port: Symbol("port"),
    browser: Symbol("browser"),
};

@Injectable()
export class CCChainApi extends _BaseApi implements BFChainWallet.CCCHAIN.API {
    private __sdk: BFMetaSDK;

    constructor(
        @Inject(CCCHAIN_PEERS.ips) public ips: string[],
        @Inject(CCCHAIN_PEERS.port) public port: number,
        public httpHelper: HttpHelper,
        @Inject(CCCHAIN_PEERS.browser, { optional: true }) public browser: string,
    ) {
        super(httpHelper);
        this.__sdk = new BFMetaSDK(undefined, {
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

    getBrowserUrl() {
        if (this.browser) {
            return this.browser;
        } else {
            throw new Error(`invaild browser path`);
        }
    }
}
