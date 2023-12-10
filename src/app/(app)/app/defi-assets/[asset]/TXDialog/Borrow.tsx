import React from "react";
import { css } from "../../../../../../../styled-system/css";
import { hstack } from "../../../../../../../styled-system/patterns";
import { LendingStatusResponse } from "@/app/api/lending-status/route";
import { TokenKey } from "../../assets";
import { getFloatValueDivDecimals } from "@/hardhat/utils";
import { prettify } from "@/utils";
import { encodeFunctionData, parseUnits } from "viem";
import {
  AAVE_V3_A_TOKENS,
  AAVE_V3_DEBT_TOKENS,
  MINTABLE_ERC20_TOKENS,
} from "@/hardhat/constants";
import { leverageABI } from "@/generated";
import { Network } from "@/hooks/useLendingStatus";

export type BorrowProps = {
  netAPR: string;
  availableLiquidity: string;
  utilizationRate: string;
  supplyAmount: string;
  maxBorrowableAmount: string;
  borrowAmount: string;
  borrowAPR: string;
  rewardAPR: string;
  currentLTV: number;
  maxLTV: number;
  afterLTV: number;
};

export function getBorrowProps({
  data,
  borrowAmountInput,
  tokenName: token,
  network,
}: {
  borrowAmountInput: number;
  data: LendingStatusResponse;
  tokenName: TokenKey;
  network: Network;
}): BorrowProps & { data: `0x${string}` } {
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

  let supplyRewardAPR = 0;
  let borrowRewardAPR = 0;
  incentiveStatus[token]["rewards"].forEach((reward) => {
    if (reward.token !== "AAVE") {
      return;
    }

    const rewardAPR = getFloatValueDivDecimals(reward.APR, "6");

    if (reward.isAToken) {
      supplyRewardAPR += rewardAPR;
    } else {
      borrowRewardAPR += rewardAPR;
    }
  });

  const borrowProps: BorrowProps = {
    netAPR:
      prettify(
        (borrowRewardAPR - status[token]["variableBorrowAPR"]).toString()
      ) + "%",
    availableLiquidity:
      prettify(status[token]["availableLiquidity"].toString()) + " " + token,
    utilizationRate:
      prettify(status[token]["utilizationRate"].toString()) + "%",
    supplyAmount: prettify(supplyAmount.toString()) + " " + token,
    borrowAmount: prettify(borrowAmount.toString()) + " " + token,
    borrowAPR: prettify((-status[token]["variableBorrowAPR"]).toString()) + "%",
    rewardAPR: prettify(borrowRewardAPR.toString()) + "%",
    maxBorrowableAmount: status[token]["availableBorrowAmount"].toString(),
    currentLTV: status["user"]["currentLTV"],
    maxLTV: status[token]["maxLTV"],
    afterLTV: status["user"]["totalCollateralUSD"]
      ? ((status["user"]["totalDebtUSD"] +
          borrowAmountInput * status[token]["price"]) /
          status["user"]["totalCollateralUSD"]) *
        100
      : 0,
  };

  const params = {
    asset: MINTABLE_ERC20_TOKENS[network][token] as `0x${string}`,
    counterAsset: AAVE_V3_DEBT_TOKENS[network][token] as `0x${string}`,
    amount: parseUnits(
      (borrowAmountInput ?? 0).toString(),
      Number(balances[token].decimals)
    ),
    flags: 5,
    data: "0x" as `0x${string}`,
  };

  const txData = encodeFunctionData({
    functionName: "borrow",
    abi: leverageABI,
    args: [params],
  });

  return {
    ...borrowProps,
    data: txData,
  };
}

function Borrow(props: BorrowProps) {
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
      <span className={css({ fontWeight: "semibold", fontSize: "18px" })}>
        Interest Debt
      </span>
      <div
        className={hstack({
          flexWrap: "wrap",
          justifyContent: "space-between",
          padding: "35px 0",
        })}
      >
        {[
          {
            label: "Net APR",
            value: props.netAPR,
          },
          {
            label: "Available Liquidity",
            value: props.availableLiquidity,
          },
          {
            label: "Utilization Rate",
            value: props.utilizationRate,
          },
        ].map((item) => {
          return (
            <div
              key={item.label}
              className={hstack({
                justifyContent: "space-between",
                minWidth: "35%",
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

export default Borrow;
