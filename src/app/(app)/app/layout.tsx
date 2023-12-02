"use client";

import Link from "next/link";
import assets from "./defi-assets/assets";
import { css } from "../../../../styled-system/css";
import { usePathname } from "next/navigation";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const activeStyle = {
  fontSize: "20px",
  fontWeight: "bold",
} as const;
export default function RootLayout(props: any) {
  const pathname = usePathname();
  const isDefiAssetPages = pathname.startsWith("/app/defi-assets");
  const [isClientRendered, setClientRendered] = useState(false);

  useEffect(() => {
    setClientRendered(true);
  }, []);

  const [isFolded, setFold] = useState(false);
  const account = useAccount();
  const { openConnectModal } = useConnectModal();
  return (
    <main
      className={css({
        display: "flex",
        backgroundColor: "black",
        minHeight: "100vh",
      })}
    >
      <nav
        className={css({
          display: "flex",
          flexDirection: "column",
          fontSize: "16px",
          backgroundColor: "#202020",
          color: "white",
          width: "256px",
          minWidth: "256px",
        })}
      >
        <div
          className={css({
            display: "flex",
            gap: "10px",
            marginBottom: "56px",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "61px",
          })}
        >
          <Image src="/logo.png" width={35} height={35} alt={""}></Image>
          <Image
            src="/lever.ez-logo.png"
            width={179}
            height={45}
            alt={""}
          ></Image>
        </div>
        <div className={css({ marginLeft: "35px", position: "relative" })}>
          <Link
            className={css({
              ...(pathname === "/app" ? activeStyle : undefined),
              display: "flex",
              gap: "10px",
            })}
            href="/app"
          >
            <Image
              src="/icon/dashboard.svg"
              alt=""
              width={15}
              height={15}
              className={css({})}
            ></Image>
            Dashboard
          </Link>
          <div>
            <span
              className={css({
                display: "flex",
                gap: "10px",
                ...(isDefiAssetPages ? activeStyle : undefined),
              })}
            >
              <Image
                src="/icon/defi-assets.svg"
                alt=""
                width={20}
                height={20}
                className={css({})}
              ></Image>
              DeFi Assets
              <Image
                src="/icon/nav-arrowdown.svg"
                alt=""
                width={20}
                height={20}
                onClick={() => setFold((v) => !v)}
                className={css({
                  transform: `rotate(var(--deg))`,
                })}
                style={
                  {
                    ["--deg"]: isFolded ? "180deg" : "0deg",
                  } as React.CSSProperties
                }
              ></Image>
              {isFolded}
            </span>
            <div
              className={css({
                display: isFolded ? "none" : "flex",
                flexDirection: "column",
              })}
            >
              {assets
                .filter((x) => x.isActive)
                .map((x) => {
                  const href = `/app/defi-assets/${x.name.toLowerCase()}`;
                  return (
                    <Link
                      key={x.name}
                      href={href}
                      className={css(
                        pathname === href ? activeStyle : undefined
                      )}
                    >
                      {x.name}
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      </nav>
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
            {isClientRendered && account.isConnected ? (
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
    </main>
  );
}
