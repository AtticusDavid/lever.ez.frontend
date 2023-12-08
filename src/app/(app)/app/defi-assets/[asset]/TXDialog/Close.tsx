import React from "react";
import { css } from "../../../../../../../styled-system/css";
import { hstack } from "../../../../../../../styled-system/patterns";

type CloseProps = {
  currentLTV: string;
  targetLTV: string;
  supplyAmount: string;
  borrowAmount: string;
  borrowAPR: string;
  rewardAPR: string;
};

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
            value: props.currentLTV,
          },
          {
            label: "Target LTV",
            value: props.targetLTV,
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
