import { Inject, Injectable } from "@bnqkl/util-node";
import { HttpHelper, PeerListHelper, TatumSymbol, TronApiScanSymbol } from "@bfmeta/wallet-helpers";
import { TronHelper } from "./tronHelper";
import { TronFuncionEnum } from "./constants";
const TronWeb = require("tronweb");

export const PEERS = {
    host: Symbol("host"),
};

@Injectable()
export class TronApi implements BFChainWallet.TRON.API {
    private __tronWeb!: any;

    get tronWeb() {
        if (this.__tronWeb) {
            return this.__tronWeb;
        } else {
            throw new Error(`tronWeb is not init`);
        }
    }

    private async newTronWeb() {
        // this.__tronWeb = new TronWeb({ fullHost: "https://nile.trongrid.io" });
        /** @TODO 暂时先这样处理 */
        const fullNodeUrl = await this.fullNodeUrl();
        const solidityNodeUrl = await this.solidityNodeUrl();
        const eventServerUrl = await this.eventServerUrl();
        this.__tronWeb = new TronWeb(fullNodeUrl, solidityNodeUrl, eventServerUrl);
    }

    constructor(
        @Inject(PEERS.host) public host: BFChainWallet.HostType[],
        public httpHelper: HttpHelper,
        public peerListHelper: PeerListHelper,
        @Inject(TatumSymbol) public tatumConfig: BFChainWallet.Config["tatum"],
        @Inject(TronApiScanSymbol) public tronApiScanConfig: BFChainWallet.Config["tronApiScan"],
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
        const account: BFChainWallet.TRON.TronWebAccount = await this.tronWeb.trx
            .getAccount(address)
            .catch((err: any) => {
                throw new Error(err);
            });
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
        const result: BFChainWallet.TRON.TronTransaction =
            await this.tronWeb.transactionBuilder.sendTrx(to, amount, from);
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
        const result: BFChainWallet.TRON.TronTransaction = await this.tronWeb.trx.sign(
            trans,
            privateKey,
        );
        return result;
    }
    /**
     * Send a TRC20 transaction from one address to another.
     *
     * @async
     * @param {BFChainWallet.TRON.SendTrc20Req} req - The request object.
     * @return {Promise<BFChainWallet.TRON.Trc20Transaction>} - The TRC20 transaction object.
     */
    async sendTrc20(
        req: BFChainWallet.TRON.SendTrc20Req,
    ): Promise<BFChainWallet.TRON.Trc20Transaction> {
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
        const result: BFChainWallet.TRON.SendTrc20Result =
            await this.tronWeb.transactionBuilder.triggerSmartContract(
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
        const result: BFChainWallet.TRON.Trc20Transaction = await this.tronWeb.trx.sign(
            trc20Trans,
            privateKey,
        );
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
        const result: BFChainWallet.TRON.SendTransResult =
            await this.tronWeb.trx.sendRawTransaction(signTrans);
        const res: BFChainWallet.TRON.BroadcastRes = {
            result: result.result ? true : false,
            txId: result.txid,
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
        const result: BFChainWallet.TRON.SendTransResult =
            await this.tronWeb.trx.sendHexTransaction(signTransHex);
        const res: BFChainWallet.TRON.BroadcastRes = {
            result: result.result ? true : false,
            txId: result.txid,
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
        const parameter: BFChainWallet.TRON.TronContractParameter[] = [
            { type: "address", value: address },
        ];
        const result = await this.tronWeb.transactionBuilder.triggerSmartContract(
            contractAddress,
            TronFuncionEnum.BALANCE_OF,
            {},
            parameter,
            address,
        );
        const decode = TronHelper.decodeParams(
            TronHelper.UINT_TYPES,
            "0x" + result.constant_result[0],
            false,
        );
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
        const decode = TronHelper.decodeParams(
            TronHelper.UINT_TYPES,
            "0x" + result.constant_result[0],
            false,
        );
        return Number(decode);
    }

    /**
     * Retrieves a TronTransaction or Trc20Transaction from the blockchain using a transaction ID.
     *
     * @param {string} txId - The ID of the transaction to retrieve.
     * @return {Promise<BFChainWallet.TRON.TronTransaction | BFChainWallet.TRON.Trc20Transaction>} - A Promise that resolves to the retrieved transaction object.
     */
    async getTrans(
        txId: string,
    ): Promise<BFChainWallet.TRON.TronTransaction | BFChainWallet.TRON.Trc20Transaction> {
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
        const transInfo: BFChainWallet.TRON.TronTransInfo =
            await this.tronWeb.trx.getTransactionInfo(txId);
        if (transInfo) {
            const res: BFChainWallet.TRON.TronTransInfoRes = {
                txId: transInfo.id,
                fee: transInfo.fee ? transInfo.fee : 0,
                blockNumber: transInfo.blockNumber,
                blockTimeStamp: transInfo.blockTimeStamp,
                netFee: transInfo.receipt.net_fee ? transInfo.receipt.net_fee : 0,
                netUsage: transInfo.receipt.net_usage ? transInfo.receipt.net_usage : 0,
                energyFee: transInfo.receipt.energy_fee ? transInfo.receipt.energy_fee : 0,
                contractAddress: transInfo.contract_address ? transInfo.contract_address : "",
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
        const confirmTrans:
            | BFChainWallet.TRON.TronTransaction
            | BFChainWallet.TRON.Trc20Transaction = await this.tronWeb.trx.getConfirmedTransaction(
            txId,
        );
        if (confirmTrans) {
            const transBody = await this.getTransBody(confirmTrans);
            const transInfoRes = await this.getTransInfo(txId);
            if (transInfoRes) {
                const receipt: BFChainWallet.TRON.TronTransReceipt = {
                    txId: transInfoRes.txId,
                    blockNumber: transInfoRes.blockNumber,
                    blockTimeStamp: transInfoRes.blockTimeStamp,
                    from: transBody.from,
                    to: transBody.to,
                    contractAddress: transInfoRes.contractAddress,
                    amount: transBody.amount,
                    fee: transInfoRes.fee,
                    netUsage: transInfoRes.netUsage,
                    netFee: transInfoRes.netFee,
                    energyFee: transInfoRes.energyFee,
                    timestamp: confirmTrans.raw_data.timestamp,
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
                TronWeb.utils.code.base64EncodeToString(
                    TronWeb.utils.code.hexStr2byteArray(signature),
                ),
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
        if (
            (<BFChainWallet.TRON.Trc20Transaction>trans).raw_data.contract[0].parameter.value.data
        ) {
            const value = (<BFChainWallet.TRON.Trc20Transaction>trans).raw_data.contract[0]
                .parameter.value;
            const decode = TronHelper.decodeParams(TronHelper.TRANS_TYPES, value.data, true);
            from = value.owner_address;
            to = decode[0]?.toString();
            amount = decode[1]?.toString();
            contractAddress = value.contract_address;
        } else {
            const value = (<BFChainWallet.TRON.TronTransaction>trans).raw_data.contract[0].parameter
                .value;
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
            signature: trans.signature ? trans.signature[0] : "",
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
        const result: BFChainWallet.TRON.CommonTransByAddressResult =
            await this.httpHelper.sendGetRequest(host, req);
        if (result?.success && !result?.error) {
            let resData: BFChainWallet.TRON.CommonTransHistoryResData[] = [];
            result.data?.forEach((a) => {
                if (
                    a.ret?.length > 0 &&
                    a.raw_data?.contract?.length > 0 &&
                    a.raw_data?.contract[0]?.parameter?.value?.to_address
                ) {
                    const { contractRet, fee } = a.ret[0];
                    const b: BFChainWallet.TRON.CommonTransHistoryResData = {
                        contractRet: contractRet,
                        txID: a.txID,
                        blockNumber: a.blockNumber,
                        from: a.raw_data.contract[0].parameter.value.owner_address,
                        to: a.raw_data.contract[0].parameter.value.to_address,
                        amount: a.raw_data.contract[0].parameter.value.amount,
                        fee: fee,
                        net_usage: a.net_usage,
                        net_fee: a.net_fee,
                        energy_usage: a.energy_usage,
                        energy_fee: a.energy_fee,
                        timestamp: a.raw_data.timestamp,
                        expiration: a.raw_data.expiration,
                    };
                    resData.push(b);
                }
            });
            const res: BFChainWallet.TRON.CommonTransHistoryRes = {
                success: result.success,
                data: resData,
                pageSize: result.meta?.page_size,
                fingerprint: result.meta?.fingerprint ? result.meta?.fingerprint : "",
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
        const host = `${await this.getApiScanUrl()}/v1/accounts/${req.address}/transactions/trc20`;
        const result: BFChainWallet.TRON.Trc20TransHistoryResult =
            await this.httpHelper.sendGetRequest(host, req);
        if (result?.success && !result?.error) {
            let resData: BFChainWallet.TRON.Trc20TransHistoryResData[] = [];
            result.data?.forEach((a) => {
                if (a.transaction_id && a.token_info) {
                    const b: BFChainWallet.TRON.Trc20TransHistoryResData = {
                        txID: a.transaction_id,
                        from: a.from,
                        to: a.from,
                        value: a.value,
                        token_symbol: a.token_info?.symbol,
                        token_address: a.token_info?.address,
                        token_name: a.token_info?.name,
                        token_decimals: a.token_info?.decimals,
                        timestamp: a.block_timestamp,
                    };
                    resData.push(b);
                }
            });
            const res: BFChainWallet.TRON.Trc20TransHistoryRes = {
                success: result.success,
                data: resData,
                pageSize: result.meta?.page_size,
                fingerprint: result.meta?.fingerprint ? result.meta?.fingerprint : "",
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

    async getAccountBalance(address: string): Promise<BFChainWallet.TRON.TronAccountBalanceRes> {
        const host = `${await this.getTatumApiUrl()}/tron/account/${address}`;
        const result: BFChainWallet.TRON.TronAccountBalanceRes =
            await this.httpHelper.sendApiGetRequest(host, {}, await this.getTatumApiHeaders());
        if (result) {
            let trc20List: { contractAddress: string; amount: string }[] = [];
            result.trc20?.forEach((item) => {
                Object.keys(item).forEach((k) => {
                    trc20List.push({ contractAddress: k, amount: item[k] });
                });
            });
            result.trc20List = trc20List;
        }
        return result;
    }

    async createTransaction(
        req: BFChainWallet.TRON.CreateTransactionReq,
    ): Promise<BFChainWallet.TRON.TronTransation> {
        const host = `${await this.getPeerUrl()}/wallet/createtransaction`;
        return await this.httpHelper.sendPostRequest(host, req);
    }

    async getTransactionSign(
        req: BFChainWallet.TRON.GetTransactionSignReq,
    ): Promise<BFChainWallet.TRON.TronTransation | BFChainWallet.TRON.TRC20Transation> {
        const host = `${await this.getPeerUrl()}/wallet/gettransactionsign`;
        return await this.httpHelper.sendPostRequest(host, req);
    }

    async broadcastTransaction(
        transactionWithSign: BFChainWallet.TRON.TronTransation | BFChainWallet.TRON.TRC20Transation,
    ): Promise<BFChainWallet.TRON.BroadcastTransactionRes> {
        const host = `${await this.getPeerUrl()}/wallet/broadcasttransaction`;
        return await this.httpHelper.sendPostRequest(host, transactionWithSign);
    }

    async getTransactionById(
        value: string,
        visible = false,
    ): Promise<BFChainWallet.TRON.TronTransation> {
        const host = `${await this.getPeerUrl()}/wallet/gettransactionbyid`;
        return await this.httpHelper.sendGetRequest(host, { value, visible });
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
            const res: BFChainWallet.TRON.TriggerSmartContractRes =
                await this.httpHelper.sendPostRequest(host, contractReq);
            const selector = contractReq.function_selector;
            // 需要做解码操作的业务
            if (selector == "balanceOf(address)" || selector == "decimals()") {
                if (res.constant_result && res.constant_result.length > 0) {
                    const output = res.constant_result[0];
                    const decode = TronHelper.decodeParams(
                        TronHelper.UINT_TYPES,
                        "0x" + output,
                        false,
                    );
                    res.constant_result_decode = decode.toString();
                }
            }
            return res;
        }
        return {} as any;
    }

    private async getApiScanUrl() {
        if (this.tronApiScanConfig?.enable) {
            return this.tronApiScanConfig?.apiHost;
        }
        return this.__getTatumNodeUrl();
    }

    private async getApiHeaders() {
        return { TRON_PRO_API_KEY: this.tronApiScanConfig?.apiKey };
    }

    private async getTatumApiUrl() {
        return this.tatumConfig.apiHost;
    }

    private async getTatumApiHeaders() {
        return { "x-api-key": this.tatumConfig.apiKey };
    }

    private __getTatumNodeUrl() {
        return `${this.tatumConfig.host}/TRON/${this.tatumConfig.apiKey}`;
    }

    private async getPeerUrl() {
        if (this.tatumConfig.enable) {
            return `${this.tatumConfig.host}/TRON/${this.tatumConfig.apiKey}`;
        } else {
            const p = await this.peerListHelper.getEnableRandom();
            let url = `http://${p.ip}`;
            if (p.port) {
                url += `:${p.port}`;
            }

            return url;
        }
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
