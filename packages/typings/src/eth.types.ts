export {};
declare global {
    export namespace BFChainWallet {
        /**以太坊 */
        export namespace ETH {
            export type TransactionBody = {
                nonce: number;
                from: string;
                to: string;
                value: string | number;
                gas: string | number;
                gasPrice: string | number;
                chainId?: number;
                data?: string;
            };

            export type SignTransactionReq = {
                trans: TransactionBody;
                privateKey: string;
            };

            export type SignTransactionRes = {
                rawTrans: string;
                txHash: string;
            };

            export type BaseGas = {
                generalGas: number;
                contractGas: number;
            };

            export type ContractBalance = {
                /**余额 */
                balance: string;
                /**精度 */
                decimal: string;
            };

            export type TransHistoryReq = {
                /**指定地址 */
                address: string;
                /**合约地址（仅适用于查询合约交易） */
                contractaddress?: string;
                /**开始区块号, 默认为0 */
                startblock?: number;
                /**结束区块号，默认为 999999999 */
                endblock?: number;
                /**页码, 默认为 1 */
                page?: number;
                /**每页显示交易数量，默认为20，不可超过10000 */
                offset?: number;
                /**排序偏好：默认为 desc 降序 */
                sort?: string;
            };

            export type NormalTransHistoryResult = {
                status: string;
                message: string;
                result: NormalTransResult[];
            };

            export type NormalTransHistoryRes = {
                /**状态：0：无更多结果 或 错误请求，1：请求成功，可继续 */
                status: string;
                /**请求结果：成功时返回 "OK" */
                message: string;
                result: NormalTransRes[];
            };

            export type Erc20TransHistoryResult = {
                status: string;
                message: string;
                result: Erc20TransResult[];
            };

            export type Erc20TransHistoryRes = {
                /**状态：0：无更多结果 或 错误请求，1：请求成功，可继续 */
                status: string;
                /**请求结果：成功时返回 "OK" */
                message: string;
                result: Erc20TransRes[];
            };

            export type NormalTransRes = {
                /**区块号 */
                blockNumber: string;
                /**时间戳：秒级 */
                timeStamp: string;
                /**交易Hash */
                hash: string;
                /**转账发起地址 */
                from: string;
                /**转账接收地址 */
                to: string;
                /**转账金额 */
                value: string;
                /**Gas */
                gas: string;
                /**GasPrice */
                gasPrice: string;
                /**手续费 */
                gasUsed: string;
                /**交易回执状态： "1" 为成功 */
                // txreceipt_status: string;
            };

            export type Erc20TransRes = {
                /**区块号 */
                blockNumber: string;
                /**时间戳：秒级 */
                timeStamp: string;
                /**交易Hash */
                hash: string;
                /**转账发起地址 */
                from: string;
                /**合约地址 */
                contractAddress: string;
                /**转账接收地址 */
                to: string;
                /**转账金额 */
                value: string;
                /**合约名称 */
                tokenName: string;
                /**合约符号 */
                tokenSymbol: string;
                /**合约精度 */
                tokenDecimal: string;
                /**Gas */
                gas: string;
                /**GasPrice */
                gasPrice: string;
                /**手续费 */
                gasUsed: string;
            };

            export type NormalTransResult = {
                blockNumber: string;
                blockHash: string;
                timeStamp: string;
                hash: string;
                nonce: string;
                transactionIndex: string;
                from: string;
                to: string;
                value: string;
                gas: string;
                gasPrice: string;
                input: string;
                methodId: string;
                functionName: string;
                contractAddress: string;
                cumulativeGasUsed: string;
                txreceipt_status: string;
                gasUsed: string;
                confirmations: string;
                isError: string;
            };

            export type Erc20TransResult = {
                blockNumber: string;
                timeStamp: string;
                hash: string;
                nonce: string;
                blockHash: string;
                from: string;
                contractAddress: string;
                to: string;
                value: string;
                tokenName: string;
                tokenSymbol: string;
                tokenDecimal: string;
                transactionIndex: string;
                gas: string;
                gasPrice: string;
                gasUsed: string;
                cumulativeGasUsed: string;
                input: string;
                confirmations: string;
            };

            export type TransReceiptNative = {
                /**交易hash */
                txHash: string;
                /**交易发起地址 */
                from: string;
                /**交易接收地址 */
                to: string;
                /**交易金额 */
                value: string;
                /**合约地址: 普通交易时默认为 "" */
                contractAddress: string;
                /**区块累计使用Gas */
                cumulativeGasUsed: string;
                /** */
                effectiveGasPrice: string;
                /**交易消耗的Gas */
                gasUsed: string;
                /**执行结果 */
                status: boolean;
                /**交易区块hash */
                blockHash: string;
                /**交易区块高度 */
                blockNumber: string;
            };

            export type EthTransBody = {
                txHash: string;
                blockHash: string | null;
                blockNumber: string | undefined;
                from: string;
                to: string | null | undefined;
                value: string;
                contractAddress: string | null | undefined;
            };

            export type EthTransBodyFromSign = {
                hash: string;
                from: string;
                to: string;
                value: string;
                contractAddress: string | null;
            };

            export type TransactionCustom = {
                hash: string;
                nonce: string;
                blockHash: string;
                blockNumber?: string | undefined;
                transactionIndex?: string | undefined;
                from: string;
                to?: string | null | undefined;
                value: string;
                gasPrice: string;
                maxFeePerGas?: string | undefined;
                maxPriorityFeePerGas?: string | undefined;
                gas: string;
                input: string;
                data?: string | undefined;
                chainId?: string | undefined;
                r: string;
                s: string;
                v?: string | undefined;
            };

            export interface API {
                /**
                 * 以太坊获取最新区块信息
                 */
                getLastBlock(): Promise<any>;
                /**
                 * 以太坊获取当前链ID
                 */
                getChainId(): Promise<number>;
                /**
                 * 以太坊获取当前基础Gas信息(可配置)
                 */
                getBaseGas(): Promise<BaseGas>;
                /**
                 * 以太坊获取当前 GasPrice
                 */
                getGasPrice(): Promise<string>;
                /**
                 * 以太坊获取指定地址余额余额信息
                 * @param address 用户地址
                 */
                getBalance(address: string): Promise<string>;
                /**
                 * 以太坊获取指定用户，指定合约地址余额信息
                 * @param address 用户地址
                 * @param contractAddress 合约地址
                 */
                getContractBalance(address: string, contractAddress: string): Promise<string>;
                /**
                 * 以太坊获取指定用户，指定合约地址余额及精度
                 * @param address 用户地址
                 * @param contractAddress 合约地址
                 */
                getContractBalanceAndDecimal(address: string, contractAddress: string): Promise<ContractBalance>;
                /**
                 * 以太坊获取指定用户地址交易数(已完成的交易)
                 * @param address 用户地址
                 */
                getTransCount(address: string): Promise<number>;
                /**
                 * 以太坊签名交易数据
                 * @param {SignTransactionReq} req 待签名的交易数据
                 * @return {SignTransactionRes} res 签名数据
                 */
                signTransaction(req: SignTransactionReq): Promise<SignTransactionRes>;
                /**
                 * 以太坊获取合约交易中的 data 数据信息
                 * @param from 发起地址
                 * @param to 接收地址
                 * @param amount 交易金额
                 * @param contractAddress 合约地址
                 */
                getContractTransData(
                    from: string,
                    to: string,
                    amount: string,
                    contractAddress: string,
                ): Promise<string>;
                /**
                 * 以太坊广播签名后的交易数据
                 * @param raw 签名后的数据串
                 */
                sendSignedTransaction(raw: string): Promise<string>;
                /**
                 * 指定交易Hash，获取交易信息
                 * @param txHash 交易Hash
                 */
                getTrans(txHash: string): Promise<BFChainWallet.ETH.TransactionCustom>;
                /**
                 * 指定交易Hash，获取交易收据(已完成交易)
                 * @param txHash 交易Hash
                 */
                getTransReceipt(txHash: string): Promise<any>;
                /**
                 * 指定交易hash，获取交易收据
                 * @param {string} txHash 交易Hash
                 * @returns {TransReceiptNative | null} 交易回执信息
                 */
                getTransReceiptNative(txHash: string): Promise<TransReceiptNative | null>;

                getNormalTransHistory(req: TransHistoryReq): Promise<NormalTransHistoryRes>;

                getErc20TransHistory(req: TransHistoryReq): Promise<Erc20TransHistoryRes>;
            }
        }
    }
}
