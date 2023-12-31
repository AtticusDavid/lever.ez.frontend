/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../../../common";

export declare namespace IUiPoolDataProviderV3 {
  export type AggregatedReserveDataStruct = {
    underlyingAsset: AddressLike;
    name: string;
    symbol: string;
    decimals: BigNumberish;
    baseLTVasCollateral: BigNumberish;
    reserveLiquidationThreshold: BigNumberish;
    reserveLiquidationBonus: BigNumberish;
    reserveFactor: BigNumberish;
    usageAsCollateralEnabled: boolean;
    borrowingEnabled: boolean;
    stableBorrowRateEnabled: boolean;
    isActive: boolean;
    isFrozen: boolean;
    liquidityIndex: BigNumberish;
    variableBorrowIndex: BigNumberish;
    liquidityRate: BigNumberish;
    variableBorrowRate: BigNumberish;
    stableBorrowRate: BigNumberish;
    lastUpdateTimestamp: BigNumberish;
    aTokenAddress: AddressLike;
    stableDebtTokenAddress: AddressLike;
    variableDebtTokenAddress: AddressLike;
    interestRateStrategyAddress: AddressLike;
    availableLiquidity: BigNumberish;
    totalPrincipalStableDebt: BigNumberish;
    averageStableRate: BigNumberish;
    stableDebtLastUpdateTimestamp: BigNumberish;
    totalScaledVariableDebt: BigNumberish;
    priceInMarketReferenceCurrency: BigNumberish;
    priceOracle: AddressLike;
    variableRateSlope1: BigNumberish;
    variableRateSlope2: BigNumberish;
    stableRateSlope1: BigNumberish;
    stableRateSlope2: BigNumberish;
    baseStableBorrowRate: BigNumberish;
    baseVariableBorrowRate: BigNumberish;
    optimalUsageRatio: BigNumberish;
    isPaused: boolean;
    isSiloedBorrowing: boolean;
    accruedToTreasury: BigNumberish;
    unbacked: BigNumberish;
    isolationModeTotalDebt: BigNumberish;
    flashLoanEnabled: boolean;
    debtCeiling: BigNumberish;
    debtCeilingDecimals: BigNumberish;
    eModeCategoryId: BigNumberish;
    borrowCap: BigNumberish;
    supplyCap: BigNumberish;
    eModeLtv: BigNumberish;
    eModeLiquidationThreshold: BigNumberish;
    eModeLiquidationBonus: BigNumberish;
    eModePriceSource: AddressLike;
    eModeLabel: string;
    borrowableInIsolation: boolean;
  };

  export type AggregatedReserveDataStructOutput = [
    underlyingAsset: string,
    name: string,
    symbol: string,
    decimals: bigint,
    baseLTVasCollateral: bigint,
    reserveLiquidationThreshold: bigint,
    reserveLiquidationBonus: bigint,
    reserveFactor: bigint,
    usageAsCollateralEnabled: boolean,
    borrowingEnabled: boolean,
    stableBorrowRateEnabled: boolean,
    isActive: boolean,
    isFrozen: boolean,
    liquidityIndex: bigint,
    variableBorrowIndex: bigint,
    liquidityRate: bigint,
    variableBorrowRate: bigint,
    stableBorrowRate: bigint,
    lastUpdateTimestamp: bigint,
    aTokenAddress: string,
    stableDebtTokenAddress: string,
    variableDebtTokenAddress: string,
    interestRateStrategyAddress: string,
    availableLiquidity: bigint,
    totalPrincipalStableDebt: bigint,
    averageStableRate: bigint,
    stableDebtLastUpdateTimestamp: bigint,
    totalScaledVariableDebt: bigint,
    priceInMarketReferenceCurrency: bigint,
    priceOracle: string,
    variableRateSlope1: bigint,
    variableRateSlope2: bigint,
    stableRateSlope1: bigint,
    stableRateSlope2: bigint,
    baseStableBorrowRate: bigint,
    baseVariableBorrowRate: bigint,
    optimalUsageRatio: bigint,
    isPaused: boolean,
    isSiloedBorrowing: boolean,
    accruedToTreasury: bigint,
    unbacked: bigint,
    isolationModeTotalDebt: bigint,
    flashLoanEnabled: boolean,
    debtCeiling: bigint,
    debtCeilingDecimals: bigint,
    eModeCategoryId: bigint,
    borrowCap: bigint,
    supplyCap: bigint,
    eModeLtv: bigint,
    eModeLiquidationThreshold: bigint,
    eModeLiquidationBonus: bigint,
    eModePriceSource: string,
    eModeLabel: string,
    borrowableInIsolation: boolean
  ] & {
    underlyingAsset: string;
    name: string;
    symbol: string;
    decimals: bigint;
    baseLTVasCollateral: bigint;
    reserveLiquidationThreshold: bigint;
    reserveLiquidationBonus: bigint;
    reserveFactor: bigint;
    usageAsCollateralEnabled: boolean;
    borrowingEnabled: boolean;
    stableBorrowRateEnabled: boolean;
    isActive: boolean;
    isFrozen: boolean;
    liquidityIndex: bigint;
    variableBorrowIndex: bigint;
    liquidityRate: bigint;
    variableBorrowRate: bigint;
    stableBorrowRate: bigint;
    lastUpdateTimestamp: bigint;
    aTokenAddress: string;
    stableDebtTokenAddress: string;
    variableDebtTokenAddress: string;
    interestRateStrategyAddress: string;
    availableLiquidity: bigint;
    totalPrincipalStableDebt: bigint;
    averageStableRate: bigint;
    stableDebtLastUpdateTimestamp: bigint;
    totalScaledVariableDebt: bigint;
    priceInMarketReferenceCurrency: bigint;
    priceOracle: string;
    variableRateSlope1: bigint;
    variableRateSlope2: bigint;
    stableRateSlope1: bigint;
    stableRateSlope2: bigint;
    baseStableBorrowRate: bigint;
    baseVariableBorrowRate: bigint;
    optimalUsageRatio: bigint;
    isPaused: boolean;
    isSiloedBorrowing: boolean;
    accruedToTreasury: bigint;
    unbacked: bigint;
    isolationModeTotalDebt: bigint;
    flashLoanEnabled: boolean;
    debtCeiling: bigint;
    debtCeilingDecimals: bigint;
    eModeCategoryId: bigint;
    borrowCap: bigint;
    supplyCap: bigint;
    eModeLtv: bigint;
    eModeLiquidationThreshold: bigint;
    eModeLiquidationBonus: bigint;
    eModePriceSource: string;
    eModeLabel: string;
    borrowableInIsolation: boolean;
  };

  export type BaseCurrencyInfoStruct = {
    marketReferenceCurrencyUnit: BigNumberish;
    marketReferenceCurrencyPriceInUsd: BigNumberish;
    networkBaseTokenPriceInUsd: BigNumberish;
    networkBaseTokenPriceDecimals: BigNumberish;
  };

  export type BaseCurrencyInfoStructOutput = [
    marketReferenceCurrencyUnit: bigint,
    marketReferenceCurrencyPriceInUsd: bigint,
    networkBaseTokenPriceInUsd: bigint,
    networkBaseTokenPriceDecimals: bigint
  ] & {
    marketReferenceCurrencyUnit: bigint;
    marketReferenceCurrencyPriceInUsd: bigint;
    networkBaseTokenPriceInUsd: bigint;
    networkBaseTokenPriceDecimals: bigint;
  };

  export type UserReserveDataStruct = {
    underlyingAsset: AddressLike;
    scaledATokenBalance: BigNumberish;
    usageAsCollateralEnabledOnUser: boolean;
    stableBorrowRate: BigNumberish;
    scaledVariableDebt: BigNumberish;
    principalStableDebt: BigNumberish;
    stableBorrowLastUpdateTimestamp: BigNumberish;
  };

  export type UserReserveDataStructOutput = [
    underlyingAsset: string,
    scaledATokenBalance: bigint,
    usageAsCollateralEnabledOnUser: boolean,
    stableBorrowRate: bigint,
    scaledVariableDebt: bigint,
    principalStableDebt: bigint,
    stableBorrowLastUpdateTimestamp: bigint
  ] & {
    underlyingAsset: string;
    scaledATokenBalance: bigint;
    usageAsCollateralEnabledOnUser: boolean;
    stableBorrowRate: bigint;
    scaledVariableDebt: bigint;
    principalStableDebt: bigint;
    stableBorrowLastUpdateTimestamp: bigint;
  };
}

export interface IUiPoolDataProviderV3Interface extends Interface {
  getFunction(
    nameOrSignature:
      | "getReservesData"
      | "getReservesList"
      | "getUserReservesData"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getReservesData",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getReservesList",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getUserReservesData",
    values: [AddressLike, AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "getReservesData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getReservesList",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUserReservesData",
    data: BytesLike
  ): Result;
}

export interface IUiPoolDataProviderV3 extends BaseContract {
  connect(runner?: ContractRunner | null): IUiPoolDataProviderV3;
  waitForDeployment(): Promise<this>;

  interface: IUiPoolDataProviderV3Interface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  getReservesData: TypedContractMethod<
    [provider: AddressLike],
    [
      [
        IUiPoolDataProviderV3.AggregatedReserveDataStructOutput[],
        IUiPoolDataProviderV3.BaseCurrencyInfoStructOutput
      ]
    ],
    "view"
  >;

  getReservesList: TypedContractMethod<
    [provider: AddressLike],
    [string[]],
    "view"
  >;

  getUserReservesData: TypedContractMethod<
    [provider: AddressLike, user: AddressLike],
    [[IUiPoolDataProviderV3.UserReserveDataStructOutput[], bigint]],
    "view"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "getReservesData"
  ): TypedContractMethod<
    [provider: AddressLike],
    [
      [
        IUiPoolDataProviderV3.AggregatedReserveDataStructOutput[],
        IUiPoolDataProviderV3.BaseCurrencyInfoStructOutput
      ]
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "getReservesList"
  ): TypedContractMethod<[provider: AddressLike], [string[]], "view">;
  getFunction(
    nameOrSignature: "getUserReservesData"
  ): TypedContractMethod<
    [provider: AddressLike, user: AddressLike],
    [[IUiPoolDataProviderV3.UserReserveDataStructOutput[], bigint]],
    "view"
  >;

  filters: {};
}
