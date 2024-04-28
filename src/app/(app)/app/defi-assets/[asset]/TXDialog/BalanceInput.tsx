import { PropsWithChildren } from "react";
import {
  vstack,
  center,
  hstack,
} from "../../../../../../../styled-system/patterns";
import { css } from "../../../../../../../styled-system/css";

function BalanceInput(
  props: PropsWithChildren<{
    placeHolder: string;
    description?: string;
    balance: string;
    value: string;
    onChange: (value: string) => void;
    onClickMax?: () => void;
  }>
) {
  return (
    <div
      className={vstack({
        padding: "17px 25px",
        backgroundColor: "#2C2C2B",
        alignItems: "flex-start",
        borderRadius: "10px",
      })}
    >
      <span
        className={css({
          fontWeight: "semibold",
        })}
      >
        {props.description ?? "Token Balance"}
      </span>
      <span
        className={css({
          fontWeight: "semibold",
          fontSize: "26px",
          color: "white",
        })}
      >
        {props.balance}
      </span>
      <div
        className={hstack({
          backgroundColor: "#565656",
          width: "100%",
          borderRadius: "10px",
        })}
      >
        <input
          type="number"
          value={props.value}
          onChange={(e) => {
            props.onChange(e.target.value);
          }}
          className={css({
            paddingLeft: "7px",
            flexGrow: "1",
            background: "none",
          })}
          placeholder={props.placeHolder}
        ></input>
        <button
          onClick={() => {
            if (props.onClickMax) props.onClickMax();
          }}
          className={center({
            borderRadius: "10px",
            margin: "5px",
            padding: "5px 15px",
            fontSize: "18px",
            fontWeight: "semibold",
            backgroundColor: "#B8FF04",
            color: "black",
          })}
        >
          Max
        </button>
      </div>
      {props.children}
    </div>
  );
}

export default BalanceInput;
