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

    async getBalanceV2(address: string): Promise<number> {
        return await this.tronWeb.trx.getBalance(address);
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

    async generateAddress(): Promise<BFChainWallet.TRON.GenerateAddressRes> {
        const host = `${await this.getPeerUrl()}/wallet/generateaddress`;
        return await this.httpHelper.sendGetRequest(host);
    }

    async getAccount(address: string, visible = false): Promise<BFChainWallet.TRON.TronAccountRes> {
        const host = `${await this.getPeerUrl()}/wallet/getaccount`;
        return await this.httpHelper.sendGetRequest(host, { address, visible });
    }

    async getAccountResource(
        address: string,
        visible = false,
    ): Promise<BFChainWallet.TRON.TronAccountResource> {
        const host = `${await this.getPeerUrl()}/wallet/getaccountresource`;
        return await this.httpHelper.sendGetRequest(host, { address, visible });
    }

    async getNowBlock(): Promise<BFChainWallet.TRON.TronBlock> {
        const host = `${await this.getPeerUrl()}/wallet/getnowblock`;
        return await this.httpHelper.sendGetRequest(host);
    }

    async getBlockByNum(num: number): Promise<BFChainWallet.TRON.TronBlock> {
        const host = `${await this.getPeerUrl()}/wallet/getblockbynum`;
        return await this.httpHelper.sendGetRequest(host, { num });
    }

    async getBlockById(value: string): Promise<BFChainWallet.TRON.TronBlock> {
        const host = `${await this.getPeerUrl()}/wallet/getblockbyid`;
        return await this.httpHelper.sendGetRequest(host, { value });
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

    async listNodes(): Promise<BFChainWallet.TRON.ListNodes> {
        const host = `${await this.getPeerUrl()}/wallet/listnodes`;
        return await this.httpHelper.sendGetRequest(host);
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
