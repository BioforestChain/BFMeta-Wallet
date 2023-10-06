export const LoggerSymbol = Symbol("logger");
export const BscApiScanSymbol = Symbol("BscApiScanSymbol");
export const EthApiScanSymbol = Symbol("EthApiScanSymbol");
export const TronApiScanSymbol = Symbol("TronApiScanSymbol");

/** Hex 前缀 */
export const HEX_PREFIX: string = "0x";
/** 交易 input 前缀 */
export const TRANS_INPUT_PREFIX: string = "0xa9059cbb";

export const enum ABISupportTypeEnum {
    /** 方法类型 */
    function = "function",
    /** 事件类型 */
    event = "event",
}

export const enum ABISupportEventEnum {
    /** 交易事件 */
    Transfer = "Transfer",
}

export const enum ABISupportFunctionEnum {
    /** 名称 */
    name = "name",
    /** 标识 */
    symbol = "symbol",
    /** 精度 */
    decimals = "decimals",
    /** 总发布量 */
    totalSupply = "totalSupply",
    /** 余额 */
    balanceOf = "balanceOf",
    /** 交易 */
    transfer = "transfer",
}
