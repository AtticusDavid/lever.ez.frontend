"use client";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { css } from "../../../../../../../styled-system/css";
import {
  center,
  hstack,
  vstack,
} from "../../../../../../../styled-system/patterns";
import { match } from "ts-pattern";
import React, { useState } from "react";
import Spinner from "../Spinner";
import BalanceInput from "./BalanceInput";
import Supply, { getSupplyProps } from "./Supply";
import Borrow, { getBorrowProps } from "./Borrow";
import Withdraw from "./Withdraw";
import Close from "./Close";
import { TokenKey, tokenIconMap } from "../../assets";
import useLendingStatus from "@/hooks/useLendingStatus";
import { formatUnits } from "viem";
import { prettify } from "@/utils";

const options = ["Supply", "Withdraw", "Borrow", "Close"] as const;

const spinnerWhiteSemiBold = css({
  fontSize: "14px",
  color: "white",
  fontWeight: "semibold",
});

const spinnerSmallText = css({
  fontSize: "12px",
  color: "#BEC3AF",
});

function TXDialog({ tokenName }: { tokenName: TokenKey }) {
  const [optionWidth, setOptionWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const [inputAmount, setInputAmount] = useState("");
  const [ratio, setRatio] = useState(0);
  const leverage = ratio * 3 + 1;

  const { data } = useLendingStatus();

  const balance = data
    ? `${formatUnits(
        BigInt(data.balances[tokenName].balance),
        parseInt(data.balances[tokenName].decimals)
      )}`
    : `0`;

  const balanceInputProps = {
    balance: `${prettify(balance)} ${tokenName}`,
    value: inputAmount,
    onChange: (value: string) => {
      if (value && parseInt(value) > parseInt(balance)) {
        setInputAmount(balance);
        return;
      }
      setInputAmount(value);
    },
    onClickMax: () => {
      setInputAmount(balance);
    },
  };

  function renderBody() {
    return match(options[index])
      .with("Supply", () => {
        const supplyProps = data
          ? getSupplyProps({
              inputAmount: parseInt(inputAmount || "0"),
              leverage,
              data,
              tokenName,
            })
          : {
              revenueEstimation: "0",
              compoundGovernanceToken: "0",
              supplyAmount: "0",
              borrowAmount: "0",
              supplyAPR: "0",
              borrowAPR: "0",
            };

        return (
          <>
            <BalanceInput {...balanceInputProps}>
              <Spinner
                color="#D70027"
                ratio={ratio}
                onChange={setRatio}
                title="Flashlone Leverage"
                description={{
                  start: <span className={spinnerWhiteSemiBold}>1X</span>,
                  middle: (
                    <span>
                      <span className={spinnerWhiteSemiBold}>
                        ${Math.floor(leverage * 100) / 100}X
                      </span>
                      <span className={spinnerSmallText}>
                        {" "}
                        | Current Leverage
                      </span>
                    </span>
                  ),
                  end: <span className={spinnerWhiteSemiBold}>4X</span>,
                }}
              ></Spinner>
            </BalanceInput>
            <Supply {...supplyProps}></Supply>
          </>
        );
      })
      .with("Borrow", () => {
        if (!data) return <div></div>;

        const borrowProps = getBorrowProps({
          data,
          borrowAmountInput: parseInt(inputAmount || "0"),
          tokenName,
        });
        console.log({ borrowProps });

        return (
          <>
            <BalanceInput
              description="Max Borrowable Amount"
              value={inputAmount}
              balance={`${prettify(
                borrowProps.maxBorrowableAmount,
                6
              )} ${tokenName}`}
              onChange={(value) => {
                if (
                  value &&
                  parseInt(value) > parseInt(borrowProps.maxBorrowableAmount)
                ) {
                  setInputAmount(borrowProps.maxBorrowableAmount);
                  return;
                }
                setInputAmount(value);
              }}
              onClickMax={() => {
                setInputAmount(borrowProps.maxBorrowableAmount);
              }}
            >
              <Spinner
                color="#C08FFF"
                ratio={borrowProps.afterLTV / 100}
                title="LTV"
                description={{
                  start: (
                    <span>
                      <span className={spinnerWhiteSemiBold}>
                        {Math.floor(borrowProps.currentLTV * 100) / 100}%
                      </span>
                      <span className={spinnerSmallText}> | Current LTV</span>
                    </span>
                  ),
                  middle: (
                    <span>
                      <span className={spinnerWhiteSemiBold}>
                        {Math.floor(borrowProps.afterLTV * 100) / 100}%
                      </span>
                      <span className={spinnerSmallText}> | Target LTV</span>
                    </span>
                  ),
                  end: (
                    <span>
                      <span className={spinnerSmallText}>Maximum LTV | </span>
                      <span className={spinnerWhiteSemiBold}>
                        {Math.floor(borrowProps.maxLTV * 100) / 100}%
                      </span>
                    </span>
                  ),
                }}
                markers={[
                  {
                    id: "current",
                    ratio: borrowProps.currentLTV / 100,
                  },
                  {
                    id: "max",
                    ratio: borrowProps.maxLTV / 100,
                    color: "rgba(255,0,0,0.5)",
                  },
                ]}
              ></Spinner>
            </BalanceInput>
            <Borrow {...borrowProps}></Borrow>
          </>
        );
      })
      .with("Withdraw", () => {
        return (
          <>
            <BalanceInput {...balanceInputProps}></BalanceInput>
            <Withdraw
              amountSupplied="0 ETH"
              amountBorrowed="0 ETH"
              supplyAPR="1.64%"
              rewardAPR="3.18% (1X)"
              borrowUsedRatio={0.86452}
              borrowAmount="$3,560.86"
            ></Withdraw>
          </>
        );
      })
      .with("Close", () => {
        return (
          <>
            <BalanceInput {...balanceInputProps}>
              <Spinner
                color="#0ED883"
                ratio={ratio}
                onChange={setRatio}
                title="Flashlone Deleverage"
                description={{
                  start: <span className={spinnerWhiteSemiBold}>1X</span>,
                  end: <span className={spinnerWhiteSemiBold}>0X</span>,
                }}
              ></Spinner>
            </BalanceInput>

            <Close
              currentLTV="72 %"
              targetLTV="50 %"
              supplyAmount="2k DAI + 0.28ETH"
              borrowAmount="5k DAI"
              borrowAPR="-8.3"
              rewardAPR="123 %"
            ></Close>
          </>
        );
      })
      .exhaustive();
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <div
          className={css({
            backgroundColor: "#565656",
            height: "48px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px",
            color: "white",
            fontWeight: "semibold",
            fontSize: "18px",
          })}
        >
          Manage
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          className={css({
            backgroundColor: "rgba(0,0,0,0.1)",
            position: "fixed",
            backdropFilter: "blur(1.5px)",
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
                src={tokenIconMap[tokenName]}
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
                {tokenName}
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

          {renderBody()}
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
