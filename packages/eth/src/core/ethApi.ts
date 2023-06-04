import { Inject, Injectable } from "@bnqkl/util-node";
import {
    ABISupportFunctionEnum,
    EthApiScanSymbol,
    HttpHelper,
    PeerListHelper,
    TatumSymbol,
} from "@bfmeta/wallet-helpers";
import Web3 from "web3";
import type * as Web3_Eth from "web3-eth";
import { ETH_ERC20_ABI } from "./constants";
import * as ethereumjs from "ethereumjs-tx";
import type { AbiItem } from "web3-utils";
export const ETH_PEERS = {
    host: Symbol("host"),
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
        @Inject(ETH_PEERS.host) public host: BFChainWallet.HostType[],
        @Inject(ETH_PEERS.testnet) public testnet: boolean,
        public httpHelper: HttpHelper,
        public peerListHelper: PeerListHelper,
        @Inject(TatumSymbol) public tatumConfig: BFChainWallet.Config["tatum"],
        @Inject(EthApiScanSymbol) public ethApiScanConfig: BFChainWallet.Config["ethApiScan"],
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
        const host = `${await this.getTatumApiUrl()}/blockchain/token/address/ETH/${address}`;
        return await this.httpHelper.sendApiGetRequest(host, {}, await this.getTatumApiHeaders());
    }

    async getNormalTransHistory(
        req: BFChainWallet.ETH.TransHistoryReq,
    ): Promise<BFChainWallet.ETH.NormalTransHistoryRes> {
        const host = `${await this.getApiScanUrl()}&module=account&action=txlist`;
        const normalResult: BFChainWallet.ETH.NormalTransHistoryResult = await this.httpHelper.sendGetRequest(
            host,
            req,
        );

        const result: BFChainWallet.ETH.NormalTransRes[] =
            normalResult?.status === "1"
                ? normalResult.result
                      ?.filter((item) => !item.contractAddress && !item.functionName && item.value !== "0")
                      .map((item) => {
                          const { blockNumber, timeStamp, hash, from, to, value, gas, gasPrice, gasUsed } = item;
                          return {
                              blockNumber,
                              timeStamp,
                              hash,
                              from,
                              to,
                              value,
                              gas,
                              gasPrice,
                              gasUsed,
                          } as BFChainWallet.ETH.NormalTransRes;
                      })
                : [];
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
        const erc20Result: BFChainWallet.ETH.Erc20TransHistoryResult = await this.httpHelper.sendGetRequest(host, req);
        const result: BFChainWallet.ETH.Erc20TransRes[] =
            erc20Result?.status === "1"
                ? (erc20Result.result
                      ?.map((item) => {
                          const {
                              blockNumber,
                              timeStamp,
                              hash,
                              from,
                              to,
                              value,
                              contractAddress,
                              tokenName,
                              tokenSymbol,
                              tokenDecimal,
                              gas,
                              gasPrice,
                              gasUsed,
                          } = item;
                          const res: BFChainWallet.ETH.Erc20TransRes = {
                              blockNumber,
                              timeStamp,
                              hash,
                              from,
                              contractAddress,
                              to,
                              value,
                              tokenName,
                              tokenSymbol,
                              tokenDecimal,
                              gas,
                              gasPrice,
                              gasUsed,
                          };
                          return res;
                      })
                      .filter((item) => item !== null) as BFChainWallet.ETH.Erc20TransRes[])
                : [];

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

    async getContractGas(from: string, to: string, amount: string, contractAddress: string) {
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

    async getContractTransData(from: string, to: string, amount: string, contractAddress: string): Promise<string> {
        const contract = await this.getContract(from, contractAddress);
        return await contract.methods.transfer(to, amount).encodeABI();
    }

    async signTransaction(req: BFChainWallet.ETH.SignTransactionReq): Promise<string> {
        const signedTransaction = await this.web3.eth.accounts.signTransaction(req.trans, req.privateKey, (err) => {
            if (err) {
                // 抛出错误信息
                throw new Error(err.message);
            }
        });
        if (signedTransaction && signedTransaction.rawTransaction) {
            return signedTransaction.rawTransaction;
        } else {
            throw new Error(`signTransaction failed: ${signedTransaction}`);
        }
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

    async getTrans(txHash: string) {
        const transaction: Web3_Eth.Transaction = await this.web3.eth.getTransaction(txHash);
        return transaction;
    }

    async getTransReceipt(txHash: string) {
        const transactionReceipt: Web3_Eth.TransactionReceipt = await this.web3.eth.getTransactionReceipt(txHash);
        return transactionReceipt;
    }

    async getTransCount(address: string) {
        return await this.web3.eth.getTransactionCount(address);
    }

    private async getContract(address: string, contractAddress: string) {
        return this.generateContract(ETH_ERC20_ABI, contractAddress, address);
    }

    private async generateContract(abi: any, contractAddress: string, from: string) {
        return new this.web3.eth.Contract(abi, contractAddress, { from: from });
    }

    private async getTatumApiUrl() {
        return this.tatumConfig.apiHost;
    }

    private async getTatumApiHeaders() {
        return { "x-api-key": this.tatumConfig.apiKey };
    }

    private async getApiScanUrl() {
        return `${this.ethApiScanConfig?.apiHost}/api?apikey=${this.ethApiScanConfig?.apiKey}`;
    }

    private async getPeerUrl() {
        const p = await this.peerListHelper.getEnableRandom();
        return `http://${p.ip}:${p.port}`;
    }

    async getTransactionFromSignature(signature: string) {
        const chainId = await this.getChainId();
        const tx = new ethereumjs.Transaction(signature, { chain: chainId });
        return tx;
    }

    /**
     * 参数解码
     * @param {string} hex  将原生data，进行 toSring("hex") 的转换, 注意是 0x开头
     * @param {ABISupportFunctionEnum} functionName  合约ABI中可以调用方法的方法名
     */
    decodeParameters<T>(hex: string, functionName: ABISupportFunctionEnum) {
        const methodABI: any = this.getMethodABI(functionName);
        return this.web3.eth.abi.decodeParameters(methodABI.inputs, hex) as T;
    }

    getMethodABI(functionName: ABISupportFunctionEnum) {
        const methodABI: AbiItem | undefined = ETH_ERC20_ABI.find((item: AbiItem) => {
            return item.type === "function" && item.name === functionName;
        });
        return methodABI;
    }
}
