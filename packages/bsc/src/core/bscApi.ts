import { Inject, Injectable } from "@bnqkl/util-node";
import {
    PeerListHelper,
    TatumSymbol,
    BscApiScanSymbol,
    HttpHelper,
    ABISupportFunctionEnum,
} from "@bfmeta/wallet-helpers";
import Web3 from "web3";
import type * as Web3_Eth from "web3-eth";
import { BSC_BEP20_ABI } from "./constants";
import * as ethereumjs from "ethereumjs-tx";
import ethereumcommon from "ethereumjs-common";
import type { AbiItem } from "web3-utils";

export const BSC_PEERS = {
    host: Symbol("host"),
    testnet: Symbol("testnet"),
};
@Injectable()
export class BscApi implements BFChainWallet.BSC.API {
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

    private __bscMainnetCommon = ethereumcommon.forCustomChain(
        "mainnet",
        {
            name: "my-network",
            networkId: 56,
            chainId: 56,
        },
        "petersburg",
    );
    private __bscTestnetCommon = ethereumcommon.forCustomChain(
        "mainnet",
        {
            name: "my-network",
            networkId: 97,
            chainId: 97,
        },
        "petersburg",
    );
    constructor(
        @Inject(BSC_PEERS.host) public host: BFChainWallet.HostType[],
        @Inject(BSC_PEERS.testnet) public testnet: boolean,
        public httpHelper: HttpHelper,
        public peerListHelper: PeerListHelper,
        @Inject(TatumSymbol) public tatumConfig: BFChainWallet.Config["tatum"],
        @Inject(BscApiScanSymbol) public bscApiScanConfig: BFChainWallet.Config["bscApiScan"],
    ) {
        const peersConfig: BFChainWallet.Helpers.PeerConfigModel[] = [];
        host.map((v) => {
            peersConfig.push({ ip: v.ip, port: v.port, protocol: "http" });
        });
        this.peerListHelper.peersConfig = peersConfig;
        this.peerListHelper.init();
        this.newWeb3();
    }

    async getAccountBalance(address: string): Promise<BFChainWallet.ETH.AccountBalanceRes> {
        const host = `${await this.getApiUrl()}/blockchain/token/address/BSC/${address}`;
        return await this.httpHelper.sendApiGetRequest(host, {}, await this.getApiHeaders());
    }

    async getNormalTransHistory(
        req: BFChainWallet.BSC.BscTransHistoryReq,
    ): Promise<BFChainWallet.BSC.NormalTransHistoryRes> {
        const host = `${await this.getApiScanUrl()}&module=account&action=txlist`;
        const normalResult: BFChainWallet.BSC.NormalTransHistoryResult =
            await this.httpHelper.sendGetRequest(host, req);
        let result: BFChainWallet.BSC.NormalTransRes[] = [];
        if (normalResult?.status === "1") {
            normalResult.result?.forEach((a) => {
                // 合约交易判断过滤
                if (!a.contractAddress && !a.functionName && a.value !== "0") {
                    const b: BFChainWallet.BSC.NormalTransRes = {
                        blockNumber: a.blockNumber,
                        timeStamp: a.timeStamp,
                        hash: a.hash,
                        from: a.from,
                        to: a.to,
                        value: a.value,
                        gas: a.gas,
                        gasPrice: a.gasPrice,
                        gasUsed: a.gasUsed,
                        // txreceipt_status: a.txreceipt_status,
                    };
                    result.push(b);
                }
            });
        }
        const res: BFChainWallet.BSC.NormalTransHistoryRes = {
            status: normalResult?.status,
            message: normalResult?.message,
            result: result,
        };
        return res;
    }

    async getBep20TransHistory(
        req: BFChainWallet.BSC.BscTransHistoryReq,
    ): Promise<BFChainWallet.BSC.Bep20TransHistoryRes> {
        const host = `${await this.getApiScanUrl()}&module=account&action=tokentx`;
        const bep20Result: BFChainWallet.BSC.Bep20TransHistoryResult =
            await this.httpHelper.sendGetRequest(host, req);
        let result: BFChainWallet.BSC.Bep20TransRes[] = [];
        // status = 1 时为成功状态
        if (bep20Result?.status === "1") {
            result = bep20Result?.result?.map((a) => {
                const b: BFChainWallet.BSC.Bep20TransRes = {
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

        const res: BFChainWallet.BSC.Bep20TransHistoryRes = {
            status: bep20Result?.status,
            message: bep20Result?.message,
            result: result,
        };
        return res;
    }

    async getLastBlock(): Promise<any> {
        return await this.web3.eth.getBlock("latest");
    }

    async getBlock(num: number): Promise<any> {
        return await this.web3.eth.getBlock(num);
    }

    async getBaseGas(): Promise<BFChainWallet.ETH.BaseGas> {
        const baseGas: BFChainWallet.ETH.BaseGas = {
            generalGas: 21000,
            contractGas: 70000,
        };
        return baseGas;
    }

    async getTokenInfo(contractAddress: string): Promise<any> {
        const abi: any = BSC_BEP20_ABI;
        const contract = new this.web3.eth.Contract(abi, contractAddress);
        const name = await contract.methods.name().call();
        const symbol = await contract.methods.symbol().call();
        const decimals = await contract.methods.decimals().call();
        const totalSupply = await contract.methods.totalSupply().call();
        return { name, symbol, decimals, totalSupply };
    }

    async getContractGas(from: string, to: string, amount: number, contractAddress: string) {
        const contract = await this.getContract(from, contractAddress);
        return await contract.methods.transfer(to, amount).estimateGas();
    }

    async getGasPrice(): Promise<string> {
        return await this.web3.eth.getGasPrice();
    }

    async getBalance(address: string): Promise<string> {
        return await this.web3.eth.getBalance(address);
    }

    async fromWei(wei: string) {
        return this.web3.utils.fromWei(wei, "ether");
    }

    async getChainId() {
        return await this.web3.eth.getChainId();
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

    async getTransactionCount(address: string) {
        return await this.web3.eth.getTransactionCount(address);
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
    async getContractTransData(
        from: string,
        to: string,
        amount: number,
        contractAddress: string,
    ): Promise<string> {
        const contract = await this.getContract(from, contractAddress);
        return await contract.methods.transfer(to, amount).encodeABI();
    }

    async sendSignedTransaction(raw: string): Promise<string> {
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
        const transactionReceipt: Web3_Eth.TransactionReceipt =
            await this.web3.eth.getTransactionReceipt(txHash);
        return transactionReceipt;
    }

    private async getContract(address: string, contractAddress: string) {
        return this.generateContract(BSC_BEP20_ABI, contractAddress, address);
    }

    private async generateContract(abi: any, contractAddress: string, from: string) {
        return new this.web3.eth.Contract(abi, contractAddress, { from: from });
    }

    private async getApiUrl() {
        return this.tatumConfig.apiHost;
    }

    private async getApiHeaders() {
        return { "x-api-key": this.tatumConfig.apiKey };
    }

    private async getApiScanUrl() {
        if (this.bscApiScanConfig?.enable) {
            return `${this.bscApiScanConfig.apiHost}/api?apikey=${this.bscApiScanConfig.apiKey}`;
        }
        return null;
    }

    private async getPeerUrl() {
        if (this.tatumConfig.enable) {
            return `${this.tatumConfig.host}/BSC/${this.tatumConfig.apiKey}`;
        } else {
            const p = await this.peerListHelper.getEnableRandom();
            // return `http://${p.ip}:${p.port}`;
            /** @TODO 因内网节点问题，暂时不带端口 */
            return `http://${p.ip}`;
        }
    }

    getTransactionFromSignature(signature: string) {
        const tx = new ethereumjs.Transaction(signature, {
            common: this.testnet ? this.__bscTestnetCommon : this.__bscMainnetCommon,
        });
        return tx;
    }

    /**
     * 参数解码
     * @param hex  将 toSring("hex") 后的data放进来。注意是 0x开头
     * @param functionName  合约ABI中可以调用方法的方法名
     */
    decodeParameters<T>(hex: string, functionName: ABISupportFunctionEnum) {
        const methodABI: any = this.getMethodABI(functionName);
        return this.web3.eth.abi.decodeParameters(methodABI.inputs, hex) as T;
    }

    getMethodABI(functionName: ABISupportFunctionEnum) {
        const methodABI: AbiItem | undefined = BSC_BEP20_ABI.find((a: AbiItem) => {
            return a.type === "function" && a.name === functionName;
        });
        return methodABI;
    }
}
