import Image from "next/image";
import { css } from "../../../styled-system/css";
import Link from "next/link";

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
        <Image
          src="/logo.png"
          alt="logo"
          width={100}
          height={100}
          className={css({ marginBottom: "50px" })}
        ></Image>
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          })}
        >
          <Image
            src="/slogan.svg"
            alt="Revolutionize yield Farming with Leverage"
            width={800}
            height={345}
            className={css({ marginBottom: "80px" })}
          ></Image>

          <div
            className={css({
              fontWeight: "24px",
              marginBottom: "60px",
              maxWidth: "990px",
            })}
          >
            Unlock a new investment era with Lever EZ, maximizing profits
            through leverage and optimizing costs with efficient gas fees.
            Introducing Flash Loans to tackle gas fee challenges in looping
            investments, empowering users to leverage with minimal fees.
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
        </div>
      </div>
    </main>
  );
}
