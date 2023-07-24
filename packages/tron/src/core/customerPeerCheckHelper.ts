import type {} from "@bfmeta/wallet-helpers";
import { Injectable, Inject } from "@bnqkl/util-node";
import { HttpHelper, LoggerSymbol } from "@bfmeta/wallet-helpers";

@Injectable("CustomerPeerCheckHelper")
export class CustomerPeerCheckHelper implements BFChainWallet.Helpers.CustomerPeerCheckHelperInterface {
    constructor(public httpHelper: HttpHelper, @Inject(LoggerSymbol) public logger: BFChainWallet.Helpers.Logger) {}
    async checkStatusByPeer(peer: BFChainWallet.Helpers.PeerModel): Promise<number> {
        // const startTime = new Date().getTime();
        // const checkUrl = `http://${peer.ip}:${peer.port}/wallet/getnowblock`;
        // const block: BFChainWallet.TRON.TronBlock = await this.httpHelper.sendGetRequest(checkUrl);
        // if (block === undefined) {
        //     return Infinity;
        // }
        // const blockNumber = block.block_header.raw_data.number;
        // this.logger.log(`tron health check for blockNumber:{${blockNumber}}", `);
        // if (blockNumber < 0) {
        //     return Infinity;
        // }
        // const endTime = new Date().getTime();
        // return endTime - startTime;
        return Infinity;
    }
}
