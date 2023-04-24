import { utils } from "ethers";
import { Injectable, Inject } from "@bnqkl/util-node";
import { LoggerSymbol } from "@bfmeta/wallet-helpers";

@Injectable()
export class TronHelper {
    constructor(@Inject(LoggerSymbol) public logger: BFChainWallet.Helpers.Logger) {}
    private static ADDRESS_PREFIX_REGEX = /^(41)/;

    private static ADDRESS_PREFIX = "41";

    encodeParameter(input: BFChainWallet.TRON.TronContractParameter[]): string {
        const AbiCoder = utils.AbiCoder;
        const abiCoder = new AbiCoder();
        let parameter = "";
        let types = [];
        let values = [];
        if (input.length == 0) {
            return parameter;
        }
        for (let i = 0; i < input.length; i++) {
            let { type, value } = input[i];
            if (type == "address" && typeof value == "string") {
                value = value.replace(TronHelper.ADDRESS_PREFIX_REGEX, "0x");
            }
            types.push(type);
            values.push(value);
        }
        // this.logger.log(types, values);
        parameter = abiCoder.encode(types, values).replace(/^(0x)/, "");
        return parameter;
    }

    decodeParameter(types: string[], output: string, ignoreMethodHash: boolean) {
        if (ignoreMethodHash && output.replace(/^0x/, "").length % 64 === 8) {
            output = "0x" + output.replace(/^0x/, "").substring(8);
        }
        const AbiCoder = utils.AbiCoder;
        const abiCoder = new AbiCoder();

        if (output.replace(/^0x/, "").length % 64) {
            return new Error(
                "the Encode string is not valed, Its length must be a multiple of 64.",
            );
        }
        return abiCoder.decode(types, output).reduce((obj, arg, index) => {
            if (types[index] == "address") {
                arg = TronHelper.ADDRESS_PREFIX + arg.substring(2).toLowerCase();
            }
            obj.push(arg);
            return obj;
        }, []);
    }
}
