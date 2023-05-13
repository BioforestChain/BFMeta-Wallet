import { WalletFactory } from "@bfmeta/wallet";
import { LoggerSymbol } from "@bfmeta/wallet";
import { ModuleStroge, Injectable } from "@bnqkl/util-node";
const config: BFChainWallet.Config = require(`../../assets/config.json`);
@Injectable(LoggerSymbol)
class DemoLogger {
    constructor() {}
    static log(...arg: any[]) {
        // 或者写文件什么的
        console.log(arg);
    }
}
const testAccountTrx = "mistake kitten proud latin end jump gun flash grid method pet until";
const testAccountUsdt =
    "mom animal indicate soldier roof sheriff always anchor harvest swim cement bulb";
(async () => {
    const moduleMap = new ModuleStroge();
    moduleMap.set(LoggerSymbol, DemoLogger);
    const walletFactory = new WalletFactory(config, moduleMap);
    const tronApi = walletFactory.TronApi;

    const tronHelper = tronApi.tronHelper;
    const address_THALJV8Nabkhy3s7im5g61pHaAdzSkUEkh = "THALJV8Nabkhy3s7im5g61pHaAdzSkUEkh";
    const privateKey_THALJV8Nabkhy3s7im5g61pHaAdzSkUEkh =
        "F714D4A373FAC3CCB331A466EA4022FBEF1F5357536E0A219DC32427F3B1B0C5";
    const address_TXfEi2DTRwpguV935X9akWuG4bzYXp7Xqh = "TXfEi2DTRwpguV935X9akWuG4bzYXp7Xqh";
    const privateKey_TXfEi2DTRwpguV935X9akWuG4bzYXp7Xqh =
        "1dd7e26534288ca17d2aed5f4653d6bb642d1c7fcc18f94eb961c968a6d2c79b";
    const address_empty = "TSECGE2YCPtzWn4wdV63J9wZw5Fj8n6dx5";
    const privateKey_empty = "3dd645997783d34f2cda84ed18668cd9de42f956b55019a75ef38e81ab9de37c";

    // transaction();
    // getTransactionById();
    // getTransactionInfoById();
    // parameterEncode();
    // parameterDecode();
    // trc20Transaction();
    // parameterEncode2();
    // parameterDecode2();
    // getTrc20Balance();
    // getTRC20Decimal();
    // getCommonTransHistory();
    // getTrc20TransHistory();
    // getAccountBalance();

    // createAccount();
    // recoverAccount();
    // addressConvert();
    // isAddress();
    // getAccountV2();
    // getAccountResourceV2();
    // signAndVerify();
    // getCurrentBlock();
    // getBalanceV2();
    trxTrans();

    async function createAccount() {
        const needMnemonic = true;
        if (needMnemonic) {
            const account = await tronApi.createAccountWithMnemonic();
            console.log(account);
        } else {
            const newAccount = await tronApi.createAccount();
            console.log(newAccount);
            // console.log("新账号地址：", newAccount.address.base58);
            // console.log("新账号私钥：", newAccount.privateKey);
        }
    }
    async function recoverAccount() {
        const mnemonic =
            "drill repair donate near knee science cloud unique until web dynamic weird";
        const account = await tronApi.recoverAccount(mnemonic);
        console.log(account);
    }

    async function addressConvert() {
        const base58 = "TXfEi2DTRwpguV935X9akWuG4bzYXp7Xqh";
        const hex = await tronApi.addressToHex(base58);
        console.log(hex);
        const _hex = "41edecb44919df66095ff647ec3754db2c1aa11eba";
        const _base58 = await tronApi.addressToBase58(_hex);
        console.log(_base58);
    }

    async function isAddress() {
        const base58 = "THALJV8Nabkhy3s7im5g61pHaAdzSkUEkh";
        // const hex = "414EE38CD8E412F5F25801964169E07740C5E7A630";
        const isAddress = await tronApi.isAddress(base58);
        console.log(isAddress);
    }

    async function getAccountV2() {
        const account = await tronApi.getAccountV2(address_THALJV8Nabkhy3s7im5g61pHaAdzSkUEkh);
        console.log(account);
    }

    async function getAccountResourceV2() {
        const account = await tronApi.getAccountResourceV2(
            address_THALJV8Nabkhy3s7im5g61pHaAdzSkUEkh,
        );
        console.log(account);
    }

    async function signAndVerify() {
        const message = "helloworld";
        const privateKey = "F714D4A373FAC3CCB331A466EA4022FBEF1F5357536E0A219DC32427F3B1B0C5";
        const signature = await tronApi.signMessageV2(message, privateKey);
        console.log(signature);
        const verify = await tronApi.verifyMessageV2(message, signature);
        console.log(verify);
    }

    async function getCurrentBlock() {
        const block = await tronApi.getCurrentBlock();
        console.log(block);
    }

    async function getBalanceV2() {
        const balance = await tronApi.getBalanceV2(address_THALJV8Nabkhy3s7im5g61pHaAdzSkUEkh);
        console.log(balance);
    }

    async function trxTrans() {
        // trx 精度为 6
        const amount = 10000000;
        const sendTrxReq: BFChainWallet.TRON.SendTrxReq = {
            from: address_empty,
            to: address_TXfEi2DTRwpguV935X9akWuG4bzYXp7Xqh,
            amount: amount,
        };
        const trxTrans = await tronApi.sendTrx(sendTrxReq);
        console.log("====== 创建交易 ======");
        console.log(trxTrans);
        const signTrans = await tronApi.sign(trxTrans, privateKey_empty);
        console.log("====== 签名交易 ======");
        console.log(signTrans);
        // await sleep(70);
        const result = await tronApi.sendTransaction(signTrans);
        console.log("====== 广播交易 ======");
        console.log(result);
    }

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

    async function transaction() {
        try {
            // 进行交易流程
            const tronweb = tronApi.tronWeb;
            const { privateKey, publicKey, address } = tronweb.fromMnemonic(testAccountTrx);
            const { address: addressUsdt } = tronweb.fromMnemonic(testAccountUsdt);
            const addressHex = tronweb.address.toHex(address);
            const addressUsdtHex = tronweb.address.toHex(addressUsdt);
            console.log(`privateKey ${privateKey}`);
            console.log(`publicKey ${publicKey}`);
            console.log(`address ${address}`);
            console.log(`addressHex ${addressHex}`);
            const txBody: BFChainWallet.TRON.CreateTransactionReq = {
                owner_address: addressHex,
                to_address: addressUsdtHex,
                amount: 2000000,
                extra_data: Buffer.from("这个是一个测试备注", "utf-8").toString("hex"),
            };
            // 创建交易
            const transactionFirst: BFChainWallet.TRON.TronTransation =
                await tronApi.createTransaction(txBody);
            console.log("============ 创建交易 ============");
            console.log(JSON.stringify(transactionFirst));
            console.log("====================================");
            // // 交易签名
            const signBody: BFChainWallet.TRON.GetTransactionSignReq = {
                transaction: transactionFirst,
                privateKey: privateKey.substr(2),
            };
            const transactionWithSign:
                | BFChainWallet.TRON.TronTransation
                | BFChainWallet.TRON.TRC20Transation = await tronweb.trx.sign(
                signBody.transaction,
                signBody.privateKey,
            );
            console.log("============ 交易签名 ============");
            console.log(JSON.stringify(transactionWithSign));
            console.log("====================================");
            // 交易广播
            const broadcastResult: BFChainWallet.TRON.BroadcastTransactionRes =
                await tronApi.broadcastTransaction(transactionWithSign);
            console.log("============ 交易广播 ============");
            console.log(JSON.stringify(broadcastResult));
            console.log("====================================");
        } catch (err) {
            console.log(err);
        }
    }

    async function getTransactionById() {
        const value = "2169f832dabbed1148d414bcf7883582d9d65010d4e5c1f802cbf13f61ba7a0d";
        const transactionById = await tronApi.getTransactionById(value);
        console.log("============ 交易查询 ============");
        console.log(JSON.stringify(transactionById));
        console.log("====================================");
    }

    async function getTransactionInfoById() {
        const value = "48d1d874f0c4a49c65bba6d9235ba277d5e94b886a28f88f5f5b33db7898dbe7";
        const transactionInfo = await tronApi.getTransactionInfoById(value);
        console.log("============ 交易INFO查询 ============");
        console.log(transactionInfo);
        console.log("====================================");
    }

    async function parameterEncode() {
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
        try {
            const tronweb = tronApi.tronWeb;
            const { privateKey, publicKey, address } = tronweb.fromMnemonic(testAccountUsdt);
            const { address: addressTrx } = tronweb.fromMnemonic(testAccountTrx);
            const addressHex = tronweb.address.toHex(address);
            const addressTrxHex = tronweb.address.toHex(addressTrx);
            console.log(`privateKey ${privateKey}`);
            console.log(`publicKey ${publicKey}`);
            console.log(`address ${address}`);
            console.log(`addressHex ${addressHex}`);
            // 进行trc20协议的 USTD 交易流程
            const contractReq: BFChainWallet.TRON.TriggerSmartContractReq = {
                owner_address: addressHex,
                contract_address: "41ea51342dabbb928ae1e576bd39eff8aaf070a8c6",
                function_selector: "transfer(address,uint256)",
                input: [
                    { type: "address", value: addressTrxHex },
                    { type: "uint256", value: 100000 },
                ],
                fee_limit: 10000000,
                call_value: 0,
            };
            // 创建交易
            const contractTx: BFChainWallet.TRON.TriggerSmartContractRes =
                await tronApi.triggerSmartContract(contractReq);
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
                privateKey: privateKey.substr(2),
            };

            const transactionWithSign:
                | BFChainWallet.TRON.TRC20Transation
                | BFChainWallet.TRON.TronTransation = await tronweb.trx.sign(
                signBody.transaction,
                signBody.privateKey,
            );
            console.log("============ 交易签名 ============");
            console.log(JSON.stringify(transactionWithSign));
            console.log("====================================");
            // 交易广播
            const broadcastResult: BFChainWallet.TRON.BroadcastTransactionRes =
                await tronApi.broadcastTransaction(transactionWithSign);
            console.log("============ 交易广播 ============");
            console.log(JSON.stringify(broadcastResult));
            console.log("====================================");
        } catch (err) {
            console.log(err);
        }
    }

    async function parameterEncode2() {
        const input = [{ type: "address", value: "41ac18e577192d1353879e31c83d1be47d4b1070be" }];
        const parameterEncode = tronHelper.encodeParameter(input);
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
        const contractTx: BFChainWallet.TRON.TriggerSmartContractRes =
            await tronApi.triggerSmartContract(contractReq);
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
        const contractTx: BFChainWallet.TRON.TriggerSmartContractRes =
            await tronApi.triggerSmartContract(contractReq);
        console.log("============ TRC20代币精度 ============");
        console.log(JSON.stringify(contractTx));
        console.log("====================================");
    }

    /**
     * 休眠函数sleep
     * @param ms
     * @returns
     */
    function sleep(s: number) {
        console.log(`开始等待，等待时间为 ${s} s`);
        return new Promise((resolve) => setTimeout(resolve, s * 1000));
    }
})();
