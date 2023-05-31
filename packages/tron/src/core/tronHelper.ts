import { utils } from "ethers";
export class TronHelper {
    static ADDRESS_HEX_PREFIX_REGEX = /^(41)/;

    static ADDRESS_HEX_PREFIX = "41";

    static HEX_PREFIX_REGEX = /^(0x)/;

    static HEX_PREFIX = "0x";

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
                value = value.replace(TronHelper.ADDRESS_HEX_PREFIX_REGEX, TronHelper.HEX_PREFIX);
            }
            return value;
        });

        const parameter = abiCoder.encode(types, values).replace(TronHelper.HEX_PREFIX_REGEX, "");
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
        if (ignoreMethodHash && output.replace(TronHelper.HEX_PREFIX_REGEX, "").length % 64 === 8) {
            output = TronHelper.HEX_PREFIX + output.replace(TronHelper.HEX_PREFIX_REGEX, "").substring(8);
        }

        if (output.replace(TronHelper.HEX_PREFIX_REGEX, "").length % 64 !== 0) {
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
