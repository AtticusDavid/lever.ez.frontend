import { css } from "../../../../styled-system/css";
import Image from "next/image";

type DashboardStatusProps = {
  balance: number;
  description: string;
  color: string;
  iconSrc: string;
};

function DashBoardOverviewStatus({
  balance,
  description,
  color,
  iconSrc,
}: DashboardStatusProps) {
  return (
    <div
      className={css({
        boxSizing: "border-box",
        display: "flex",
        flexGrow: "1",
        minWidth: "220px",
        justifyContent: "space-between",
        borderRadius: "10px",
        border: `1px solid var(--border-color)`,
        backgroundColor: "#2C2C2B",
        padding: "13px 18px",
        position: "relative",
      })}
      style={
        {
          ["--border-color"]: color,
        } as React.CSSProperties
      }
    >
      <div
        className={css({
          display: "flex",
          fontWeight: "semibold",
          flexDirection: "column",
          justifyContent: "space-between",
        })}
      >
        <span
          className={css({
            fontSize: "26px",
            color,
          })}
        >
          $ {Math.floor(balance * 100) / 100}
        </span>
        <span
          className={css({
            fontSize: "14px",
            color: "#BEC3AF",
          })}
        >
          {description}
        </span>
      </div>
      <div
        className={css({
          height: "100%",
        })}
      >
        <Image src={iconSrc} alt="" width={60} height={60}></Image>
      </div>
    </div>
  );
}

export default DashBoardOverviewStatus;
