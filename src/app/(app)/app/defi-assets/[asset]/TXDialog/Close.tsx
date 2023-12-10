import React from "react";
import { css } from "../../../../../../../styled-system/css";
import { hstack } from "../../../../../../../styled-system/patterns";
import { LendingStatusResponse } from "@/app/api/lending-status/route";
import { TokenKey } from "../../assets";
import {
  calculateFlashloanLeverageBaseAmount,
  getFloatValueDivDecimals,
} from "@/hardhat/utils";
import { prettify } from "@/utils";
import { leverageABI } from "@/generated";
import {
  MINTABLE_ERC20_TOKENS,
  AAVE_V3_DEBT_TOKENS,
  AAVE_V3_A_TOKENS,
} from "@/hardhat/constants";
import {
  encodeAbiParameters,
  parseAbiParameters,
  parseUnits,
  encodeFunctionData,
} from "viem";
import { Network } from "@/hooks/useLendingStatus";

type CloseProps = {
  currentLTV: number;
  targetLTV: number;
  supplyAmount: string;
  borrowAmount: string;
  borrowAPR: string;
  rewardAPR: string;
};

export function getCloseProps({
  data,
  token,
  inputAmount,
  network,
  targetLTV,
}: {
  inputAmount: number;
  data: LendingStatusResponse;
  targetLTV: number;
  token: TokenKey;
  network: Network;
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
    supplyAmount: prettify(supplyAmount.toString()) + " " + token,
    borrowAmount: prettify(borrowAmount.toString()) + " " + token,
    borrowAPR:
      "-" + prettify(status[token]["variableBorrowAPR"].toString()) + "%",
    rewardAPR: prettify(borrowRewardAPR.toString()) + "%",
  };

  const { flashloanAmount } =
    targetLTV === 1
      ? { flashloanAmount: 0 }
      : calculateFlashloanLeverageBaseAmount(
          inputAmount,
          supplyAmount,
          supplyAmount === 0 ? 0 : borrowAmount / supplyAmount,
          targetLTV,
          1,
          1,
          0.001
        );

  const abiParams = encodeAbiParameters(
    parseAbiParameters(["address", "address", "uint256", "bytes"].join(", ")),
    [
      MINTABLE_ERC20_TOKENS[network][token],
      AAVE_V3_DEBT_TOKENS[network][token],
      parseUnits(
        flashloanAmount.toString(),
        parseInt(balances[token].decimals)
      ),
      "0x",
    ]
  );

  const params = {
    asset: MINTABLE_ERC20_TOKENS[network][token] as `0x${string}`,
    counterAsset: AAVE_V3_A_TOKENS[network][token] as `0x${string}`,
    amount: parseUnits(
      (inputAmount ?? 0).toString(),
      Number(balances[token].decimals)
    ),
    flags: 1,
    data: abiParams,
  };

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
            value: Math.floor(props.currentLTV * 100) / 100 + "%",
          },
          {
            label: "Target LTV",
            value: Math.floor(props.targetLTV * 100) / 100 + "%",
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
