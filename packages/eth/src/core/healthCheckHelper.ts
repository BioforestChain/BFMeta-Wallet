import { Injectable } from "@bfchain/util-dep-inject";

@Injectable("CustomerPeerCheckHelper")
export class EthHealthCheckHelper
    implements BFChainWallet.Helpers.CustomerPeerCheckHelperInterface {
    constructor() {}
    async checkStatusByPeer(peer: BFChainWallet.Helpers.PeerModel): Promise<number> {
        return Infinity;
    }
}
