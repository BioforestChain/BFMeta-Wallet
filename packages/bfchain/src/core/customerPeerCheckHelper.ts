export class CustomerPeerCheckHelper
    implements BFChainWallet.Helpers.CustomerPeerCheckHelperInterface {
    async checkStatusByPeer(peer: BFChainWallet.Helpers.PeerModel): Promise<number> {
        // bfchain的节点似乎已经在sdk里面维护了
        return Infinity;
    }
}
