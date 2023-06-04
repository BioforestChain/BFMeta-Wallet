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
        const address = "0xce8C1E1b11e06FaE762f6E2b5264961C0C7A6a48";
        // const address = "0x551b1ae3aa1d19e7976f5fd8d69b412d595ee9c4";
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
        const to = "0xce8C1E1b11e06FaE762f6E2b5264961C0C7A6a48";
        const from = "0x551B1AE3AA1d19e7976F5Fd8D69B412D595eE9C4";
        // const privateKey = "7d672dd3c7e63a856e11a114464448f3f320e52d22e5268c23e485d11a25119a";
        const privateKey = "addf83b399e8432070963bb810e2417007f0bd6ba3ec2174fdc952a4215f1b82";

        const txCount = await ethApi.getTransCount(from);
        console.log("txCount : %s", txCount);

        const generalGas = (await getBaseGas()).generalGas;

        const gasPrice = await ethApi.getGasPrice();
        console.log("gasPrice : %s", gasPrice);

        const txObjcet = {
            from: from,
            to: to,
            value: "60000",
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
        // const from_1 = "0xce8C1E1b11e06FaE762f6E2b5264961C0C7A6a48";
        // const to_1 = "0x551B1AE3AA1d19e7976F5Fd8D69B412D595eE9C4";
        // const privateKey_1 = "7d672dd3c7e63a856e11a114464448f3f320e52d22e5268c23e485d11a25119a";
        // const privateKey = "addf83b399e8432070963bb810e2417007f0bd6ba3ec2174fdc952a4215f1b82";
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
            value: "31",
            gas: contractGas,
            gasPrice: gasPrice,
            nonce: txCount,
            data: data,
            chainId,
        };

        const signTx = { trans: contracTxObjcet, privateKey: privateKey };
        const rawTransaction = await ethApi.signTransaction(signTx);
        console.log("rawTransaction : %s", rawTransaction);
        // const txHash = await ethApi.sendSignedTransaction(rawTransaction);
        // console.log("txHash : %s", txHash);
        const tx = await ethApi.getTransactionFromSignature(rawTransaction);
        console.log(tx);
        console.log(tx.to.toString("hex"));
        console.log(tx.value.toString("hex"));
        console.log(tx.data.toString("hex"));
        const txData = "0x" + tx.data.toString("hex");
        const result = ethApi.decodeParameters<{ _to: string; _value: string }>(
            txData.substring(10),
            ABISupportFunctionEnum.transfer,
        );
        console.log(result);
    }

    async function getTrans() {
        const txHash = "0xd588737afc4e92ab85dc35dfc34424abbf605b8941745e978d3b72e2176da719";
        const trans = await ethApi.getTrans(txHash);
        console.log("========= 查询交易信息 =========");
        console.log("trans : %s", trans);
    }

    async function getTransReceipt() {
        const txHash = "0xd588737afc4e92ab85dc35dfc34424abbf605b8941745e978d3b72e2176da719";
        const transReceipt = await ethApi.getTransReceipt(txHash);
        console.log("========= 查询交易收据 =========");
        console.log("transReceipt : %s", transReceipt);
    }
})();
