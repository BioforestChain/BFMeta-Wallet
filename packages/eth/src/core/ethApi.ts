import { Inject, Injectable } from "@bnqkl/util-node";
import {
    ABISupportEventEnum,
    ABISupportFunctionEnum,
    ABISupportTypeEnum,
    EthApiScanSymbol,
    HEX_PREFIX,
    HttpHelper,
    PeerListHelper,
    TRANS_INPUT_PREFIX,
} from "@bfmeta/wallet-helpers";
import Web3 from "web3";
import Web3HttpProvider from "web3-providers-http";
import { ETH_ERC20_ABI } from "./constants";
import * as ethereumjs2 from "@ethereumjs/tx";
import { toBuffer } from "@ethereumjs/util";
import * as ethereumjs from "ethereumjs-tx";
import type { AbiItem, AbiInput } from "web3-utils";
import type { Log, Transaction, TransactionReceipt, SignedTransaction } from "web3-core";
export const ETH_PEERS = {
    host: Symbol("host"),
    testnet: Symbol("testnet"),
    headers: Symbol("headers"),
    official: Symbol("official"),
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
        const headers: { name: string; value: string }[] = [];
        for (const name in this.headers) {
            headers.push({ name, value: this.headers[name] });
        }
        const provider = new Web3HttpProvider(await this.getPeerUrl(), {
            headers,
        });
        this.__web3 = new Web3(headers.length > 0 ? provider : await this.getPeerUrl());
    }
    constructor(
        @Inject(ETH_PEERS.host) public host: BFChainWallet.HostType[],
        @Inject(ETH_PEERS.testnet) public testnet: boolean,
        @Inject(ETH_PEERS.headers) public headers: BFChainWallet.HeadersType,
        public httpHelper: HttpHelper,
        public peerListHelper: PeerListHelper,
        @Inject(EthApiScanSymbol) public ethApiScanConfig: BFChainWallet.Config["ethApiScan"],
        @Inject(ETH_PEERS.official, { optional: true }) public official?: string,
    ) {
        const peersConfig: BFChainWallet.Helpers.PeerConfigModel[] = [];
        host.map((v) => {
            peersConfig.push({ ip: v.ip, port: v.port, protocol: "http" });
        });
        this.peerListHelper.peersConfig = peersConfig;
        this.peerListHelper.init();
        this.newWeb3();
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

    async getLastBlock(): Promise<any> {
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
        const contract = this.getContract(from, contractAddress);
        return await contract.methods.transfer(to, amount).estimateGas();
    }

    async getGasPrice(): Promise<string> {
        return await this.web3.eth.getGasPrice();
    }

    async getBalance(address: string): Promise<string> {
        return await this.web3.eth.getBalance(address, "latest");
    }

    async getContractBalance(address: string, contractAddress: string): Promise<string> {
        const contract = this.getContract(address, contractAddress);
        return await contract.methods.balanceOf(address).call();
    }

    async getContractBalanceAndDecimal(
        address: string,
        contractAddress: string,
    ): Promise<BFChainWallet.ETH.Contract20Balance> {
        const contract = this.getContract(address, contractAddress);
        const balance = await contract.methods.balanceOf(address).call();
        const decimal = await contract.methods.decimals().call();
        return { balance, decimal };
    }

    async fromWei(wei: string) {
        return this.web3.utils.fromWei(wei, "ether");
    }

    async getContractTransData(from: string, to: string, amount: string, contractAddress: string): Promise<string> {
        const contract = this.getContract(from, contractAddress);
        return await contract.methods.transfer(to, amount).encodeABI();
    }

    async signTransaction(req: BFChainWallet.ETH.SignTransactionReq): Promise<BFChainWallet.ETH.SignTransactionRes> {
        const signedTrans: SignedTransaction = await this.web3.eth.accounts.signTransaction(
            req.trans,
            req.privateKey,
            (err, signedTransaction) => {
                if (err) {
                    // 抛出错误信息
                    throw new Error(err.message);
                }
            },
        );
        if (signedTrans && signedTrans.rawTransaction && signedTrans.transactionHash) {
            const res: BFChainWallet.ETH.SignTransactionRes = {
                rawTrans: signedTrans.rawTransaction,
                txHash: signedTrans.transactionHash,
            };
            return res;
        } else {
            throw new Error(`signedTrans failed: ${signedTrans}`);
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

    async getTransCount(address: string) {
        return await this.web3.eth.getTransactionCount(address);
    }

    async getTrans(txHash: string) {
        const trans: Transaction = await this.web3.eth.getTransaction(txHash);
        return trans;
    }

    async getTransReceipt(txHash: string) {
        const receipt: TransactionReceipt = await this.web3.eth.getTransactionReceipt(txHash);
        return receipt;
    }

    /**
     * Retrieves the transaction receipt for a given transaction hash and returns it as a TransReceiptNative object.
     *
     * @param {string} txHash - the hash of the transaction to retrieve the receipt for.
     * @return {Promise<BFChainWallet.ETH.TransReceiptNative | null>} - a promise that resolves to the transaction receipt as a TransReceiptNative object if it exists, or null if it does not.
     */
    async getTransReceiptNative(txHash: string): Promise<BFChainWallet.ETH.TransReceiptNative | null> {
        const receipt: TransactionReceipt = await this.web3.eth.getTransactionReceipt(txHash);
        if (receipt) {
            const { transactionHash, cumulativeGasUsed, effectiveGasPrice, gasUsed, status, blockHash, blockNumber } =
                receipt;
            const parseReceipt = this.parseReceipt(receipt);
            const isContract: boolean = parseReceipt && parseReceipt.contractAddress;
            const result: BFChainWallet.ETH.TransReceiptNative = {
                txHash: transactionHash,
                from: isContract ? parseReceipt?.from : receipt.from,
                to: isContract ? parseReceipt?.to : receipt.to,
                value: isContract ? parseReceipt?.value : (await this.getTrans(txHash))?.value,
                contractAddress: isContract ? parseReceipt?.contractAddress : "",
                cumulativeGasUsed,
                effectiveGasPrice,
                gasUsed,
                status,
                blockHash,
                blockNumber,
            };
            return result;
        }
        return null;
    }

    /**
     * Returns the transaction body of a given transaction object.
     *
     * @param {Transaction} trans - the transaction object to get the body from.
     * @return {BFChainWallet.ETH.EthTransBody} the transaction body object.
     */
    getTransBody(trans: Transaction): BFChainWallet.ETH.EthTransBody {
        const { hash, blockHash, blockNumber, from, input, to, value } = trans;
        const parseInput = this.parseInput(input);
        const transBody: BFChainWallet.ETH.EthTransBody = {
            txHash: hash,
            blockHash,
            blockNumber,
            from,
            to: parseInput ? parseInput.to : to,
            value: parseInput ? parseInput.value : value,
            contractAddress: parseInput ? trans.to : "",
        };
        return transBody;
    }

    private getContract(address: string, contractAddress: string) {
        return this.generateContract(ETH_ERC20_ABI, contractAddress, address);
    }

    private generateContract(abi: any, contractAddress: string, from: string) {
        return new this.web3.eth.Contract(abi, contractAddress, { from: from });
    }

    private async getApiScanUrl() {
        return `${this.ethApiScanConfig?.apiHost}/api?apikey=${this.ethApiScanConfig?.apiKey}`;
    }

    private async getPeerUrl() {
        const p = await this.peerListHelper.getEnableRandom();
        let url = "";
        if (p.ip.startsWith("http")) {
            url += p.ip;
        } else {
            url += `http://` + p.ip;
        }
        if (p.port) {
            url += `:${p.port}`;
        }
        return url;
    }

    getTransactionFromSignature(signature: string) {
        const tx = new ethereumjs.Transaction(signature, { chain: this.testnet ? 5 : 1 });
        return tx;
    }

    getEIP1559TransactionFromSignature(signature: string) {
        const tx = ethereumjs2.FeeMarketEIP1559Transaction.fromSerializedTx(toBuffer(signature));
        return tx;
    }

    getTransBodyFromSignature(signature: string): BFChainWallet.ETH.EthTransBodyFromSign | null {
        const tx = this.getTransactionFromSignature(signature);
        if (tx) {
            const hash = HEX_PREFIX + tx.hash().toString("hex");
            const txData = HEX_PREFIX + tx.data.toString("hex");
            const from = HEX_PREFIX + tx.getSenderAddress().toString("hex");
            let to = HEX_PREFIX + tx.to.toString("hex");
            let value = this.web3.utils.hexToNumberString(HEX_PREFIX + tx.value.toString("hex"));
            const parseInput = this.parseInput(txData);
            const body: BFChainWallet.ETH.EthTransBodyFromSign = {
                hash,
                from,
                to: parseInput ? parseInput.to : to,
                value: parseInput ? parseInput.value : value,
                contractAddress: parseInput ? to : "",
            };
            if (value === "0" && parseInput?.value === "0") {
                throw new Error(`getTransBodyFromSignature error, trans value not allow '0', signature: ${signature}`);
            }
            return body;
        }
        return null;
    }

    getEIP1559TransBodyFromSignature(signature: string): BFChainWallet.ETH.EthTransBodyFromSign | null {
        const tx = this.getEIP1559TransactionFromSignature(signature);
        if (tx) {
            const hash = HEX_PREFIX + tx.hash().toString("hex");
            const txData = HEX_PREFIX + tx.data.toString("hex");
            const from = tx.getSenderAddress().toString();
            let to = tx.to!.toString();
            let value = this.web3.utils.hexToNumberString(HEX_PREFIX + tx.value);
            const parseInput = this.parseInput(txData);
            const body: BFChainWallet.ETH.EthTransBodyFromSign = {
                hash,
                from,
                to: parseInput ? parseInput.to : to,
                value: parseInput ? parseInput.value : value,
                contractAddress: parseInput ? to : "",
            };
            if (value === "0" && parseInput?.value === "0") {
                throw new Error(
                    `getEIP1559TransBodyFromSignature error, trans value not allow '0', signature: ${signature}`,
                );
            }
            return body;
        }
        return null;
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
            return item.type === ABISupportTypeEnum.function && item.name === functionName;
        });
        return methodABI;
    }

    getEventABI(eventName: ABISupportEventEnum) {
        const eventABI: AbiItem | undefined = ETH_ERC20_ABI.find((a: AbiItem) => {
            return a.type === ABISupportTypeEnum.event && a.name === eventName;
        });
        return eventABI;
    }

    parseReceipt(receipt: TransactionReceipt) {
        const logs = receipt.logs;
        if (!logs || logs.length === 0) {
            return null;
        }
        const result = this.parseEventLog(logs[0]);
        if (result) {
            result["contractAddress"] = receipt.to;
        }
        return result;
    }

    parseEventLog(eventLog: Log) {
        const AbiItem = this.getEventABI(ABISupportEventEnum.Transfer);
        if (!AbiItem) {
            return null;
        }
        const eventSignature = this.web3.eth.abi.encodeEventSignature(AbiItem);
        const topics = eventLog.topics;
        // 检查事件签名是否匹配
        if (topics[0] === eventSignature) {
            // 解析参数值
            const eventInputs = AbiItem.inputs ?? [];
            // 去除事件签名主题
            const parameterTopics = topics.slice(1);
            const parsedParameters: { [name: string]: any } = {};

            const length = topics.length - 1;
            for (let i = 0; i < length; i++) {
                const { name, type } = eventInputs[i];
                const topic = parameterTopics[i];
                // 解码参数值
                const decodedValue = this.web3.eth.abi.decodeParameter(type, topic);
                // 将参数名和解码后的值添加到解析结果中
                parsedParameters[name] = decodedValue;
            }

            // 交易金额
            const data = eventLog.data;
            const valueInput = eventInputs.find((input: AbiInput) => {
                return input.name === "value";
            });
            if (!valueInput) {
                return null;
            }
            const decodedValue = this.web3.eth.abi.decodeParameter(valueInput.type, data);
            parsedParameters[valueInput.name] = decodedValue;
            return parsedParameters;
        }
        return null;
    }

    parseInput(input: string) {
        // 判断当前是否需要解析input
        if (!input || input === "0x") {
            return null;
        }
        // 获取函数选择器
        const funcSelector = input.slice(0, 10);
        if (TRANS_INPUT_PREFIX !== funcSelector.toLocaleLowerCase()) {
            return null;
        }
        // 获取函数参数
        const funcArguments = input.slice(10);
        // 解码
        const decode = this.decodeParameters<{ _to: string; _value: string }>(
            funcArguments,
            ABISupportFunctionEnum.transfer,
        );
        if (decode) {
            const to = decode._to;
            const value = decode._value;
            return { to, value };
        }
        return null;
    }
}
