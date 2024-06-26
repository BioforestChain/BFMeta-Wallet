import { BCFWalletFactory, type BCFApi } from "@bfmeta/wallet-bcf";

export class BfmetabrowserTest {
    constructor() {}
    private __BFChainApi!: BCFApi;

    get BFChainApi() {
        if (this.__BFChainApi) {
            return this.__BFChainApi;
        } else {
            this.__BFChainApi = BCFWalletFactory({
                host: [{ ip: "34.84.204.111", port: 19003 }],
                browserPath: "https://qatracker.bfchain.info/browser",
            });
            return this.__BFChainApi;
        }
    }

    async getAddressBalance() {
        console.log(`getAddressBalance`);
        const r1 = await this.BFChainApi.getAddressBalance("cEAXDkaEJgWKMM61KYz2dYU1RfuxbB8Ma", "E00EI", "BFT");
        console.log(r1, "bfchain");
    }
    async getAccountInfo() {
        console.log(`getAccountInfo`);
        const r1 = await this.BFChainApi.getAccountInfo("cEAXDkaEJgWKMM61KYz2dYU1RfuxbB8Ma");
        console.log(r1.result?.secondPublicKey); // 是否设置安全密码含有二次密钥
    }
    async getBlockAverageFee() {
        console.log(`getBlockAverageFee`);
        const r1 = await this.BFChainApi.getBlockAverageFee();
    }
    async getAccountAsset() {
        console.log(`getAccountAsset`);
        const r1 = await this.BFChainApi.getAccountAsset("cMB9PUAyKrV1j3KM9ch1BfZbFD7aticm96");
    }

    async getAssets() {
        console.log(`getAssets`);
        const r1 = await this.BFChainApi.getAssets(1, 5, "BFT");
        console.log(r1.result, "bfchain");
    }

    async getAssetDetails() {
        console.log(`getAssetDetails`);

        const r1 = await this.BFChainApi.getAssetDetails("BFT");
        console.log(r1.result, "bfchain");
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
