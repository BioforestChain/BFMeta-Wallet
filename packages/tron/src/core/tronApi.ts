import { Inject, Injectable } from "@bnqkl/util-node";
import { HttpHelper, PeerListHelper, TatumSymbol } from "@bfmeta/wallet-helpers";
import { TronHelper } from "./tronHelper";
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
        this.__tronWeb = new TronWeb({ fullHost: "https://nile.trongrid.io" });
    }

    constructor(
        @Inject(PEERS.host) public host: BFChainWallet.HostType[],
        public httpHelper: HttpHelper,
        public peerListHelper: PeerListHelper,
        public tronHelper: TronHelper,
        @Inject(TatumSymbol) public tatumConfig: BFChainWallet.Config["tatum"],
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
    async getAccountV2(address: string): Promise<BFChainWallet.TRON.TronAccount | null> {
        const account: BFChainWallet.TRON.TronWebAccount = await this.tronWeb.trx.getAccount(
            address,
        );
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
    async getAccountResourceV2(address: string): Promise<any> {
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

    async getCurrentBlock(): Promise<BFChainWallet.TRON.TronBlock> {
        return await this.tronWeb.trx.getCurrentBlock();
    }

    async getBalanceV2(address: string): Promise<number> {
        return await this.tronWeb.trx.getBalance(address).catch((err: any) => {
            throw new Error(err);
        });
    }

    async sendTrx(req: BFChainWallet.TRON.SendTrxReq): Promise<any> {
        const { to, from, amount } = req;
        if (!amount || amount <= 0 || !Number.isInteger(amount)) {
            throw new Error("amount must be a positive integer greater than 0");
        }
        return await this.tronWeb.transactionBuilder.sendTrx(to, amount, from).catch((err: any) => {
            throw new Error(err);
        });
    }

    async sign(
        trans: BFChainWallet.TRON.TronTransaction,
        privateKey: string,
    ): Promise<BFChainWallet.TRON.TronSignTrans> {
        return await this.tronWeb.trx.sign(trans, privateKey).catch((err: any) => {
            throw new Error(err);
        });
    }

    async sendTransaction(signTrans: BFChainWallet.TRON.TronSignTrans): Promise<any> {
        return await this.tronWeb.trx.sendRawTransaction(signTrans).catch((err: any) => {
            throw new Error(err);
        });
    }

    async getCommonTransHistory(req: BFChainWallet.TRON.TronTransHistoryReq): Promise<any> {
        const host = `${this.__getTatumUrl()}/v1/accounts/${req.address}/transactions`;
        const result: BFChainWallet.TRON.CommonTransByAddressResult = await this.httpHelper.sendGetRequest(
            host,
            req,
        );
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
        const host = `${this.__getTatumUrl()}/v1/accounts/${req.address}/transactions/trc20`;
        const result: BFChainWallet.TRON.Trc20TransHistoryResult = await this.httpHelper.sendGetRequest(
            host,
            req,
        );
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
        const host = `${await this.getApiUrl()}/tron/account/${address}`;
        const result: BFChainWallet.TRON.TronAccountBalanceRes = await this.httpHelper.sendApiGetRequest(
            host,
            {},
            await this.getApiHeaders(),
        );
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
            const parameter = this.tronHelper.encodeParameter(contractReq.input);
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
                    const types = ["uint256"];
                    const decode = this.tronHelper.decodeParameter(types, "0x" + output, false);
                    res.constant_result_decode = decode.toString();
                }
            }
            return res;
        }
        return {} as any;
    }

    private async getApiUrl() {
        return this.tatumConfig.apiHost;
    }

    private async getApiHeaders() {
        return { "x-api-key": this.tatumConfig.apiKey };
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

    private __getTatumUrl() {
        return `${this.tatumConfig.host}/TRON/${this.tatumConfig.apiKey}`;
    }
}
