"use client";

import { css } from "../../../../styled-system/css";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import NavigationBar from "./NavigationBar";
import ReactLoading from "react-loading";

export default function RootLayout(props: any) {
  const [isClientRendered, setClientRendered] = useState(false);

  useEffect(() => {
    setClientRendered(true);
  }, []);

  const account = useAccount();
  const { openConnectModal } = useConnectModal();
  return (
    <div
      className={css({
        display: "flex",
        backgroundColor: "black",
        minHeight: "100vh",
      })}
    >
      <NavigationBar />
      <section
        className={css({
          flexGrow: 1,
        })}
      >
        <header
          className={css({
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxSizing: "border-box",
            padding: "60px 50px 50px 60px",
          })}
        >
          <Image
            src="/dashboard-title.svg"
            alt="dashboard"
            width={252}
            height={50}
          ></Image>
          <>
            {!isClientRendered ? (
              <div></div>
            ) : account.isConnected ? (
              <ConnectButton></ConnectButton>
            ) : (
              <button
                className={css({
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "10px 28px",
                  height: "45px",
                  borderRadius: "200px",
                  color: "black",
                  backgroundColor: "#B8FF04",
                  fontSize: 18,
                  fontWeight: "semibold",
                })}
                onClick={() => {
                  if (openConnectModal) openConnectModal();
                }}
              >
                Connect Wallet
              </button>
            )}
          </>
        </header>
        {props.children}
      </section>
    </div>
  );
}
