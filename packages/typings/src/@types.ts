export {};
declare global {
    export namespace BFChainWallet {
        export type HostType = {
            ip: string;
            port: number;
        };
        export type WalletNode = {
            host: HostType[];
            browserPath?: string;
        };
        export type HeadersType = { [key: string]: string };
        export type Config = {
            bfchain?: {
                enable: boolean;
            } & WalletNode;
            ccchain?: {
                enable: boolean;
            } & WalletNode;
            bfm?: {
                enable: boolean;
            } & WalletNode;
            pmchain?: {
                enable: boolean;
            } & WalletNode;
            ethm?: {
                enable: boolean;
            } & WalletNode;
            bfchainv2?: {
                enable: boolean;
            } & WalletNode;
            tron?: {
                enable: boolean;
                host: HostType[];
                headers: HeadersType;
                official?: string;
            };
            eth?: {
                enable: boolean;
                host: HostType[];
                testnet: boolean;
                headers: HeadersType;
                official?: string;
            };
            bsc?: {
                enable: boolean;
                host: HostType[];
                testnet: boolean;
                headers: HeadersType;
                official?: string;
            };
            tatum: {
                /** 这里配置成true, 将不直连节点，通过tatum连接节点。若配置为false，节点由上述三条链决定 */
                enable: boolean;
                apiKey: string;
                host: string;
                apiHost: string;
                ethTest?: string;
            };

            bscApiScan?: {
                enable: boolean;
                apiHost: string;
                apiKey: string;
            };

            ethApiScan?: {
                enable: boolean;
                apiHost: string;
                apiKey: string;
            };

            tronApiScan?: {
                enable: boolean;
                apiHost: string;
                apiKey: string;
            };
        };

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

            export type Contract20Balance = {
                balance: string;
                decimal: string;
            };

            export type TransHistoryReq = {
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

            export type Erc20TransHistoryResult = {
                status: string;
                message: string;
                result: Erc20TransResult[];
            };

            export type Erc20TransHistoryRes = {
                // 状态：0：无更多结果 或 错误请求，1：请求成功，可继续
                status: string;
                // 请求结果：成功时返回 "OK"
                message: string;
                result: Erc20TransRes[];
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

            export type Erc20TransRes = {
                // 区块号
                blockNumber: string;
                // 时间戳：秒级
                timeStamp: string;
                // 交易Hash
                hash: string;
                // 转账发起地址
                from: string;
                // 合约地址
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

            export type AccountBalanceRes = { contractAddress: string; amount: string }[];

            export type TransReceiptNative = {
                txHash: string;
                from: string;
                to: string;
                value: string;
                contractAddress: string;
                cumulativeGasUsed: number;
                effectiveGasPrice: number;
                gasUsed: number;
                status: boolean;
                blockHash: string;
                blockNumber: number;
            };

            export type EthTransBody = {
                txHash: string;
                blockHash: string | null;
                blockNumber: number | null;
                from: string;
                to: string | null;
                value: string;
                contractAddress: string | null;
            };

            export type EthTransBodyFromSign = {
                hash: string;
                from: string;
                to: string;
                value: string;
                contractAddress: string | null;
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
                getContractBalanceAndDecimal(address: string, contractAddress: string): Promise<Contract20Balance>;

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
                getTrans(txHash: string): Promise<any>;

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

                getAccountBalance(address: string): Promise<AccountBalanceRes>;
            }
        }

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
        /** 波场 */
        export namespace TRON {
            export type TronBlock = {
                blockID: string;
                block_header: {
                    raw_data: {
                        number: number;
                        txTrieRoot: string;
                        witness_address: string;
                        parentHash: string;
                        version: number;
                        timestamp: number;
                    };
                    witness_signature: string;
                };
            };

            export type CreateTransactionReq = {
                /** 转账转出地址，Base58check格式 或 Hex格式 */
                owner_address: string;
                /** 转账转入地址，Base58check格式 或 Hex格式 */
                to_address: string;
                /** 转账金额 */
                amount: number;
                /** 账户地址是否为 Base58check 格式，默认为 false，使用 Hex 地址 */
                visible?: boolean;
                /** 交易时添加的备注信息 */
                extra_data?: string;
            };

            export type GetTransactionSignReq = {
                /** 未签名前的交易信息 */
                transaction: TronTransaction | Trc20Transaction;
                /** 用户私钥 */
                privateKey: string;
            };

            export type BroadcastTransactionRes = {
                /** 交易是否成功: true: 成功，false: 失败 */
                result: boolean;
                /** 交易ID */
                txid: string;
                /** 交易失败时出现，显示为交易失败原因的code */
                code?: string;
                /** 信息 */
                message: string;
            };

            export type TronTransactionInfo = {
                /** 交易ID */
                id: string;
                /** 交易手续费 */
                fee?: number;
                /** 区块高度 */
                blockNumber: number;
                /** 时间 */
                blockTimeStamp: number;
                contractResult: string[];
                // 合约地址
                contract_address?: string;
                receipt: {
                    // 消耗带宽
                    net_fee?: number;
                    // 免费带宽
                    net_usage?: number;
                    // 消耗能量
                    energy_fee?: number;
                    result?: string;
                };
                packingFee?: number;
            };

            export type TriggerSmartContractReq = {
                /** 发起合约调用的账户地址 默认使用 Hex 地址*/
                owner_address: string;
                /** 合约地址 默认使用 Hex 地址*/
                contract_address: string;
                /**
                 * 所调用的函数
                 * 1.转账时使用：transfer(address, uint256)
                 * 2.获取余额使用：balanceOf(address)
                 * 3.获取代币精度：decimals()
                 */
                function_selector: string;
                /** 原始数据，包含转账地址和转账金额 */
                input: TronContractParameter[];
                /** 编码后的 parameter(服务端使用) */
                parameter?: string;
                /** 最大消耗的 TRX 数量 */
                fee_limit?: number;
                /** 本次调用往合约转账的 TRX 数量 */
                call_value?: number;
                /** 账户地址是否为 Base58check 格式，默认为 false，使用 Hex 地址 */
                visible?: boolean;
            };

            export type TriggerSmartContractRes = {
                /** 请求结果 */
                result: { result: boolean };
                energy_used?: number;
                constant_result?: string[];
                constant_result_decode?: string;
                transaction: Trc20Transaction;
            };

            export type TronContractParameter = {
                type: string;
                value: string | number;
            };

            export type TronTransHistoryReq = {
                // 查询地址
                address: string;
                // 每页结果数，默认20，最大200
                limit: number;
                // 特定合约地址(适用于合约交易查询)
                contract_address?: string;
                // 翻页参数，指定上一页的 fingerprint
                fingerprint?: string;
            };

            export type CommonTransByAddressResult = {
                // 是否成功；ture 成功， false失败
                success: boolean;
                // 交易历史集合
                data: CommonTransHistoryResultData[];
                // 额外参数
                meta?: {
                    // 时间戳
                    at: number;
                    // 翻页参数，指定上一页的 fingerprint
                    fingerprint: string;
                    // 翻页链接地址
                    links?: { next: string };
                    // 页数
                    page_size: number;
                };
                // 查询错误信息
                error?: string;
                statusCode?: number;
            };

            export type CommonTransHistoryRes = {
                // 是否成功；ture 成功， false失败
                success: boolean;
                // 交易历史集合
                data: CommonTransHistoryResData[];
                // 当前页的数量
                pageSize?: number;
                // 翻页参数，指定上一页的 fingerprint
                fingerprint?: string;
                // 查询错误信息
                error?: string;
                // 错误状态
                statusCode?: number;
            };

            export type Trc20TransHistoryResult = {
                // 是否成功；ture 成功， false失败
                success: boolean;
                // 交易历史集合
                data: Trc20TransHistoryResultData[];
                // 额外参数
                meta?: {
                    // 时间戳
                    at: number;
                    // 翻页参数，指定上一页的 fingerprint
                    fingerprint: string;
                    // 翻页链接地址
                    links?: { next: string };
                    // 页数
                    page_size: number;
                };
                // 查询错误信息
                error?: string;
                // 错误状态
                statusCode?: number;
            };

            export type Trc20TransHistoryRes = {
                // 是否成功；ture 成功， false失败
                success: boolean;
                // 交易历史集合
                data: Trc20TransHistoryResData[];
                // 当前页的数量
                pageSize?: number;
                // 翻页参数，指定上一页的 fingerprint
                fingerprint?: string;
                // 错误信息
                error?: string;
                // 错误状态
                statusCode?: number;
            };

            export type CommonTransHistoryResultData = {
                ret: { contractRet: string; fee: number }[];
                signature: string[];
                txID: string;
                raw_data_hex: string;
                net_usage: number;
                net_fee: number;
                energy_usage: number;
                energy_fee: 0;
                energy_usage_total: 0;
                blockNumber: number;
                block_timestamp: number;
                raw_data: {
                    contract: {
                        parameter: {
                            value: {
                                amount: number;
                                owner_address: string;
                                to_address: string;
                            };
                            type_url: string;
                        };
                        type: string;
                    }[];
                    ref_block_bytes: string;
                    ref_block_hash: string;
                    expiration: number;
                    timestamp: number;
                };
                internal_transactions: [];
            };

            export type CommonTransHistoryResData = {
                contractRet: string;
                txID: string;
                blockNumber: number;
                from: string;
                to: string;
                amount: number;
                fee: number;
                net_usage: number;
                net_fee: number;
                energy_usage: number;
                energy_fee: number;
                timestamp: number;
                expiration: number;
            };

            export type Trc20TransHistoryResultData = {
                transaction_id: string;
                token_info: {
                    symbol: string;
                    address: string;
                    decimals: number;
                    name: string;
                };
                block_timestamp: number;
                from: string;
                to: string;
                value: string;
                type: string;
            };

            export type Trc20TransHistoryResData = {
                txID: string;
                from: string;
                to: string;
                value: string;
                token_symbol: string;
                token_address: string;
                token_name: string;
                token_decimals: number;
                timestamp: number;
            };

            export type TronAccountBalanceRes = {
                balance: number;
                trc20: { [key: string]: string }[];
                trc20List: { contractAddress: string; amount: string }[];
                createTime: number;
                freeNetLimit: number;
            };

            // 以下是新的类型

            export type TronNewAccount = {
                /** 私钥 */
                privateKey: string;
                /** 公钥 */
                publicKey: string;
                /** 地址 */
                address: {
                    base58: string;
                    hex: string;
                };
            };

            export type TronNewAccountWithMnemonic = {
                /** 助记词 */
                mnemonic: { phrase: string; path: string; locale: string };
                /** 私钥 */
                privateKey: string;
                /** 公钥 */
                publicKey: string;
                /** base58地址 */
                address: string;
            };

            export type TronAccount = {
                /** 地址 */
                address: {
                    base58: string;
                    hex: string;
                };
                /** 余额 */
                balance: number;
            };

            export type TronWebAccount = {
                /** hex格式地址 */
                address: string;
                /** 余额 */
                balance: number;
                /** 创建时间 */
                create_time: number;
            };

            export type TronAccountResources = {
                /** 免费带宽总量 */
                freeNetLimit?: number;
                /** 已使用的免费带宽 */
                freeNetUsed?: number;
                /** 已使用的通过质押获得的带宽 */
                NetUsed?: number;
                /** 质押获得的带宽总量 */
                NetLimit?: number;
                /** 拥有的投票权 */
                tronPowerLimit?: number;
                /** 已使用的能量 */
                EnergyUsed?: number;
                /** 质押获取的总能量 */
                EnergyLimit?: number;
                /** 全网通过质押获取的带宽总量 */
                TotalNetLimit?: number;
                /** 全网用于获取带宽的质押TRX总量 */
                TotalNetWeight?: number;
                /** 全网通过质押获取的能量总量 */
                TotalEnergyLimit?: number;
                /** 全网用于获取能量的质押TRX总量 */
                TotalEnergyWeight?: number;
            };

            export type SendTrxReq = {
                from: string;
                to: string;
                amount: string;
            };

            export type SendTrc20Req = {
                from: string;
                to: string;
                amount: string;
                contractAddress: string;
            };

            export type TronTransactionRawData = {
                contract: {
                    parameter: {
                        value: {
                            /** 交易金额 */
                            amount: number;
                            /** 交易发起地址 */
                            owner_address: string;
                            /** 交易接收地址 */
                            to_address: string;
                        };
                        type_url: string;
                    };
                    type: string;
                }[];
                ref_block_bytes: string;
                ref_block_hash: string;
                expiration: number;
                timestamp: number;
            };

            export type Trc20TransactionRawData = {
                contract: {
                    parameter: {
                        value: {
                            /** 交易加密数据 */
                            data: string;
                            /** 交易发起地址 */
                            owner_address: string;
                            /** 合约地址 */
                            contract_address: string;
                        };
                        type_url: string;
                    };
                    type: string;
                }[];
                ref_block_bytes: string;
                ref_block_hash: string;
                expiration: number;
                timestamp: number;
            };

            export type TronTransaction = {
                visible: boolean;
                txID: string;
                raw_data: TronTransactionRawData;
                raw_data_hex: string;
                signature?: string[];
                ret?: { contractRet: string }[];
            };

            export type Trc20Transaction = {
                visible: boolean;
                txID: string;
                raw_data: Trc20TransactionRawData;
                raw_data_hex: string;
                /** 签名 */
                signature?: string[];
                /** 查询 */
                ret?: { contractRet: string }[];
            };

            export type TronOptions = {
                /** 交易的手续费上限。可以根据交易的复杂性和网络情况选择适当的手续费上限。如果未提供此选项，默认手续费上限为 10 TRX。 */
                feeLimit: number;
                /** 调用合约时传输的 TRX 数量。对于 TRC20 转账，一般情况下传输的 TRX 数量为 0。 */
                callValue: number;
                /** 发送的代币数量。这是一个可选项，如果您要发送 TRC10 代币，可以使用此选项指定发送的代币数量 */
                tokenValue?: number;
                /** 代币的 tokenId。这是一个可选项，如果您要发送 TRC10 代币，可以使用此选项指定代币的 ID */
                tokenId?: number;
            };

            export type SendTrc20Result = {
                result: boolean;
                transaction: Trc20Transaction;
            };

            export type SendTransResult = {
                /** 交易ID */
                txid: string;
                /** 广播结果 */
                result?: boolean;
                /** 错误码，不是数字，而是错误信息 */
                code?: string;
                message?: string;
            };

            export type BroadcastRes = {
                /** 广播结果 */
                result: boolean;
                /** 交易ID */
                txid: string;
                /** 返回消息 */
                message: string;
                code?: string;
            };

            export type TronTransInfo = {
                /** txId */
                id: string;
                /** 手续费 */
                fee: number;
                /** 区块高度 */
                blockNumber: number;
                /** 区块时间: 时间戳 毫秒 */
                blockTimeStamp: number;
                contractResult: string[];
                // 合约地址
                contract_address?: string;
                receipt: {
                    // 消耗带宽
                    net_fee?: number;
                    // 免费带宽
                    net_usage?: number;
                    // 消耗能量
                    energy_fee?: number;
                    result?: string;
                };
            };

            export type TronTransInfoRes = {
                /** txId */
                txId: string;
                /** 手续费 */
                fee: number;
                /** 区块高度 */
                blockNumber: number;
                /** 区块时间: 时间戳 毫秒 */
                blockTimeStamp: number;
                // 消耗带宽
                netFee: number;
                // 免费带宽
                netUsage: number;
                // 消耗能量
                energyFee: number;
                // 合约地址
                contractAddress: string;
            };

            export type TronTransReceipt = {
                /** 状态：true 成功，false 失败 */
                status: boolean;
                /** 交易ID */
                txId: string;
                /** 区块高度 */
                blockNumber: number;
                /** 区块时间: 时间戳 毫秒 */
                blockTimeStamp: number;
                /** 交易发起地址 */
                from: string;
                /** 交易接收地址 */
                to: string;
                /** 合约地址 */
                contractAddress: string;
                /** 交易金额 */
                amount: string;
                /** 手续费：消耗TRX */
                fee: number;
                /** 网络费(免费) */
                netUsage: number;
                /** 网络费 */
                netFee: number;
                /** 能量费 */
                energyFee: number;
                /** 交易时间戳 */
                timestamp: number;
            };

            export type TronTransBody = {
                txId: string;
                from: string;
                to: string;
                amount: string;
                /** 合约地址：该字段不会为空，非合约交易时为空字符串 */
                contractAddress: string;
                /** 签名信息：已签名的交易才会有该字段，默认为空字符串 */
                signature: string;
            };

            export interface API {
                /**
                 * 生成新账户：不包含助记词
                 * @returns {TronNewAccount}
                 */
                createAccount(): Promise<TronNewAccount>;
                /**
                 * 生成新账户：包含助记词
                 * @returns {TronNewAccountWithMnemonic}
                 */
                createAccountWithMnemonic(): Promise<TronNewAccountWithMnemonic>;
                /**
                 * 根据助记词恢复账户信息
                 * @param mnemonic 助记词
                 * @returns {TronNewAccountWithMnemonic}
                 */
                recoverAccount(mnemonic: string): Promise<TronNewAccountWithMnemonic>;
                /**
                 * 是否是波场的地址
                 * @param address hex格式地址或base58格式地址
                 * @returns {boolean}
                 */
                isAddress(address: string): Promise<boolean>;
                /**
                 * base58地址转 Hex地址
                 * @param address base58格式地址（T开头的地址）
                 * @returns {string}
                 */
                addressToHex(address: string): Promise<string>;
                /**
                 * hex格式地址转 base58地址
                 * @param address hex格式地址（41开头的地址）
                 * @returns {string}
                 */
                addressToBase58(address: string): Promise<string>;
                /**
                 * 获取指定地址的用户信息（包含两种格式地址）
                 * 如地址存在或地址未激活，统一返回 null
                 * @param address hex格式地址或base58格式地址
                 * @returns {TronAccount | null}
                 */
                getAccount(address: string): Promise<TronAccount | null>;

                /**
                 * 获取指定地址的账户资源
                 * @param address 地址
                 * @returns {TronAccountResources}
                 */
                getAccountResources(address: string): Promise<TronAccountResources>;

                /**
                 * 消息签名
                 * @param message 待签名的消息，可以是明文也可以是hex的字符串
                 * @param privateKey 私钥
                 * @returns {string} 加密后的签名
                 */
                signMessageV2(message: string, privateKey: string): Promise<string>;

                /**
                 * 验证签名
                 * @param message 待加密消息，可以是明文也可以是hex的字符串
                 * @param signature 加密签名
                 * @returns {string} 返回加密用户的地址（地址为base58格式）
                 */
                verifyMessageV2(message: string, signature: string): Promise<string>;

                /**
                 * 获取波场最新区块信息
                 * @returns {TronBlock}
                 */
                getCurrentBlock(): Promise<TronBlock>;

                /**
                 * 获取指定地址的trx余额
                 * @param address 地址
                 * @returns {string} trx余额
                 */
                getTrxBalance(address: string): Promise<string>;

                /**
                 * 发起TRX交易
                 * @param req req
                 * @returns {TronTransaction} TRX交易体
                 */
                sendTrx(req: SendTrxReq): Promise<TronTransaction>;

                /**
                 * TRX交易签名
                 * @param trans TRX交易体
                 * @param privateKey 私钥
                 * @returns {TronTransaction} 签名后的TRX交易体
                 */
                signTrx(trans: TronTransaction, privateKey: string): Promise<TronTransaction>;

                /**
                 * 发起TRC20合约交易
                 * @param req req
                 * @returns {Trc20Transaction} TRC20交易体
                 */
                sendTrc20(req: SendTrc20Req): Promise<Trc20Transaction>;

                /**
                 * TRC20交易签名
                 * @param trc20Trans TRC20交易体
                 * @param privateKey 私钥
                 * @returns {TronTransaction} 签名后的TRC20交易体
                 */
                signTrc20(trc20Trans: Trc20Transaction, privateKey: string): Promise<Trc20Transaction>;

                /**
                 * 交易广播
                 * @param signTrans 签名后的交易体
                 * @returns {BroadcastRes} 广播结果
                 */
                broadcast(signTrans: TronTransaction | Trc20Transaction): Promise<BroadcastRes>;

                /**
                 * 交易广播
                 * 该方法的参数是签名后的交易信息转换 hex 后的字符串
                 * ps：并非简单hex转换，需要调用方法#API.transToPbHex() 才可获取到正确的hex数据
                 * @param {string} signTransHex 签名后交易体Hex字符串
                 * @returns {BroadcastRes} 广播结果
                 */
                broadcastHexTrans(signTransHex: string): Promise<BroadcastRes>;

                /**
                 * 交易JSON转换成交易Protobuf的HEX格式
                 * @param signTrans 签名后的交易体
                 * @returns {string} 交易
                 */
                transToPbHex(signTrans: TronTransaction | Trc20Transaction): Promise<string>;

                /**
                 * 获取交易体中的具体交易数据
                 * ps: 主要是用于在不熟悉复杂交易结构的前提下能更直观的获取交易体数据，同时也会对于合约交易进行数据解析
                 * @param {TronTransaction | Trc20Transaction} trans 交易数据
                 * @returns {TronTransBody} 交易体数据
                 */
                getTransBody(trans: TronTransaction | Trc20Transaction): Promise<TronTransBody>;

                /**
                 * 获取指定地址的合约余额
                 * @param {string} address  用户地址
                 * @param {string} contractAddress 合约地址
                 * @returns {string} 合约余额
                 */
                getContractBalance(address: string, contractAddress: string): Promise<string>;

                /**
                 * 获取指定地址的合约精度
                 * @param contractAddress 合约地址
                 * @returns {number} 合约精度
                 */
                getContractDecimal(contractAddress: string): Promise<number>;

                /**
                 * 获取指定txId的交易信息
                 * @param {string} txId 交易ID
                 * @returns {TronTransaction | Trc20Transaction} 交易信息
                 */
                getTrans(txId: string): Promise<TronTransaction | Trc20Transaction>;

                /**
                 * 获取交易详情，包含手续费等信息(只能获取已上链成功的交易)
                 * @param txId 交易ID
                 * @returns {TronTransInfoRes | null} 交易详情
                 */
                getTransInfo(txId: string): Promise<TronTransInfoRes | null>;

                /**
                 * 获取交易回执信息(只能获取已上链成功的交易)
                 * @param txId 交易ID
                 * @returns {TronTransReceipt | null} 交易回执
                 */
                getTransReceipt(txId: string): Promise<TronTransReceipt | null>;

                /**
                 * 创建 Transaction(POST)
                 * 注意：从创建交易到交易广播时有时效性的，时间为60秒
                 * @param req req#CreateTransactionReq
                 */
                createTransaction(req: CreateTransactionReq): Promise<TronTransaction>;
                /**
                 * 使用私钥签名交易(POST)，返回签名后的Transaction
                 * @param req req#GetTransactionSignReq
                 */
                getTransactionSign(req: GetTransactionSignReq): Promise<TronTransaction | Trc20Transaction>;
                /**
                 * 交易广播(POST)
                 * @param transactionWithSign 签名后的交易信息
                 */
                broadcastTransaction(transactionWithSign: TronTransaction | Trc20Transaction): Promise<BroadcastRes>;

                /**
                 * @deprecated
                 * 查询交易的Info信息，包含交易的fee信息，所在区块信息
                 * @param value 交易ID
                 */
                getTransactionInfoById(value: string): Promise<TronTransactionInfo>;

                /**
                 * 调用智能合约，返回 TRC20Transaction(转账时需要签名后广播完成交易)
                 * @param contractReq TriggerSmartContractReq
                 */
                triggerSmartContract(contractReq: TriggerSmartContractReq): Promise<TriggerSmartContractRes>;

                /**
                 * 查询指定地址的普通交易历史
                 * @param req req
                 */
                getCommonTransHistory(req: TronTransHistoryReq): Promise<CommonTransHistoryRes>;

                /**
                 * 查询指定地址的合约交易历史
                 * @param req
                 */
                getTrc20TransHistory(req: TronTransHistoryReq): Promise<Trc20TransHistoryRes>;

                /**
                 * 查询指定地址余额信息
                 * @param address address必须是TRON地址，以 T 开头
                 */
                getAccountBalance(address: string): Promise<TronAccountBalanceRes>;
            }
        }

        /**BCF */
        export namespace BCF {
            export type COMMON_RESPONSE<T> = {
                success: boolean;
                result: T;
            };
            export type GetAddressBalanceResp = { amount: string };
            export type GetAccountInfoResp = {
                address: string;
                publicKey: string;
                secondPublicKey: string;
                isDelegate: boolean;
                isAcceptVote: boolean;
                accountStatus: number;
            };
            export type GetBlockAverageFeeResp = { blockAveFee: string };

            export type GetAccountAssetResp = {
                address: string;
                assets: {
                    [magic: string]: {
                        [assetType: string]: {
                            sourceChainMagic: string;
                            assetType: string;
                            sourceChainName: string;
                            assetNumber: string;
                        };
                    };
                };
            };

            export type GetTransactionsByBrowserResp = {
                page: number;
                pageSize: number;
                total: number;
                hasMore: boolean;
                dataList: BFMetaNodeSDK.Basic.TransactionInBlockJSON[];
            };

            export type GetAssetsResp = {
                page: number;
                pageSzie: number;
                total: number;
                hasMore: boolean;
                dataList: GetAssetsData[];
            };

            export type GetAssetsData = {
                assetType: string;
                sourceChainMagic: string;
                applyAddress: string;
                sourceChainName: string;
                iconUrl: string;
            };

            export type GetAssetDetailsResp = {
                // 资产名称
                assetType: string;
                // 发行地址
                applyAddress: string;
                // 创世地址
                genesisAddress: string;
                // 归属链名称
                sourceChainName: string;
                // 发行总量
                issuedAssetPrealnum: string;
                // 当前总量
                remainAssetPrealnum: string;
                // 冻结主资产量
                frozenMainAssetPrealnum: string;
                // 发行时间
                dateCreated: number;
                // 跨链字段
                sourceChainMagic: string;
                // 图标url
                iconUrl: string;
            };

            export interface API {
                sdk: import("@bfmeta/node-sdk").BFMetaSDK;

                getAddressBalance(
                    address: string,
                    magic: string,
                    assetType: string,
                ): Promise<COMMON_RESPONSE<GetAddressBalanceResp>>;
                getAccountInfo(address: string): Promise<COMMON_RESPONSE<GetAccountInfoResp | null>>;
                getBlockAverageFee(): Promise<COMMON_RESPONSE<GetBlockAverageFeeResp>>;
                getAccountAsset(
                    address: string,
                ): Promise<BFChainWallet.BCF.COMMON_RESPONSE<BFChainWallet.BCF.GetAccountAssetResp>>;
                getAssets(page: number, pageSize: number, assetType?: string): Promise<COMMON_RESPONSE<GetAssetsResp>>;
                getAssetDetails(assetType: string): Promise<COMMON_RESPONSE<GetAssetDetailsResp>>;
            }
        }
    }
}
