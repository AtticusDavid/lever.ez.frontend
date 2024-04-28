import React from "react";
import { css } from "../../../../../../../styled-system/css";
import { hstack } from "../../../../../../../styled-system/patterns";
import { LendingStatusResponse } from "@/app/api/lending-status/route";
import { TokenKey } from "../../assets";
import {
  calculateFlashloanDeleverageBaseAmount,
  getFloatValueDivDecimals,
} from "@/hardhat/utils";
import { prettify } from "@/utils";
import { leverageABI } from "@/generated";
import {
  MINTABLE_ERC20_TOKENS,
  AAVE_V3_DEBT_TOKENS,
  AAVE_V3_A_TOKENS,
  routerConfig,
} from "@/hardhat/constants";
import {
  encodeAbiParameters,
  parseAbiParameters,
  parseUnits,
  encodeFunctionData,
} from "viem";
import { Network } from "@/hooks/useLendingStatus";
import { ChainsCloseResponse } from "@/hooks/useChainsClose";

type CloseProps = {
  currentLTV: number;
  targetLTV: number;
  supplyAmount: string;
  borrowAmount: string;
  borrowAmountNumber: number;
  maxBorrowableAmount: number;
  borrowAPR: string;
  rewardAPR: string;
};

export function getCloseProps({
  data,
  token,
  inputAmount,
  network,
  targetLTV,
  networkSet,
  chainsData,
  address,
}: {
  inputAmount: number;
  data: LendingStatusResponse;
  targetLTV: number;
  token: TokenKey;
  network: Network;
  networkSet: Set<Network>;
  chainsData: ChainsCloseResponse;
  address: `0x${string}`;
}): CloseProps & { data: `0x${string}` } {
  const { status, balances, incentiveStatus } = data;

  const aToken = `a${token}` as const;
  const vToken = `v${token}` as const;

  const supplyAmount = getFloatValueDivDecimals(
    balances[aToken]["balance"],
    balances[aToken]["decimals"]
  );

  const borrowAmount = getFloatValueDivDecimals(
    balances[vToken]["balance"],
    balances[vToken]["decimals"]
  );

  let borrowRewardAPR = 0;
  incentiveStatus[token]["rewards"].forEach((reward) => {
    if (reward.token !== "AAVE") {
      return;
    }

    const rewardAPR = getFloatValueDivDecimals(reward.APR, "6");

    if (!reward.isAToken) {
      borrowRewardAPR += rewardAPR;
    }
  });

  const assetCurrentLTV =
    (borrowAmount * status[token]["price"]) /
    status["user"]["totalCollateralUSD"];

  const closeProps: CloseProps = {
    currentLTV: assetCurrentLTV,
    targetLTV,
    supplyAmount: `${prettify(supplyAmount.toString())} ${token}`,
    borrowAmount: `${prettify(borrowAmount.toString())} ${token}`,
    borrowAmountNumber: borrowAmount,
    borrowAPR:
      "-" + prettify(status[token]["variableBorrowAPR"].toString()) + "%",
    rewardAPR: prettify(borrowRewardAPR.toString()) + "%",
    maxBorrowableAmount: status[token].availableBorrowAmount,
  };

  const threshold =
    ((borrowAmount - inputAmount) * status[token]["price"]) /
    status["user"]["totalCollateralUSD"];

  console.log({ closeProps, targetLTV, threshold });

  const { flashloanAmount } =
    targetLTV > threshold
      ? { flashloanAmount: 0 }
      : calculateFlashloanDeleverageBaseAmount(
          inputAmount,
          supplyAmount,
          supplyAmount === 0 ? 0 : borrowAmount / supplyAmount,
          targetLTV,
          1,
          1,
          0.001
        );

  console.log({
    flashloanAmount,
    inputAmount,
    supplyAmount,
    targetLTV,
    borrowAmount,
  });

  const selectedNetworks = (chainsData ?? []).filter((item) =>
    networkSet.has(item.networkName)
  );

  console.log({ selectedNetworks });

  const chainLinkData = chainsData
    ? encodeAbiParameters(parseAbiParameters("uint64[], bytes[]"), [
        selectedNetworks.map((network) =>
          BigInt(routerConfig[network.networkName].chainSelector)
        ),
        selectedNetworks.map((network) => {
          return encodeAbiParameters(
            parseAbiParameters("address, address, address, uint8, bytes"),
            [
              address,
              MINTABLE_ERC20_TOKENS[network.networkName][token], // asset
              AAVE_V3_A_TOKENS[network.networkName][token], // supply
              1, // flag
              encodeAbiParameters(
                parseAbiParameters("address, address, uint256, bytes"),
                [
                  MINTABLE_ERC20_TOKENS[network.networkName][token], // asset
                  AAVE_V3_DEBT_TOKENS[network.networkName][token], // debt
                  BigInt(
                    Math.max(network.flashloanAmount, 0) *
                      10 ** network.decimals
                  ),
                  "0x",
                ]
              ),
            ]
          );
        }),
      ])
    : "0x";

  const closeFlashloanData = encodeAbiParameters(
    parseAbiParameters(["address", "address", "uint256", "bytes"].join(", ")),
    [
      MINTABLE_ERC20_TOKENS[network][token],
      AAVE_V3_DEBT_TOKENS[network][token],
      Math.max(
        Math.floor(flashloanAmount * 10 ** parseInt(balances[token].decimals)),
        0
      ),
      selectedNetworks.length > 0 ? chainLinkData : "0x",
    ]
  );

  /**
   * / inputParams.data = closeFlashloanData;
      // closeFlashloanData = flashloan params + chainlink data
      // chainlink data= abi.encode("uint64[]", "bytes[]" [destination Selectors, msgsData])
      // msgs data = destination chain's closeFlashloanData
   * 
   */

  const params = {
    asset: MINTABLE_ERC20_TOKENS[network][token] as `0x${string}`,
    counterAsset: AAVE_V3_A_TOKENS[network][token] as `0x${string}`,
    amount: parseUnits(
      inputAmount.toString(),
      Number(balances[token].decimals)
    ),
    flags: 1,
    data: Math.max(flashloanAmount, 0) === 0 ? "0x" : closeFlashloanData,
  };

  console.log({ closeFlashloanData, params, network, token });

  const txData = encodeFunctionData({
    functionName: "close",
    abi: leverageABI,
    args: [params],
  });

  return {
    ...closeProps,
    data: txData,
  };
}

function Close(props: CloseProps) {
  const data = [
    {
      label: "Supply Amount",
      value: props.supplyAmount,
    },
    {
      label: "Borrow APR",
      value: props.borrowAPR,
    },
    {
      label: "Borrow Amount",
      value: props.borrowAmount,
    },
    {
      label: "Reward APR",
      value: props.rewardAPR,
    },
  ];
  return (
    <div>
      <div
        className={hstack({
          justifyContent: "space-between",
          padding: "35px 0",
        })}
      >
        {[
          {
            label: "Current LTV",
            value: Math.floor(props.currentLTV * 100) + "%",
          },
          {
            label: "Target LTV",
            value: Math.floor(props.targetLTV * 100) + "%",
          },
        ].map((item) => {
          return (
            <div
              key={item.label}
              className={hstack({
                justifyContent: "space-between",
              })}
            >
              <span>{item.label}</span>
              <span
                className={css({
                  fontSize: "26px",
                  fontWeight: "semibold",
                  color: "white",
                })}
              >
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
      <table className={css({ width: "100%" })}>
        {[0, 2].map((x) => {
          return (
            <tr
              key={x}
              className={css({
                height: "30px",
              })}
            >
              {[0, 1].map((y) => {
                return (
                  <React.Fragment key={x + y}>
                    <td
                      className={css({
                        fontWeight: "semibold",
                      })}
                    >
                      {data[x + y].label}
                    </td>
                    <td>{data[x + y].value}</td>
                  </React.Fragment>
                );
              })}
            </tr>
          );
        })}
      </table>
    </div>
  );
}

export default Close;
