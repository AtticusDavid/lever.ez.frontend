/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IAaveViewer,
  IAaveViewerInterface,
} from "../../../../contracts/interfaces/IAave.sol/IAaveViewer";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_provider",
        type: "address",
      },
    ],
    name: "aavePoolParamsV2",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "flashloanPremium",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "address",
                name: "underlyingAsset",
                type: "address",
              },
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "string",
                name: "symbol",
                type: "string",
              },
              {
                internalType: "uint16",
                name: "id",
                type: "uint16",
              },
              {
                internalType: "address",
                name: "aTokenAddress",
                type: "address",
              },
              {
                internalType: "address",
                name: "stableDebtTokenAddress",
                type: "address",
              },
              {
                internalType: "address",
                name: "variableDebtTokenAddress",
                type: "address",
              },
              {
                internalType: "address",
                name: "interestRateStrategyAddress",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "baseLTVasCollateral",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "reserveLiquidationThreshold",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "reserveLiquidationBonus",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "decimals",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "reserveFactor",
                type: "uint256",
              },
              {
                internalType: "uint8",
                name: "eModeCategoryId",
                type: "uint8",
              },
              {
                internalType: "bool",
                name: "usageAsCollateralEnabled",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "isActive",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "isFrozen",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "borrowingEnabled",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "stableBorrowRateEnabled",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "paused",
                type: "bool",
              },
              {
                internalType: "uint256",
                name: "variableRateSlope1",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "variableRateSlope2",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "stableRateSlope1",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "stableRateSlope2",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "baseStableBorrowRate",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "baseVariableBorrowRate",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "optimalUsageRatio",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "debtCeiling",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "debtCeilingDecimals",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "borrowCap",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "supplyCap",
                type: "uint256",
              },
              {
                internalType: "bool",
                name: "flashLoanEnabled",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "isSiloedBorrowing",
                type: "bool",
              },
              {
                internalType: "uint128",
                name: "accruedToTreasury",
                type: "uint128",
              },
              {
                internalType: "uint128",
                name: "unbacked",
                type: "uint128",
              },
              {
                internalType: "uint128",
                name: "isolationModeTotalDebt",
                type: "uint128",
              },
              {
                internalType: "uint16",
                name: "eModeLtv",
                type: "uint16",
              },
              {
                internalType: "uint16",
                name: "eModeLiquidationThreshold",
                type: "uint16",
              },
              {
                internalType: "uint16",
                name: "eModeLiquidationBonus",
                type: "uint16",
              },
              {
                internalType: "bool",
                name: "borrowableInIsolation",
                type: "bool",
              },
              {
                internalType: "address",
                name: "eModePriceSource",
                type: "address",
              },
              {
                internalType: "address",
                name: "priceOracle",
                type: "address",
              },
              {
                internalType: "string",
                name: "eModeLabel",
                type: "string",
              },
            ],
            internalType: "struct IAaveViewer.AaveAssetParams[]",
            name: "assetParams",
            type: "tuple[]",
          },
        ],
        internalType: "struct IAaveViewer.AavePoolParamsResponseV2",
        name: "response",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_provider",
        type: "address",
      },
    ],
    name: "aavePoolParamsV3",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "flashloanPremium",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "address",
                name: "underlyingAsset",
                type: "address",
              },
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "string",
                name: "symbol",
                type: "string",
              },
              {
                internalType: "uint16",
                name: "id",
                type: "uint16",
              },
              {
                internalType: "address",
                name: "aTokenAddress",
                type: "address",
              },
              {
                internalType: "address",
                name: "stableDebtTokenAddress",
                type: "address",
              },
              {
                internalType: "address",
                name: "variableDebtTokenAddress",
                type: "address",
              },
              {
                internalType: "address",
                name: "interestRateStrategyAddress",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "baseLTVasCollateral",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "reserveLiquidationThreshold",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "reserveLiquidationBonus",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "decimals",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "reserveFactor",
                type: "uint256",
              },
              {
                internalType: "uint8",
                name: "eModeCategoryId",
                type: "uint8",
              },
              {
                internalType: "bool",
                name: "usageAsCollateralEnabled",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "isActive",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "isFrozen",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "borrowingEnabled",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "stableBorrowRateEnabled",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "paused",
                type: "bool",
              },
              {
                internalType: "uint256",
                name: "variableRateSlope1",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "variableRateSlope2",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "stableRateSlope1",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "stableRateSlope2",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "baseStableBorrowRate",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "baseVariableBorrowRate",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "optimalUsageRatio",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "debtCeiling",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "debtCeilingDecimals",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "borrowCap",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "supplyCap",
                type: "uint256",
              },
              {
                internalType: "bool",
                name: "flashLoanEnabled",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "isSiloedBorrowing",
                type: "bool",
              },
              {
                internalType: "uint128",
                name: "accruedToTreasury",
                type: "uint128",
              },
              {
                internalType: "uint128",
                name: "unbacked",
                type: "uint128",
              },
              {
                internalType: "uint128",
                name: "isolationModeTotalDebt",
                type: "uint128",
              },
              {
                internalType: "uint16",
                name: "eModeLtv",
                type: "uint16",
              },
              {
                internalType: "uint16",
                name: "eModeLiquidationThreshold",
                type: "uint16",
              },
              {
                internalType: "uint16",
                name: "eModeLiquidationBonus",
                type: "uint16",
              },
              {
                internalType: "bool",
                name: "borrowableInIsolation",
                type: "bool",
              },
              {
                internalType: "address",
                name: "eModePriceSource",
                type: "address",
              },
              {
                internalType: "address",
                name: "priceOracle",
                type: "address",
              },
              {
                internalType: "string",
                name: "eModeLabel",
                type: "string",
              },
            ],
            internalType: "struct IAaveViewer.AaveAssetParams[]",
            name: "assetParams",
            type: "tuple[]",
          },
        ],
        internalType: "struct IAaveViewer.AavePoolParamsResponseV3",
        name: "response",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_provider",
        type: "address",
      },
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "aavePoolStateV2",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "underlyingAsset",
            type: "address",
          },
          {
            internalType: "uint40",
            name: "stableDebtLastUpdateTimestamp",
            type: "uint40",
          },
          {
            internalType: "uint128",
            name: "liquidityIndex",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "variableBorrowIndex",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "liquidityRate",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "variableBorrowRate",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "stableBorrowRate",
            type: "uint128",
          },
          {
            internalType: "uint40",
            name: "lastUpdateTimestamp",
            type: "uint40",
          },
          {
            internalType: "uint256",
            name: "availableLiquidity",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "priceInMarketReferenceCurrency",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "principalStableDebt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalPrincipalStableDebt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "averageStableRate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalScaledVariableDebt",
            type: "uint256",
          },
        ],
        internalType: "struct IAaveViewer.AavePoolStateResponseV2",
        name: "response",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_provider",
        type: "address",
      },
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "aavePoolStateV3",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "underlyingAsset",
            type: "address",
          },
          {
            internalType: "uint40",
            name: "stableDebtLastUpdateTimestamp",
            type: "uint40",
          },
          {
            internalType: "uint128",
            name: "liquidityIndex",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "variableBorrowIndex",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "liquidityRate",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "variableBorrowRate",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "stableBorrowRate",
            type: "uint128",
          },
          {
            internalType: "uint40",
            name: "lastUpdateTimestamp",
            type: "uint40",
          },
          {
            internalType: "uint256",
            name: "availableLiquidity",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "priceInMarketReferenceCurrency",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "principalStableDebt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalPrincipalStableDebt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "averageStableRate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalScaledVariableDebt",
            type: "uint256",
          },
        ],
        internalType: "struct IAaveViewer.AavePoolStateResponseV3",
        name: "response",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class IAaveViewer__factory {
  static readonly abi = _abi;
  static createInterface(): IAaveViewerInterface {
    return new Interface(_abi) as IAaveViewerInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): IAaveViewer {
    return new Contract(address, _abi, runner) as unknown as IAaveViewer;
  }
}
