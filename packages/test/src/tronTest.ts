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
const testAccountUsdt = "mom animal indicate soldier roof sheriff always anchor harvest swim cement bulb";
(async () => {
    const moduleMap = new ModuleStroge();
    moduleMap.set(LoggerSymbol, DemoLogger);
    const walletFactory = new WalletFactory(config, moduleMap);
    const tronApi = walletFactory.TronApi;
    await sleep(0);
    const address_THALJV8Nabkhy3s7im5g61pHaAdzSkUEkh = "THALJV8Nabkhy3s7im5g61pHaAdzSkUEkh";
    const privateKey_THALJV8Nabkhy3s7im5g61pHaAdzSkUEkh =
        "F714D4A373FAC3CCB331A466EA4022FBEF1F5357536E0A219DC32427F3B1B0C5";
    const address_TXfEi2DTRwpguV935X9akWuG4bzYXp7Xqh = "TXfEi2DTRwpguV935X9akWuG4bzYXp7Xqh";
    const privateKey_TXfEi2DTRwpguV935X9akWuG4bzYXp7Xqh =
        "1dd7e26534288ca17d2aed5f4653d6bb642d1c7fcc18f94eb961c968a6d2c79b";
    const address_TSECGE2YCPtzWn4wdV63J9wZw5Fj8n6dx5 = "TSECGE2YCPtzWn4wdV63J9wZw5Fj8n6dx5";
    const privateKey_TSECGE2YCPtzWn4wdV63J9wZw5Fj8n6dx5 =
        "3dd645997783d34f2cda84ed18668cd9de42f956b55019a75ef38e81ab9de37c";
    const address_empty = "THeHX3TmWWgRwYd7j8HBiaJHP5iXgaMtbZ";
    const privateKey_empty = "a42480f1f9a60009c57ec70cdcab44672edae18ad61e6136d8c59d4dd11fd9a0";

    const contract_usdt = "TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj";

    // transaction();
    // trc20Transaction();
    // getCommonTransHistory();
    getTrc20TransHistory();
    // getAccountBalance();

    // createAccount();
    // recoverAccount();
    // addressConvert();
    // isAddress();
    // getAccount();
    // getAccountResources();
    // signAndVerify();
    // getCurrentBlock();
    // getTrxBalance();
    // trxTrans();
    // trc20Trans();
    // getContractBalance();
    // getContractDecimal();
    // getTrans();
    // getTransInfo();
    // getTransReceipt();

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
        const mnemonic = "drill repair donate near knee science cloud unique until web dynamic weird";
        const account = await tronApi.recoverAccount(mnemonic);
        console.log(account);
    }

    async function addressConvert() {
        const mnemonic = "express slam merit craft victory dumb priority dog illness rail eyebrow apology";
        const account = await tronApi.recoverAccount(mnemonic);
        console.log(account);
        // const base58 = "TXfEi2DTRwpguV935X9akWuG4bzYXp7Xqh";
        // const hex = await tronApi.addressToHex(base58);
        // console.log(hex);
        // const _hex = "41edecb44919df66095ff647ec3754db2c1aa11eba";
        // const _base58 = await tronApi.addressToBase58(_hex);
        // console.log(_base58);
    }

    async function isAddress() {
        const base58 = "THALJV8Nabkhy3s7im5g61pHaAdzSkUEkh";
        // const hex = "414EE38CD8E412F5F25801964169E07740C5E7A630";
        const isAddress = await tronApi.isAddress(base58);
        console.log(isAddress);
    }

    async function getAccount() {
        const account = await tronApi.getAccount(address_TXfEi2DTRwpguV935X9akWuG4bzYXp7Xqh);
        console.log(account);
    }

    async function getAccountResources() {
        const account = await tronApi.getAccountResources(address_TXfEi2DTRwpguV935X9akWuG4bzYXp7Xqh);
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

    async function getTrxBalance() {
        const balance = await tronApi.getTrxBalance(address_THALJV8Nabkhy3s7im5g61pHaAdzSkUEkh);
        console.log(balance);
    }

    async function trxTrans() {
        // trx 精度为 6
        const amount = "10000000";
        const sendTrxReq: BFChainWallet.TRON.SendTrxReq = {
            from: address_TXfEi2DTRwpguV935X9akWuG4bzYXp7Xqh,
            to: address_THALJV8Nabkhy3s7im5g61pHaAdzSkUEkh,
            amount: amount,
        };
        console.log("====== 创建交易 ======");
        const trxTrans = await tronApi.sendTrx(sendTrxReq);
        console.log(trxTrans);
        console.log("====== 签名交易 ======");
        const signTrans = await tronApi.signTrx(trxTrans, privateKey_TXfEi2DTRwpguV935X9akWuG4bzYXp7Xqh);
        console.log(signTrans);
        console.log("====== 广播交易 ======");
        // await sleep(70);
        const result = await tronApi.broadcast(signTrans);
        console.log(result);
    }

    async function trc20Trans() {
        const amount = "1000000";
        const SendTrc20Req: BFChainWallet.TRON.SendTrc20Req = {
            from: address_TXfEi2DTRwpguV935X9akWuG4bzYXp7Xqh,
            to: address_THALJV8Nabkhy3s7im5g61pHaAdzSkUEkh,
            amount: amount,
            contractAddress: contract_usdt,
        };
        console.log("====== 创建trc20交易 ======");
        const trc20Trans = await tronApi.sendTrc20(SendTrc20Req);
        console.log(trc20Trans);
        console.log("====== 签名交易 ======");
        const signTrans = await tronApi.signTrc20(trc20Trans, privateKey_TXfEi2DTRwpguV935X9akWuG4bzYXp7Xqh);
        console.log(signTrans);
        console.log("====== 广播交易 ======");
        // await sleep(70);
        const transHex = await tronApi.transToPbHex(signTrans);
        const result = await tronApi.broadcastHexTrans(transHex);
        // const result = await tronApi.broadcast(signTrans);
        console.log(result);
    }

    async function getContractBalance() {
        const balance = await tronApi.getContractBalance(address_TXfEi2DTRwpguV935X9akWuG4bzYXp7Xqh, contract_usdt);
        console.log("====== 获取合约余额 ======");
        console.log(JSON.stringify(balance));
    }

    async function getContractDecimal() {
        const decimal = await tronApi.getContractDecimal(contract_usdt);
        console.log(decimal);
    }

    async function getTrans() {
        const contractTxId = "e473be87320b182c4da27497b6a8baff8c5de721bef1c9ba413a3726466cef7d";
        const txId = "f6fc748c8a2d2fd39a25aae99ddcdc49d02a346557d6901ce3264123bdf80283";
        const result = await tronApi.getTrans(contractTxId);
        console.log("====== 根据txid查询交易体 ======");
        console.log(result);
        console.log("====== 交易Json获取交易Body ======");
        const transBody = await tronApi.getTransBody(result);
        console.log(transBody);
    }

    async function getTransInfo() {
        const contractTxId = "e473be87320b182c4da27497b6a8baff8c5de721bef1c9ba413a3726466cef7d";
        const txId = "f6fc748c8a2d2fd39a25aae99ddcdc49d02a346557d6901ce3264123bdf80283";
        const result = await tronApi.getTransInfo(txId);
        console.log("====== 根据txid查询交易详情 ======");
        console.log(result);
    }

    async function getTransReceipt() {
        const contractTxId = "e473be87320b182c4da27497b6a8baff8c5de721bef1c9ba413a3726466cef7d";
        const txId = "f6fc748c8a2d2fd39a25aae99ddcdc49d02a346557d6901ce3264123bdf80283";
        const faileTxId = "70bf4e63a9dffe5daa6d0e1617a349c0279ce1513528f9ad06e253fb75b86157";
        const result = await tronApi.getTransReceipt(txId);
        console.log("====== 根据txid查询交易 ======");
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
            address: address_TXfEi2DTRwpguV935X9akWuG4bzYXp7Xqh,
            limit: 10,
            fingerprint: "",
        };
        const result = await tronApi.getCommonTransHistory(req);
        console.log("======== 获取用户地址所有交易 ========");
        console.log(result);
        console.log("====================================");
    }

    async function getTrc20TransHistory() {
        const req: BFChainWallet.TRON.TronTransHistoryReq = {
            address: address_TXfEi2DTRwpguV935X9akWuG4bzYXp7Xqh,
            contract_address: contract_usdt,
            limit: 10,
            fingerprint: "",
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
            };
            // 创建交易
            const transactionFirst: BFChainWallet.TRON.TronTransaction = await tronApi.createTransaction(txBody);
            console.log("============ 创建交易 ============");
            console.log(JSON.stringify(transactionFirst));
            console.log("====================================");
            // // 交易签名
            const signBody: BFChainWallet.TRON.GetTransactionSignReq = {
                transaction: transactionFirst,
                privateKey: privateKey.substr(2),
            };
            const transactionWithSign: BFChainWallet.TRON.TronTransaction | BFChainWallet.TRON.Trc20Transaction =
                await tronweb.trx.sign(signBody.transaction, signBody.privateKey);
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
        } catch (err) {
            console.log(err);
        }
    }

    async function getTransactionInfoById() {
        const value = "48d1d874f0c4a49c65bba6d9235ba277d5e94b886a28f88f5f5b33db7898dbe7";
        const transactionInfo = await tronApi.getTransactionInfoById(value);
        console.log("============ 交易INFO查询 ============");
        console.log(transactionInfo);
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
            // 进行trc20协议的 USDT 交易流程
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
                privateKey: privateKey.substr(2),
            };

            const transactionWithSign: BFChainWallet.TRON.Trc20Transaction | BFChainWallet.TRON.TronTransaction =
                await tronweb.trx.sign(signBody.transaction, signBody.privateKey);
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
        } catch (err) {
            console.log(err);
        }
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
