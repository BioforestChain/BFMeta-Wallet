export const LoggerSymbol = Symbol("logger");
export const TatumSymbol = Symbol("TatumSymbol");
export const BscApiScanSymbol = Symbol("BscApiScanSymbol");
export const EthApiScanSymbol = Symbol("EthApiScanSymbol");
export const TronApiScanSymbol = Symbol("TronApiScanSymbol");

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
