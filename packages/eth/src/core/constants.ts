import type { AbiItem, AbiFragment, AbiInput, AbiFunctionFragment } from "web3-types";
/**正式网络 USDT合约地址 */
export const ETH_USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
/**正式网络 USDC合约地址 */
export const ETH_USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

/**sepolia测试网络 USDT合约地址 */
export const ETH_SEPOLIA_TEST_USDT_ADDRESS = "0x371345f4D90e95d1DdBe69C547028f311AdecA38";
/**sepolia测试网络 USDC合约地址 */
export const ETH_SEPOLIA_TEST_USDC_ADDRESS = "0xbe72E441BF55620febc26715db68d3494213D8Cb";
/**sepolia测试网络 LINK合约地址 */
export const ETH_SEPOLIA_TEST_LINK_ADDRESS = "0x779877A7B0D9E8603169DdbD7836e478b4624789";

export type AbiItemCustom = AbiItem & { name?: string };
export type AbiInputCustom = AbiInput & { name?: string };

export type { AbiFunctionFragment };

export const ETH_ERC20_ABI: AbiItem[] = [
    {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [
            {
                name: "",
                type: "string",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "totalSupply",
        outputs: [
            {
                name: "",
                type: "uint256",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [
            {
                name: "",
                type: "uint256",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [
            {
                name: "who",
                type: "address",
            },
        ],
        name: "balanceOf",
        outputs: [
            {
                name: "",
                type: "uint256",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "symbol",
        outputs: [
            {
                name: "",
                type: "string",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: false,
        inputs: [
            {
                name: "_to",
                type: "address",
            },
            {
                name: "_value",
                type: "uint256",
            },
        ],
        name: "transfer",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: "from",
                type: "address",
            },
            {
                indexed: true,
                name: "to",
                type: "address",
            },
            {
                indexed: false,
                name: "value",
                type: "uint256",
            },
        ],
        name: "Transfer",
        type: "event",
    },
];
