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

const chainList = ["Mumbai", "Sepolia", "Fuji"];
function CloseModal() {
  const [index, setIndex] = useState(0);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button>Close Modal</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          className={css({
            position: "fixed",
            inset: "0",
          })}
        />
        <Dialog.Content
          className={vstack({
            border: "2px solid #B8FF04",
            alignItems: "stretch",
            color: "white",
            backgroundColor: "#2C2C2B",
            padding: "60px 40px 40px 40px",
            gap: "30px",
            borderRadius: "10px",
            boxShadow:
              "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
            position: "fixed",
            top: "50%",
            left: "50%",
            fontSize: "24px",
            fontWeight: "semibold",
            transform: "translate(-50%, -50%)",
            animation: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
          })}
        >
          <Dialog.Close asChild>
            <div
              className={css({
                position: "absolute",
                top: "40px",
                right: "40px",
              })}
            >
              <Image
                src="/icon/arrow-left.svg"
                height={25}
                width={25}
                alt="Close"
              ></Image>
            </div>
          </Dialog.Close>

          <div
            className={center({
              width: "100%",
              textAlign: "center",
            })}
          >
            If you want to close on <br></br>different chain, select chain.
          </div>
          <div
            className={hstack({
              gap: "12px",
            })}
          >
            {chainList.map((chainName, chainIndex) => {
              const isActive = chainIndex === index;
              return (
                <div
                  key={chainName}
                  onClick={() => setIndex(chainIndex)}
                  style={
                    {
                      "--bg": isActive ? "#B8FF04" : "#53544E",
                      "--color": isActive ? "#000000" : "#FFFFFF",
                      "--amount-color": isActive ? "#393939" : "#BEC3AF",
                    } as React.CSSProperties
                  }
                  className={vstack({
                    flexGrow: "1",
                    gap: "4px",
                    backgroundColor: "var(--bg)",
                    borderRadius: "10px",
                    padding: "10px",
                    width: "160px",
                  })}
                >
                  <div
                    className={center({
                      position: "relative",
                    })}
                  >
                    <Image
                      src={
                        isActive
                          ? "/icon/black-circle.svg"
                          : "/icon/gray-circle.svg"
                      }
                      width={25}
                      height={25}
                      alt=""
                    ></Image>
                    {isActive ? (
                      <Image
                        className={css({
                          position: "absolute",
                        })}
                        src="/icon/black-checked.svg"
                        width={12}
                        height={12}
                        alt=""
                      ></Image>
                    ) : null}
                  </div>
                  <span
                    className={css({
                      fontSize: "24px",
                      color: "var(--color)",
                    })}
                  >
                    {chainName}
                  </span>
                  <span
                    className={css({
                      color: "var(--amount-color)",
                      fontSize: "16px",
                      fontWeight: "normal",
                    })}
                  >
                    20TH
                  </span>
                </div>
              );
            })}
          </div>
          <Dialog.Close asChild>
            <button
              className={center({
                marginTop: "20px",
                borderRadius: "10px",
                backgroundColor: "#53544E",
                border: "1px solid #B8FF04",
                color: "#B8FF04",
                height: "62px",
                width: "100%",
                fontSize: "28px",
                fontWeight: "bold",
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

export default CloseModal;
