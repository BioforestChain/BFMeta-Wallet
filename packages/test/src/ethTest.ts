import type {} from "@bfmeta/wallet-typings";
import { WalletFactory } from "@bfmeta/wallet";
import { LoggerSymbol } from "@bfmeta/wallet";
import { ModuleStroge, Injectable, sleep } from "@bnqkl/util-node";
import { ETH_SEPOLIA_TEST_LINK_ADDRESS } from "@bfmeta/wallet-eth";
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

    const address_0x2CE7Cc719b8d4DBA69d0ab002cD56808FC684311 = "0x2CE7Cc719b8d4DBA69d0ab002cD56808FC684311";
    const privateKey_0x2CE7Cc719b8d4DBA69d0ab002cD56808FC684311 =
        "bb98720c8f30386c12387ee14671c94c9403f666676ae450dc205b87c9e22418";
    const address_0x1b3B3fc528e7c65dB1524AA3b74C5Ce1aEb95a92 = "0x1b3B3fc528e7c65dB1524AA3b74C5Ce1aEb95a92";
    const privateKey_0x1b3B3fc528e7c65dB1524AA3b74C5Ce1aEb95a92 =
        "f47a8c2dd9b5b43b990e9f8c92a71ddd9e124e4041bf17f20b9eae3088f9a769";
    // getChainId();
    // lastBlock();
    // getGasPrice();
    // getBalance();
    getContractBalance();
    // getContractBalanceAndDecimal();

    // commonTrans();
    // ERC20Trans();

    // getTrans();
    // getTransReceipt();
    getTransReceiptNative();
    // getTransBody();

    // getTransBodyFromSign();
    // getEIP1559TransBodyFromSign();

    async function getChainId() {
        const chainId = await ethApi.getChainId();
        console.log("========= 获取链ID =========");
        //sepolia 11155111
        console.log(chainId);
        return chainId;
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
        const balance = await ethApi.getBalance(address_0x2CE7Cc719b8d4DBA69d0ab002cD56808FC684311);
        const fromWei = await ethApi.web3.utils.fromWei(balance, "ether");
        console.log("========= 获取账户 balance =========");
        console.log("balance : %s, fromWei : %s", balance, fromWei);
    }

    async function getContractBalance() {
        const address = address_0x2CE7Cc719b8d4DBA69d0ab002cD56808FC684311;
        const contractAddress = ETH_SEPOLIA_TEST_LINK_ADDRESS;
        const contractBalance = await ethApi.getContractBalance(address, contractAddress);
        console.log("========= 获取账户 contractBalance =========");
        console.log(contractBalance);
    }

    async function getContractBalanceAndDecimal() {
        const erc20Balance = await ethApi.getContractBalanceAndDecimal(
            address_0x2CE7Cc719b8d4DBA69d0ab002cD56808FC684311,
            ETH_SEPOLIA_TEST_LINK_ADDRESS,
        );
        console.log("========= 获取账户 ERC20BalanceAndDecimal =========");
        console.log(erc20Balance);
    }

    async function commonTrans() {
        console.log("========= ETH发起普通交易 =========");
        const from = address_0x2CE7Cc719b8d4DBA69d0ab002cD56808FC684311;
        const to = address_0x1b3B3fc528e7c65dB1524AA3b74C5Ce1aEb95a92;
        const privateKey = privateKey_0x2CE7Cc719b8d4DBA69d0ab002cD56808FC684311;

        const txCount = await ethApi.getTransCount(from);
        console.log("txCount : %s", txCount);

        const generalGas = (await getBaseGas()).generalGas;

        const gasPrice = await ethApi.getGasPrice();
        console.log("gasPrice : %s", gasPrice);

        const txObjcet = {
            from: from,
            to: to,
            value: "123456789",
            gas: generalGas,
            gasPrice: gasPrice,
            nonce: txCount,
            chainId: await getChainId(),
        };

        const signTx = { trans: txObjcet, privateKey: privateKey };
        const signTrans = await ethApi.signTransaction(signTx);
        console.log(`signTrans : ${JSON.stringify(signTrans, null, 2)}`);

        const tx = ethApi.getEIP1559TransBodyFromSignature(signTrans.rawTrans);
        console.log(tx);

        const txHash = await ethApi.sendSignedTransaction(signTrans.rawTrans);
        console.log("txHash : %s", txHash);
    }

    async function ERC20Trans() {
        console.log("========= ETH发起合约交易 =========");
        const from = address_0x2CE7Cc719b8d4DBA69d0ab002cD56808FC684311;
        const to = address_0x1b3B3fc528e7c65dB1524AA3b74C5Ce1aEb95a92;
        const privateKey = privateKey_0x2CE7Cc719b8d4DBA69d0ab002cD56808FC684311;
        const contractAddress = ETH_SEPOLIA_TEST_LINK_ADDRESS;

        const txCount = await ethApi.getTransCount(from);
        console.log("txCount : %s", txCount);

        const gasPrice = await ethApi.getGasPrice();
        console.log("gasPrice : %s", gasPrice);

        const amount = "1234567890";
        const data = await ethApi.getContractTransData(from, to, amount, contractAddress);
        console.log("data : %s", data);

        const contractGas = await ethApi.getContractGas(from, to, amount, contractAddress);
        console.log("contractGas : %s", contractGas);

        const contracTxObjcet = {
            from: from,
            to: contractAddress,
            value: "0",
            gas: contractGas,
            gasPrice: gasPrice,
            nonce: txCount,
            data: data,
            chainId: await getChainId(),
        };

        const signTx = { trans: contracTxObjcet, privateKey: privateKey };
        const signTrans = await ethApi.signTransaction(signTx);
        console.log(`signTrans : ${JSON.stringify(signTrans, null, 2)}`);

        const tx = ethApi.getEIP1559TransBodyFromSignature(signTrans.rawTrans);
        console.log(tx);

        const txHash = await ethApi.sendSignedTransaction(signTrans.rawTrans);
        console.log(txHash);
    }

    async function getTrans() {
        const txHash = "0x6ebbe5cacf9380cc309052539ebf65e4bd430e22f39ea51b09ac75539f4f1aad";
        const contractHash = "0xa1e3d739b5b1db7370c0898d0e6f46b93eb86f253c9c9f870ec3daa09896e426";
        const trans = await ethApi.getTrans(txHash);
        console.log("========= 查询交易信息 =========");
        console.log(trans);

        console.log("========= input 解析 =========");
        const input = ethApi.parseInput(trans.input);
        console.log(input);
    }

    async function getTransReceipt() {
        const txHash = "0x6ebbe5cacf9380cc309052539ebf65e4bd430e22f39ea51b09ac75539f4f1aad";
        const contractHash = "0xa1e3d739b5b1db7370c0898d0e6f46b93eb86f253c9c9f870ec3daa09896e426";
        const transReceipt = await ethApi.getTransReceipt(contractHash);
        console.log("========= 查询交易收据 =========");
        console.log(transReceipt);
    }

    async function getTransReceiptNative() {
        const txHash = "0x6ebbe5cacf9380cc309052539ebf65e4bd430e22f39ea51b09ac75539f4f1aad";
        const contractHash = "0xa1e3d739b5b1db7370c0898d0e6f46b93eb86f253c9c9f870ec3daa09896e426";
        const transReceipt = await ethApi.getTransReceiptNative(contractHash);
        console.log("========= 查询交易收据 =========");
        console.log(transReceipt);
    }

    async function getTransBody() {
        const txHash = "0x6ebbe5cacf9380cc309052539ebf65e4bd430e22f39ea51b09ac75539f4f1aad";
        const contractHash = "0xa1e3d739b5b1db7370c0898d0e6f46b93eb86f253c9c9f870ec3daa09896e426";
        const trans = await ethApi.getTrans(contractHash);
        const transReceipt = ethApi.getTransBody(trans);
        console.log("========= 获取交易体 =========");
        console.log(transReceipt);
    }
    async function getTransBodyFromSign() {
        const commonSign =
            "0xf8671084641f524e825208941b3b3fc528e7c65db1524aa3b74c5ce1aeb95a928405f5e100802ea0758ca8f368ac4acc8e44fef4e85b30f6b0ec7f4754e259b7c004c594161b4456a00a0e24ad304b288e560515ccc2ced4098ed5d4a34602e05851ef7ba6d05f29b6";
        const contractSign =
            "0xf8a80e846abacc3782877a94326c977e6efc84e512bb9c30f76e30c160ed06fb80b844a9059cbb0000000000000000000000001b3b3fc528e7c65db1524aa3b74c5ce1aeb95a9200000000000000000000000000000000000000000000000000000002540be4002da07a9f777b89f1534657a8ab8c36c8e2de0014a447e2df2b1e8e4f598ad03072d9a02405e50a66b876d74e869a6f9f87cb64992ea6d107635b64d33d59d412f32063";
        const body = ethApi.getTransBodyFromSignature(commonSign);
        console.log("========= 获取交易体 =========");
        console.log(body);
    }

    async function getEIP1559TransBodyFromSign() {
        const commonSign =
            "0xf86c01850168956cfb825208941b3b3fc528e7c65db1524aa3b74c5ce1aeb95a9284075bcd15808401546d72a0bb4cd91d1a054487249badc3f4954dd504214b5e39a19badf8155f93f60ee4baa0486a0bc110fc207d983d6aa93422d155dabcc873e5dca2d64a6572125473a5be";
        const contractSign =
            "0xf8ac0384a1af582c82c9b294779877a7b0d9e8603169ddbd7836e478b462478980b844a9059cbb0000000000000000000000001b3b3fc528e7c65db1524aa3b74c5ce1aeb95a9200000000000000000000000000000000000000000000000000000000499602d28401546d71a082dfbbc976633c5d59e6692534cf3ae75d87a705d02c1fb6c44966f00451a17ba02a2d395ab79f1975a19c12fdb5f9b5daebf9c1182b86100889c4997920b395ac";
        const body = ethApi.getEIP1559TransBodyFromSignature(contractSign);
        console.log("========= 获取交易体 =========");
        console.log(body);
    }
})();
