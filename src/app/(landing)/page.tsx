import Image from "next/image";
import { css } from "../../../styled-system/css";
import Link from "next/link";
import { center, hstack } from "../../../styled-system/patterns";
import CarouselItem from "./CarouselItem";

export default function Home() {
  return (
    <main
      className={css({
        color: "white",
        backgroundColor: "black",
      })}
    >
      <div
        className={css({
          fontWeight: "bold",
        })}
      >
        <div
          className={center({
            height: "100px",
            width: "100px",
          })}
        >
          <Image src="/logo3x.png" alt="logo" width={60} height={60}></Image>
        </div>

        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          })}
        >
          <Image
            src="/lever.png"
            alt=""
            width={100}
            height={100}
            className={css({
              margin: "30px 0 80px 0",
            })}
          ></Image>
          <div
            className={center({
              fontFamily: "var(--font-dogica)",
              fontSize: "84px",
              fontWeight: "bold",
            })}
          >
            Pull the lever,<br></br> Easy Success!
          </div>

          <div
            className={css({
              fontSize: "36px",
              fontWeight: "semibold",
              margin: "50px 0 80px 0",
            })}
          >
            #Leverage #Easy #HugeGains #Success
          </div>

          <Link
            href="/app"
            className={css({
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "16px 44px 16px 30px",
              marginBottom: "60px",
              height: "65px",
              borderRadius: "200px",
              color: "black",
              backgroundColor: "#B8FF04",
              fontSize: 24,
              fontWeight: "semibold",
            })}
          >
            <Image
              src="/icon/export.png"
              alt=""
              height={16}
              width={16}
              className={css({ marginRight: "25px" })}
            ></Image>
            View App
          </Link>

          <div
            className={hstack({
              alignItems: "flex-start",
              gap: "20px",
              animationDuration: "4s",
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationName: "carousel",
            })}
          >
            {Array.from({ length: 20 }).map((_, index) => {
              return <CarouselItem key={index}></CarouselItem>;
            })}
          </div>
          <div
            className={css({
              backgroundColor: "#202020",
              marginTop: "80px",
            })}
          ></div>
        </div>
      </div>
    </main>
  );
}
