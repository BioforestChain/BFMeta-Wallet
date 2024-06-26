import type {} from "@bfmeta/wallet-helpers";
import { Inject, Injectable } from "@bnqkl/util-node";
import { HttpHelper, PeerListHelper, TronApiScanSymbol } from "@bfmeta/wallet-helpers";
import { TronHelper } from "./tronHelper";
import { TronFuncionEnum } from "./constants";
const TronWeb = require("tronweb");

export const TRON_PEERS = {
    host: Symbol("host"),
    headers: Symbol("headers"),
    official: Symbol("official"),
};

@Injectable()
export class TronApi implements BFChainWallet.TRON.API {
    private __tronWeb!: any;
    private __tronWebOfficial!: any;
    get tronWeb() {
        if (this.__tronWeb) {
            return this.__tronWeb;
        } else {
            throw new Error(`tronWeb is not init`);
        }
    }

    private async newTronWeb() {
        const headers: { [key: string]: string } = {};
        for (const name in this.headers) {
            headers[name] = this.headers[name];
        }
        const url = await this.getPeerUrl();
        this.__tronWeb = new TronWeb({ fullHost: url, headers: this.headers });
        if (this.official) {
            const __headers: { TRON_PRO_API_KEY?: string } = {};
            const apiKey = this.tronApiScanConfig?.apiKey;
            if (apiKey) {
                __headers["TRON_PRO_API_KEY"] = apiKey;
            }
            this.__tronWebOfficial = new TronWeb({
                fullHost: this.official,
                headers: __headers,
            });
        }
        // this.__tronWeb = new TronWeb({ fullHost: "https://api.trongrid.io/", headers: this.headers });
        // this.__tronWeb = new TronWeb({ fullHost: "https://nile.trongrid.io" });

        /** @TODO 暂时先这样处理 */
        // const fullNodeUrl = await this.fullNodeUrl();
        // const solidityNodeUrl = await this.solidityNodeUrl();
        // const eventServerUrl = await this.eventServerUrl();
        // this.__tronWeb = new TronWeb(fullNodeUrl, solidityNodeUrl, eventServerUrl);
    }

    constructor(
        @Inject(TRON_PEERS.host) public host: BFChainWallet.HostType[],
        @Inject(TRON_PEERS.headers) public headers: BFChainWallet.HeadersType,
        public httpHelper: HttpHelper,
        public peerListHelper: PeerListHelper,
        @Inject(TronApiScanSymbol) public tronApiScanConfig: BFChainWallet.Config["tronApiScan"],
        @Inject(TRON_PEERS.official, { optional: true }) public official?: string,
    ) {
        const peersConfig: BFChainWallet.Helpers.PeerConfigModel[] = [];
        host.map((v) => {
            peersConfig.push({ ip: v.ip, port: v.port, protocol: "http" });
        });
        this.peerListHelper.peersConfig = peersConfig;
        this.peerListHelper.init();
        this.newTronWeb();
    }
    /**
     * Creates a new TRON account using the tronWeb instance associated with this BFChainWallet,
     * and returns the new account object.
     *
     * @return {Promise<BFChainWallet.TRON.TronNewAccount>} A Promise that resolves to the new account object.
     */
    async createAccount(): Promise<BFChainWallet.TRON.TronNewAccount> {
        return await this.tronWeb.createAccount();
    }

    /**
     * Creates a new Tron account with a randomly generated mnemonic phrase.
     *
     * @return {Promise<BFChainWallet.TRON.TronNewAccountWithMnemonic>} The new Tron account with mnemonic phrase.
     */
    async createAccountWithMnemonic(): Promise<BFChainWallet.TRON.TronNewAccountWithMnemonic> {
        return await this.tronWeb.createRandom();
    }

    /**
     * Recovers a TRON account using a given mnemonic phrase.
     *
     * @param {string} mnemonic - The mnemonic phrase to recover the account from.
     * @return {Promise<BFChainWallet.TRON.TronNewAccountWithMnemonic>} - A promise that resolves to a new TRON account with the recovered mnemonic.
     */
    async recoverAccount(mnemonic: string): Promise<BFChainWallet.TRON.TronNewAccountWithMnemonic> {
        return await this.tronWeb.fromMnemonic(mnemonic);
    }

    /**
     * Converts a given Tron address to its corresponding hex format.
     *
     * @param {string} address - The address to convert.
     * @return {Promise<string>} The hexadecimal representation of the given address.
     */
    async addressToHex(address: string): Promise<string> {
        return await this.tronWeb.address.toHex(address);
    }

    /**
     * Converts a Tron address in hex format to its base58 representation.
     *
     * @param {string} address - The Tron address in hex format to convert.
     * @return {Promise<string>} - A Promise that resolves to the base58 representation of the Tron address.
     */
    async addressToBase58(address: string): Promise<string> {
        return await this.tronWeb.address.fromHex(address);
    }

    /**
     * Checks if the given string is a valid Tron address.
     *
     * @param {string} address - The address to validate.
     * @return {Promise<boolean>} - True if the address is valid, false otherwise.
     */
    async isAddress(address: string): Promise<boolean> {
        return await this.tronWeb.isAddress(address);
    }
    /**
     * Retrieves a Tron account by its address.
     *
     * @async
     * @param {string} address - The address of the account to retrieve.
     * @return {Promise<BFChainWallet.TRON.TronAccount | null>} A promise that resolves to the retrieved
     * account or null if it does not exist.
     */
    async getAccount(address: string): Promise<BFChainWallet.TRON.TronAccount | null> {
        const account: BFChainWallet.TRON.TronWebAccount = await this.tronWeb.trx.getAccount(address);

        if (account && account.address) {
            const tronAccount: BFChainWallet.TRON.TronAccount = {
                address: {
                    hex: account.address,
                    base58: await this.addressToBase58(account.address),
                },
                balance: account.balance,
            };
            return tronAccount;
        }
        return null;
    }

    /**
     * Retrieves TRON account resources for a given address.
     *
     * @param {string} address - The address to retrieve TRON account resources for.
     * @return {Promise<BFChainWallet.TRON.TronAccountResources>} - A promise that resolves to an object containing the TRON account resources.
     */
    async getAccountResources(address: string): Promise<BFChainWallet.TRON.TronAccountResources> {
        return await this.tronWeb.trx.getAccountResources(address);
    }

    /**
     * Signs a message with the provided private key using SignMessageV2.
     *
     * @param {string} message - The message to sign.
     * @param {string} privateKey - The private key to use for signing.
     * @return {Promise<string>} - The signed message.
     */
    async signMessageV2(message: string, privateKey: string): Promise<string> {
        return await this.tronWeb.trx.signMessageV2(message, privateKey);
    }
    /**
     * Verifies a message using a specified signature.
     *
     * @param {string} message - The message to be verified.
     * @param {string} signature - The signature to be used for verification.
     * @return {Promise<string>} - A promise that resolves to the verified message.
     */
    async verifyMessageV2(message: string, signature: string): Promise<string> {
        return await this.tronWeb.trx.verifyMessageV2(message, signature);
    }
    /**
     * Returns a Promise of the current TronBlock.
     *
     * @return {Promise<BFChainWallet.TRON.TronBlock>} Block object of the current block.
     */
    async getCurrentBlock(): Promise<BFChainWallet.TRON.TronBlock> {
        const block: BFChainWallet.TRON.TronBlock = await this.tronWeb.trx.getCurrentBlock();
        return block;
    }

    /**
     * Retrieves the TRX balance of a given address using the TronWeb API.
     *
     * @param {string} address - The address to retrieve the balance of.
     * @return {Promise<string>} - A promise that resolves with the balance of the address.
     */
    async getTrxBalance(address: string): Promise<string> {
        const balance = await this.tronWeb.trx.getBalance(address);
        return balance.toString();
    }

    /**
     * Send a TronTransaction with the given parameters.
     *
     * @param {BFChainWallet.TRON.SendTrxReq} req - Object containing to, from, and amount of the transaction
     * @throws {Error} amount must be a positive integer greater than 0
     * @return {Promise<BFChainWallet.TRON.TronTransaction>} - The TronTransaction object representing the transaction
     */
    async sendTrx(req: BFChainWallet.TRON.SendTrxReq): Promise<BFChainWallet.TRON.TronTransaction> {
        const { to, from, amount } = req;
        const result: BFChainWallet.TRON.TronTransaction = await this.tronWeb.transactionBuilder.sendTrx(
            to,
            amount,
            from,
        );
        return result;
    }

    /**
     * Signs a Tron transaction with the provided private key.
     *
     * @param {BFChainWallet.TRON.TronTransaction} trans - The transaction to sign.
     * @param {string} privateKey - The private key to use for signing.
     * @return {Promise<BFChainWallet.TRON.TronTransaction>} A promise that resolves with the signed transaction.
     */
    async signTrx(
        trans: BFChainWallet.TRON.TronTransaction,
        privateKey: string,
    ): Promise<BFChainWallet.TRON.TronTransaction> {
        const result: BFChainWallet.TRON.TronTransaction = await this.tronWeb.trx.sign(trans, privateKey);
        return result;
    }
    /**
     * Send a TRC20 transaction from one address to another.
     *
     * @async
     * @param {BFChainWallet.TRON.SendTrc20Req} req - The request object.
     * @return {Promise<BFChainWallet.TRON.Trc20Transaction>} - The TRC20 transaction object.
     */
    async sendTrc20(req: BFChainWallet.TRON.SendTrc20Req): Promise<BFChainWallet.TRON.Trc20Transaction> {
        const { from, to, amount, contractAddress } = req;
        const parameter: BFChainWallet.TRON.TronContractParameter[] = [
            { type: "address", value: to },
            { type: "uint256", value: amount },
        ];
        // const options = {
        //     feeLimit: 100000000,
        //     callValue: 0,
        //     // tokenValue: 10,
        //     // tokenId: 1000001,
        // };
        const result: BFChainWallet.TRON.SendTrc20Result = await this.tronWeb.transactionBuilder.triggerSmartContract(
            contractAddress,
            TronFuncionEnum.TRANSFER,
            {},
            parameter,
            from,
        );
        return result?.transaction;
    }

    /**
     * Sign a Trc20 transaction using the provided private key.
     *
     * @param {BFChainWallet.TRON.Trc20Transaction} trc20Trans - The Trc20 transaction to sign.
     * @param {string} privateKey - The private key to use for signing.
     * @return {Promise<BFChainWallet.TRON.Trc20Transaction>} The signed Trc20 transaction.
     */
    async signTrc20(
        trc20Trans: BFChainWallet.TRON.Trc20Transaction,
        privateKey: string,
    ): Promise<BFChainWallet.TRON.Trc20Transaction> {
        const result: BFChainWallet.TRON.Trc20Transaction = await this.tronWeb.trx.sign(trc20Trans, privateKey);
        return result;
    }

    /**
     * Broadcast signed TRON transaction to the network.
     *
     * @param {BFChainWallet.TRON.Trc20Transaction | BFChainWallet.TRON.TronTransaction} signTrans
     *        The signed TRON transaction.
     * @return {Promise<BFChainWallet.TRON.BroadcastRes>} The broadcast result, which includes
     *         whether the broadcast was successful, the transaction ID, and a message if an error
     *         occurred.
     */
    async broadcast(
        signTrans: BFChainWallet.TRON.Trc20Transaction | BFChainWallet.TRON.TronTransaction,
    ): Promise<BFChainWallet.TRON.BroadcastRes> {
        const result: BFChainWallet.TRON.SendTransResult = await this.tronWeb.trx.sendRawTransaction(signTrans);
        const res: BFChainWallet.TRON.BroadcastRes = {
            result: result.result ? true : false,
            txid: result.txid,
            message: result.code && result.code.length > 0 ? result.code : "SUCCESS",
        };
        return res;
    }

    /**
     * Broadcasts a signed transaction in hex format and returns the broadcast result.
     *
     * @param {string} signTransHex - The signed transaction in hex format.
     * @return {Promise<BFChainWallet.TRON.BroadcastRes>} An object containing the broadcast result, including a boolean 'result',
     * the transaction ID 'txId', and a message 'message' indicating the status of the broadcast.
     */
    async broadcastHexTrans(signTransHex: string): Promise<BFChainWallet.TRON.BroadcastRes> {
        const result: BFChainWallet.TRON.SendTransResult = await this.tronWeb.trx.sendHexTransaction(signTransHex);
        const res: BFChainWallet.TRON.BroadcastRes = {
            result: result.result ? true : false,
            txid: result.txid,
            message: result.code && result.code.length > 0 ? result.code : "SUCCESS",
        };
        return res;
    }

    /**
     * Retrieves the balance of a contract for a given address.
     *
     * @param {string} address - the address of the user
     * @param {string} contractAddress - the address of the contract
     * @return {Promise<string>} - the balance of the contract as a string
     */
    async getContractBalance(address: string, contractAddress: string): Promise<string> {
        const parameter: BFChainWallet.TRON.TronContractParameter[] = [{ type: "address", value: address }];
        const result = await this.tronWeb.transactionBuilder.triggerSmartContract(
            contractAddress,
            TronFuncionEnum.BALANCE_OF,
            {},
            parameter,
            address,
        );
        const output = TronHelper.HEX_PREFIX + result.constant_result[0];
        const decode = TronHelper.decodeParams(TronHelper.UINT_TYPES, output, false);
        return decode.toString();
    }

    /**
     * Retrieves the decimal value of a smart contract on the Tron network.
     *
     * @param {string} contractAddress - The address of the smart contract.
     * @return {Promise<number>} - Returns the decimal value of the smart contract as a Promise.
     */
    async getContractDecimal(contractAddress: string): Promise<number> {
        const result = await this.tronWeb.transactionBuilder.triggerSmartContract(
            contractAddress,
            TronFuncionEnum.DECIMALS,
            {},
            [],
            contractAddress,
        );
        const output = TronHelper.HEX_PREFIX + result.constant_result[0];
        const decode = TronHelper.decodeParams(TronHelper.UINT_TYPES, output, false);
        return Number(decode);
    }

    /**
     * Retrieves a TronTransaction or Trc20Transaction from the blockchain using a transaction ID.
     *
     * @param {string} txId - The ID of the transaction to retrieve.
     * @return {Promise<BFChainWallet.TRON.TronTransaction | BFChainWallet.TRON.Trc20Transaction>} - A Promise that resolves to the retrieved transaction object.
     */
    async getTrans(txId: string): Promise<BFChainWallet.TRON.TronTransaction | BFChainWallet.TRON.Trc20Transaction> {
        const result: BFChainWallet.TRON.TronTransaction | BFChainWallet.TRON.Trc20Transaction =
            await this.tronWeb.trx.getTransaction(txId);
        return result;
    }

    /**
     *  Retrieves Transaction information from the Tron network.
     *
     * @param {string} txId - The transaction ID to fetch information for.
     * @return {Promise<BFChainWallet.TRON.TronTransInfoRes | null>} - A promise that resolves with the
     * transaction information, or null if it cannot be found.
     */
    async getTransInfo(txId: string): Promise<BFChainWallet.TRON.TronTransInfoRes | null> {
        const transInfo: BFChainWallet.TRON.TronTransInfo = await this.tronWeb.trx.getTransactionInfo(txId);
        if (transInfo) {
            const {
                id,
                fee,
                blockNumber,
                blockTimeStamp,
                contract_address,
                receipt: { net_fee, net_usage, energy_fee, energy_usage, energy_usage_total, origin_energy_usage },
            } = transInfo;
            const res: BFChainWallet.TRON.TronTransInfoRes = {
                txId: id,
                fee: fee ?? 0,
                blockNumber,
                blockTimeStamp,
                netFee: net_fee ?? 0,
                netUsage: net_usage ?? 0,
                energyFee: energy_fee ?? 0,
                energyUsage: energy_usage ?? 0,
                energyUsageTotal: energy_usage_total ?? 0,
                originEnergyUsage: origin_energy_usage ?? 0,
                contractAddress: contract_address ?? "",
            };
            return res;
        }
        return null;
    }

    /**
     * Retrieves the confirmed transaction information for a given transaction ID and returns
     * the transaction receipt. If there is no confirmed transaction, null is returned.
     *
     * @param {string} txId - the ID of the transaction to retrieve information for
     * @return {Promise<BFChainWallet.TRON.TronTransReceipt | null>} - the transaction receipt or
     * null if there is no confirmed transaction
     */
    async getTransReceipt(txId: string): Promise<BFChainWallet.TRON.TronTransReceipt | null> {
        // 获取确认交易信息
        const confirmTrans: BFChainWallet.TRON.TronTransaction | BFChainWallet.TRON.Trc20Transaction =
            await this.tronWeb.trx.getConfirmedTransaction(txId);
        if (confirmTrans) {
            // Use Promise.all to execute getTransBody and getTransInfo concurrently
            const [transBody, transInfoRes] = await Promise.all([
                this.getTransBody(confirmTrans),
                this.getTransInfo(txId),
            ]);
            // 判断交易是否成功
            const status = confirmTrans.ret?.[0]?.contractRet === "SUCCESS" || false;
            if (transInfoRes) {
                const { from, to, amount } = transBody;
                const {
                    txId,
                    blockNumber,
                    blockTimeStamp,
                    contractAddress,
                    fee,
                    netUsage,
                    netFee,
                    energyFee,
                    energyUsage,
                    energyUsageTotal,
                    originEnergyUsage,
                } = transInfoRes;
                const receipt: BFChainWallet.TRON.TronTransReceipt = {
                    status,
                    txId,
                    blockNumber,
                    blockTimeStamp,
                    from,
                    to,
                    contractAddress,
                    amount,
                    fee,
                    netUsage,
                    netFee,
                    energyFee,
                    energyUsage,
                    energyUsageTotal,
                    originEnergyUsage,
                    // 预防少数情况下 timestamp 不存在的情况
                    timestamp: confirmTrans.raw_data.timestamp || blockTimeStamp,
                };
                return receipt;
            }
        }

        return null;
    }

    /**
     * Transforms a Tron or TRC20 transaction to its corresponding hexadecimal representation.
     *
     * @param {BFChainWallet.TRON.TronTransaction | BFChainWallet.TRON.Trc20Transaction} signTrans - The signed transaction object.
     * @return {Promise<string>} A promise that resolves to the hexadecimal representation of the transaction.
     */
    async transToPbHex(
        signTrans: BFChainWallet.TRON.TronTransaction | BFChainWallet.TRON.Trc20Transaction,
    ): Promise<string> {
        const transactionPb = TronWeb.utils.transaction.txJsonToPb(signTrans);
        signTrans.signature?.forEach((signature: string) => {
            transactionPb.addSignature(
                TronWeb.utils.code.base64EncodeToString(TronWeb.utils.code.hexStr2byteArray(signature)),
            );
        });
        return await TronWeb.utils.bytes.byteArray2hexStr(transactionPb.serializeBinary());
    }

    /**
     * Gets the transaction body for a given TRON or TRC20 transaction.
     *
     * @param {BFChainWallet.TRON.TronTransaction | BFChainWallet.TRON.Trc20Transaction} trans - the transaction object to retrieve the body from
     * @return {Promise<BFChainWallet.TRON.TronTransBody>} the transaction body object containing the transaction ID, sender address, receiver address, amount, contract address, and signature if available
     */
    async getTransBody(
        trans: BFChainWallet.TRON.TronTransaction | BFChainWallet.TRON.Trc20Transaction,
    ): Promise<BFChainWallet.TRON.TronTransBody> {
        let from, to, amount, contractAddress: string;
        if ((<BFChainWallet.TRON.Trc20Transaction>trans).raw_data.contract[0].parameter.value.data) {
            const value = (<BFChainWallet.TRON.Trc20Transaction>trans).raw_data.contract[0].parameter.value;
            const decode = TronHelper.decodeParams(TronHelper.TRANS_TYPES, value.data, true);
            from = value.owner_address;
            to = decode[0]?.toString();
            amount = decode[1]?.toString();
            contractAddress = value.contract_address;
        } else {
            const value = (<BFChainWallet.TRON.TronTransaction>trans).raw_data.contract[0].parameter.value;
            from = value.owner_address;
            to = value.to_address;
            amount = value.amount.toString();
            contractAddress = "";
        }
        const res: BFChainWallet.TRON.TronTransBody = {
            txId: trans.txID,
            from,
            to,
            amount,
            contractAddress,
            signature: trans.signature?.[0] ?? "",
        };
        return res;
    }

    // async getContractBalance(address: string, contractAddress: string) {
    //     // 只有设置了地址才可以获取，但是并不适用于当前场景
    //     this.tronWeb.setAddress(address);
    //     // 获取合约余额
    //     const contract = await this.tronWeb.contract().at(contractAddress);
    //     const result = await contract.balanceOf(address).call();
    //     return result.toString();
    // }

    async getCommonTransHistory(req: BFChainWallet.TRON.TronTransHistoryReq): Promise<any> {
        const host = `${await this.getApiScanUrl()}/v1/accounts/${req.address}/transactions`;
        const result: BFChainWallet.TRON.CommonTransByAddressResult = await this.httpHelper.sendApiGetRequest(
            host,
            req,
            await this.getApiHeaders(),
        );
        if (result?.success && !result?.error) {
            const resData: BFChainWallet.TRON.CommonTransHistoryResData[] = result.data
                .filter(
                    (resultData) =>
                        resultData.ret?.length > 0 &&
                        resultData.raw_data?.contract?.length > 0 &&
                        resultData.raw_data?.contract[0]?.parameter?.value?.to_address,
                )
                .map((resultData) => {
                    const { txID, blockNumber, net_usage, net_fee, energy_usage, energy_fee } = resultData;
                    const { contractRet, fee } = resultData.ret[0];
                    const { owner_address, to_address, amount } = resultData.raw_data.contract[0].parameter.value;
                    return {
                        contractRet,
                        txID,
                        blockNumber,
                        from: owner_address,
                        to: to_address,
                        amount,
                        fee,
                        net_usage,
                        net_fee,
                        energy_usage,
                        energy_fee,
                        timestamp: resultData.raw_data.timestamp || resultData.block_timestamp,
                        expiration: resultData.raw_data.expiration,
                    };
                });
            const res: BFChainWallet.TRON.CommonTransHistoryRes = {
                success: result.success,
                data: resData,
                pageSize: result.meta?.page_size,
                fingerprint: result.meta?.fingerprint ?? "",
            };
            return res;
        }
        const res: BFChainWallet.TRON.CommonTransHistoryRes = {
            success: result.success,
            data: [],
            error: result.error,
            statusCode: result.statusCode,
        };
        return res;
    }

    async getTrc20TransHistory(req: BFChainWallet.TRON.TronTransHistoryReq): Promise<any> {
        const [host, headers] = await Promise.all([this.getApiScanUrl(), this.getApiHeaders()]);
        if (req.contract_address) {
            // 这里的合约地址必须转换为 base58格式
            const base58 = await this.addressToBase58(req.contract_address);
            req.contract_address = base58;
        }
        const result: BFChainWallet.TRON.Trc20TransHistoryResult = await this.httpHelper.sendApiGetRequest(
            `${host}/v1/accounts/${req.address}/transactions/trc20`,
            req,
            headers,
        );
        if (result?.success && !result?.error) {
            const resData: BFChainWallet.TRON.Trc20TransHistoryResData[] = result.data?.map((a) => {
                const {
                    transaction_id,
                    from,
                    to,
                    value,
                    block_timestamp,
                    token_info: { symbol, address, name, decimals },
                } = a;
                return {
                    txID: transaction_id,
                    from,
                    to,
                    value,
                    token_symbol: symbol,
                    token_address: address,
                    token_name: name,
                    token_decimals: decimals,
                    timestamp: block_timestamp,
                };
            });
            const res: BFChainWallet.TRON.Trc20TransHistoryRes = {
                success: result.success,
                data: resData,
                pageSize: result.meta?.page_size,
                fingerprint: result.meta?.fingerprint || "",
            };
            return res;
        }

        const res: BFChainWallet.TRON.Trc20TransHistoryRes = {
            success: result.success,
            data: [],
            error: result.error,
            statusCode: result.statusCode,
        };

        return res;
    }

    async createTransaction(req: BFChainWallet.TRON.CreateTransactionReq): Promise<BFChainWallet.TRON.TronTransaction> {
        const host = `${await this.getPeerUrl()}/wallet/createtransaction`;
        return await this.httpHelper.sendPostRequest(host, req);
    }

    async getTransactionSign(
        req: BFChainWallet.TRON.GetTransactionSignReq,
    ): Promise<BFChainWallet.TRON.TronTransaction | BFChainWallet.TRON.Trc20Transaction> {
        const host = `${await this.getPeerUrl()}/wallet/gettransactionsign`;
        return await this.httpHelper.sendPostRequest(host, req);
    }

    async broadcastTransaction(
        transactionWithSign: BFChainWallet.TRON.TronTransaction | BFChainWallet.TRON.Trc20Transaction,
    ): Promise<BFChainWallet.TRON.BroadcastTransactionRes> {
        if (this.__tronWebOfficial) {
            const result: BFChainWallet.TRON.SendTransResult = await this.__tronWebOfficial.trx.sendRawTransaction(
                transactionWithSign,
            );
            return {
                result: result.result ? true : false,
                txid: result.txid,
                message: result.code && result.code.length > 0 ? result.code : "SUCCESS",
            };
        } else {
            const host = `${await this.getPeerUrl()}/wallet/broadcasttransaction`;
            return await this.httpHelper.sendPostRequest(host, transactionWithSign);
        }
    }

    async getTransactionInfoById(value: string): Promise<BFChainWallet.TRON.TronTransactionInfo> {
        const host = `${await this.getPeerUrl()}/wallet/gettransactioninfobyid`;
        return await this.httpHelper.sendGetRequest(host, { value });
    }

    async triggerSmartContract(
        contractReq: BFChainWallet.TRON.TriggerSmartContractReq,
    ): Promise<BFChainWallet.TRON.TriggerSmartContractRes> {
        const host = `${await this.getPeerUrl()}/wallet/triggersmartcontract`;
        if (contractReq && contractReq.input.length > 0) {
            // 先对 input 数据进行编码
            const parameter = TronHelper.encodeParams(contractReq.input);
            contractReq.parameter = parameter;
            const res: BFChainWallet.TRON.TriggerSmartContractRes = await this.httpHelper.sendPostRequest(
                host,
                contractReq,
            );
            const selector = contractReq.function_selector;
            // 需要做解码操作的业务
            if (selector == "balanceOf(address)" || selector == "decimals()") {
                if (res.constant_result && res.constant_result.length > 0) {
                    const output = res.constant_result[0];
                    const decode = TronHelper.decodeParams(TronHelper.UINT_TYPES, "0x" + output, false);
                    res.constant_result_decode = decode.toString();
                }
            }
            return res;
        }
        return {} as any;
    }

    private async getApiScanUrl() {
        return this.tronApiScanConfig?.apiHost;
    }

    private async getApiHeaders() {
        return { TRON_PRO_API_KEY: this.tronApiScanConfig?.apiKey };
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

    private async fullNodeUrl() {
        const p = await this.peerListHelper.getEnableRandom();
        return `http://${p.ip}:8090`;
    }

    private async solidityNodeUrl() {
        const p = await this.peerListHelper.getEnableRandom();
        return `http://${p.ip}:8091`;
    }

    private async eventServerUrl() {
        const p = await this.peerListHelper.getEnableRandom();
        return `http://${p.ip}:8092`;
    }
}
