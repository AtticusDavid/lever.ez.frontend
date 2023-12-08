import { css } from "../../../../../../../styled-system/css";
import { hstack, vstack } from "../../../../../../../styled-system/patterns";
import Spinner from "../Spinner";

type WithdrawProps = {
  amountSupplied: string;
  amountBorrowed: string;
  supplyAPR: string;
  rewardAPR: string;
  borrowUsedRatio: number;
  borrowAmount: string;
};

function Withdraw(props: WithdrawProps) {
  const data = [
    { label: "Amount Supplied", value: props.amountSupplied },
    { label: "Amount Borrowed", value: props.amountBorrowed },
    { label: "Supply APR", value: props.supplyAPR },
    { label: "Reward APR", value: props.rewardAPR },
  ];
  return (
    <div>
      <div
        className={css({
          color: "#BEC3AF",
          fontSize: "18px",
          fontWeight: "semibold",
        })}
      >
        Withdrawable Amount
      </div>
      <div
        className={css({
          color: "#53544E",
          margin: "20px 0",
          fontSize: "16px",
        })}
      >
        My Stats
      </div>
      <div>
        {data.map((item) => {
          return (
            <div
              key={item.label}
              className={hstack({
                justifyContent: "space-between",
                marginBottom: "12px",
              })}
            >
              <div
                className={css({
                  fontWeight: "semibold",
                  color: "#BEC3AF",
                })}
              >
                {item.label}
              </div>
              <div>{item.value}</div>
            </div>
          );
        })}
      </div>
      <Spinner
        color="#C08FFF"
        ratio={props.borrowUsedRatio}
        description={{
          start: (
            <span>
              <span
                className={css({
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "semibold",
                })}
              >
                {Math.floor(props.borrowUsedRatio * 100) / 100}%
              </span>
              <span
                className={css({
                  fontSize: "12px",
                })}
              >
                {" "}
                | Borrow used
              </span>
            </span>
          ),
          end: (
            <span
              className={css({
                fontWeight: "semibold",
                color: "white",
              })}
            >
              {props.borrowAmount}
            </span>
          ),
        }}
      ></Spinner>
    </div>
  );
}

export default Withdraw;
