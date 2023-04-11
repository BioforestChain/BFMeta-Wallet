import { WalletFactory } from "@bfmeta/wallet";
import { LoggerSymbol } from "@bfmeta/wallet";
import { ModuleStroge, Injectable, sleep } from "@bfchain/util";

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
            bsc: {
                enable: true,
                ips: ["192.168.150.7"],
                port: 8575,
                testnet: true,
            },
            tatum: {
                enable: true,
                host: "http://192.168.150.6/v3/blockchain/node",
                apiKey: "3510e2c4-4d62-487c-b20f-42c8679912b7",
                apiHost: "http://192.168.150.6/v3",
            },
            bscApiScan: {
                enable: true,
                apiHost: "http://192.168.150.7",
                apiKey: "5UZ63SSG3FZ5IRR7E5EDG141QET1HXS9GG",
            },
        },
        moduleMap,
    );
    const bscApi = walletFactory.BscApi;
    await sleep(0);

    // latestBlock();
    // getBlock();
    // getGasPrice();
    // getBalance();
    // getContractBalanceAndDecimal();

    // commonTrans();
    // BEP20Trans();

    // getTransaction();

    // getTransactionReceipt();

    getNormalTransHistory();
    // getBep20TransHistory();

    // getTokenInfo();
    // getAccountBalance();

    async function getAccountBalance() {
        const address = "0xce8C1E1b11e06FaE762f6E2b5264961C0C7A6a48";
        const result = await bscApi.getAccountBalance(address);
        console.log("========= 获取账户余额信息 =========");
        console.log(result);
        console.log("====================================");
    }

    async function getTokenInfo() {
        // const contractAddress = "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd";
        // const contractAddress = "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06";
        const contractAddress = "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee";
        const result = await bscApi.getTokenInfo(contractAddress);
        console.log("========= 获取合约基础信息 =========");
        console.log(result);
        console.log("====================================");
    }

    async function getNormalTransHistory() {
        const req: BFChainWallet.BSC.BscTransHistoryReq = {
            address: "0xce8C1E1b11e06FaE762f6E2b5264961C0C7A6a48",
            startblock: 0,
            endblock: 999999999,
            page: 1,
            offset: 5,
            sort: "desc",
        };
        const result = await bscApi.getNormalTransHistory(req);
        console.log("========= 获取普通交易历史信息 =========");
        console.log(result);
        console.log("====================================");
    }

    async function getBep20TransHistory() {
        const req: BFChainWallet.BSC.BscTransHistoryReq = {
            address: "0xce8C1E1b11e06FaE762f6E2b5264961C0C7A6a48",
            contractaddress: "string",
            // contractaddress: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
            startblock: 0,
            endblock: 999999999,
            page: 1,
            offset: 5,
            sort: "desc",
        };
        const result = await bscApi.getBep20TransHistory(req);
        console.log("========= 获取Bep20交易历史信息 =========");
        console.log(result);
        console.log("====================================");
    }

    async function latestBlock() {
        const lastBlock = await bscApi.getLastBlock();
        console.log("========= 获取区块信息 =========");
        console.log(lastBlock);
        console.log("====================================");
    }

    async function getBlock() {
        const num = 24607405;
        const block = await bscApi.getBlock(num);
        console.log("========= 获取指定区块信息 =========");
        console.log(block);
        console.log("====================================");
    }

    async function getGasPrice() {
        const gasPrice = await bscApi.getGasPrice();
        console.log("========= 获取 gasPrice =========");
        console.log(gasPrice);
        console.log("====================================");
    }

    async function getBaseGas() {
        const baseGas = await bscApi.getBaseGas();
        console.log("========= 获取 baseGas =========");
        console.log(baseGas);
        console.log("====================================");
        return baseGas;
    }

    async function getBalance() {
        const address = "0xce8C1E1b11e06FaE762f6E2b5264961C0C7A6a48";
        // const address = "0x551b1ae3aa1d19e7976f5fd8d69b412d595ee9c4";
        const balance = await bscApi.getBalance(address);
        const fromWei = await bscApi.fromWei(balance);
        console.log("========= 获取账户 balance =========");
        console.log("balance : %s, fromWei : %s", balance, fromWei);
        console.log("====================================");
    }

    async function getContractBalanceAndDecimal() {
        const address = "0xce8C1E1b11e06FaE762f6E2b5264961C0C7A6a48";
        // const address = "0x551b1ae3aa1d19e7976f5fd8d69b412d595ee9c4";
        const contracAddress = "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd";
        const erc20Balance = await bscApi.getContractBalanceAndDecimal(address, contracAddress);
        console.log("========= 获取账户 BEP20BalanceAndDecimal =========");
        console.log(erc20Balance);
        console.log("====================================");
    }

    async function commonTrans() {
        console.log("========= BSC 发起普通交易 =========");
        const from = "0xce8C1E1b11e06FaE762f6E2b5264961C0C7A6a48";
        const to = "0x551B1AE3AA1d19e7976F5Fd8D69B412D595eE9C4";
        const privateKey = "7d672dd3c7e63a856e11a114464448f3f320e52d22e5268c23e485d11a25119a";
        // const privateKey = "addf83b399e8432070963bb810e2417007f0bd6ba3ec2174fdc952a4215f1b82";

        const txCount = await bscApi.getTransactionCount(from);
        console.log("txCount : %s", txCount);

        const generalGas = (await getBaseGas()).generalGas;

        const gasPrice = await bscApi.getGasPrice();
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
        const rawTransaction = await bscApi.signTransaction(signTx);
        const txHash = await bscApi.sendSignedTransaction(rawTransaction);
        console.log("txHash : %s", txHash);
        console.log("====================================");
    }

    async function BEP20Trans() {
        console.log("========= BSC 发起合约交易 =========");
        const from = "0xce8C1E1b11e06FaE762f6E2b5264961C0C7A6a48";
        const to = "0xaed4EF39a1005Ba89BFc2A9A408F4Af79625b61f";
        const privateKey = "7d672dd3c7e63a856e11a114464448f3f320e52d22e5268c23e485d11a25119a";
        // const privateKey = "addf83b399e8432070963bb810e2417007f0bd6ba3ec2174fdc952a4215f1b82";
        // const contractAddress = "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd";
        const contractAddress = "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06";

        const txCount = await bscApi.getTransactionCount(from);
        console.log("txCount : %s", txCount);

        const amount = 1000000000;

        const contractGas = await bscApi.getContractGas(from, to, amount, contractAddress);
        console.log("contractGas : %s", contractGas);
        // const contractGas = (await getBaseGas()).contractGas;

        const gasPrice = await bscApi.getGasPrice();
        console.log("gasPrice : %s", gasPrice);

        const data = await bscApi.getContractTransData(from, to, amount, contractAddress);
        console.log("data : %s", data);

        const contracTxObjcet = {
            from: from,
            to: contractAddress,
            value: "0",
            gas: contractGas,
            gasPrice: gasPrice,
            nonce: txCount,
            data: data,
        };

        const signTx = { trans: contracTxObjcet, privateKey: privateKey };
        const rawTransaction = await bscApi.signTransaction(signTx);
        const txHash = await bscApi.sendSignedTransaction(rawTransaction);
        console.log("txHash : %s", txHash);
        console.log("====================================");
    }

    async function getTransaction() {
        // const txHash = "0xa06723e4ceb7df6c4312f4a0a064e815a039a447b56d17dfba1fcbb511145845";
        const txHash = "0x47f2fef80261aedf5f009c78119acb14f535794d15f5f065f6c421beea057d7f";
        const trans = await bscApi.getTransaction(txHash);
        console.log("========= 查询交易信息 =========");
        console.log(trans);
        console.log("====================================");
    }

    async function getTransactionReceipt() {
        // const txHash = "0xa06723e4ceb7df6c4312f4a0a064e815a039a447b56d17dfba1fcbb511145845";
        const txHash = "0x47f2fef80261aedf5f009c78119acb14f535794d15f5f065f6c421beea057d7f";

        const transReceipt = await bscApi.getTransactionReceipt(txHash);
        console.log("========= 查询交易收据 =========");
        console.log(transReceipt);
        console.log("====================================");
    }
})();
