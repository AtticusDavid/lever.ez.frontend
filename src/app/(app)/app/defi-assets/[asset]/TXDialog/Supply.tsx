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
import { token } from "@/hardhat/typechain-types/@openzeppelin/contracts";

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
}: {
  inputAmount: number;
  leverage: number;
  data: LendingStatusResponse;
  tokenName: TokenKey;
}): SupplyProps {
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

  const { flashloanAmount } = calculateFlashloanLeverageBaseAmount(
    inputAmount,
    supplyAmount,
    borrowAmount / supplyAmount,
    targetLTV,
    1,
    1,
    0.001
  );

  const revenueEstimation =
    (inputAmount + supplyAmount + flashloanAmount) *
      (status[tokenName]["supplyAPR"] as number) -
    (targetLTV * (status[tokenName]["variableBorrowAPR"] as number)) / 100;
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

  return {
    revenueEstimation: prettify(revenueEstimation.toString()) + " " + tokenName,
    governanceToken:
      prettify(compoundGovernanceToken.toString()) + " " + "AAVE",
    supplyAmount: prettify(supplyAmount.toString()) + " " + tokenName,
    borrowAmount: prettify(borrowAmount.toString()) + " " + tokenName,
    supplyAPR: prettify(status[tokenName]["supplyAPR"].toString()) + "%",
    borrowAPR:
      prettify(status[tokenName]["variableBorrowAPR"].toString()) + "%",
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
            label: "-",
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
