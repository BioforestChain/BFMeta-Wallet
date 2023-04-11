import { Injectable } from "@bfchain/util-dep-inject";

@Injectable("CustomerPeerCheckHelper")
export class BscHealthCheckHelper
    implements BFChainWallet.Helpers.CustomerPeerCheckHelperInterface {
    constructor() {}
    async checkStatusByPeer(peer: BFChainWallet.Helpers.PeerModel): Promise<number> {
        return Infinity;
    }
}
