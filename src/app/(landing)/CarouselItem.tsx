import { css } from "../../../styled-system/css";
import Image from "next/image";
import {
  center,
  circle,
  hstack,
  vstack,
} from "../../../styled-system/patterns";

function CarouselItem() {
  return (
    <div
      className={vstack({
        position: "relative",
        backgroundColor: "#393939",
        width: "260px",
        borderRadius: "15px",
        overflow: "hidden",
      })}
    >
      <div
        className={vstack({
          width: "100%",
          padding: "25px 20px 10px 20px",
          gap: "22px",
          alignItems: "flex-start",
        })}
      >
        <div
          className={hstack({
            gap: "0px",
            fontSize: "18px",
            fontWeight: "semibold",
          })}
        >
          <Image
            src="/token-pair.png"
            alt=""
            height={30}
            width={53}
            className={css({
              marginRight: "5px",
            })}
          ></Image>

          <span>
            ETH{" "}
            <span
              className={css({
                color: "#959A87",
              })}
            >
              | Base
            </span>
          </span>
        </div>

        <div
          className={circle({
            width: "160px",
            height: "3px",
            backgroundColor: "#53544E",
          })}
        ></div>
        <div
          className={circle({
            width: "160px",
            height: "3px",
            backgroundColor: "#53544E",
          })}
        ></div>
      </div>
      <div
        className={hstack({
          width: "100%",
          backgroundColor: "#565656",
          color: "#C5CAB5",
          fontWeight: "semibold",
          fontSize: "14px",
          height: "50px",
        })}
      >
        <div
          className={center({
            width: "50%",
            height: "100%",
            borderRight: "2px solid #686A62",
          })}
        >
          App
        </div>
        <div className={center({ width: "50%" })}>Market</div>
      </div>
    </div>
  );
}

export default CarouselItem;
