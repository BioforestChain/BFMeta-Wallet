import { WalletFactory } from "@bfmeta/wallet";
import { LoggerSymbol } from "@bfmeta/wallet";
import { ModuleStroge, Injectable } from "@bfchain/util";

@Injectable(LoggerSymbol)
class DemoLogger {
    constructor() {}
    static log(...arg: any[]) {
        // 或者写文件什么的
        console.log(arg);
    }
}
(async () => {
    const moduleMap = new ModuleStroge();
    moduleMap.set(LoggerSymbol, DemoLogger);
    const walletFactory = new WalletFactory(
        {
            tron: { enable: true, ips: ["192.168.150.6"], port: 8090 },
            tatum: {
                enable: true,
                host: "http://192.168.150.6/v3/blockchain/node",
                apiKey: "3510e2c4-4d62-487c-b20f-42c8679912b7",
                apiHost: "http://192.168.150.6/v3",
            },
        },
        moduleMap,
    );
    const tronApi = walletFactory.TronApi;

    const tronHelper = tronApi.tronHelper;

    // generateAddress();
    // getNowBlock();
    // getBlockByNum();
    // getBlockById();
    // getAccount();
    // getAccountResource();
    // listNodes();
    // transaction();
    // easyTransfer();
    // getTransactionById();
    // getTransactionInfoById();
    // parameterEncode();
    // parameterDecode();
    // trc20Transaction();
    // parameterEncode2();
    // parameterDecode2();
    // getTrc20Balance();
    // getTRC20Decimal();
    getCommonTransHistory();
    getTrc20TransHistory();
    // getAccountBalance();

    async function getAccountBalance() {
        const address = "TZGGgtFmQjMzaeVdWfVHbRuNRSR2rHiCKT";
        // const address = "TRfB3t8q8KPXRvsvzvWomzpLvf8kVxBhgq";
        const result = await tronApi.getAccountBalance(address);
        console.log("======== 获取账户余额信息 ========");
        console.log(result);
        console.log("====================================");
    }

    async function getCommonTransHistory() {
        const req: BFChainWallet.TRON.TronTransHistoryReq = {
            address: "TZGGgtFmQjMzaeVdWfVHbRuNRSR2rHiCKT",
            limit: 2,
            fingerprint: "",
        };
        const result = await tronApi.getCommonTransHistory(req);
        console.log("======== 获取用户地址所有交易 ========");
        console.log(result);
        console.log("====================================");
    }

    async function getTrc20TransHistory() {
        const req: BFChainWallet.TRON.TronTransHistoryReq = {
            address: "TZGGgtFmQjMzaeVdWfVHbRuNRSR2rHiCKT",
            contract_address: "TBpfHbf7K8RZP4U4S9mDqGSMCBPBHkCMrf",
            limit: 2,
            fingerprint:
                "T6atjwJE3mif8Kyc1USumd2eYJ6cANGRRiukvTFSqeJP1d9aPKGahfdWdkGsRKhavvYtfjokPkEkvbwPJR9TYkVB8NimJz",
        };
        const result = await tronApi.getTrc20TransHistory(req);
        console.log("======== 获取用户地址合约交易 ========");
        console.log(result);
        console.log("====================================");
    }

    async function generateAddress() {
        const result: BFChainWallet.TRON.GenerateAddressRes = await tronApi.generateAddress();
        console.log("========生成私钥和账户地址========");
        console.log(result);
        console.log("====================================");
    }

    async function getNowBlock() {
        const nowBlock = await tronApi.getNowBlock();
        console.log("========获取最新区块信息========");
        console.log(nowBlock);
        console.log("====================================");
    }

    async function getBlockByNum() {
        const blockNum = 30506670;
        const block = await tronApi.getBlockByNum(blockNum);
        console.log("========通过高度查询区块内容========");
        console.log(block);
        console.log("====================================");
    }

    async function getBlockById() {
        const valuse = "0000000001d17eae2fd5a16f3c1689da44f91e9371115798a61fe455ce376b73";
        const blockById = await tronApi.getBlockById(valuse);
        console.log("========通过区块ID, 查询区块========");
        console.log(blockById);
        console.log("====================================");
    }

    async function listNodes() {
        // tslint:disable-next-line: no-shadowed-variable
        const listNodes = await tronApi.listNodes();
        console.log("=====查询api所在机器链接的节点列表=====");
        console.log(listNodes);
        console.log("====================================");
    }

    async function getAccount() {
        // const address = "TRfB3t8q8KPXRvsvzvWomzpLvf8kVxBhgq";
        const address = "TZGGgtFmQjMzaeVdWfVHbRuNRSR2rHiCKT";
        const visible = true;
        const account = await tronApi.getAccount(address, visible);
        console.log("========查询账号信息，包含余额========");
        console.log(account);
        console.log("====================================");
    }

    async function getAccountResource() {
        const address = "41ac18e577192d1353879e31c83d1be47d4b1070be";
        const resource = await tronApi.getAccountResource(address);
        console.log("======== 查询账户的资源信息 ========");
        console.log(resource);
        console.log("====================================");
    }

    async function transaction() {
        // 进行交易流程
        const txBody: BFChainWallet.TRON.CreateTransactionReq = {
            owner_address: "41ac18e577192d1353879e31c83d1be47d4b1070be",
            to_address: "41e82af0e99c9ed76b3100a643126948c03d27ef8e",
            amount: 2000000,
            extra_data: Buffer.from("这个是一个测试备注", "utf-8").toString("hex"),
        };
        // 创建交易
        const transactionFirst: BFChainWallet.TRON.TronTransation = await tronApi.createTransaction(
            txBody,
        );
        console.log("============ 创建交易 ============");
        console.log(JSON.stringify(transactionFirst));
        console.log("====================================");
        // 交易签名
        const signBody: BFChainWallet.TRON.GetTransactionSignReq = {
            transaction: transactionFirst,
            privateKey: "117f7ad8e97dff1e1a4d53db38d96235325c193e582dfa17e4a861bd81f27e70",
        };
        const transactionWithSign:
            | BFChainWallet.TRON.TronTransation
            | BFChainWallet.TRON.TRC20Transation = await tronApi.getTransactionSign(signBody);
        console.log("============ 交易签名 ============");
        console.log(JSON.stringify(transactionWithSign));
        console.log("====================================");
        // 交易广播
        const broadcastResult: BFChainWallet.TRON.BroadcastTransactionRes = await tronApi.broadcastTransaction(
            transactionWithSign,
        );
        console.log("============ 交易广播 ============");
        console.log(JSON.stringify(broadcastResult));
        console.log("====================================");
    }

    async function getTransactionById() {
        // const value = "6452d237f7465f27c26403b5f9961d824b0ffbc6c5051ef5a3ac4067d85528c2";
        const value = "2169f832dabbed1148d414bcf7883582d9d65010d4e5c1f802cbf13f61ba7a0d";
        // const visible = false;
        const transactionById = await tronApi.getTransactionById(value);
        console.log("============ 交易查询 ============");
        console.log(JSON.stringify(transactionById));
        console.log("====================================");
    }

    async function getTransactionInfoById() {
        // const value = "6452d237f7465f27c26403b5f9961d824b0ffbc6c5051ef5a3ac4067d85528c2";
        const value = "48d1d874f0c4a49c65bba6d9235ba277d5e94b886a28f88f5f5b33db7898dbe7";
        const transactionInfo = await tronApi.getTransactionInfoById(value);
        console.log("============ 交易INFO查询 ============");
        console.log(transactionInfo);
        console.log("====================================");
    }

    async function parameterEncode() {
        // const input = [
        //     { type: "address", value: "412ed5dd8a98aea00ae32517742ea5289761b2710e" },
        //     { type: "uint256", value: "50000000000" },
        // ]
        //0000000000000000000000002ed5dd8a98aea00ae32517742ea5289761b2710e0000000000000000000000000000000000000000000000000000000ba43b7400
        const input = [
            { type: "address", value: "41e82af0e99c9ed76b3100a643126948c03d27ef8e" },
            { type: "uint256", value: "100" },
        ];

        const parameterEncode = await tronHelper.encodeParameter(input);
        console.log("============ 合约参数编码 ============");
        console.log(parameterEncode);
        console.log("====================================");
    }

    async function parameterDecode() {
        const data =
            "a9059cbb000000000000000000000000e82af0e99c9ed76b3100a643126948c03d27ef8e00000000000000000000000000000000000000000000000000000000000f4240";
        const types = ["address", "uint256"];
        const result = await tronHelper.decodeParameter(types, data, true);
        console.log("============ 合约参数解码 ============");
        console.log(result);
        console.log("====================================");
    }

    async function trc20Transaction() {
        // 进行trc20协议的 USTD 交易流程
        const contractReq: BFChainWallet.TRON.TriggerSmartContractReq = {
            owner_address: "41ac18e577192d1353879e31c83d1be47d4b1070be",
            contract_address: "41ea51342dabbb928ae1e576bd39eff8aaf070a8c6",
            function_selector: "transfer(address,uint256)",
            input: [
                { type: "address", value: "41e82af0e99c9ed76b3100a643126948c03d27ef8e" },
                { type: "uint256", value: 100000 },
            ],
            fee_limit: 10000000,
            call_value: 0,
        };
        // 创建交易
        const contractTx: BFChainWallet.TRON.TriggerSmartContractRes = await tronApi.triggerSmartContract(
            contractReq,
        );
        console.log("============ 创建交易 ============");
        console.log(JSON.stringify(contractTx));
        console.log("====================================");
        // 交易签名

        if (!contractTx.result.result) {
            console.log("创建交易失败: contractTx", contractTx);
            return;
        }
        const signBody: BFChainWallet.TRON.GetTransactionSignReq = {
            transaction: contractTx.transaction,
            privateKey: "117f7ad8e97dff1e1a4d53db38d96235325c193e582dfa17e4a861bd81f27e70",
        };

        const transactionWithSign:
            | BFChainWallet.TRON.TRC20Transation
            | BFChainWallet.TRON.TronTransation = await tronApi.getTransactionSign(signBody);
        console.log("============ 交易签名 ============");
        console.log(JSON.stringify(transactionWithSign));
        console.log("====================================");
        // 交易广播
        const broadcastResult: BFChainWallet.TRON.BroadcastTransactionRes = await tronApi.broadcastTransaction(
            transactionWithSign,
        );
        console.log("============ 交易广播 ============");
        console.log(JSON.stringify(broadcastResult));
        console.log("====================================");
    }

    async function parameterEncode2() {
        const input = [{ type: "address", value: "41ac18e577192d1353879e31c83d1be47d4b1070be" }];
        const parameterEncode = await tronHelper.encodeParameter(input);
        console.log("============ 合约参数编码 ============");
        console.log(parameterEncode);
        console.log("====================================");
    }

    async function parameterDecode2() {
        // const data = "0x0000000000000000000000000000000000000000000000000000000ba438665c";
        const data = "0x0000000000000000000000000000000000000000000000000000000000000006";
        const types = ["uint256"];
        const result = await tronHelper.decodeParameter(types, data, false);

        // 直接转换为数字
        console.log(result.toString());
        console.log("============ 合约参数解码 ============");
        console.log(result);
        console.log("====================================");
    }

    async function getTrc20Balance() {
        const contractReq: BFChainWallet.TRON.TriggerSmartContractReq = {
            owner_address: "41ac18e577192d1353879e31c83d1be47d4b1070be",
            contract_address: "41ea51342dabbb928ae1e576bd39eff8aaf070a8c6",
            function_selector: "balanceOf(address)",
            input: [{ type: "address", value: "41ac18e577192d1353879e31c83d1be47d4b1070be" }],
        };
        // 获取TRC20代币余额
        const contractTx: BFChainWallet.TRON.TriggerSmartContractRes = await tronApi.triggerSmartContract(
            contractReq,
        );
        console.log("============ TRC20代币余额 ============");
        console.log(JSON.stringify(contractTx));
        console.log("====================================");
    }

    async function getTRC20Decimal() {
        const contractReq: BFChainWallet.TRON.TriggerSmartContractReq = {
            owner_address: "41ac18e577192d1353879e31c83d1be47d4b1070be",
            contract_address: "41ea51342dabbb928ae1e576bd39eff8aaf070a8c6",
            function_selector: "decimals()",
            input: [{ type: "address", value: "41ac18e577192d1353879e31c83d1be47d4b1070be" }],
        };
        // 获取TRC20代币精度
        const contractTx: BFChainWallet.TRON.TriggerSmartContractRes = await tronApi.triggerSmartContract(
            contractReq,
        );
        console.log("============ TRC20代币精度 ============");
        console.log(JSON.stringify(contractTx));
        console.log("====================================");
    }
})();
