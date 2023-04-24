import { Injectable } from "@bnqkl/util-node";

@Injectable("CustomerPeerCheckHelper")
export class BscHealthCheckHelper
    implements BFChainWallet.Helpers.CustomerPeerCheckHelperInterface {
    constructor() {}
    async checkStatusByPeer(peer: BFChainWallet.Helpers.PeerModel): Promise<number> {
        return Infinity;
    }
}
