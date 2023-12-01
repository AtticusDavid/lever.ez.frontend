"use client";

import Link from "next/link";
import assets from "./defi-assets/assets";
import { css } from "../../../styled-system/css";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

const activeStyle = {
  fontSize: "20px",
  fontWeight: "bold",
} as const;
export default function RootLayout(props: any) {
  const pathname = usePathname();

  const isDefiAssetPages = pathname.startsWith("/app/defi-assets");
  const [isFolded, setFold] = useState(!isDefiAssetPages);
  return (
    <main
      className={css({
        display: "flex",
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
          height: "100vh",
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
                ...(pathname.startsWith("/app/defi-assets")
                  ? activeStyle
                  : undefined),
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
                  transform: `rotate(${isFolded ? "180deg" : "0deg"})`,
                  // transform: `rotate(180deg)`,
                })}
              ></Image>
              {isFolded}
            </span>
            <div
              className={css({
                display: isFolded ? "none" : "flex",
                flexDirection: "column",
              })}
            >
              {assets.map((x) => {
                const href = `/app/defi-assets/${x.name.toLowerCase()}`;
                return (
                  <Link
                    key={x.name}
                    href={href}
                    className={css(pathname === href ? activeStyle : undefined)}
                  >
                    {x.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
      <section>{props.children}</section>
    </main>
  );
}
