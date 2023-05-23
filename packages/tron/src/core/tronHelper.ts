import { utils } from "ethers";
export class TronHelper {
    private static ADDRESS_HEX_PREFIX_REGEX = /^(41)/;

    private static ADDRESS_HEX_PREFIX = "41";

    static UINT_TYPES = ["uint256"];

    static TRANS_TYPES = ["address", "uint256"];
    /**
     * 加密
     * @param input 待加密数据
     * @returns
     */
    static encodeParams(input: BFChainWallet.TRON.TronContractParameter[]) {
        if (input.length === 0) {
            return "";
        }
        const AbiCoder = utils.AbiCoder;
        const abiCoder = new AbiCoder();

        const types = input.map(({ type }) => type);
        const values = input.map(({ type, value }) => {
            if (type === "address" && typeof value === "string") {
                value = value.replace(TronHelper.ADDRESS_HEX_PREFIX_REGEX, "0x");
            }
            return value;
        });

        const parameter = abiCoder.encode(types, values).replace(/^0x/, "");
        return parameter;
    }

    /**
     * 解码
     * @param types 参数类型列表
     * @param output 解码前的数据
     * @param ignoreMethodHash 对函数返回值解码，ignoreMethodHash填写false，如果是对gettransactionbyid结果中的data字段解码时，ignoreMethodHash填写true
     * @returns decode
     */
    static decodeParams(types: string[], output: string, ignoreMethodHash: boolean) {
        if (ignoreMethodHash && output.replace(/^0x/, "").length % 64 === 8) {
            output = "0x" + output.replace(/^0x/, "").substring(8);
        }

        if (output.replace(/^0x/, "").length % 64 !== 0) {
            throw new Error("the Encode string is not valed, Its length must be a multiple of 64.");
        }
        const AbiCoder = utils.AbiCoder;
        const abiCoder = new AbiCoder();
        const decodedParameters = abiCoder.decode(types, output).map((arg, index) => {
            if (types[index] === "address") {
                arg = TronHelper.ADDRESS_HEX_PREFIX + arg.substring(2).toLowerCase();
            }
            return arg;
        });

        return decodedParameters;
    }
}
