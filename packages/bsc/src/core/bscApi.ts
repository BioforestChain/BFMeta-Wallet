import { Inject, Injectable } from "@bnqkl/util-node";
import {
    PeerListHelper,
    BscApiScanSymbol,
    HttpHelper,
    ABISupportFunctionEnum,
    ABISupportTypeEnum,
    ABISupportEventEnum,
    TRANS_INPUT_PREFIX,
    HEX_PREFIX,
} from "@bfmeta/wallet-helpers";
import Web3, { HttpProvider } from "web3";
import {
    AbiEventFragment,
    Transaction,
    TransactionReceipt,
    EventLog,
    DEFAULT_RETURN_FORMAT,
    FMT_NUMBER,
    FMT_BYTES,
    BlockTags,
    DataFormat,
} from "web3-types";
import type { SignTransactionResult } from "web3-eth-accounts";
import { AbiItemCustom, AbiInputCustom, BSC_BEP20_ABI } from "./constants";
import * as ethereumjs from "ethereumjs-tx";
import ethereumcommon from "ethereumjs-common";
import type { HttpProviderOptions } from "web3-providers-http";

export const BSC_PEERS = {
    host: Symbol("host"),
    testnet: Symbol("testnet"),
    headers: Symbol("headers"),
    official: Symbol("official"),
};
@Injectable()
export class BscApi implements BFChainWallet.BSC.API {
    private __web3!: Web3<{}>;
    get web3() {
        if (this.__web3) {
            return this.__web3;
        } else {
            throw new Error(`web3 is not init`);
        }
    }
    private async newWeb3() {
        const headers: { [key: string]: string } = {};
        for (const name in this.headers) {
            headers[name] = this.headers[name];
        }
        const url = await this.getPeerUrl();
        if (headers) {
            const httpProviderOptions: HttpProviderOptions = {
                providerOptions: { headers } as RequestInit,
            };
            this.__web3 = new Web3(new HttpProvider(url, httpProviderOptions));
        } else {
            this.__web3 = new Web3(url);
        }
        if (this.official) {
            this.__officialweb3 = new Web3(this.official);
        }
    }

    private __officialweb3?: Web3;

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
        @Inject(BscApiScanSymbol) public bscApiScanConfig: BFChainWallet.Config["bscApiScan"],
        @Inject(BSC_PEERS.official, { optional: true }) public official?: string,
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

    async getChainId(): Promise<number> {
        return await this.web3.eth.getChainId({ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER });
    }

    //如果指定 true，则返回的块将包含所有交易作为对象。 如果为 false，它将仅包含交易哈希。
    async getLastBlock(): Promise<any> {
        const lastBlock = await this.web3.eth.getBlock(BlockTags.LATEST, false, {
            bytes: FMT_BYTES.HEX,
            number: FMT_NUMBER.NUMBER,
        });
        return lastBlock;
    }

    async getBaseGas(): Promise<BFChainWallet.ETH.BaseGas> {
        const baseGas: BFChainWallet.ETH.BaseGas = {
            generalGas: 21000,
            contractGas: 70000,
        };
        return baseGas;
    }

    async getGasPrice(): Promise<string> {
        const gasPrice: string = await this.web3.eth.getGasPrice({ bytes: FMT_BYTES.HEX, number: FMT_NUMBER.STR });
        return gasPrice;
    }

    async getBalance(address: string): Promise<string> {
        const balance = await this.web3.eth.getBalance(address, BlockTags.LATEST, {
            ...DEFAULT_RETURN_FORMAT,
            number: FMT_NUMBER.STR,
        });
        return balance;
    }

    async getTokenInfo(contractAddress: string): Promise<any> {
        const contract = new this.web3.eth.Contract(BSC_BEP20_ABI, contractAddress);
        const name = await contract.methods.name().call();
        const symbol = await contract.methods.symbol().call();
        const decimals = await contract.methods.decimals().call();
        const totalSupply = await contract.methods.totalSupply().call();
        return { name, symbol, decimals, totalSupply };
    }

    private async getContract(address: string, contractAddress: string) {
        const web3 = this.__officialweb3 ? this.__officialweb3 : this.web3;
        return new web3.eth.Contract(BSC_BEP20_ABI, contractAddress, { from: address });
    }

    async getContractGas(from: string, to: string, amount: string, contractAddress: string) {
        const contract = await this.getContract(from, contractAddress);
        const estimateGas = await contract.methods
            .transfer(to, amount)
            .estimateGas(undefined, { bytes: FMT_BYTES.HEX, number: FMT_NUMBER.NUMBER });
        return estimateGas;
    }

    async getContractBalance(address: string, contractAddress: string): Promise<string> {
        const contract = await this.getContract(address, contractAddress);
        const balanceOf = await contract.methods.balanceOf(address).call();
        if (balanceOf) {
            const balance = balanceOf as unknown as bigint;
            return balance.toString();
        }
        return "0";
    }

    async getContractBalanceAndDecimal(
        address: string,
        contractAddress: string,
    ): Promise<BFChainWallet.ETH.ContractBalance> {
        const contract = await this.getContract(address, contractAddress);
        const balance = (await contract.methods.balanceOf(address).call()) as unknown as bigint;
        const decimal = (await contract.methods.decimals().call()) as unknown as bigint;
        const result: BFChainWallet.ETH.ContractBalance = {
            balance: balance.toString(),
            decimal: decimal.toString(),
        };
        return result;
    }

    async getContractTransData(from: string, to: string, amount: string, contractAddress: string): Promise<string> {
        const contract = await this.getContract(from, contractAddress);
        return await contract.methods.transfer(to, amount).encodeABI();
    }

    async signTransaction(req: BFChainWallet.ETH.SignTransactionReq): Promise<BFChainWallet.ETH.SignTransactionRes> {
        const signedTrans: SignTransactionResult = await this.web3.eth.accounts.signTransaction(
            req.trans,
            req.privateKey,
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
        const web3 = this.__officialweb3 ? this.__officialweb3 : this.web3;
        const receipt = await web3.eth.sendSignedTransaction(raw, {
            bytes: FMT_BYTES.HEX,
            number: FMT_NUMBER.STR,
        });
        if (receipt && receipt.transactionHash) {
            return receipt.transactionHash as unknown as string;
        }
        throw Error(`sendSignedTransaction failed receipt:${JSON.stringify(receipt, null, 2)}`);
    }

    async getTransCount(address: string): Promise<number> {
        return await this.web3.eth.getTransactionCount(address, undefined, {
            ...DEFAULT_RETURN_FORMAT,
            number: FMT_NUMBER.NUMBER,
        });
    }

    async getTrans(txHash: string): Promise<BFChainWallet.ETH.TransactionCustom> {
        const trans = await this.web3.eth.getTransaction(txHash, {
            bytes: FMT_BYTES.HEX,
            number: FMT_NUMBER.STR,
        });
        const transCustom: BFChainWallet.ETH.TransactionCustom = {
            hash: trans.hash,
            nonce: trans.nonce,
            blockHash: trans.blockHash ?? "",
            blockNumber: trans.blockNumber ?? "",
            transactionIndex: trans.transactionIndex ?? "",
            from: trans.from,
            to: trans.to ?? "",
            value: trans.value,
            gasPrice: trans.gasPrice,
            maxFeePerGas: trans.maxFeePerGas ?? "",
            maxPriorityFeePerGas: trans.maxPriorityFeePerGas ?? "",
            gas: trans.gas,
            input: trans.input,
            data: trans.data ?? "",
            chainId: trans.chainId ?? "",
            r: trans.r,
            s: trans.s,
            v: trans.v ?? "",
        };
        return transCustom;
    }

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
        const receipt: TransactionReceipt = await this.web3.eth.getTransactionReceipt(txHash, {
            bytes: FMT_BYTES.HEX,
            number: FMT_NUMBER.STR,
        });
        if (receipt) {
            const { transactionHash, cumulativeGasUsed, effectiveGasPrice, gasUsed, status, blockHash, blockNumber } =
                receipt;

            const parseReceipt = this.parseReceipt(receipt);
            const isContract: boolean = parseReceipt && parseReceipt.contractAddress;
            const result: BFChainWallet.ETH.TransReceiptNative = {
                txHash: typeof transactionHash === "string" ? transactionHash : "",
                from: isContract ? parseReceipt?.from : receipt.from,
                to: isContract ? parseReceipt?.to : receipt.to,
                value: isContract
                    ? BigInt(parseReceipt?.value as bigint).toString()
                    : (await this.getTrans(txHash))?.value,
                contractAddress: isContract ? parseReceipt?.contractAddress : "",
                cumulativeGasUsed: BigInt(cumulativeGasUsed).toString(),
                effectiveGasPrice: BigInt(effectiveGasPrice ?? "0").toString(),
                gasUsed: BigInt(gasUsed).toString(),
                status: status.toString() === "1",
                blockHash: typeof blockHash === "string" ? blockHash : "",
                blockNumber: BigInt(blockNumber).toString(),
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
    getTransBody(trans: BFChainWallet.ETH.TransactionCustom): BFChainWallet.ETH.EthTransBody {
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

    private async getApiScanUrl() {
        return `${this.bscApiScanConfig?.apiHost}/api?apikey=${this.bscApiScanConfig?.apiKey}`;
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

    getTransBodyFromSignature(signature: string): BFChainWallet.ETH.EthTransBodyFromSign | null {
        const tx = new ethereumjs.Transaction(signature, {
            common: this.testnet ? this.__bscTestnetCommon : this.__bscMainnetCommon,
        });

        if (tx) {
            const hash = HEX_PREFIX + tx.hash().toString("hex");
            const txData = HEX_PREFIX + tx.data.toString("hex");
            const from = HEX_PREFIX + tx.getSenderAddress().toString("hex");
            let to = HEX_PREFIX + tx.to.toString("hex");
            // web3升级版本后value会出现为空的情况
            const txValue = tx.value.toString("hex");
            let value = !txValue || txValue === "" ? "0" : this.web3.utils.hexToNumberString(HEX_PREFIX + txValue);
            const parseInput = this.parseInput(txData);
            const body: BFChainWallet.ETH.EthTransBodyFromSign = {
                hash,
                from,
                to: parseInput ? parseInput.to : to,
                value: parseInput ? parseInput.value : value,
                contractAddress: parseInput ? to : "",
            };
            // if (value === "0" && parseInput?.value === "0") {
            //     throw new Error(`getTransBodyFromSignature error, trans value not allow '0', signature: ${signature}`);
            // }
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
        const methodABI: AbiItemCustom | undefined = BSC_BEP20_ABI.find((a: AbiItemCustom) => {
            return a.type === ABISupportTypeEnum.function && a?.name === functionName;
        });
        return methodABI;
    }

    getEventABI(eventName: ABISupportEventEnum) {
        const eventABI: AbiItemCustom | undefined = BSC_BEP20_ABI.find((a: AbiItemCustom) => {
            return a.type === ABISupportTypeEnum.event && a?.name === eventName;
        });
        return eventABI;
    }

    parseReceipt(receipt: TransactionReceipt) {
        const logs = receipt.logs as unknown as EventLog[];
        if (!logs || logs.length === 0) {
            return null;
        }
        const result = this.parseEventLog(logs[0]);
        if (result) {
            result["contractAddress"] = receipt.to;
        }
        return result;
    }

    parseEventLog(eventLog: EventLog) {
        const AbiItem = this.getEventABI(ABISupportEventEnum.Transfer);
        if (!AbiItem) {
            return null;
        }
        const eventSignature = this.web3.eth.abi.encodeEventSignature(AbiItem as unknown as AbiEventFragment);
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
            const valueInput = eventInputs.find((input: AbiInputCustom) => {
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
        const decode = this.decodeParameters<{ recipient: string; amount: bigint }>(
            funcArguments,
            ABISupportFunctionEnum.transfer,
        );
        if (decode) {
            const to = decode.recipient.toString();
            const value = decode.amount.toString();
            return { to, value };
        }
        return null;
    }
}
