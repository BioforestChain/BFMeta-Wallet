import { Inject, Injectable } from "@bfchain/util-dep-inject";
import { HttpHelper, _BaseApi } from "@bfmeta/wallet-helpers";
import { BFMetaSDK } from "@bfmeta/node-sdk";
export const BFM_PEERS = {
    ips: Symbol("ips"),
    port: Symbol("port"),
    browser: Symbol("browser"),
};

@Injectable()
export class BfmApi extends _BaseApi implements BFChainWallet.BFM.API {
    private __sdk: BFMetaSDK;

    constructor(
        @Inject(BFM_PEERS.ips) public ips: string[],
        @Inject(BFM_PEERS.port) public port: number,
        public httpHelper: HttpHelper,
        @Inject(BFM_PEERS.browser, { optional: true }) public browser: string,
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
