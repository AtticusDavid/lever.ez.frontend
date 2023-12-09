"use client";
import ReactLoading from "react-loading";
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
import Withdraw, { getWithdrawProps } from "./Withdraw";
import Close, { getCloseProps } from "./Close";
import { TokenKey, tokenIconMap } from "../../assets";
import useLendingStatus, {
  Network,
  mapChainName,
} from "@/hooks/useLendingStatus";
import { formatUnits, maxUint256, parseAbi } from "viem";
import { prettify } from "@/utils";
import {
  erc20ABI,
  readContract,
  sendTransaction,
  waitForTransaction,
  writeContract,
} from "@wagmi/core";
import { useAccount, useMutation, useNetwork, useQuery } from "wagmi";
import {
  AAVE_V3_DEBT_TOKENS,
  MINTABLE_ERC20_TOKENS,
  leveragerAddress,
} from "@/hardhat/constants";
declare global {
  interface Window {
    ethereum: any;
  }
}

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

function useAllowance({
  chainAddress,
  address,
}: {
  chainAddress: `0x${string}`;
  address?: `0x${string}`;
}) {
  const { chain } = useNetwork();
  const network = mapChainName(chain?.name);

  return useQuery(
    ["allowance", address],
    () => {
      return readContract({
        abi: erc20ABI,
        address: chainAddress,
        functionName: "allowance",
        args: [
          address as `0x${string}`,
          leveragerAddress[network as Network] as `0x${string}`,
        ],
      });
    },
    {
      enabled: address && Boolean(network),
    }
  );
}
function TXDialog({ tokenName }: { tokenName: TokenKey }) {
  const [optionWidth, setOptionWidth] = useState(0);
  const [index, _setIndex] = useState(0);

  const { chain } = useNetwork();
  const { address } = useAccount();

  const { mutate: supply, isLoading: supplyIsLoading } = useMutation({
    mutationFn: ({
      txData,
      network,
    }: {
      txData: `0x${string}`;
      network: Network;
    }) => {
      return sendTransaction({
        data: txData,
        to: leveragerAddress[network],
      }).then((res) => {
        return waitForTransaction({
          hash: res.hash,
        });
      });
    },
  });

  const network = mapChainName(chain?.name);

  const { data: allowanceData } = useAllowance({
    address,
    chainAddress: MINTABLE_ERC20_TOKENS[network as Network][tokenName],
  });

  const { data: debtAllowanceData } = useAllowance({
    address,
    chainAddress: AAVE_V3_DEBT_TOKENS[network as Network][
      tokenName
    ] as `0x${string}`,
  });

  const needApprove = allowanceData === 0n || debtAllowanceData === 0n;

  const [inputAmount, setInputAmount] = useState("");
  const setIndex = (value: number) => {
    // reset inputamount;
    setInputAmount("");
    _setIndex(value);
  };
  const [ratio, setRatio] = useState(0);
  const leverage = ratio * 3 + 1;

  const { data, refetch } = useLendingStatus();

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
        if (!data || !network || !address) return <div></div>;

        const supplyProps = getSupplyProps({
          inputAmount: parseInt(inputAmount || "0"),
          leverage,
          data,
          tokenName,
          network,
        });

        return (
          <>
            <BalanceInput {...balanceInputProps} placeHolder="Amount to Supply">
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
              onClick={async () => {
                try {
                  const leverager = leveragerAddress[network] as `0x${string}`;
                  let count = 0;

                  console.log({ allowanceData, debtAllowanceData });
                  if (allowanceData === 0n) {
                    const result = await writeContract({
                      abi: erc20ABI,
                      functionName: "approve",
                      args: [leverager, maxUint256],
                      address: MINTABLE_ERC20_TOKENS[network][tokenName],
                    });

                    count++;
                    console.log({ result });
                  }
                  if (debtAllowanceData === 0n) {
                    const result = await writeContract({
                      abi: parseAbi([
                        "function approveDelegation(address delegatee, uint256 amount)",
                      ]),
                      functionName: "approveDelegation",
                      args: [leverager, maxUint256],
                      address: AAVE_V3_DEBT_TOKENS[network][
                        tokenName
                      ] as `0x${string}`,
                    });

                    count++;
                    console.log({ result });
                  }
                  if (count > 1) {
                    refetch();
                    return;
                  }

                  supply({
                    txData: supplyProps.data,
                    network,
                  });
                } catch (e) {
                  console.error(e);
                }
              }}
            >
              {supplyIsLoading ? (
                <ReactLoading
                  type="spin"
                  height={40}
                  width={40}
                  color="black"
                ></ReactLoading>
              ) : needApprove ? (
                "Approve"
              ) : (
                "Supply"
              )}
            </button>
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

        return (
          <>
            <BalanceInput
              placeHolder="Amount to Borrow"
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
        if (!data) return;

        const withdrawProps = getWithdrawProps({
          data,
          tokenName,
        });

        return (
          <>
            <BalanceInput
              placeHolder="Amount to Withdraw"
              description="Max Withdrawable Amount"
              value={inputAmount}
              balance={`${prettify(
                withdrawProps.withdrawableAmount,
                6
              )} ${tokenName}`}
              onChange={(value) => {
                if (
                  value &&
                  parseInt(value) > parseInt(withdrawProps.withdrawableAmount)
                ) {
                  setInputAmount(withdrawProps.withdrawableAmount);
                  return;
                }
                setInputAmount(value);
              }}
              onClickMax={() => {
                setInputAmount(withdrawProps.withdrawableAmount);
              }}
            ></BalanceInput>
            <Withdraw {...withdrawProps}></Withdraw>
          </>
        );
      })
      .with("Close", () => {
        if (!data) return;

        const closeProps = getCloseProps({
          data,
          token: tokenName,
        });

        const deleverage = 1 - ratio;

        return (
          <>
            <BalanceInput {...balanceInputProps} placeHolder="Amount to Close">
              <Spinner
                color="#0ED883"
                ratio={ratio}
                onChange={setRatio}
                title="Flashlone Deleverage"
                description={{
                  start: <span className={spinnerWhiteSemiBold}>1X</span>,
                  middle: (
                    <span>
                      <span className={spinnerWhiteSemiBold}>
                        ${Math.floor(deleverage * 100) / 100}X
                      </span>
                      <span className={spinnerSmallText}> | current</span>
                    </span>
                  ),
                  end: <span className={spinnerWhiteSemiBold}>0X</span>,
                }}
              ></Spinner>
            </BalanceInput>

            <Close {...closeProps}></Close>
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default TXDialog;
