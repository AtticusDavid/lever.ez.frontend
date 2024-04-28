const assets = [
  {
    name: "Aave-v3",
    icon: "/assets/aave-v3.png",
    isActive: true,
  },
  {
    name: "Compound",
    icon: "/assets/compound.png",
    isActive: false,
  },
  {
    name: "Aave-v2",
    icon: "/assets/aave.png",
    isActive: false,
  },
  {
    name: "Morpho",
    icon: "/assets/morpho.png",
    isActive: false,
  },
  {
    name: "Spark",
    icon: "/assets/spark.png",
    isActive: false,
  },
  {
    name: "Uniswap-v3",
    icon: "/assets/uniswap-v3.png",
    isActive: false,
  },
];

export const tokenWhitelist = ["DAI", "USDT", "USDC", "WETH"] as const;

export type TokenKey = (typeof tokenWhitelist)[number];

export const tokenIconMap: Record<TokenKey, string> = {
  DAI: "/assets/dai.svg",
  USDC: "/assets/usdc.svg",
  USDT: "/assets/usdt.svg",
  WETH: "/assets/eth.svg",
};

export default assets;
