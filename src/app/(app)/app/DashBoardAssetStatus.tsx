"use client";

import { css } from "../../../../styled-system/css";
import Image from "next/image";

type DashBoardAssetStatusProps = {
  iconSrc: string;
  assetName: string;
  onClick?: () => void;
  isActive: boolean;
};

function DashBoardAssetStatus({
  assetName,
  iconSrc,
  onClick,
  isActive,
}: DashBoardAssetStatusProps) {
  return (
    <div
      onClick={() => onClick && onClick()}
      className={`${css({
        minWidth: "410px",
        flexGrow: "1",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: "10px",
        backgroundColor: "#2C2C2B",
        opacity: isActive ? 1 : 0.5,
        padding: "23px",
        _hover: {
          backgroundColor: "#4C4C4B",
        },
        _active: {
          backgroundColor: "#B8FF04",
        },
      })} group`}
    >
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        })}
      >
        <div
          className={css({
            display: "flex",
            gap: "20px",
            alignItems: "center",
          })}
        >
          <Image src={iconSrc} height={60} width={60} alt=""></Image>
          <span
            className={css({
              fontSize: "26px",
              fontWeight: "semibold",
              color: "white",
              _groupActive: {
                color: "black",
              },
            })}
          >
            {assetName}
          </span>
        </div>
      </div>
      <span
        className={css({
          fontSize: "20px",
          fontWeight: "semibold",
          color: isActive ? "#B8FF04" : "#BEC3AF",
          _groupActive: {
            color: "black",
          },
        })}
      >
        {isActive ? "Manage" : "Preparing..."}
      </span>
    </div>
  );
}

export default DashBoardAssetStatus;
