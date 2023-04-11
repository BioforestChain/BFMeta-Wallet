import { Inject, Injectable } from "@bfchain/util-dep-inject";
import { EthApiScanSymbol, HttpHelper, PeerListHelper, TatumSymbol } from "@bfmeta/wallet-helpers";
import Web3 from "web3";
import type * as Web3_Eth from "web3-eth";
import type * as Web3_Utils from "web3-utils";
import { ETH_ERC20_ABI } from "./constants";
export const ETH_PEERS = {
    ips: Symbol("ips"),
    port: Symbol("port"),
    testnet: Symbol("testnet"),
};

@Injectable()
export class EthApi implements BFChainWallet.ETH.API {
    private __web3!: Web3;
    get web3() {
        if (this.__web3) {
            return this.__web3;
        } else {
            throw new Error(`web3 is not init`);
        }
    }
    private async newWeb3() {
        this.__web3 = new Web3(await this.getPeerUrl());
    }
    constructor(
        @Inject(ETH_PEERS.ips) public ips: string[],
        @Inject(ETH_PEERS.port) public port: number,
        @Inject(ETH_PEERS.testnet) public testnet: boolean,
        public httpHelper: HttpHelper,
        public peerListHelper: PeerListHelper,
        @Inject(TatumSymbol) public tatumConfig: BFChainWallet.Config["tatum"],
        @Inject(EthApiScanSymbol) public ethApiScanConfig: BFChainWallet.Config["ethApiScan"],
    ) {
        const peersConfig: BFChainWallet.Helpers.PeerConfigModel[] = [];
        ips.map((ip) => {
            peersConfig.push({ ip: ip, port: this.port, protocol: "http" });
        });
        this.peerListHelper.peersConfig = peersConfig;
        this.peerListHelper.init();
        this.newWeb3();
    }

    async getAccountBalance(address: string): Promise<BFChainWallet.ETH.AccountBalanceRes> {
        const host = `${await this.getApiUrl()}/blockchain/token/address/ETH/${address}`;
        return await this.httpHelper.sendApiGetRequest(host, {}, await this.getApiHeaders());
    }

    async getNormalTransHistory(
        req: BFChainWallet.ETH.TransHistoryReq,
    ): Promise<BFChainWallet.ETH.NormalTransHistoryRes> {
        const host = `${await this.getApiScanUrl()}&module=account&action=txlist`;
        const normalResult: BFChainWallet.ETH.NormalTransHistoryResult = await this.httpHelper.sendGetRequest(
            host,
            req,
        );
        let result: BFChainWallet.ETH.NormalTransRes[] = [];
        if (normalResult?.status === "1") {
            normalResult.result?.forEach((a) => {
                // 合约交易判断过滤
                if (!a.contractAddress && !a.functionName && a.value !== "0") {
                    const b: BFChainWallet.ETH.NormalTransRes = {
                        blockNumber: a.blockNumber,
                        timeStamp: a.timeStamp,
                        hash: a.hash,
                        from: a.from,
                        to: a.to,
                        value: a.value,
                        gas: a.gas,
                        gasPrice: a.gasPrice,
                        gasUsed: a.gasUsed,
                    };
                    result.push(b);
                }
            });
        }
        const res: BFChainWallet.ETH.NormalTransHistoryRes = {
            status: normalResult?.status,
            message: normalResult?.message,
            result: result,
        };
        return res;
    }
    async getErc20TransHistory(
        req: BFChainWallet.ETH.TransHistoryReq,
    ): Promise<BFChainWallet.ETH.Erc20TransHistoryRes> {
        const host = `${await this.getApiScanUrl()}&module=account&action=tokentx`;
        const erc20Result: BFChainWallet.ETH.Erc20TransHistoryResult = await this.httpHelper.sendGetRequest(
            host,
            req,
        );
        let result: BFChainWallet.ETH.Erc20TransRes[] = [];
        if (erc20Result?.status === "1") {
            result = erc20Result?.result?.map((a) => {
                const b: BFChainWallet.ETH.Erc20TransRes = {
                    blockNumber: a.blockNumber,
                    timeStamp: a.timeStamp,
                    hash: a.hash,
                    from: a.from,
                    contractAddress: a.contractAddress,
                    to: a.to,
                    value: a.value,
                    tokenName: a.tokenName,
                    tokenSymbol: a.tokenSymbol,
                    tokenDecimal: a.tokenDecimal,
                    gas: a.gas,
                    gasPrice: a.gasPrice,
                    gasUsed: a.gasUsed,
                };
                return b;
            });
        }

        const res: BFChainWallet.ETH.Erc20TransHistoryRes = {
            status: erc20Result?.status,
            message: erc20Result?.message,
            result: result,
        };
        return res;
    }

    async getLastBlock(): Promise<Web3_Eth.BlockTransactionString> {
        return await this.web3.eth.getBlock("latest");
    }

    async getBlock(num: number): Promise<Web3_Eth.BlockTransactionString> {
        return await this.web3.eth.getBlock(num);
    }

    async getChainId(): Promise<number> {
        return await this.web3.eth.getChainId();
    }

    async getBaseGas(): Promise<BFChainWallet.ETH.BaseGas> {
        const baseGas: BFChainWallet.ETH.BaseGas = {
            generalGas: 21000,
            contractGas: 70000,
        };
        return baseGas;
    }

    async getContractGas(from: string, to: string, amount: number, contractAddress: string) {
        const contract = await this.getContract(from, contractAddress);
        return await contract.methods.transfer(to, amount).estimateGas();
    }

    async getGasPrice(): Promise<string> {
        return await this.web3.eth.getGasPrice();
    }

    async getBalance(address: string): Promise<string> {
        return await this.web3.eth.getBalance(address, "latest");
    }

    async getContractBalance(address: string, contractAddress: string): Promise<string> {
        const contract = await this.getContract(address, contractAddress);
        return await contract.methods.balanceOf(address).call();
    }

    async getContractBalanceAndDecimal(
        address: string,
        contractAddress: string,
    ): Promise<BFChainWallet.ETH.Contract20Balance> {
        const contract = await this.getContract(address, contractAddress);
        const balance = await contract.methods.balanceOf(address).call();
        const decimal = await contract.methods.decimals().call();
        return { balance, decimal };
    }

    async fromWei(wei: string) {
        return this.web3.utils.fromWei(wei, "ether");
    }

    async getContractTransData(
        from: string,
        to: string,
        amount: number,
        contractAddress: string,
    ): Promise<string> {
        const contract = await this.getContract(from, contractAddress);
        return await contract.methods.transfer(to, amount).encodeABI();
    }

    async signTransaction(req: BFChainWallet.ETH.SignTransactionReq): Promise<string> {
        const signedTransaction = await this.web3.eth.accounts.signTransaction(
            req.trans,
            req.privateKey,
            (err, signTransaction) => {
                if (err) {
                    // 抛出错误信息
                    throw new Error(err.message);
                }
            },
        );
        if (signedTransaction && signedTransaction.rawTransaction) {
            return signedTransaction.rawTransaction;
        } else {
            throw new Error("signTransaction failed, " + signedTransaction);
        }
    }

    async sendSignedTransaction(raw: string): Promise<string> {
        // 返回的交易收据信息，需要交易确定完成才会返回，会造成接口响应时间过长
        // const txReceipt = await this.web3.eth.sendSignedTransaction(raw, (err, txHash) => {
        //     if (err) {
        //         throw new Error(err.message);
        //     }
        //     console.log("txHash : %s", txHash);
        // });
        // if (txReceipt && txReceipt.transactionHash) {
        //     return txReceipt;
        // } else {
        //     throw new Error("sendSignedTransaction failed, " + txReceipt);
        // }

        return new Promise((resolve, reject) => {
            this.web3.eth.sendSignedTransaction(raw, (err, txHash) => {
                if (err) {
                    reject(err);
                }
                resolve(txHash);
            });
        });
    }

    async getTransaction(txHash: string) {
        const transaction: Web3_Eth.Transaction = await this.web3.eth.getTransaction(txHash);
        return transaction;
    }

    async getTransactionReceipt(txHash: string) {
        const transactionReceipt: Web3_Eth.TransactionReceipt = await this.web3.eth.getTransactionReceipt(
            txHash,
        );
        return transactionReceipt;
    }

    async getTransactionCount(address: string) {
        return await this.web3.eth.getTransactionCount(address);
    }

    async getNodeInfo() {
        return await this.web3.eth.getNodeInfo();
    }

    async getWeb3Util(): Promise<Web3_Utils.Utils> {
        return this.web3.utils;
    }

    private async getContract(address: string, contractAddress: string) {
        return this.generateContract(ETH_ERC20_ABI, contractAddress, address);
    }

    private async generateContract(abi: any, contractAddress: string, from: string) {
        return new this.web3.eth.Contract(abi, contractAddress, { from: from });
    }

    private async getApiUrl() {
        if (this.tatumConfig.apiHost) {
            return this.tatumConfig.apiHost;
        }
        return this.getPeerUrl();
    }

    private async getApiHeaders() {
        return { "x-api-key": this.tatumConfig.apiKey };
    }

    private async getApiScanUrl() {
        if (this.ethApiScanConfig?.enable) {
            return `${this.ethApiScanConfig.apiHost}/api?apikey=${this.ethApiScanConfig.apiKey}`;
        }
        return null;
    }

    private async getPeerUrl() {
        if (this.tatumConfig.enable) {
            return this.tatumConfig.ethTest
                ? `${this.tatumConfig.host}/ETH/${this.tatumConfig.apiKey}?${this.tatumConfig.ethTest}`
                : `${this.tatumConfig.host}/ETH/${this.tatumConfig.apiKey}`;
        } else {
            const p = await this.peerListHelper.getEnableRandom();
            // return `http://${p.ip}:${p.port}`;
            /** @TODO 因内网节点问题，暂时不带端口 */
            return `http://${p.ip}`;
        }
    }
}
