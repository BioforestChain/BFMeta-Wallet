import { WalletFactory, LoggerSymbol } from "@bfmeta/wallet";
import { ModuleStroge, Injectable, sleep } from "@bfchain/util";
const config: BFChainWallet.Config = require(`../../assets/config.json`);
@Injectable(LoggerSymbol)
class DemoLogger {
    constructor() {}
    static log(...arg: any[]) {
        // 或者写文件什么的
        console.log(arg);
    }
}
export class BfmetabrowserTest {
    walletFactory: WalletFactory;
    constructor() {
        const moduleMap = new ModuleStroge();
        moduleMap.set(LoggerSymbol, DemoLogger);
        this.walletFactory = new WalletFactory(config, moduleMap);
    }

    async getAddressBalance() {
        console.log(`getAddressBalance`);
        const r1 = await this.walletFactory.BFChainApi.getAddressBalance(
            "cEAXDkaEJgWKMM61KYz2dYU1RfuxbB8Ma",
            "E00EI",
            "BFT",
        );
        console.log(r1, "bfchain");
        const r2 = await this.walletFactory.CCChainApi.getAddressBalance(
            "cEAXDkaEJgWKMM61KYz2dYU1RfuxbB8Ma",
            "22A30",
            "CCC",
        );
        console.log(r2, "ccchain");
        const r3 = await this.walletFactory.BFMApi.getAddressBalance(
            "cEAXDkaEJgWKMM61KYz2dYU1RfuxbB8Ma",
            "PPPPW",
            "BFMTEST",
        );
        console.log(r3, "bfm");
    }
    async getAccountInfo() {
        console.log(`getAccountInfo`);
        const r1 = await this.walletFactory.BFChainApi.getAccountInfo(
            "cEAXDkaEJgWKMM61KYz2dYU1RfuxbB8Ma",
        );
        console.log(r1, "bfchain");
        const r2 = await this.walletFactory.CCChainApi.getAccountInfo(
            "cEAXDkaEJgWKMM61KYz2dYU1RfuxbB8Ma",
        );
        console.log(r2, "ccchain");
        const r3 = await this.walletFactory.BFMApi.getAccountInfo(
            "cEAXDkaEJgWKMM61KYz2dYU1RfuxbB8Ma",
        );
        console.log(r3, "bfm");
    }
    async getBlockAverageFee() {
        console.log(`getBlockAverageFee`);
        const r1 = await this.walletFactory.BFChainApi.getBlockAverageFee();
        console.log(r1, "bfchain");
        const r2 = await this.walletFactory.CCChainApi.getBlockAverageFee();
        console.log(r2, "ccchain");
        const r3 = await this.walletFactory.BFMApi.getBlockAverageFee();
        console.log(r3, "bfm");
    }
    async getAccountAsset() {
        console.log(`getAccountAsset`);
        const r1 = await this.walletFactory.BFChainApi.getAccountAsset(
            "cMB9PUAyKrV1j3KM9ch1BfZbFD7aticm96",
        );
        console.log(r1.result, "bfchain");
        const r2 = await this.walletFactory.CCChainApi.getAccountAsset(
            "cLrUCNAWPyPH96bqqC3JQXZ3CtsvvXmNj1",
        );
        console.log(r2.result, "ccchain");
        const r3 = await this.walletFactory.BFMApi.getAccountAsset(
            "cEAXDkaEJgWKMM61KYz2dYU1RfuxbB8Ma",
        );
        console.log(r3.result, "bfm");
    }

    async getAssets() {
        console.log(`getAssets`);
        // const r1 = await this.walletFactory.BFChainApi.getAssets(1, 5, "BFT");
        // console.log(r1.result, "bfchain");

        // const r2 = await this.walletFactory.CCChainApi.getAssets(1, 5, "CC");
        // console.log(r2.result, "ccchain");

        const r3 = await this.walletFactory.BFMApi.getAssets(1, 5, "BR");
        console.log(r3.result, "bfm");
    }

    async getAssetDetails() {
        console.log(`getAssetDetails`);

        const r1 = await this.walletFactory.BFChainApi.getAssetDetails("BFT");
        console.log(r1.result, "bfchain");

        const r2 = await this.walletFactory.CCChainApi.getAssetDetails("CCC");
        console.log(r1.result, "ccchain");

        const r3 = await this.walletFactory.BFMApi.getAssetDetails("BFM");
        console.log(r1.result, "bfm");
    }
}
(async () => {
    try {
        const test = new BfmetabrowserTest();
        // await test.getAddressBalance();
        // await test.getAccountInfo();
        // await test.getBlockAverageFee();
        // await test.getAccountAsset();
        // await test.getAssets();
        await test.getAssetDetails();
    } catch (err) {
        console.log(err);
    }
})();
