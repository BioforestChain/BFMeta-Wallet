import { Inject, sleep, Injectable, PromiseOut } from "@bnqkl/util-node";
import { LoggerSymbol } from "./constants";

export const PeerListHelperParmas = {
    checkInterval: Symbol("checkInterval"),
};

@Injectable()
export class PeerListHelper implements BFChainWallet.Helpers.PeerListHelperInterface {
    private __peersConfig: BFChainWallet.Helpers.PeerConfigModel[] = [];
    get peersConfig() {
        return this.__peersConfig;
    }
    set peersConfig(p: BFChainWallet.Helpers.PeerConfigModel[]) {
        this.__peersConfig = p;
    }
    private __initPromiseOut = new PromiseOut();
    constructor(
        @Inject(PeerListHelperParmas.checkInterval) public checkInterval: number,
        @Inject("CustomerPeerCheckHelper")
        private customerPeerCheckHelperInterface: BFChainWallet.Helpers.CustomerPeerCheckHelperInterface,
        @Inject(LoggerSymbol) public logger: BFChainWallet.Helpers.Logger,
    ) {}

    async init() {
        do {
            for (const peerConfig of this.peersConfig) {
                const p: BFChainWallet.Helpers.PeerModel = {
                    ip: peerConfig.ip,
                    port: peerConfig.port,
                    protocol: peerConfig.protocol,
                    enable: false,
                    delay: Infinity,
                };
                const peer = await this.__checkStatusByPeer(p);
                if (peer.enable) {
                    this.peerMap.set(`${p.ip}:${p.port}`, peer);
                }
            }
            this.__enablePeerArr = [...this.peerMap.values()].sort((a, b) => a.delay - b.delay);
            // 第一次初始化后 将锁释放
            if (!this.__initPromiseOut.is_finished) {
                this.__initPromiseOut.resolve(undefined);
            }
            await sleep(this.checkInterval);
        } while (true);
    }
    peerMap = new Map<string, BFChainWallet.Helpers.PeerModel>();
    private __enablePeerArr: BFChainWallet.Helpers.PeerModel[] = [];
    async checkPeerInterval() {
        do {
            const _tempArr: BFChainWallet.Helpers.PeerModel[] = [];
            for (const [key, peer] of this.peerMap.entries()) {
                let p = await this.__checkStatusByPeer(peer);
                if (p.enable) {
                    _tempArr.push(p);
                }
            }
            this.__enablePeerArr = _tempArr.sort((a, b) => a.delay - b.delay);
            await sleep(this.checkInterval);
        } while (true);
    }

    private async __checkStatusByPeer(peer: BFChainWallet.Helpers.PeerModel) {
        try {
            const delay = await this.customerPeerCheckHelperInterface.checkStatusByPeer(peer);
            peer.delay = delay;
            peer.enable = true;
            return peer;
        } catch (err) {
            peer.enable = false;
            peer.delay = Infinity;
            this.logger.warn(err);
            return peer;
        }
    }

    /** @TODO 以下两个接口要做一些缓存策略 */
    async getEnableRandom() {
        await this.__initPromiseOut.promise;
        if (this.__enablePeerArr.length > 0) {
            return this.__enablePeerArr[Math.floor(Math.random() * this.__enablePeerArr.length)];
        } else {
            throw new Error(`can not find enable peer`);
        }
    }

    async getEnablePeerByDelay() {
        await this.__initPromiseOut.promise;
        if (this.__enablePeerArr.length > 0) {
            return this.__enablePeerArr[0];
        } else {
            throw new Error(`can not find enable peer`);
        }
    }
}
