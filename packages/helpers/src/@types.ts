declare namespace BFChainWallet {
    namespace Helpers {
        type PeerConfigModel = {
            ip: string;
            port: number;
            protocol: "http" | "websocket";
        };
        type PeerModel = PeerConfigModel & {
            enable: boolean;
            delay: number;
        };
        interface PeerListHelperInterface {
            peersConfig: PeerConfigModel[];
            peerMap: Map<string, PeerModel>;
            checkPeerInterval(): void;
        }

        interface CustomerPeerCheckHelperInterface {
            checkStatusByPeer(peer: BFChainWallet.Helpers.PeerModel): Promise<number>;
        }

        interface Logger {
            log(...arg: any[]): void;
            info(...arg: any[]): void;
            warn(...arg: any[]): void;
            error(...arg: any[]): void;
        }
    }
}
