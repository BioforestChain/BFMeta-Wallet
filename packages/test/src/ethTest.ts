import { WalletFactory } from "@bfmeta/wallet";
import { LoggerSymbol } from "@bfmeta/wallet";
import { ModuleStroge, Injectable, sleep } from "@bnqkl/util-node";
import * as ethereumjs from "ethereumjs-tx";
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
    // getBlock();
    // getGasPrice();
    // getBalance();
    // getERC20Balance();
    // getERC20BalanceAndDecimal();
    // commonTrans();
    ERC20Trans();

    // sendTransaction();
    // getTransaction();
    // getTransactionReceipt();
    // sendSignedTransaction();

    // test();

    // getAccountBalance();

    async function getAccountBalance() {
        const address = "0x5718D9C95D15a766E9DdE6579D7B93Eaa88a26b8";
        // const address = "0xce8C1E1b11e06FaE762f6E2b5264961C0C7A6a48";
        const result = await ethApi.getAccountBalance(address);
        console.log("========= 获取账户余额信息 =========");
        console.log(result);
        console.log("====================================");
    }

    async function lastBlock() {
        const lastBlock = await ethApi.getLastBlock();
        console.log("========= 获取最新区块信息 =========");
        console.log(lastBlock);
        console.log("====================================");
    }

    async function getBlock() {
        const num = 6;
        const block = await ethApi.getBlock(num);
        console.log("========= 获取指定区块信息 =========");
        console.log(block);
        console.log("====================================");
    }

    async function getBaseGas() {
        const baseGas = await ethApi.getBaseGas();
        console.log("========= 获取 baseGas =========");
        console.log(baseGas);
        console.log("====================================");
        return baseGas;
    }

    async function getGasPrice() {
        const gasPrice = await ethApi.getGasPrice();
        console.log("========= 获取 gasPrice =========");
        console.log(gasPrice);
        console.log("====================================");
    }

    async function getBalance() {
        const address = "0xce8C1E1b11e06FaE762f6E2b5264961C0C7A6a48";
        // const address = "0x551b1ae3aa1d19e7976f5fd8d69b412d595ee9c4";
        const balance = await ethApi.getBalance(address);
        const fromWei = await ethApi.fromWei(balance);
        console.log("========= 获取账户 balance =========");
        console.log("balance : %s, fromWei : %s", balance, fromWei);
        console.log("====================================");
    }

    async function getERC20BalanceAndDecimal() {
        const address = "0xce8C1E1b11e06FaE762f6E2b5264961C0C7A6a48";
        // const address = "0x551b1ae3aa1d19e7976f5fd8d69b412d595ee9c4";
        // const contractAddress = "0x5AB6F31B29Fc2021436B3Be57dE83Ead3286fdc7";
        // const contractAddress = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
        const contractAddress = "0x466595626333c55fa7d7Ad6265D46bA5fDbBDd99";
        const erc20Balance = await ethApi.getContractBalanceAndDecimal(address, contractAddress);
        console.log("========= 获取账户 ERC20BalanceAndDecimal =========");
        console.log(erc20Balance);
        console.log("====================================");
    }

    async function commonTrans() {
        console.log("========= ETH发起普通交易 =========");
        const to = "0xce8C1E1b11e06FaE762f6E2b5264961C0C7A6a48";
        const from = "0x551B1AE3AA1d19e7976F5Fd8D69B412D595eE9C4";
        // const privateKey = "7d672dd3c7e63a856e11a114464448f3f320e52d22e5268c23e485d11a25119a";
        const privateKey = "addf83b399e8432070963bb810e2417007f0bd6ba3ec2174fdc952a4215f1b82";

        const txCount = await ethApi.getTransactionCount(from);
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
        console.log("====================================");
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

        const txCount = await ethApi.getTransactionCount(from);
        console.log("txCount : %s", txCount);

        const gasPrice = await ethApi.getGasPrice();
        console.log("gasPrice : %s", gasPrice);

        const amount = 10000000000;
        const data = await ethApi.getContractTransData(from, to, amount, contractAddress_link);
        console.log("data : %s", data);

        const contractGas = await ethApi.getContractGas(from, to, amount, contractAddress_link);
        console.log("contractGas : %s", contractGas);

        const chainId = 3;
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
        const tx = ethApi.getTransactionFromSignature(rawTransaction, {
            chain: chainId,
        });
        console.log(tx);
        console.log(tx.to.toString("hex"));
        console.log(tx.value.toString("hex"));
        console.log("====================================");
    }

    async function getTransaction() {
        const txHash = "0xd588737afc4e92ab85dc35dfc34424abbf605b8941745e978d3b72e2176da719";
        const trans = await ethApi.getTransaction(txHash);
        console.log("========= 查询交易信息 =========");
        console.log("trans : %s", trans);
        console.log("====================================");
    }

    async function getTransactionReceipt() {
        const txHash = "0xd588737afc4e92ab85dc35dfc34424abbf605b8941745e978d3b72e2176da719";
        const transReceipt = await ethApi.getTransactionReceipt(txHash);
        console.log("========= 查询交易收据 =========");
        console.log("transReceipt : %s", transReceipt);
        console.log("====================================");
    }

    async function test() {
        const chainId = await ethApi.getChainId();
        const nodeInfo = await ethApi.getNodeInfo();
        const transCount = await ethApi.getTransactionCount(
            "0xce8C1E1b11e06FaE762f6E2b5264961C0C7A6a48",
        );
        console.log("========= 以太坊的一些接口测试 =========");
        console.log("ChainId : %s", chainId);
        console.log("nodeInfo : %s", nodeInfo);
        console.log("transCount : %s", transCount);
        console.log("====================================");
    }

    async function sendSignedTransaction2() {
        const address1 = "0xce8C1E1b11e06FaE762f6E2b5264961C0C7A6a48";
        const address2 = "0x551B1AE3AA1d19e7976F5Fd8D69B412D595eE9C4";
        const privateKey1 = "7d672dd3c7e63a856e11a114464448f3f320e52d22e5268c23e485d11a25119a";
        const privateKey2 = "addf83b399e8432070963bb810e2417007f0bd6ba3ec2174fdc952a4215f1b82";
        // 获取交易数量
        const txCount = await ethApi.getTransactionCount(address1);
        console.log("txCount : %s", txCount);

        // 准备交易数据
        const util = await ethApi.getWeb3Util();
        const txObjcet = {
            // nonce存在的问题
            // 如果是同一个地址发起两次交易，它的第一笔交易如果是还处于 pending 状态时，发起第二笔交易时再获取 txCount 是没有变化的，交易失败
            // 还是上面的情况，如果自行给 txCount 做 +1 的操作理论上是可行的，但是必须自己本地管理每个用户的 txCount，不然就会出现顺序问题
            // 如果自己不做 txCount 自增操作，还可以通过第二部交易增加 gasPrice 手续费的方式，可以进行交易，但是会直接覆盖第一笔交易记录
            nonce: util.toHex(txCount),
            from: address1,
            to: address2,
            value: util.toHex(util.toWei("0.1", "ether")),
            gasLimit: util.toHex(2100000),
            gasPrice: util.toHex(util.toWei("100", "gwei")),
        };

        const TX = ethereumjs.Transaction;
        const tx = new TX(txObjcet, { chain: "goerli", hardfork: "petersburg" });
        tx.sign(Buffer.from(privateKey1, "hex"));

        const serializedTx = tx.serialize();
        const raw = "0x" + serializedTx.toString("hex");
        console.log("raw : %s", raw);

        const transReceipt = await ethApi.sendSignedTransaction(raw);
        console.log("txHash : %s", transReceipt);
    }
})();
