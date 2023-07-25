export {};
declare global {
    export namespace BFChainWallet {
        export namespace Helpers {
            export type PeerConfigModel = {
                ip: string;
                port: number;
                protocol: "http" | "websocket";
            };
            export type PeerModel = PeerConfigModel & {
                enable: boolean;
                delay: number;
            };
            export interface PeerListHelperInterface {
                peersConfig: PeerConfigModel[];
                peerMap: Map<string, PeerModel>;
                checkPeerInterval(): void;
            }

            export interface CustomerPeerCheckHelperInterface {
                checkStatusByPeer(peer: BFChainWallet.Helpers.PeerModel): Promise<number>;
            }

            export interface Logger {
                log(...arg: any[]): void;
                info(...arg: any[]): void;
                warn(...arg: any[]): void;
                error(...arg: any[]): void;
            }
        }
    }
}
