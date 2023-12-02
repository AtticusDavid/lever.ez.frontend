"use client";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { css } from "../../../../../../styled-system/css";
import {
  center,
  hstack,
  vstack,
} from "../../../../../../styled-system/patterns";
import React, { useState } from "react";
import Spinner from "./Spinner";

const options = ["Supply", "Withdraw", "Borrow", "Close"];
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

function TXDialog() {
  const [optionWidth, setOptionWidth] = useState(0);
  const [index, setIndex] = useState(0);

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
            gap: "30px",
            borderRadius: "10px",
            boxShadow:
              "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
            position: "fixed",
            overflowY: "scroll",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "800px",
            maxHeight: "85vh",
            animation: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
          })}
        >
          <Dialog.Title
            className={hstack({
              justifyContent: "space-between",
            })}
          >
            <div className={hstack({})}>
              <Image
                src="/assets/compound.png"
                height={64}
                width={64}
                alt=""
              ></Image>
              <span
                className={css({
                  fontFamily: "var(--font-dogica)",
                  fontWeight: "bold",
                  fontSize: "26px",
                  color: "white",
                })}
              >
                ETH
              </span>
            </div>
            <Dialog.Close asChild>
              <Image
                src="/icon/arrow-left.svg"
                height={35}
                width={35}
                alt="Close "
              ></Image>
            </Dialog.Close>
          </Dialog.Title>
          <div
            ref={(element: HTMLDivElement | null) => {
              if (element) {
                setOptionWidth(element.offsetWidth / 4);
              }
            }}
            className={hstack({
              backgroundColor: "#2C2C2B",
              height: "50px",
              borderRadius: "10px",
              position: "relative",
            })}
          >
            {options.map((item, index) => (
              <div
                key={item}
                onClick={() => setIndex(index)}
                className={center({
                  flexGrow: "1",
                  width: "25%",
                  height: "50px",
                  fontSize: "24px",
                  fontWeight: "semibold",
                })}
              >
                {item}
              </div>
            ))}
            <div
              style={
                {
                  "--x": `${optionWidth * index}px`,
                } as React.CSSProperties
              }
              className={center({
                boxSizing: "content-box",
                pointerEvents: "none",
                backgroundColor: "#565656",
                position: "absolute",
                width: "25%",
                padding: "5px",
                height: "100%",
                borderRadius: "25px",
                border: "1px solid #B8FF04",
                color: "#B8FF04",
                fontWeight: "semibold",
                fontSize: "24px",
                transform: "translateX(calc(var(--x) - 5px))",
                transition: "0.1s transform ease-in-out",
              })}
            >
              {options[index]}
            </div>
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
              {options[index]}
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default TXDialog;
