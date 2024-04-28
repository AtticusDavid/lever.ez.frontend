import { css } from "../../../../../../styled-system/css";
import {
  circle,
  hstack,
  vstack,
} from "../../../../../../styled-system/patterns";

function UserIndicator({
  description,
  color,
  ratio,
  position,
}: {
  description: string;
  color: string;
  ratio: number;
  position: string;
}) {
  return (
    <div
      style={
        {
          "--color": color,
        } as React.CSSProperties
      }
      className={vstack({
        borderRadius: "10px",
        alignItems: "stretch",
        padding: "22px 46px",
        width: "100%",
        color: "#BEC3AF",
        backgroundColor: "#2C2C2B",
      })}
    >
      <div
        className={vstack({
          position: "relative",
        })}
      >
        <div
          className={hstack({
            justifyContent: "space-between",
            width: "100%",
            fontSize: "14px",
          })}
        >
          <span>no debt</span>
          <span>liquidation</span>
        </div>
        <div
          className={css({
            width: "100%",
          })}
        >
          <div
            className={css({
              backgroundColor: "#53544E",
              height: "20px",
              borderRadius: "10px",
              padding: "5px",
              position: "relative",
            })}
          >
            <div
              style={
                {
                  "--ratio": `${Math.floor(ratio * 100)}%`,
                } as React.CSSProperties
              }
              className={circle({
                backgroundColor: "var(--color)",
                height: "10px",
                width: "calc(var(--ratio) - 10px)",
                position: "absolute",
              })}
            ></div>

            <div
              className={css({
                position: "absolute",
                top: "0",
                left: "calc(33% - 2px)",
                width: "5px",
                height: "20px",
                backgroundColor: "#393939",
                opacity: "0.7",
              })}
            ></div>
            <div
              className={css({
                position: "absolute",
                top: "0",
                left: "calc(66% - 2px)",
                width: "5px",
                height: "20px",
                backgroundColor: "#393939",
                opacity: "0.7",
              })}
            ></div>
          </div>
        </div>
      </div>
      <div
        style={
          {
            "--position": position,
          } as React.CSSProperties
        }
        className={css({
          color: "var(--color)",
          fontWeight: "semibold",
          alignSelf: "var(--position)",
        })}
      >
        {description}
      </div>
    </div>
  );
}

export default UserIndicator;
