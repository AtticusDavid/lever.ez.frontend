import {
  multicall3Address,
  LENDING_POOLS,
  APR,
  SECONDS_PER_YEAR,
  RAY,
  MAX_UINT256,
  AAVE_V3_A_TOKENS,
  AAVE_V3_DEBT_TOKENS,
  MINTABLE_ERC20_TOKENS,
  leveragerAddress,
} from "@/hardhat/constants";
import {
  Multicall3,
  Multicall3__factory,
  IPool__factory,
  IUiPoolDataProviderV3__factory,
  IUiIncentiveDataProviderV3__factory,
  CToken__factory,
  MockERC20__factory,
} from "@/hardhat/typechain-types";
import {
  calculateAaveInterestRate,
  calculateCompoundedInterest,
  calculateFlashloanLeverageBaseAmount,
  calculateFlashloanLeverageToTargetLTV,
  calculateLinearInterest,
  getPrivateKey,
  getProviderRpcUrl,
  rayMul,
} from "@/hardhat/utils";
import { lendingStatusRequestSchema } from "@/utils";
import { ethers, Wallet, getBigInt } from "ethers";
import { InferType, object, string } from "yup";

export const dynamic = "force-dynamic"; // defaults to force-static

type BalanceToken = "DAI" | "USDC" | "USDT" | "WETH";

export type Balances = Record<
  BalanceToken | `a${BalanceToken}` | `v${BalanceToken}`,
  {
    decimals: string;
    balance: string;
    allowance: string;
  }
> & {
  NATIVE: {
    decimals: string;
    balance: string;
  };
};

export type AaveIncentiveStatus = Record<BalanceToken, APR>;

export type LendingStatusRequest = InferType<typeof lendingStatusRequestSchema>;

export type LendingStatusResponse = {
  status: AaveFloatStatus;
  incentiveStatus: AaveIncentiveStatus;
  balances: Balances;
};

export type AaveFloatStatus = Record<
  "DAI" | "LINK" | "USDC" | "WBTC" | "WETH" | "USDT" | "AAVE" | "EURS",
  {
    price: number;
    maxLTV: number;
    liquidationThreshold: number;
    availableBorrowAmount: number;
    supplyAPR: number;
    variableBorrowAPR: number;
    stableBorrowAPR: number;
    totalSupply: number;
    totalSupplyUSD: number;
    totalBorrow: number;
    totalBorrowUSD: number;
    availableLiquidity: number;
    availableLiquidityUSD: number;
    utilizationRate: number;
    liquidationPenalty: number;
  }
> & {
  user: {
    totalCollateralUSD: number;
    totalDebtUSD: number;
    availableBorrowsUSD: number;
    ltv: number;
    healthFactor: number;
    currentLTV: number;
  };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");
  const network = searchParams.get("network");
  const body = {
    address,
    network,
  };

  if (!lendingStatusRequestSchema.isValidSync(body))
    throw new Error("invalid query params");

  const params = lendingStatusRequestSchema.validateSync(body);

  const rpcProviderUrl = getProviderRpcUrl(params.network);
  const provider = new ethers.JsonRpcProvider(rpcProviderUrl);
  const privateKey = getPrivateKey();
  const wallet = new Wallet(privateKey);
  const signer = wallet.connect(provider);

  const multicall: Multicall3 = Multicall3__factory.connect(
    multicall3Address,
    signer
  );

  const aaveV3 = IPool__factory.connect(
    LENDING_POOLS[params.network].AaveV3LendingPool,
    signer
  );
  const aaveV3PoolDataProvider = IUiPoolDataProviderV3__factory.connect(
    LENDING_POOLS[params.network].AaveV3UiPoolDataProvider,
    signer
  );

  const aaveV3IncentiveDataProvider =
    IUiIncentiveDataProviderV3__factory.connect(
      LENDING_POOLS[params.network].AaveV3UiIncentiveDataProvider,
      signer
    );

  const itf = new ethers.Interface([
    "function decimals() view returns(uint8)",
    "function MAX_EXCESS_STABLE_TO_TOTAL_DEBT_RATIO() view returns(uint256)",
    "function OPTIMAL_STABLE_TO_TOTAL_DEBT_RATIO() view returns(uint256)",
    "function getStableRateExcessOffset() view returns(uint256)",
    "function getTotalSupplyLastUpdated() view returns(uint40)",
    "function scaledTotalSupply() view returns(uint256)",
  ]);

  const aaveV3Data = await aaveV3PoolDataProvider.getReservesData(
    LENDING_POOLS[params.network].AaveV3AddressProvider
  );

  const aaveV3IncentiveData =
    await aaveV3IncentiveDataProvider.getReservesIncentivesData(
      LENDING_POOLS[params.network].AaveV3AddressProvider
    );

  const aaveV3Status: Record<string, Record<string, string>> = {};
  const aaveV3InterestCalls: Multicall3.Call3Struct[] = [];

  const TOKEN_ADDRESS_TO_NAME: Record<string, string> = {};

  /// unit in a ray=10**27
  aaveV3Data[0].forEach((element) => {
    const name = element.name.toString();
    aaveV3Status[name] = {
      decimals: element.decimals.toString(),
      baseLTVasCollateral: element.baseLTVasCollateral.toString(),
      reserveLiquidationThreshold:
        element.reserveLiquidationThreshold.toString(),
      reserveLiquidationBonus: element.reserveLiquidationBonus.toString(),
      reserveFactor: element.reserveFactor.toString(),
      usageAsCollateralEnabled: element.usageAsCollateralEnabled.toString(),
      availableLiquidity: element.availableLiquidity.toString(),
      totalPrincipalStableDebt: element.totalPrincipalStableDebt.toString(),
      totalScaledVariableDebt: element.totalScaledVariableDebt.toString(),
      averageStableRate: element.averageStableRate.toString(),
      priceInMarketReferenceCurrency:
        element.priceInMarketReferenceCurrency.toString(),
      variableRateSlope1: element.variableRateSlope1.toString(),
      variableRateSlope2: element.variableRateSlope2.toString(),
      stableRateSlope1: element.stableRateSlope1.toString(),
      stableRateSlope2: element.stableRateSlope2.toString(),
      baseStableBorrowRate: element.baseStableBorrowRate.toString(),
      baseVariableBorrowRate: element.baseVariableBorrowRate.toString(),
      optimalUtilizationRate: element.optimalUsageRatio.toString(),
      unbacked: element.unbacked.toString(),
      liquidityIndex: element.liquidityIndex.toString(),
      price: element.priceInMarketReferenceCurrency.toString(),
      liquidityRate: element.liquidityRate.toString(),
      variableBorrowRate: element.variableBorrowRate.toString(),
      stableBorrowRate: element.stableBorrowRate.toString(),
      reserveLastUpdated: element.lastUpdateTimestamp.toString(),
    };
    // get price oracle decimals
    aaveV3InterestCalls.push({
      target: element.priceOracle.toString(),
      allowFailure: true,
      callData: itf.encodeFunctionData("decimals"),
    });
    aaveV3InterestCalls.push({
      target: element.interestRateStrategyAddress.toString(),
      allowFailure: true,
      callData: itf.encodeFunctionData("MAX_EXCESS_STABLE_TO_TOTAL_DEBT_RATIO"),
    });
    aaveV3InterestCalls.push({
      target: element.interestRateStrategyAddress.toString(),
      allowFailure: true,
      callData: itf.encodeFunctionData("OPTIMAL_STABLE_TO_TOTAL_DEBT_RATIO"),
    });
    aaveV3InterestCalls.push({
      target: element.interestRateStrategyAddress.toString(),
      allowFailure: true,
      callData: itf.encodeFunctionData("getStableRateExcessOffset"),
    });
    aaveV3InterestCalls.push({
      target: element.stableDebtTokenAddress.toString(),
      allowFailure: true,
      callData: itf.encodeFunctionData("getTotalSupplyLastUpdated"),
    });
    aaveV3InterestCalls.push({
      target: element.aTokenAddress.toString(),
      allowFailure: true,
      callData: itf.encodeFunctionData("scaledTotalSupply"),
    });
    TOKEN_ADDRESS_TO_NAME[element.underlyingAsset.toString()] = name;
  });

  const results = await multicall.aggregate3.staticCall(aaveV3InterestCalls);

  let idx = 0;

  const time = Math.floor(new Date().getTime() / 1000);
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.success) {
      const name = aaveV3Data[0][idx].name.toString();

      if (i % 6 === 0) {
        aaveV3Status[name]["priceOracleDecimals"] = itf
          .decodeFunctionResult("decimals", result.returnData)
          .toString();
      }
      if (i % 6 === 1) {
        aaveV3Status[name]["maxExcessStableToTotalDebtRatio"] = itf
          .decodeFunctionResult(
            "MAX_EXCESS_STABLE_TO_TOTAL_DEBT_RATIO",
            result.returnData
          )
          .toString();
      }
      if (i % 6 === 2) {
        aaveV3Status[name]["optimalStableToTotalDebtRatio"] = itf
          .decodeFunctionResult(
            "OPTIMAL_STABLE_TO_TOTAL_DEBT_RATIO",
            result.returnData
          )
          .toString();
      }
      if (i % 6 === 3) {
        aaveV3Status[name]["stableRateExcessOffset"] = itf
          .decodeFunctionResult("getStableRateExcessOffset", result.returnData)
          .toString();
      }

      if (i % 6 === 4) {
        aaveV3Status[name]["stableTotalSupplyLastUpdated"] = itf
          .decodeFunctionResult("getTotalSupplyLastUpdated", result.returnData)
          .toString();
      }
      if (i % 6 === 5) {
        aaveV3Status[name]["aTokenScaledTotalSupply"] = itf
          .decodeFunctionResult("scaledTotalSupply", result.returnData)
          .toString();
        idx += 1;
      }
    }
  }

  aaveV3Data[0].forEach((element) => {
    const name = element.name.toString();

    const totalATokenSupply = rayMul(
      getBigInt(aaveV3Status[name]["aTokenScaledTotalSupply"]),
      rayMul(
        calculateLinearInterest(
          getBigInt(element.liquidityRate),
          getBigInt(time),
          getBigInt(aaveV3Status[name]["reserveLastUpdated"])
        ),
        getBigInt(element.liquidityIndex)
      )
    );

    aaveV3Status[name]["totalATokenSupply"] = totalATokenSupply.toString();

    const totalVariableDebt = rayMul(
      rayMul(
        calculateCompoundedInterest(
          getBigInt(element.variableBorrowRate),
          getBigInt(time),
          getBigInt(aaveV3Status[name]["reserveLastUpdated"])
        ),
        getBigInt(element.variableBorrowIndex)
      ),
      getBigInt(element.totalScaledVariableDebt)
    );
    const totalStableDebt = rayMul(
      getBigInt(element.totalPrincipalStableDebt),
      calculateCompoundedInterest(
        getBigInt(element.averageStableRate),
        getBigInt(time),
        getBigInt(aaveV3Status[name]["stableTotalSupplyLastUpdated"])
      )
    );

    const interestRate = calculateAaveInterestRate(
      totalStableDebt,
      totalVariableDebt,
      getBigInt(element.availableLiquidity),
      getBigInt(element.optimalUsageRatio),
      getBigInt(aaveV3Status[name].optimalStableToTotalDebtRatio as string),
      getBigInt(aaveV3Status[name].maxExcessStableToTotalDebtRatio as string),
      getBigInt(element.baseVariableBorrowRate),
      getBigInt(element.stableRateSlope1),
      getBigInt(element.stableRateSlope2),
      getBigInt(element.variableRateSlope1),
      getBigInt(element.variableRateSlope2),
      getBigInt(element.baseStableBorrowRate),
      getBigInt(aaveV3Status[name].stableRateExcessOffset as string),
      getBigInt(element.reserveFactor),
      getBigInt(element.unbacked)
    );

    aaveV3Status[name]["totalVariableDebt"] = totalVariableDebt.toString();
    aaveV3Status[name]["totalStableDebt"] = totalStableDebt.toString();
    aaveV3Status[name]["borrowUsageRatio"] =
      interestRate.borrowUsageRatio.toString();
    aaveV3Status[name]["liquidityRate"] =
      interestRate.currentLiquidityRate.toString();
    aaveV3Status[name]["stableBorrowRate"] =
      interestRate.currentStableBorrowRate.toString();
    aaveV3Status[name]["variableBorrowRate"] =
      interestRate.currentVariableBorrowRate.toString();
  });

  const aaveV3IncentiveStatus: Record<string, APR> = {};

  aaveV3IncentiveData.forEach((element) => {
    const name = TOKEN_ADDRESS_TO_NAME[element.underlyingAsset.toString()];
    aaveV3IncentiveStatus[name] = {
      rewards: [],
      aTotalAPR: "0",
      vTotalAPR: "0",
    };
    let aTotalAPR = getBigInt(0);
    element.aIncentiveData.rewardsTokenInformation.forEach((aIncentiveData) => {
      /// decimals 6
      const numerator =
        getBigInt("1000000") *
        getBigInt(SECONDS_PER_YEAR) *
        getBigInt(aIncentiveData.emissionPerSecond) *
        getBigInt(aIncentiveData.rewardPriceFeed) *
        getBigInt(10) ** getBigInt(aaveV3Status[name]["priceOracleDecimals"]);

      const denominator =
        getBigInt(aaveV3Status[name]["totalATokenSupply"]) *
        getBigInt(aaveV3Status[name]["price"]) *
        getBigInt(10) ** getBigInt(aIncentiveData.rewardTokenDecimals);

      aaveV3IncentiveStatus[name]["rewards"].push({
        token: aIncentiveData.rewardTokenSymbol,
        tokenPrice: aIncentiveData.rewardPriceFeed.toString(),
        tokenPriceDecimals: aIncentiveData.rewardTokenDecimals.toString(),
        isAToken: true,
        APR: (numerator / denominator).toString(),
      });
      aTotalAPR += numerator / denominator;
    });
    aaveV3IncentiveStatus[name]["aTotalAPR"] = aTotalAPR.toString();
    let vTotalAPR = getBigInt(0);
    element.vIncentiveData.rewardsTokenInformation.forEach((vIncentiveData) => {
      /// decimals 6
      const numerator =
        getBigInt("1000000") *
        getBigInt(SECONDS_PER_YEAR) *
        getBigInt(vIncentiveData.emissionPerSecond) *
        getBigInt(vIncentiveData.rewardPriceFeed) *
        getBigInt(10) ** getBigInt(aaveV3Status[name]["priceOracleDecimals"]);

      const denominator =
        getBigInt(aaveV3Status[name]["totalVariableDebt"]) *
        getBigInt(aaveV3Status[name]["price"]) *
        getBigInt(10) ** getBigInt(vIncentiveData.rewardTokenDecimals);

      aaveV3IncentiveStatus[name]["rewards"].push({
        token: vIncentiveData.rewardTokenSymbol,
        tokenPrice: vIncentiveData.rewardPriceFeed.toString(),
        tokenPriceDecimals: vIncentiveData.rewardTokenDecimals.toString(),
        isAToken: false,
        APR: (numerator / denominator).toString(),
      });
      vTotalAPR += numerator / denominator;
    });
    aaveV3IncentiveStatus[name]["vTotalAPR"] = vTotalAPR.toString();
  });

  const accountData = await aaveV3.getUserAccountData(params.address);
  const aaveV3AccountNetStatus: Record<string, string> = {};
  aaveV3AccountNetStatus["totalCollateralBase"] =
    accountData.totalCollateralBase.toString();
  aaveV3AccountNetStatus["totalDebtBase"] =
    accountData.totalDebtBase.toString();
  aaveV3AccountNetStatus["availableBorrowsBase"] =
    accountData.availableBorrowsBase.toString();
  aaveV3AccountNetStatus["currentLiquidationThreshold"] =
    accountData.currentLiquidationThreshold.toString();
  aaveV3AccountNetStatus["ltv"] = accountData.ltv.toString();
  aaveV3AccountNetStatus["healthFactor"] = accountData.healthFactor.toString();
  aaveV3AccountNetStatus["baseDecimals"] =
    aaveV3Data[1].networkBaseTokenPriceDecimals.toString();

  const aaveFloatStatus: Record<string, Record<string, string | number>> = {};
  for (const name of Object.keys(aaveV3Status)) {
    const element = aaveV3Status[name];
    aaveFloatStatus[name] = {};

    aaveFloatStatus[name]["price"] =
      parseFloat(element["price"]) /
      parseFloat(
        (getBigInt(10) ** getBigInt(element["priceOracleDecimals"])).toString()
      );

    const baseDecimals = parseFloat(
      (
        getBigInt(10) ** getBigInt(aaveV3AccountNetStatus.baseDecimals)
      ).toString()
    );

    aaveFloatStatus[name]["maxLTV"] =
      parseFloat(element.baseLTVasCollateral) / 100;

    aaveFloatStatus[name]["liquidationThreshold"] =
      parseFloat(element.reserveLiquidationThreshold) / 100;
    aaveFloatStatus[name]["availableBorrowAmount"] =
      (((parseFloat(aaveV3AccountNetStatus.totalCollateralBase) -
        parseFloat(aaveV3AccountNetStatus.totalDebtBase)) /
        baseDecimals /
        (aaveFloatStatus[name]["price"] as number)) *
        parseFloat(aaveV3AccountNetStatus.ltv)) /
      10000;
    aaveFloatStatus[name]["supplyAPR"] =
      (parseFloat(element.liquidityRate) / parseFloat(RAY)) * 100;
    aaveFloatStatus[name]["variableBorrowAPR"] =
      (parseFloat(element.variableBorrowRate) / parseFloat(RAY)) * 100;
    aaveFloatStatus[name]["stableBorrowAPR"] =
      (parseFloat(element.stableBorrowRate) / parseFloat(RAY)) * 100;
    aaveFloatStatus[name]["totalSupply"] =
      parseFloat(element["totalATokenSupply"]) /
      parseFloat((getBigInt(10) ** getBigInt(element["decimals"])).toString());
    aaveFloatStatus[name]["totalSupplyUSD"] =
      (aaveFloatStatus[name]["totalSupply"] as number) *
      (aaveFloatStatus[name]["price"] as number);
    aaveFloatStatus[name]["totalBorrow"] =
      (parseFloat(element["totalVariableDebt"]) +
        parseFloat(element["totalStableDebt"])) /
      parseFloat((getBigInt(10) ** getBigInt(element["decimals"])).toString());
    aaveFloatStatus[name]["totalBorrowUSD"] =
      (aaveFloatStatus[name]["totalBorrow"] as number) *
      (aaveFloatStatus[name]["price"] as number);

    aaveFloatStatus[name]["availableLiquidity"] =
      parseFloat(element["availableLiquidity"]) /
      parseFloat((getBigInt(10) ** getBigInt(element["decimals"])).toString());
    aaveFloatStatus[name]["availableLiquidityUSD"] =
      (parseFloat(element["availableLiquidity"]) /
        parseFloat(
          (getBigInt(10) ** getBigInt(element["decimals"])).toString()
        )) *
      (aaveFloatStatus[name]["price"] as number);

    aaveFloatStatus[name]["utilizationRate"] =
      (parseFloat(element.borrowUsageRatio) / parseFloat(RAY)) * 100;

    aaveFloatStatus[name]["liquidationPenalty"] =
      parseFloat(element.reserveLiquidationBonus) / 100 - 100;
  }
  aaveFloatStatus["user"] = {};
  const baseDecimals = parseFloat(
    (getBigInt(10) ** getBigInt(aaveV3AccountNetStatus.baseDecimals)).toString()
  );
  aaveFloatStatus["user"]["totalCollateralUSD"] =
    parseFloat(aaveV3AccountNetStatus.totalCollateralBase) / baseDecimals;

  aaveFloatStatus["user"]["totalDebtUSD"] =
    parseFloat(aaveV3AccountNetStatus.totalDebtBase) / baseDecimals;

  aaveFloatStatus["user"]["availableBorrowsUSD"] =
    parseFloat(aaveV3AccountNetStatus.availableBorrowsBase) / baseDecimals;

  aaveFloatStatus["user"]["ltv"] = parseFloat(aaveV3AccountNetStatus.ltv) / 100;

  aaveFloatStatus["user"]["healthFactor"] =
    parseFloat(aaveV3AccountNetStatus.totalDebtBase) == 0
      ? parseFloat(MAX_UINT256)
      : (aaveFloatStatus["user"]["totalCollateralUSD"] *
          aaveFloatStatus["user"]["ltv"]) /
        aaveFloatStatus["user"]["totalDebtUSD"] /
        100;

  aaveFloatStatus["user"]["currentLTV"] =
    (aaveFloatStatus["user"]["totalDebtUSD"] /
      aaveFloatStatus["user"]["totalCollateralUSD"]) *
    100;

  const balances = await walletStatus(signer, params.address, params.network);

  let leverage = 2;
  let inputAmount = 0;
  let token = "DAI";

  const aToken = "a" + token;
  const vToken = "v" + token;

  const supplyAmount = getFloatValueDivDecimals(
    balances[aToken]["balance"],
    balances[aToken]["decimals"]
  );
  const borrowAmount = getFloatValueDivDecimals(
    balances[vToken]["balance"],
    balances[vToken]["decimals"]
  );

  const { targetLTV } = calculateFlashloanLeverageToTargetLTV(
    inputAmount,
    supplyAmount,
    borrowAmount,
    leverage,
    1,
    1,
    0.001
  );

  const { flashloanAmount } = calculateFlashloanLeverageBaseAmount(
    inputAmount,
    supplyAmount,
    borrowAmount / supplyAmount,
    targetLTV,
    1,
    1,
    0.001
  );

  let compoundGovernanceToken = 0;
  aaveV3IncentiveStatus[token]["rewards"].forEach((reward) => {
    if (reward.token !== "AAVE") {
      return;
    }
    const rewardTokenPrice = getFloatValueDivDecimals(
      reward.tokenPrice,
      reward.tokenPriceDecimals
    );
    const rewardAPR = getFloatValueDivDecimals(reward.APR, "6");

    if (reward.isAToken) {
      compoundGovernanceToken +=
        (rewardAPR *
          (inputAmount + supplyAmount + flashloanAmount) *
          (aaveFloatStatus[token].price as number)) /
        rewardTokenPrice;
    } else {
      compoundGovernanceToken +=
        (rewardAPR *
          (inputAmount + supplyAmount + flashloanAmount) *
          targetLTV *
          (aaveFloatStatus[token].price as number)) /
        rewardTokenPrice;
    }
  });

  return Response.json({
    status: aaveFloatStatus,
    incentiveStatus: aaveV3IncentiveStatus,
    balances,
  });
}
function getFloatValueDivDecimals(value: string, decimals: string) {
  return (
    parseFloat(value) /
    parseFloat((getBigInt(10) ** getBigInt(decimals)).toString())
  );
}

async function walletStatus(
  signer: Wallet,
  address: string,
  blockchain: "ethereumSepolia" | "avalancheFuji" | "polygonMumbai"
) {
  const multicall: Multicall3 = Multicall3__factory.connect(
    multicall3Address,
    signer
  );

  const mockERC20 = MockERC20__factory.createInterface();
  const calls: Multicall3.Call3Struct[] = [];

  const tokens = ["DAI", "USDC", "USDT", "WBTC", "WETH"] as const;
  tokens.forEach((token) => {
    calls.push({
      target: MINTABLE_ERC20_TOKENS[blockchain][token],
      allowFailure: true,
      callData: mockERC20.encodeFunctionData("name"),
    });
    calls.push({
      target: MINTABLE_ERC20_TOKENS[blockchain][token],
      allowFailure: true,
      callData: mockERC20.encodeFunctionData("decimals"),
    });
    calls.push({
      target: MINTABLE_ERC20_TOKENS[blockchain][token],
      allowFailure: true,
      callData: mockERC20.encodeFunctionData("balanceOf", [address]),
    });

    calls.push({
      target: MINTABLE_ERC20_TOKENS[blockchain][token],
      allowFailure: true,
      callData: mockERC20.encodeFunctionData("allowance", [
        address,
        leveragerAddress[blockchain],
      ]),
    });
    calls.push({
      target: AAVE_V3_A_TOKENS[blockchain][token],
      allowFailure: true,
      callData: mockERC20.encodeFunctionData("name"),
    });
    calls.push({
      target: AAVE_V3_A_TOKENS[blockchain][token],
      allowFailure: true,
      callData: mockERC20.encodeFunctionData("decimals"),
    });
    calls.push({
      target: AAVE_V3_A_TOKENS[blockchain][token],
      allowFailure: true,
      callData: mockERC20.encodeFunctionData("balanceOf", [address]),
    });
    calls.push({
      target: AAVE_V3_A_TOKENS[blockchain][token],
      allowFailure: true,
      callData: mockERC20.encodeFunctionData("allowance", [
        address,
        leveragerAddress[blockchain],
      ]),
    });
    calls.push({
      target: AAVE_V3_DEBT_TOKENS[blockchain][token],
      allowFailure: true,
      callData: mockERC20.encodeFunctionData("name"),
    });
    calls.push({
      target: AAVE_V3_DEBT_TOKENS[blockchain][token],
      allowFailure: true,
      callData: mockERC20.encodeFunctionData("decimals"),
    });
    calls.push({
      target: AAVE_V3_DEBT_TOKENS[blockchain][token],
      allowFailure: true,
      callData: mockERC20.encodeFunctionData("balanceOf", [address]),
    });
    calls.push({
      target: AAVE_V3_DEBT_TOKENS[blockchain][token],
      allowFailure: true,
      callData: mockERC20.encodeFunctionData("borrowAllowance", [
        address,
        leveragerAddress[blockchain],
      ]),
    });
  });

  const results = await multicall.aggregate3.staticCall(calls);

  const walletStatus: Record<string, Record<string, string>> = {};

  let name = "";
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.success) {
      if (i % 4 === 0) {
        if (i % 12 === 0) {
          name = mockERC20
            .decodeFunctionResult("name", result.returnData)
            .toString();
        } else if (i % 12 === 4) {
          name =
            "a" +
            mockERC20
              .decodeFunctionResult("name", result.returnData)
              .toString()
              .split(" ")
              .slice(-1)
              .pop();
        } else {
          name =
            "v" +
            mockERC20
              .decodeFunctionResult("name", result.returnData)
              .toString()
              .split(" ")
              .slice(-1)
              .pop();
        }
        walletStatus[name] = {};
      }
      if (i % 4 === 1) {
        walletStatus[name]["decimals"] = mockERC20
          .decodeFunctionResult("decimals", result.returnData)
          .toString();
      }
      if (i % 4 === 2) {
        walletStatus[name]["balance"] = mockERC20
          .decodeFunctionResult("balanceOf", result.returnData)
          .toString();
      }
      if (i % 4 === 3) {
        walletStatus[name]["allowance"] =
          i % 9 == 8
            ? mockERC20
                .decodeFunctionResult("borrowAllowance", result.returnData)
                .toString()
            : mockERC20
                .decodeFunctionResult("allowance", result.returnData)
                .toString();
      }
    }
  }

  walletStatus["NATIVE"] = {};
  walletStatus["NATIVE"]["decimals"] = "18";

  const provider = signer.provider;
  if (!provider) throw new Error("Provider not found");

  walletStatus["NATIVE"]["balance"] = (
    await provider.getBalance(address)
  ).toString();

  return walletStatus;
}
