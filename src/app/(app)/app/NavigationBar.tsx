"use client";

import Link from "next/link";
import { css } from "../../../../styled-system/css";
import { hstack } from "../../../../styled-system/patterns";
import Image from "next/image";
import assets from "./defi-assets/assets";
import { useState } from "react";
import { usePathname } from "next/navigation";

const activeStyle = {
  fontSize: "20px",
  fontWeight: "semibold",
} as const;

function NavigationBar() {
  const [isFolded, setFold] = useState(false);
  const pathname = usePathname();
  return (
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
          className={hstack({
            ...(pathname === "/app" ? activeStyle : undefined),
            display: "flex",
            gap: "25px",
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
            className={hstack({
              display: "flex",
              justifyContent: "space-between",
              gap: "25px",
              paddingRight: "20px",
              margin: "25px 0 16px 0",
            })}
          >
            <div
              className={hstack({
                gap: "25px",
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
            </div>
            <Image
              src="/icon/nav-arrowdown.svg"
              alt=""
              width={10}
              height={10}
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
              gap: "15px",
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
                    className={hstack(
                      pathname === href ? activeStyle : undefined
                    )}
                  >
                    <Image
                      src={x.icon}
                      width={20}
                      height={20}
                      alt=""
                      className={css({
                        marginRight: "18px",
                      })}
                    ></Image>
                    {x.name}
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
