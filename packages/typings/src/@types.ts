export {};
declare global {
    export namespace BFChainWallet {
        export type HostType = {
            ip: string;
            port: number;
        };
        export type WalletNode = {
            host: HostType[];
            browserPath?: string;
        };
        export type HeadersType = { [key: string]: string };
        export interface Config {
            bcf: {
                [chainName: string]: {
                    enable: boolean;
                } & WalletNode;
            };
            tron?: {
                enable: boolean;
                host: HostType[];
                headers: HeadersType;
                official?: string;
            };
            eth?: {
                enable: boolean;
                host: HostType[];
                testnet: boolean;
                headers: HeadersType;
                official?: string;
            };
            bsc?: {
                enable: boolean;
                host: HostType[];
                testnet: boolean;
                headers: HeadersType;
                official?: string;
            };

            bscApiScan?: {
                enable: boolean;
                apiHost: string;
                apiKey: string;
            };

            ethApiScan?: {
                enable: boolean;
                apiHost: string;
                apiKey: string;
            };

            tronApiScan?: {
                enable: boolean;
                apiHost: string;
                apiKey: string;
            };
        }
    }
}
