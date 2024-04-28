import { css } from "../../../../../../styled-system/css";
import Image from "next/image";
import { center } from "../../../../../../styled-system/patterns";
import React from "react";
import TXDialog from "./TXDialog";
import { TokenKey } from "../assets";

function PositionCard({
  tokenName,
  iconSrc,
  netWorth,
  supply,
  borrow,
  badgeText,
  badgeColor,
}: {
  tokenName: TokenKey;
  iconSrc: string;
  netWorth: string;
  supply: string;
  borrow: string;
  badgeText: string;
  badgeColor: string;
}) {
  return (
    <div
      className={css({
        borderRadius: "10px",
        backgroundColor: "#2C2C2B",
        minWidth: "430px",
        display: "flex",
        flexDirection: "column",
      })}
    >
      <div
        className={css({
          height: "104px",
          display: "flex",
          padding: "20px 30px",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "2px solid #565656",
        })}
      >
        <div
          className={css({
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
          })}
        >
          <Image src={iconSrc} height={64} width={64} alt=""></Image>
          <div
            className={css({
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            })}
          >
            <div
              className={css({
                fontSize: "26px",
                fontWeight: "semibold",
              })}
            >
              $ {netWorth}
            </div>
            <div
              className={css({
                color: "#C5CAB5",
                fontSize: "14px",
              })}
            >
              Net Worth
            </div>
          </div>
        </div>
        <div>
          <div
            style={
              {
                "--badge-color": badgeColor,
              } as React.CSSProperties
            }
            className={center({
              padding: "3px 14px",
              borderRadius: "5px",
              backgroundColor: "rgba(var(--badge-color), 0.2)",
              color: "var(--badge-color)",
              fontSize: "14px",
              fontWeight: "semibold",
              border: "1px solid var(--badge-color)",
            })}
          >
            {badgeText}
          </div>
        </div>
      </div>
      <div
        className={css({
          display: "flex",
        })}
      >
        {[
          {
            name: "Supply",
            color: "#B8FF04",
            value: supply,
          },
          {
            name: "Borrow",
            color: "#C08FFF",
            value: borrow,
          },
        ].map((item, index) => (
          <div
            key={item.name}
            className={css({
              flexGrow: "1",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              padding: "17px 0",
              boxSizing: "border-box",
              alignItems: "center",
              borderRight: index === 0 ? "2px solid #565656" : "none",
              color: item.color,
            })}
          >
            <div
              className={css({
                fontSize: "26px",
                fontWeight: "semibold",
              })}
            >
              {item.value} $
            </div>
            <div className={css({ fontSize: "14px" })}>{item.name}</div>
          </div>
        ))}
      </div>

      <TXDialog tokenName={tokenName}></TXDialog>
    </div>
  );
}

export default PositionCard;
