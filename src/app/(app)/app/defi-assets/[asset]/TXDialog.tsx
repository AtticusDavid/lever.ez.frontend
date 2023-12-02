"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { css } from "../../../../../../styled-system/css";
import {
  center,
  hstack,
  vstack,
} from "../../../../../../styled-system/patterns";
import React from "react";
import Spinner from "./Spinner";

function TXDialog() {
  const interestDebtData = {
    big: [
      {
        label: "AVR",
        value: "-20%",
      },
      {
        label: "Governance APR",
        value: "120%",
      },
    ],
    small: [
      {
        label: "Supply Amount",
        value: "2k DAI + 0.28 ETH",
      },
      {
        label: "Borrow APR",
        value: "-8.3",
      },
      {
        label: "Borrow Amount",
        value: "5k DAI",
      },
      {
        label: "Reward APR",
        value: "-123%",
      },
    ],
  };
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button>Open Form</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          className={css({
            backgroundColor: "rgba(0,0,0,0.1)",
            position: "fixed",
            inset: "0",
            animation: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
            filter: "blur(10px)",
          })}
        />
        <Dialog.Content
          className={vstack({
            border: "2px solid #B8FF04",
            alignItems: "stretch",
            color: "#BEC3AF",
            backgroundColor: "#171814",
            padding: "50px 60px",
            borderRadius: "10px",
            boxShadow:
              "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "800px",
            maxHeight: "85vh",
            animation: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
          })}
        >
          <Dialog.Title className="DialogTitle">ETH</Dialog.Title>
          <div
            className={hstack({
              backgroundColor: "#2C2C2B",
              height: "50px",
              borderRadius: "10px",
            })}
          >
            {["Supply", "Withdraw", "Borrow", "Close"].map((item) => (
              <div
                key={item}
                className={center({
                  flexGrow: "1",
                  fontSize: "24px",
                  fontWeight: "semibold",
                })}
              >
                {item}
              </div>
            ))}
          </div>
          <div
            className={vstack({
              padding: "17px 25px",
              backgroundColor: "#2C2C2B",
              alignItems: "flex-start",
              borderRadius: "10px",
            })}
          >
            <span
              className={css({
                fontWeight: "semibold",
              })}
            >
              Token Balance
            </span>
            <span
              className={css({
                fontWeight: "semibold",
                fontSize: "26px",
                color: "white",
              })}
            >
              20ETH
            </span>
            <div
              className={hstack({
                backgroundColor: "#565656",
                width: "100%",
                borderRadius: "10px",
              })}
            >
              <input
                className={css({
                  paddingLeft: "7px",
                  flexGrow: "1",
                  background: "none",
                })}
                placeholder="Amount to Borrow"
              ></input>
              <button
                className={center({
                  borderRadius: "10px",
                  margin: "5px",
                  padding: "5px 15px",
                  fontSize: "18px",
                  fontWeight: "semibold",
                  backgroundColor: "#B8FF04",
                  color: "black",
                })}
              >
                Max
              </button>
            </div>
            <Spinner
              color="#C08FFF"
              ratio={0.6}
              title="LTV"
              description={{
                start: <span></span>,
                middle: <span></span>,
                end: <span></span>,
              }}
            ></Spinner>
          </div>
          <div>
            <span className={css({ fontWeight: "semibold", fontSize: "18px" })}>
              Interest Debt
            </span>
            <div
              className={hstack({
                justifyContent: "space-between",
                padding: "35px 0",
              })}
            >
              {interestDebtData.big.map((item) => {
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
                            {interestDebtData.small[x + y].label}
                          </td>
                          <td>{interestDebtData.small[x + y].value}</td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                );
              })}
            </table>
          </div>

          <Dialog.Close asChild>
            <button
              className={center({
                marginTop: "20px",
                borderRadius: "10px",
                backgroundColor: "#B8FF04",
                height: "62px",
                width: "100%",
                fontSize: "28px",
                fontWeight: "bold",
                color: "black",
              })}
              aria-label="Close"
            >
              Close
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default TXDialog;
