import { Inject, Injectable } from "@bnqkl/util-node";
import {
    PeerListHelper,
    TatumSymbol,
    BscApiScanSymbol,
    HttpHelper,
    ABISupportFunctionEnum,
    ABISupportTypeEnum,
    ABISupportEventEnum,
    TRANS_INPUT_PREFIX,
    HEX_PREFIX,
} from "@bfmeta/wallet-helpers";
import Web3 from "web3";
import Web3HttpProvider from "web3-providers-http";
import { BSC_BEP20_ABI } from "./constants";
import * as ethereumjs from "ethereumjs-tx";
import ethereumcommon from "ethereumjs-common";
import type { AbiItem, AbiInput } from "web3-utils";
import type { Log, Transaction, TransactionReceipt, SignedTransaction } from "web3-core";

export const BSC_PEERS = {
    host: Symbol("host"),
    testnet: Symbol("testnet"),
    headers: Symbol("headers"),
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
        const headers: { name: string; value: string }[] = [];
        for (const name in this.headers) {
            headers.push({ name, value: this.headers[name] });
        }
        const provider = new Web3HttpProvider(await this.getPeerUrl(), {
            headers,
        });
        this.__web3 = new Web3(headers.length > 0 ? provider : await this.getPeerUrl());
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
        @Inject(BSC_PEERS.headers) public headers: BFChainWallet.HeadersType,
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
        const host = `${await this.getTatumApiUrl()}/blockchain/token/address/BSC/${address}`;
        return await this.httpHelper.sendApiGetRequest(host, {}, await this.getTatumApiHeaders());
    }

    async getNormalTransHistory(
        req: BFChainWallet.BSC.BscTransHistoryReq,
    ): Promise<BFChainWallet.BSC.NormalTransHistoryRes> {
        const host = `${await this.getApiScanUrl()}&module=account&action=txlist`;
        const normalResult: BFChainWallet.BSC.NormalTransHistoryResult = await this.httpHelper.sendGetRequest(
            host,
            req,
        );
        const result: BFChainWallet.BSC.NormalTransRes[] =
            normalResult?.status === "1"
                ? normalResult.result
                      ?.filter((item) => !item.contractAddress && !item.functionName && item.value !== "0")
                      .map(
                          ({ blockNumber, timeStamp, hash, from, to, value, gas, gasPrice, gasUsed }) =>
                              ({
                                  blockNumber,
                                  timeStamp,
                                  hash,
                                  from,
                                  to,
                                  value,
                                  gas,
                                  gasPrice,
                                  gasUsed,
                              } as BFChainWallet.BSC.NormalTransRes),
                      )
                : [];
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
        const bep20Result: BFChainWallet.BSC.Bep20TransHistoryResult = await this.httpHelper.sendGetRequest(host, req);
        const result: BFChainWallet.BSC.Bep20TransRes[] =
            // status = 1 时为成功状态
            bep20Result?.status === "1"
                ? bep20Result?.result?.map((item) => {
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
                      return {
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
                      } as BFChainWallet.BSC.Bep20TransRes;
                  })
                : [];

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

    async getBaseGas(): Promise<BFChainWallet.ETH.BaseGas> {
        const baseGas: BFChainWallet.ETH.BaseGas = {
            generalGas: 21000,
            contractGas: 70000,
        };
        return baseGas;
    }

    async getTokenInfo(contractAddress: string): Promise<any> {
        const contract = new this.web3.eth.Contract(BSC_BEP20_ABI, contractAddress);
        const name = await contract.methods.name().call();
        const symbol = await contract.methods.symbol().call();
        const decimals = await contract.methods.decimals().call();
        const totalSupply = await contract.methods.totalSupply().call();
        return { name, symbol, decimals, totalSupply };
    }

    async getContractGas(from: string, to: string, amount: string, contractAddress: string) {
        const contract = this.getContract(from, contractAddress);
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
        const contract = this.getContract(address, contractAddress);
        const balance = await contract.methods.balanceOf(address).call();
        const decimal = await contract.methods.decimals().call();
        return { balance, decimal };
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
    async getContractTransData(from: string, to: string, amount: string, contractAddress: string): Promise<string> {
        const contract = this.getContract(from, contractAddress);
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

    async getTransCount(address: string) {
        return await this.web3.eth.getTransactionCount(address);
    }

    /**
     * Retrieves a transaction using its hash.
     *
     * @param {string} txHash - the hash of the transaction to retrieve.
     * @return {Promise<Transaction>} A promise that resolves with the retrieved transaction object.
     */
    async getTrans(txHash: string) {
        const trans: Transaction = await this.web3.eth.getTransaction(txHash);
        return trans;
    }

    /**
     * Retrieves the transaction receipt for a given transaction hash.
     *
     * @param {string} txHash - The transaction hash to retrieve the receipt for.
     * @return {Promise<TransactionReceipt>} - A promise that resolves with the transaction receipt.
     */
    async getTransReceipt(txHash: string) {
        const receipt: TransactionReceipt = await this.web3.eth.getTransactionReceipt(txHash);
        return receipt;
    }

    /**
     * Retrieves the transaction receipt for a given transaction hash and returns it as a native object.
     *
     * @param {string} txHash - the hash of the transaction to retrieve the receipt for
     * @return {Promise<BFChainWallet.ETH.TransReceiptNative | null>} - the transaction receipt as a native object, or null if the receipt does not exist
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
     * Return the body of a transaction in the format of BFChainWallet.ETH.EthTransBody.
     *
     * @param {Transaction} trans - the transaction to extract the body from
     * @return {BFChainWallet.ETH.EthTransBody} the extracted transaction body
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
        return this.generateContract(BSC_BEP20_ABI, contractAddress, address);
    }

    private generateContract(abi: any, contractAddress: string, from: string) {
        const contract = new this.web3.eth.Contract(abi, contractAddress, { from: from });
        return contract;
    }

    private async getTatumNodeUrl() {
        return `${this.tatumConfig.host}/BSC/${this.tatumConfig.apiKey}`;
    }

    private async getTatumApiUrl() {
        return this.tatumConfig.apiHost;
    }

    private async getTatumApiHeaders() {
        return { "x-api-key": this.tatumConfig.apiKey };
    }

    private async getApiScanUrl() {
        return `${this.bscApiScanConfig?.apiHost}/api?apikey=${this.bscApiScanConfig?.apiKey}`;
    }

    private async getPeerUrl() {
        const p = await this.peerListHelper.getEnableRandom();
        return `http://${p.ip}:${p.port}`;
        // return this.getTatumNodeUrl();
    }

    getTransBodyFromSignature(signature: string): BFChainWallet.ETH.EthTransBodyFromSign | null {
        const tx = new ethereumjs.Transaction(signature, {
            common: this.testnet ? this.__bscTestnetCommon : this.__bscMainnetCommon,
        });
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
            return a.type === ABISupportTypeEnum.function && a.name === functionName;
        });
        return methodABI;
    }

    getEventABI(eventName: ABISupportEventEnum) {
        const eventABI: AbiItem | undefined = BSC_BEP20_ABI.find((a: AbiItem) => {
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
        const decode = this.decodeParameters<{ recipient: string; amount: string }>(
            funcArguments,
            ABISupportFunctionEnum.transfer,
        );
        if (decode) {
            const to = decode.recipient;
            const value = decode.amount;
            return { to, value };
        }
        return null;
    }
}
