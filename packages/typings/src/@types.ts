declare namespace BFChainWallet {
    type HostType = {
        ip: string;
        port: number;
    };

    type Config = {
        bfchain?: {
            enable: boolean;
            host: HostType[];
            browserPath?: string;
        };
        ccchain?: {
            enable: boolean;
            host: HostType[];
            browserPath?: string;
        };
        bfm?: {
            enable: boolean;
            host: HostType[];
            browserPath?: string;
        };
        pmchain?: {
            enable: boolean;
            host: HostType[];
            browserPath?: string;
        };
        tron?: {
            enable: boolean;
            host: HostType[];
        };
        eth?: {
            enable: boolean;
            host: HostType[];
            testnet: boolean;
        };
        bsc?: {
            enable: boolean;
            host: HostType[];
            testnet: boolean;
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
    };

    /**以太坊 */
    namespace ETH {
        type TransactionBody = {
            nonce: number;
            from: string;
            to: string;
            value: string | number;
            gas: string | number;
            gasPrice: string | number;
            chainId?: number;
            data?: string;
        };

        type SignTransactionReq = {
            trans: TransactionBody;
            privateKey: string;
        };

        type BaseGas = {
            generalGas: number;
            contractGas: number;
        };

        type Contract20Balance = {
            balance: string;
            decimal: string;
        };

        type TransHistoryReq = {
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

        type NormalTransHistoryResult = {
            status: string;
            message: string;
            result: NormalTransResult[];
        };

        type NormalTransHistoryRes = {
            // 状态：0：无更多结果 或 错误请求，1：请求成功，可继续
            status: string;
            // 请求结果：成功时返回 "OK"
            message: string;
            result: NormalTransRes[];
        };

        type Erc20TransHistoryResult = {
            status: string;
            message: string;
            result: Erc20TransResult[];
        };

        type Erc20TransHistoryRes = {
            // 状态：0：无更多结果 或 错误请求，1：请求成功，可继续
            status: string;
            // 请求结果：成功时返回 "OK"
            message: string;
            result: Erc20TransRes[];
        };

        type NormalTransRes = {
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

        type Erc20TransRes = {
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

        type NormalTransResult = {
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

        type Erc20TransResult = {
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

        type AccountBalanceRes = { contractAddress: string; amount: string }[];

        interface API {
            /**
             * 以太坊获取最新区块信息
             */
            getLastBlock(): Promise<any>;

            /**
             * 以太坊指定区块高度，获取区块信息
             * @param num 区块高度
             */
            getBlock(num: number): Promise<any>;

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
            getContractBalanceAndDecimal(
                address: string,
                contractAddress: string,
            ): Promise<Contract20Balance>;

            /**
             * 以太坊获取指定用户地址交易数(已完成的交易)
             * @param address 用户地址
             */
            getTransactionCount(address: string): Promise<number>;

            /**
             * 以太坊签名交易数据
             * @param req 待签名的交易数据
             */
            signTransaction(req: SignTransactionReq): Promise<string>;

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
            getTransaction(txHash: string): Promise<any>;

            /**
             * 指定交易Hash，获取交易收据(已完成交易)
             * @param txHash 交易Hash
             */
            getTransactionReceipt(txHash: string): Promise<any>;

            getNormalTransHistory(req: TransHistoryReq): Promise<NormalTransHistoryRes>;

            getErc20TransHistory(req: TransHistoryReq): Promise<Erc20TransHistoryRes>;

            getAccountBalance(address: string): Promise<AccountBalanceRes>;
        }
    }

    /** 币安智能链 */
    namespace BSC {
        type BscTransHistoryReq = {
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

        type NormalTransHistoryResult = {
            status: string;
            message: string;
            result: NormalTransResult[];
        };

        type NormalTransHistoryRes = {
            // 状态：0：无更多结果 或 错误请求，1：请求成功，可继续
            status: string;
            // 请求结果：成功时返回 "OK"
            message: string;
            result: NormalTransRes[];
        };

        type Bep20TransHistoryResult = {
            status: string;
            message: string;
            result: Bep20TransResult[];
        };

        type Bep20TransHistoryRes = {
            // 状态：0：无更多结果 或 错误请求，1：请求成功，可继续
            status: string;
            // 请求结果：成功时返回 "OK"
            message: string;
            result: Bep20TransRes[];
        };

        type NormalTransRes = {
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

        type Bep20TransRes = {
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

        type NormalTransResult = {
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

        type Bep20TransResult = {
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
        interface API
            extends Omit<BFChainWallet.ETH.API, "getNormalTransHistory" | "getErc20TransHistory"> {
            getNormalTransHistory(req: BscTransHistoryReq): Promise<NormalTransHistoryRes>;
            getBep20TransHistory(req: BscTransHistoryReq): Promise<Bep20TransHistoryRes>;
        }
    }
    /** 波场 */
    namespace TRON {
        type TronAccountRes = {
            /** 账户地址，Base58check 或 HEX格式 */
            address: string;
            /** 账户余额, 比例 1000000:1 */
            balance: number;
            /** 创建时间 */
            create_time: number;
            account_resource: {
                frozen_balance_for_energy?: { forzen_balance: number; expire_time: number };
                lastest_consume_time_for_energy?: number;
            };
            owner_permission: {
                keys: { address: string; weight: number }[];
                threshold: number;
                permission_name: string;
            };
            active_permission: {
                operations: string;
                keys: { addrss: string; weight: number }[];
                threshold: number;
                id: number;
                type: string;
                permission_name: string;
            }[];
            witness_premission?: {
                keys: { address: string; weight: number }[];
                threshold: number;
                id: number;
                type: string;
                permission_name: string;
            };
            asset_optimized: boolean;
            // frozen_supply: [{frozen_balance: number, expire_time: number}];
            // frozen: [{frozen_balance: number, expire_time: number}];
            // allowance: number;
            // asset_issued_ID: string;
            // asset_issued_name: string;
            // free_asset_net_usageV2: [{value: number, key: string}];
            // is_witness: boolean;
            // assetV2: [{value: number, key: string}];
            // latest_consume_time: number;
            // latest_opration_time: string;
            // latest_consume_free_time: number;
        };

        type TronAccountResource = {
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

        type TronBlock = {
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

        type TransactionRawData = {
            contract: {
                parameter: {
                    value: { amount: number; owner_address: string; to_address: string };
                    type_url: string;
                };
                type: string;
            }[];
            ref_block_bytes: string;
            ref_block_hash: string;
            expiration: number;
            timestamp: number;
            /** 交易备注，必须为hex格式 */
            data?: string;
        };

        type TRC20TransactionRawData = {
            contract: {
                parameter: {
                    value: {
                        data: string;
                        owner_address: string;
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
            fee_limit: number;
            /** 交易备注，必须为hex格式 */
            data?: string;
        };

        type TronTransation = {
            /** 账户地址是否为 Base58check 格式，默认为 false，使用 Hex 地址 */
            visible?: boolean;
            /** 交易签名，签名后获得 */
            signature?: string[];
            /** 交易ID */
            txID: string;
            /** 交易json */
            raw_data: TransactionRawData;
            /** 交易 raw_data 通过 protobuf 序列化后的二进制，Hex格式 */
            raw_data_hex: string;
            ret?: { contractRet: string }[];
        };

        type TRC20Transation = {
            /** 账户地址是否为 Base58check 格式，默认为 false，使用 Hex 地址 */
            visible?: boolean;
            /** 交易签名，签名后获得 */
            signature?: string[];
            /** 交易ID */
            txID: string;
            /** 交易json */
            raw_data: TRC20TransactionRawData;
            /** 交易 raw_data 通过 protobuf 序列化后的二进制，Hex格式 */
            raw_data_hex: string;
            ret?: { contractRet: string }[];
        };

        type CreateTransactionReq = {
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

        type GetTransactionSignReq = {
            /** 未签名前的交易信息 */
            transaction: TronTransation | TRC20Transation;
            /** 用户私钥 */
            privateKey: string;
        };

        type BroadcastTransactionRes = {
            /** 交易是否成功: true: 成功，false: 失败 */
            result: boolean;
            /** 交易ID */
            txid: string;
            /** 交易失败时出现，显示为交易失败原因的code */
            code?: string;
            /** 信息 */
            message?: string;
        };

        type TronTransactionInfo = {
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

        type TriggerSmartContractReq = {
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

        type TriggerSmartContractRes = {
            /** 请求结果 */
            result: { result: boolean };
            energy_used?: number;
            constant_result?: string[];
            constant_result_decode?: string;
            transaction: TRC20Transation;
        };

        type TronContractParameter = {
            type: string;
            value: string | number;
        };

        type TronTransHistoryReq = {
            // 查询地址
            address: string;
            // 每页结果数，默认20，最大200
            limit: number;
            // 特定合约地址(适用于合约交易查询)
            contract_address?: string;
            // 翻页参数，指定上一页的 fingerprint
            fingerprint?: string;
        };

        type CommonTransByAddressResult = {
            // 是否成功；ture 成功， false失败
            success: boolean;
            // 交易历史集合
            data?: CommonTransHistoryResultData[];
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

        type CommonTransHistoryRes = {
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

        type Trc20TransHistoryResult = {
            // 是否成功；ture 成功， false失败
            success: boolean;
            // 交易历史集合
            data?: Trc20TransHistoryResultData[];
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

        type Trc20TransHistoryRes = {
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

        type CommonTransHistoryResultData = {
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

        type CommonTransHistoryResData = {
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

        type Trc20TransHistoryResultData = {
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

        type Trc20TransHistoryResData = {
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

        type TronAccountBalanceRes = {
            balance: number;
            trc20: { [key: string]: string }[];
            trc20List: { contractAddress: string; amount: string }[];
            createTime: number;
            freeNetLimit: number;
        };

        // 以下是新的类型

        type TronNewAccount = {
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

        type TronNewAccountWithMnemonic = {
            /** 助记词 */
            mnemonic: { phrase: string; path: string; locale: string };
            /** 私钥 */
            privateKey: string;
            /** 公钥 */
            publicKey: string;
            /** base58地址 */
            address: string;
        };

        type TronAccount = {
            /** 地址 */
            address: {
                base58: string;
                hex: string;
            };
            /** 余额 */
            balance: number;
        };

        type TronWebAccount = {
            /** hex格式地址 */
            address: string;
            /** 余额 */
            balance: number;
            /** 创建时间 */
            create_time: number;
        };

        type TronAccountResources = {
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

        type SendTrxReq = {
            from: string;
            to: string;
            amount: number;
        };

        type SendTrc20Req = {
            from: string;
            to: string;
            amount: string;
            contractAddress: string;
        };

        type TronTransactionRawData = {
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

        type Trc20TransactionRawData = {
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

        type TronTransaction = {
            visible: boolean;
            txID: string;
            raw_data: TronTransactionRawData[];
            raw_data_hex: string;
            signature?: string[];
        };

        type Trc20Transaction = {
            visible: boolean;
            txID: string;
            raw_data: Trc20TransactionRawData[];
            raw_data_hex: string;
            /** 签名 */
            signature?: string[];
        };

        type TronOptions = {
            /** 交易的手续费上限。可以根据交易的复杂性和网络情况选择适当的手续费上限。如果未提供此选项，默认手续费上限为 10 TRX。 */
            feeLimit: number;
            /** 调用合约时传输的 TRX 数量。对于 TRC20 转账，一般情况下传输的 TRX 数量为 0。 */
            callValue: number;
            /** 发送的代币数量。这是一个可选项，如果您要发送 TRC10 代币，可以使用此选项指定发送的代币数量 */
            tokenValue?: number;
            /** 代币的 tokenId。这是一个可选项，如果您要发送 TRC10 代币，可以使用此选项指定代币的 ID */
            tokenId?: number;
        };

        type SendTrc20Result = {
            result: boolean;
            transaction: Trc20Transaction;
        };

        type SendTransResult = {
            /** 交易ID */
            txid: string;
            /** 广播结果 */
            result?: boolean;
            /** 错误码，不是数字，而是错误信息 */
            code?: string;
            message?: string;
        };

        type BroadcastRes = {
            /** 广播结果 */
            result: boolean;
            /** 交易ID */
            txId: string;
            /** 返回消息 */
            message: string;
        };

        type TronTransReceipt = {
            /** txId */
            id: string;
            /** 手续费 */
            fee?: number;
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

        interface API {
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
             * @returns {number} trx余额
             */
            getTrxBalance(address: string): Promise<number>;

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
             * 获取指定地址的合约余额
             * @param address  用户地址
             * @param contract 合约地址
             * @returns {string} 合约余额
             */
            getContractBalance(address: string, contractAddress: string): Promise<string>;

            getTransaction(txId: string): Promise<any>;

            getTransactionReceipt(txId: string): Promise<any>;

            /**
             * 创建 Transaction(POST)
             * 注意：从创建交易到交易广播时有时效性的，时间为60秒
             * @param req req#CreateTransactionReq
             */
            createTransaction(req: CreateTransactionReq): Promise<TronTransation>;
            /**
             * 使用私钥签名交易(POST)，返回签名后的Transaction
             * @param req req#GetTransactionSignReq
             */
            getTransactionSign(
                req: GetTransactionSignReq,
            ): Promise<TronTransation | TRC20Transation>;
            /**
             * 交易广播(POST)
             * @param transactionWithSign 签名后的交易信息
             */
            broadcastTransaction(
                transactionWithSign: TronTransation | TRC20Transation,
            ): Promise<BroadcastTransactionRes>;

            /**
             * 根据交易ID，查询交易
             * @param value 交易ID，即交易哈希
             * @param visible 账户地址是否为 Base58check 格式，默认为 false，使用 Hex 地址
             */
            getTransactionById(value: string, visible?: boolean): Promise<TronTransation>;

            /**
             * 查询交易的Info信息，包含交易的fee信息，所在区块信息
             * @param value 交易ID
             */
            getTransactionInfoById(value: string): Promise<TronTransactionInfo>;

            /**
             * 调用智能合约，返回 TRC20Transaction(转账时需要签名后广播完成交易)
             * @param contractReq TriggerSmartContractReq
             */
            triggerSmartContract(
                contractReq: TriggerSmartContractReq,
            ): Promise<TriggerSmartContractRes>;

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

    /**BFCHAIN */
    namespace BFCHAIN {
        // type GetTransactionParam = {
        //     signature: string;
        //     minHeight: number;
        //     maxHeight: number;
        //     senderId: string;
        //     recipientId: string;
        //     type: string;
        // };
        // type GetBlockParam = {
        //     height: number;
        //     signature: string;
        // };
        // type PageModel = {
        //     page: number;
        //     pageSize: number;
        // };

        // type SendTransactionRepsonse =
        //     | {
        //           success: true;
        //       }
        //     | { success: false; errorCode: number; message: string };
        type COMMON_RESPONSE<T> = {
            success: boolean;
            result: T;
        };
        type GetAddressBalanceResp = { amount: string };
        type GetAccountInfoResp = {
            address: string;
            publicKey: string;
            secondPublicKey: string;
            isDelegate: boolean;
            isAcceptVote: boolean;
            accountStatus: number;
        };
        type GetBlockAverageFeeResp = { blockAveFee: string };

        type GetAccountAssetResp = {
            address: string;
            asset: {
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

        type GetTransactionsByBrowserResp = {
            page: number;
            pageSize: number;
            total: number;
            hasMore: boolean;
            dataList: BFMetaNodeSDK.Basic.TransactionInBlockJSON[];
        };

        type GetAssetsResp = {
            page: number;
            pageSzie: number;
            total: number;
            hasMore: boolean;
            dataList: GetAssetsData[];
        };

        type GetAssetsData = {
            assetType: string;
            sourceChainMagic: string;
            applyAddress: string;
            sourceChainName: string;
        };

        type GetAssetDetailsResp = {
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
        };

        interface BASEAPI {
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
            ): Promise<
                BFChainWallet.BFCHAIN.COMMON_RESPONSE<BFChainWallet.BFCHAIN.GetAccountAssetResp>
            >;
            getAssets(
                page: number,
                pageSize: number,
                assetType?: string,
            ): Promise<COMMON_RESPONSE<GetAssetsResp>>;
            getAssetDetails(assetType: string): Promise<COMMON_RESPONSE<GetAssetDetailsResp>>;
        }

        interface API extends BASEAPI {
            getTransactionsByBrowser(
                params: BFMetaNodeSDK.Basic.GetTransactionsParams,
            ): Promise<COMMON_RESPONSE<GetTransactionsByBrowserResp>>;
        }
    }
    /**CCCHAIN */
    namespace CCCHAIN {
        /**仅对充值提现而言应该两边接口一样 */
        interface API extends BFChainWallet.BFCHAIN.BASEAPI {}
    }
    /**BFM */
    namespace BFM {
        /**仅对充值提现而言应该两边接口一样 */
        interface API extends BFChainWallet.BFCHAIN.BASEAPI {}
    }
    /**PMCHAIN */
    namespace PMCHAIN {
        /**仅对充值提现而言应该两边接口一样 */
        interface API extends BFChainWallet.BFCHAIN.BASEAPI {}
    }
}
