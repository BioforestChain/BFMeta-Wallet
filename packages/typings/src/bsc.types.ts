export {};
declare global {
    export namespace BFChainWallet {
        /** 币安智能链 */
        export namespace BSC {
            export type BscTransHistoryReq = {
                // 指定地址
                address: string;
                // 合约地址（仅适用于查询合约交易）
                contractaddress?: string;
                // 开始区块号, 默认为0
                startblock?: number;
                // 结束区块号，默认为 999999999
                endblock?: number;
                // 页码, 默认为 1
                page?: number;
                // 每页显示交易数量，默认为20，不可超过10000
                offset?: number;
                // 排序偏好：默认为 desc 降序
                sort?: string;
            };

            export type NormalTransHistoryResult = {
                status: string;
                message: string;
                result: NormalTransResult[];
            };

            export type NormalTransHistoryRes = {
                // 状态：0：无更多结果 或 错误请求，1：请求成功，可继续
                status: string;
                // 请求结果：成功时返回 "OK"
                message: string;
                result: NormalTransRes[];
            };

            export type Bep20TransHistoryResult = {
                status: string;
                message: string;
                result: Bep20TransResult[];
            };

            export type Bep20TransHistoryRes = {
                // 状态：0：无更多结果 或 错误请求，1：请求成功，可继续
                status: string;
                // 请求结果：成功时返回 "OK"
                message: string;
                result: Bep20TransRes[];
            };

            export type NormalTransRes = {
                // 区块号
                blockNumber: string;
                // 时间戳：秒级
                timeStamp: string;
                // 交易Hash
                hash: string;
                // 转账发起地址
                from: string;
                // 转账接收地址
                to: string;
                // 转账金额
                value: string;
                // Gas
                gas: string;
                // GasPrice
                gasPrice: string;
                // 手续费
                gasUsed: string;
                // 交易回执状态： "1" 为成功
                // txreceipt_status: string;
            };

            export type Bep20TransRes = {
                // 区块号
                blockNumber: string;
                // 时间戳：秒级
                timeStamp: string;
                // 交易Hash
                hash: string;
                // 转账发起地址
                from: string;
                contractAddress: string;
                // 转账接收地址
                to: string;
                // 转账金额
                value: string;
                // 合约名称
                tokenName: string;
                // 合约符号
                tokenSymbol: string;
                // 合约精度
                tokenDecimal: string;
                // Gas
                gas: string;
                // GasPrice
                gasPrice: string;
                // 手续费
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

            export type Bep20TransResult = {
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
            export interface API extends Omit<BFChainWallet.ETH.API, "getNormalTransHistory" | "getErc20TransHistory"> {
                getNormalTransHistory(req: BscTransHistoryReq): Promise<NormalTransHistoryRes>;
                getBep20TransHistory(req: BscTransHistoryReq): Promise<Bep20TransHistoryRes>;
            }
        }
    }
}
