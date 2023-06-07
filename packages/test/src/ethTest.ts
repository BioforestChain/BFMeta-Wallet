import { ABISupportFunctionEnum, WalletFactory } from "@bfmeta/wallet";
import { LoggerSymbol } from "@bfmeta/wallet";
import { ETH_TEST_USDT_ABI } from "@bfmeta/wallet-eth";
import { ModuleStroge, Injectable, sleep } from "@bnqkl/util-node";
const config: BFChainWallet.Config = require(`../../assets/config.json`);

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
    const walletFactory = new WalletFactory(config, moduleMap);
    const ethApi = walletFactory.EthApi;

    await sleep(0);
    // lastBlock();
    // getGasPrice();
    // getBalance();
    getContractBalanceAndDecimal();
    // commonTrans();
    // ERC20Trans();

    // sendTransaction();
    // getTrans();
    // getTransReceipt();
    // getTransReceiptNative();
    // getTransBody();

    // getAccountBalance();

    async function getAccountBalance() {
        const address = "0x5718D9C95D15a766E9DdE6579D7B93Eaa88a26b8";
        const result = await ethApi.getAccountBalance(address);
        console.log("========= 获取账户余额信息 =========");
        console.log(result);
    }

    async function lastBlock() {
        const lastBlock = await ethApi.getLastBlock();
        console.log("========= 获取最新区块信息 =========");
        console.log(lastBlock);
    }

    async function getBaseGas() {
        const baseGas = await ethApi.getBaseGas();
        console.log("========= 获取 baseGas =========");
        console.log(baseGas);
        return baseGas;
    }

    async function getGasPrice() {
        const gasPrice = await ethApi.getGasPrice();
        console.log("========= 获取 gasPrice =========");
        console.log(gasPrice);
    }

    async function getBalance() {
        const address = "0x2CE7Cc719b8d4DBA69d0ab002cD56808FC684311";
        const balance = await ethApi.getBalance(address);
        const fromWei = await ethApi.fromWei(balance);
        console.log("========= 获取账户 balance =========");
        console.log("balance : %s, fromWei : %s", balance, fromWei);
    }

    async function getContractBalanceAndDecimal() {
        const address = "0xce8C1E1b11e06FaE762f6E2b5264961C0C7A6a48";
        const contractAddress = "0x466595626333c55fa7d7Ad6265D46bA5fDbBDd99";
        const erc20Balance = await ethApi.getContractBalanceAndDecimal(address, contractAddress);
        console.log("========= 获取账户 ERC20BalanceAndDecimal =========");
        console.log(erc20Balance);
    }

    async function commonTrans() {
        console.log("========= ETH发起普通交易 =========");
        const from = "0x2CE7Cc719b8d4DBA69d0ab002cD56808FC684311";
        const to = "0x1b3B3fc528e7c65dB1524AA3b74C5Ce1aEb95a92";
        const privateKey = "bb98720c8f30386c12387ee14671c94c9403f666676ae450dc205b87c9e22418";

        const txCount = await ethApi.getTransCount(from);
        console.log("txCount : %s", txCount);

        const generalGas = (await getBaseGas()).generalGas;

        const gasPrice = await ethApi.getGasPrice();
        console.log("gasPrice : %s", gasPrice);

        const txObjcet = {
            from: from,
            to: to,
            value: "100000000",
            gas: generalGas,
            gasPrice: gasPrice,
            nonce: txCount,
        };

        const signTx = { trans: txObjcet, privateKey: privateKey };
        const rawTransaction = await ethApi.signTransaction(signTx);
        const txHash = await ethApi.sendSignedTransaction(rawTransaction);
        console.log("txHash : %s", txHash);
    }

    async function ERC20Trans() {
        console.log("========= ETH发起合约交易 =========");
        const from = "0x2CE7Cc719b8d4DBA69d0ab002cD56808FC684311";
        const to = "0x1b3B3fc528e7c65dB1524AA3b74C5Ce1aEb95a92";
        const privateKey = "bb98720c8f30386c12387ee14671c94c9403f666676ae450dc205b87c9e22418";

        // const contractAddress_usdt = "0x5AB6F31B29Fc2021436B3Be57dE83Ead3286fdc7";
        const contractAddress_link = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
        // const contractAddress_usdc = "0x466595626333c55fa7d7Ad6265D46bA5fDbBDd99";

        const txCount = await ethApi.getTransCount(from);
        console.log("txCount : %s", txCount);

        const gasPrice = await ethApi.getGasPrice();
        console.log("gasPrice : %s", gasPrice);

        const amount = "10000000000";
        const data = await ethApi.getContractTransData(from, to, amount, contractAddress_link);
        console.log("data : %s", data);

        const contractGas = await ethApi.getContractGas(from, to, amount, contractAddress_link);
        console.log("contractGas : %s", contractGas);

        const chainId = 5;
        const contracTxObjcet = {
            from: from,
            to: contractAddress_link,
            value: "0",
            gas: contractGas,
            gasPrice: gasPrice,
            nonce: txCount,
            data: data,
            chainId,
        };

        const signTx = { trans: contracTxObjcet, privateKey: privateKey };
        const rawTransaction = await ethApi.signTransaction(signTx);
        console.log("rawTransaction : %s", rawTransaction);
        const txHash = await ethApi.sendSignedTransaction(rawTransaction);
        console.log("txHash : %s", txHash);
        // const tx = ethApi.getTransactionFromSignature(rawTransaction);
        // console.log(tx);
        // console.log(tx.to.toString("hex"));
        // console.log(tx.value.toString("hex"));
        // console.log(tx.data.toString("hex"));
        // const txData = "0x" + tx.data.toString("hex");
        // const result = ethApi.decodeParameters<{ _to: string; _value: string }>(
        //     txData.substring(10),
        //     ABISupportFunctionEnum.transfer,
        // );
        // console.log(result);
    }

    async function getTrans() {
        const txHash = "0x6abe393ffce83c210a6ef0dd7312718a651c7c5fdb32be88c29665f775acf4d7";
        const contractHash = "0xcf02e7cfa3297b6a9f5a71464d7c8d1efa6c7f4e36adcf6f26c7186862b03517";
        const trans = await ethApi.getTrans(contractHash);
        console.log("========= 查询交易信息 =========");
        console.log(trans);

        console.log("========= input 解析 =========");
        const input = ethApi.parseInput(trans.input);
        console.log(input);
    }

    async function getTransReceipt() {
        const txHash = "0x6abe393ffce83c210a6ef0dd7312718a651c7c5fdb32be88c29665f775acf4d7";
        const contractHash = "0xcf02e7cfa3297b6a9f5a71464d7c8d1efa6c7f4e36adcf6f26c7186862b03517";
        const transReceipt = await ethApi.getTransReceipt(contractHash);
        console.log("========= 查询交易收据 =========");
        console.log(transReceipt);
    }

    async function getTransReceiptNative() {
        const txHash = "0x6abe393ffce83c210a6ef0dd7312718a651c7c5fdb32be88c29665f775acf4d7";
        const contractHash = "0xcf02e7cfa3297b6a9f5a71464d7c8d1efa6c7f4e36adcf6f26c7186862b03517";
        const transReceipt = await ethApi.getTransReceiptNative(contractHash);
        console.log("========= 查询交易收据 =========");
        console.log(transReceipt);
    }

    async function getTransBody() {
        const txHash = "0x6abe393ffce83c210a6ef0dd7312718a651c7c5fdb32be88c29665f775acf4d7";
        const contractHash = "0xcf02e7cfa3297b6a9f5a71464d7c8d1efa6c7f4e36adcf6f26c7186862b03517";
        const trans = await ethApi.getTrans(contractHash);
        const transReceipt = ethApi.getTransBody(trans);
        console.log("========= 获取交易体 =========");
        console.log(transReceipt);
    }
})();
