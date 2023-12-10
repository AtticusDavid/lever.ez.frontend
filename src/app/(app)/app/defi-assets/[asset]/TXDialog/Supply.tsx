import React from "react";
import { css } from "../../../../../../../styled-system/css";
import { hstack } from "../../../../../../../styled-system/patterns";
import { LendingStatusResponse } from "@/app/api/lending-status/route";
import {
  calculateFlashloanLeverageToTargetLTV,
  calculateFlashloanLeverageBaseAmount,
  getFloatValueDivDecimals,
} from "@/hardhat/utils";
import { TokenKey } from "../../assets";
import { prettify } from "@/utils";
import {
  AAVE_V3_A_TOKENS,
  AAVE_V3_DEBT_TOKENS,
  MINTABLE_ERC20_TOKENS,
} from "@/hardhat/constants";
import { Network } from "@/hooks/useLendingStatus";
import {
  encodeAbiParameters,
  encodeFunctionData,
  parseAbiParameters,
  parseUnits,
} from "viem";
import { leverageABI } from "@/generated";

type SupplyProps = {
  revenueEstimation: string;
  governanceToken: string;
  supplyAmount: string;
  borrowAmount: string;
  supplyAPR: string;
  borrowAPR: string;
};

export function getSupplyProps({
  inputAmount,
  data,
  leverage,
  tokenName,
  network,
}: {
  inputAmount: number;
  leverage: number;
  data: LendingStatusResponse;
  tokenName: TokenKey;
  network: Network;
}): SupplyProps & { data: `0x${string}` } {
  const { balances, status, incentiveStatus } = data;

  const aToken = `a${tokenName}` as const;
  const vToken = `v${tokenName}` as const;

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

  const { flashloanAmount } =
    leverage === 1
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

  console.log({
    targetLTV,
    flashloanAmount,
    borrowAPR: status[tokenName]["variableBorrowAPR"],
  });

  const revenueEstimation =
    ((inputAmount + supplyAmount + flashloanAmount) *
      (status[tokenName]["supplyAPR"] -
        targetLTV * status[tokenName]["variableBorrowAPR"])) /
    100;
  let compoundGovernanceToken = 0;

  incentiveStatus[tokenName]["rewards"].forEach((reward) => {
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
          (status[tokenName].price as number)) /
        rewardTokenPrice;
    } else {
      compoundGovernanceToken +=
        (rewardAPR *
          (inputAmount + supplyAmount + flashloanAmount) *
          targetLTV *
          (status[tokenName].price as number)) /
        rewardTokenPrice;
    }
  });
  console.log({ flashloanAmount });

  const abiParams = encodeAbiParameters(
    parseAbiParameters(["address", "address", "uint256", "bytes"].join(", ")),
    [
      MINTABLE_ERC20_TOKENS[network][tokenName],
      AAVE_V3_DEBT_TOKENS[network][tokenName],
      Math.max(
        Math.floor(
          flashloanAmount * 10 ** parseInt(balances[tokenName].decimals)
        ),
        0
      ),

      "0x",
    ]
  );

  const params = {
    asset: MINTABLE_ERC20_TOKENS[network][tokenName] as `0x${string}`,
    counterAsset: AAVE_V3_A_TOKENS[network][tokenName] as `0x${string}`,
    amount: parseUnits(
      (inputAmount ?? 0).toString(),
      Number(balances[tokenName].decimals)
    ),
    flags: leverage > 1 ? 3 : 1,
    data: leverage === 1 ? "0x" : abiParams,
  };

  console.log({ params, abiParams });

  const txData = encodeFunctionData({
    functionName: "supply",
    abi: leverageABI,
    args: [params],
  });

  return {
    revenueEstimation: prettify(revenueEstimation.toString()) + " " + tokenName,
    governanceToken:
      prettify(compoundGovernanceToken.toString()) + " " + "AAVE",
    supplyAmount: prettify(supplyAmount.toString()) + " " + tokenName,
    borrowAmount: prettify(borrowAmount.toString()) + " " + tokenName,
    supplyAPR: prettify(status[tokenName]["supplyAPR"].toString()) + "%",
    borrowAPR:
      prettify(status[tokenName]["variableBorrowAPR"].toString()) + "%",
    data: txData,
  };
}

function Supply(props: SupplyProps) {
  const data = [
    {
      label: "Supply Amount",
      value: props.supplyAmount,
    },
    {
      label: "Supply APR",
      value: props.supplyAPR,
    },
    {
      label: "Borrow Amount",
      value: props.borrowAmount,
    },
    {
      label: "Borrow APR",
      value: props.borrowAPR,
    },
  ];
  return (
    <div>
      <span className={css({ fontWeight: "semibold", fontSize: "18px" })}>
        Your Revenue Estimation
      </span>
      <div
        className={hstack({
          justifyContent: "space-between",
          padding: "35px 0",
        })}
      >
        {[
          {
            label: "",
            value: props.revenueEstimation,
          },
          {
            label: "Governance Token",
            value: props.governanceToken,
          },
        ].map((item) => {
          return (
            <div
              key={item.label}
              className={hstack({
                width: "45%",
                justifyContent: "space-between",
              })}
            >
              <span
                className={css({
                  fontSize: "14px",
                  maxWidth: "150px",
                })}
              >
                {item.label}
              </span>
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

export default Supply;
