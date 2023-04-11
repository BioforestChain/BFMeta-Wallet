import * as crypto from "node:crypto";
import "@bfmeta/wallet-typings";
// import type {} from "@bfmeta/node-sdk";

export class CryptoHelper implements BFMetaSignUtil.CryptoHelperInterface {
    async sha256(msg: string | Uint8Array) {
        if (msg instanceof Uint8Array) {
            return crypto.createHash("sha256").update(msg).digest();
        }
        return crypto
            .createHash("sha256")
            .update(new Uint8Array(Buffer.from(msg)))
            .digest();
    }

    md5(data?: any): any {
        const hash = crypto.createHash("md5");
        if (data) {
            return hash.update(data).digest();
        }
        return hash;
    }

    ripemd160(data?: any): any {
        const hash = crypto.createHash("ripemd160");
        if (data) {
            return hash.update(data).digest();
        }
        return hash;
    }
}
