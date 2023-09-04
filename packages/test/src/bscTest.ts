import { LoggerSymbol } from "@bfmeta/wallet";
import { ABISupportFunctionEnum, WalletFactory } from "@bfmeta/wallet";
import { BSC_BEP20_ABI } from "@bfmeta/wallet-bsc";
import { ModuleStroge, Injectable, sleep } from "@bnqkl/util-node";
const config: BFChainWallet.Config = require(`../../assets/config.json`);
import type { AbiItem } from "web3-utils";

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
    const bscApi = walletFactory.BscApi;
    await sleep(0);

    // latestBlock();
    getGasPrice();
    // getBalance();
    // getContractBalanceAndDecimal();

    // commonTrans();
    // BEP20Trans();

    // getTrans();
    // getTransReceipt();
    // getTransReceiptNative();
    // getTransBodyFromTrans();
    // getTransBodyFromSign();
    // const sign =
    //     "0x02f8af0582019f827c7684596927ec8286f2942e8d98fd126a32362f2bd8aa427e59a1ec63f78080b844a9059cbb000000000000000000000000785f8ee0c83ab7cf398008d0428233fc177355210000000000000000000000000000000000000000000000000000000000b8a1a0c080a021feee594dffa2c6450c01d35ad2bff36d4576d822e6148e46b08ce57b5c6b9ba0122d751de4e346d848ce16d2a8c3a64e13840d8a27820a353ca2e57e848ba496";
    // console.log(sign);
    // const z = bscApi.getTransactionFromSignature(sign);
    // console.log(z);

    // getNormalTransHistory();
    // getBep20TransHistory();

    // getAccountBalance();
    // getTokenInfo();
    // signFunction();

    async function signFunction() {
        const methodABI: AbiItem | undefined = BSC_BEP20_ABI.find((a: any) => {
            return a.type === "function" && a.name === "transfer";
        });
        if (methodABI) {
            console.log(methodABI.inputs);
            const result = bscApi.web3.eth.abi.encodeFunctionSignature(methodABI);
            console.log(result);
        }
    }

    async function getAccountBalance() {
        const address = "0xce8C1E1b11e06FaE762f6E2b5264961C0C7A6a48";
        const result = await bscApi.getAccountBalance(address);
        console.log("========= 获取账户余额信息 =========");
        console.log(result);
    }

    async function getTokenInfo() {
        // const contractAddress = "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd";
        // const contractAddress = "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06";
        const contractAddress = "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee";
        const result = await bscApi.getTokenInfo(contractAddress);
        console.log("========= 获取合约基础信息 =========");
        console.log(result);
    }

    async function getNormalTransHistory() {
        const req: BFChainWallet.BSC.BscTransHistoryReq = {
            address: "0xce8C1E1b11e06FaE762f6E2b5264961C0C7A6a48",
            startblock: 0,
            endblock: 999999999,
            page: 1,
            offset: 20,
            sort: "desc",
        };
        const result = await bscApi.getNormalTransHistory(req);
        console.log("========= 获取普通交易历史信息 =========");
        console.log(result);
    }

    async function getBep20TransHistory() {
        const req: BFChainWallet.BSC.BscTransHistoryReq = {
            address: "0xce8C1E1b11e06FaE762f6E2b5264961C0C7A6a48",
            contractaddress: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
            startblock: 0,
            endblock: 999999999,
            page: 1,
            offset: 5,
            sort: "desc",
        };
        const result = await bscApi.getBep20TransHistory(req);
        console.log("========= 获取Bep20交易历史信息 =========");
        console.log(result);
    }

    async function latestBlock() {
        const lastBlock = await bscApi.getLastBlock();
        console.log("========= 获取区块信息 =========");
        console.log(lastBlock);
    }

    async function getGasPrice() {
        const gasPrice = await bscApi.getGasPrice();
        console.log("========= 获取 gasPrice =========");
        console.log(gasPrice);
    }

    async function getBaseGas() {
        const baseGas = await bscApi.getBaseGas();
        console.log("========= 获取 baseGas =========");
        console.log(baseGas);
        return baseGas;
    }

    async function getBalance() {
        const address = "0xce8C1E1b11e06FaE762f6E2b5264961C0C7A6a48";
        // const address = "0x551b1ae3aa1d19e7976f5fd8d69b412d595ee9c4";
        const balance = await bscApi.getBalance(address);
        const fromWei = await bscApi.fromWei(balance);
        console.log("========= 获取账户 balance =========");
        console.log("balance : %s, fromWei : %s", balance, fromWei);
    }

    async function getContractBalanceAndDecimal() {
        const address = "0xce8C1E1b11e06FaE762f6E2b5264961C0C7A6a48";
        // const address = "0x551b1ae3aa1d19e7976f5fd8d69b412d595ee9c4";
        const contracAddress = "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd";
        const erc20Balance = await bscApi.getContractBalanceAndDecimal(address, contracAddress);
        console.log("========= 获取账户 ContractBalanceAndDecimal =========");
        console.log(erc20Balance);
    }

    async function commonTrans() {
        console.log("========= BSC 发起普通交易 =========");
        // const from = "0xce8C1E1b11e06FaE762f6E2b5264961C0C7A6a48";
        // const to = "0x2CE7Cc719b8d4DBA69d0ab002cD56808FC684311";
        // const privateKey = "7d672dd3c7e63a856e11a114464448f3f320e52d22e5268c23e485d11a25119a";
        // // const privateKey = "bb98720c8f30386c12387ee14671c94c9403f666676ae450dc205b87c9e22418";

        const from = "0x2CE7Cc719b8d4DBA69d0ab002cD56808FC684311";
        const to = "0x1b3B3fc528e7c65dB1524AA3b74C5Ce1aEb95a92";
        const privateKey = "bb98720c8f30386c12387ee14671c94c9403f666676ae450dc205b87c9e22418";

        const txCount = await bscApi.getTransCount(from);
        console.log("txCount : %s", txCount);

        const generalGas = (await getBaseGas()).generalGas;

        const gasPrice = await bscApi.getGasPrice();
        console.log("gasPrice : %s", gasPrice);

        const txObjcet = {
            from: from,
            to: to,
            value: "50000000",
            gas: generalGas,
            gasPrice: gasPrice,
            nonce: txCount,
        };

        const signTx = { trans: txObjcet, privateKey: privateKey };
        const signTrans = await bscApi.signTransaction(signTx);

        const txHash = await bscApi.sendSignedTransaction(signTrans.rawTrans);
        console.log("txHash : %s", txHash);
    }

    async function BEP20Trans() {
        console.log("========= BSC 发起合约交易 =========");
        const from = "0xce8C1E1b11e06FaE762f6E2b5264961C0C7A6a48";
        const to = "0xaed4EF39a1005Ba89BFc2A9A408F4Af79625b61f";
        const privateKey = "7d672dd3c7e63a856e11a114464448f3f320e52d22e5268c23e485d11a25119a";
        // const privateKey = "addf83b399e8432070963bb810e2417007f0bd6ba3ec2174fdc952a4215f1b82";
        // const contractAddress = "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd";
        const contractAddress = "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06";

        const txCount = await bscApi.getTransCount(from);
        console.log("txCount : %s", txCount);

        const amount = "10000000";

        const contractGas = await bscApi.getContractGas(from, to, amount, contractAddress);
        console.log("contractGas : %s", contractGas);
        // const contractGas = (await getBaseGas()).contractGas;

        const gasPrice = await bscApi.getGasPrice();
        console.log("gasPrice : %s", gasPrice);

        const data = await bscApi.getContractTransData(from, to, amount, contractAddress);
        console.log("data : %s", data);
        const chainId = 97;
        const contracTxObjcet = {
            from: from,
            to: contractAddress,
            value: "0",
            gas: contractGas,
            gasPrice: gasPrice,
            nonce: txCount,
            data: data,
            chainId,
        };

        const signTx = { trans: contracTxObjcet, privateKey: privateKey };
        const signTrans = await bscApi.signTransaction(signTx);
        console.log(`signTrans : ${JSON.stringify(signTrans, null, 2)}`);

        const tx = bscApi.getTransBodyFromSignature(signTrans.rawTrans);
        console.log(tx);

        const txHash = await bscApi.sendSignedTransaction(signTrans.rawTrans);
        console.log("txHash : %s", txHash);
        // const tx = bscApi.getTransactionFromSignature(rawTransaction);
        // // console.log(tx);
        // console.log(contracTxObjcet.to);
        // console.log(contracTxObjcet.value);
        // console.log(tx.to.toString("hex"));
        // console.log(tx.value.toString("hex"));
        // console.log(tx.data.toString("hex"));
        // const txData = "0x" + tx.data.toString("hex");
        // const result = bscApi.decodeParameters<{ recipient: string; amount: string }>(
        //     txData.substring(10),
        //     ABISupportFunctionEnum.transfer,
        // );
        // console.log(result);
    }

    async function getTrans() {
        const txHash = "0xb7c9abed35f5463a253590cdd075c516d8ba0319fd21154be75bb759d5078d74";
        const contractHash = "0x6d78c36724a94469968e7c4634dd60ca562bb9741269fb7815e7403064569591";
        const trans = await bscApi.getTrans(contractHash);
        console.log("========= 查询交易信息 =========");
        console.log(trans);
    }

    async function getTransReceipt() {
        const txHash = "0xb7c9abed35f5463a253590cdd075c516d8ba0319fd21154be75bb759d5078d74";
        const contractHash = "0x6d78c36724a94469968e7c4634dd60ca562bb9741269fb7815e7403064569591";
        const transReceipt = await bscApi.getTransReceipt(contractHash);
        console.log("========= 查询交易收据 =========");
        console.log(transReceipt);
    }

    async function getTransReceiptNative() {
        const txHash = "0xb7c9abed35f5463a253590cdd075c516d8ba0319fd21154be75bb759d5078d74";
        const contractHash = "0x6d78c36724a94469968e7c4634dd60ca562bb9741269fb7815e7403064569591";
        const transReceipt = await bscApi.getTransReceiptNative(contractHash);
        console.log("========= 查询交易收据 =========");
        console.log(transReceipt);
    }

    async function getTransBodyFromTrans() {
        const txHash = "0xb7c9abed35f5463a253590cdd075c516d8ba0319fd21154be75bb759d5078d74";
        const contractHash = "0x6d78c36724a94469968e7c4634dd60ca562bb9741269fb7815e7403064569591";
        const trans = await bscApi.getTrans(txHash);
        const transReceipt = bscApi.getTransBody(trans);
        console.log("========= 获取交易体 =========");
        console.log(transReceipt);
    }

    async function getTransBodyFromSign() {
        const commonSign =
            "0xf86a81ab850430e23400825208941b3b3fc528e7c65db1524aa3b74c5ce1aeb95a928402faf0808081e6a0538e9d821cd353cc1c2162a334e79f080483eecb8818e365510ed23a05a06a16a0370d70a6f95fa67e07da215b72cd348bdf2ac5a069262e604c523c43b04fc51d";
        const contractSign =
            "0xf8ab81f5850430e234008287629484b9b910527ad5c03a9ca831909e21e236ea7b0680b844a9059cbb000000000000000000000000aed4ef39a1005ba89bfc2a9a408f4af79625b61f000000000000000000000000000000000000000000000000000000000098968081e5a0e4034ada9a8b1f86ea67433e62528fb36365c47a7812f056df1f241e4d4202aca033ee503a2ab5bd7293c649a24a1881e584f6904552c73ab713608ce3758372fc";

        const body = bscApi.getTransBodyFromSignature(contractSign);
        console.log("========= 获取交易体 =========");
        console.log(body);
    }
})();
