import React from "react";
import { css } from "../../../../../../../styled-system/css";
import { hstack } from "../../../../../../../styled-system/patterns";

type SupplyProps = {
  revnueEstimation: string;
  compoundGovernanceToken: string;
  supplyAmount: string;
  borrowAmount: string;
  supplyAPR: string;
  borrowAPR: string;
};

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
            label: "ETh",
            value: props.revnueEstimation,
          },
          {
            label: "Compound Governance Token",
            value: props.compoundGovernanceToken,
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

export default Supply;
