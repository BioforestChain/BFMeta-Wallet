import { Inject, Injectable } from "@bnqkl/util-node";
import { HttpHelper, _BaseApi } from "@bfmeta/wallet-helpers";
import { BFMetaSDK } from "@bfmeta/node-sdk";
export const PMCHAIN_PEERS = {
    host: Symbol("host"),
    browser: Symbol("browser"),
};

@Injectable()
export class PMChainApi extends _BaseApi implements BFChainWallet.PMCHAIN.API {
    private __sdk: BFMetaSDK;

    constructor(
        @Inject(PMCHAIN_PEERS.host) public host: BFChainWallet.HostType[],
        public httpHelper: HttpHelper,
        @Inject(PMCHAIN_PEERS.browser, { optional: true }) public browser: string,
    ) {
        super(httpHelper);
        this.__sdk = new BFMetaSDK({
            multiNodes: {
                enable: true,
                nodes: this.host.map((v) => {
                    return { ip: v.ip, port: v.port };
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
