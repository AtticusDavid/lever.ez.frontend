"use client";
import { useParams, useRouter } from "next/navigation";
import { object, string } from "yup";
import assets from "../assets";
import DashBoardSection from "../../DashBoardSection";
import { css } from "../../../../../../styled-system/css";
import DashBoardOverviewStatus from "../../DashBoardOverviewStatus";
import PositionCard from "./PositionCard";
import { hstack, vstack } from "../../../../../../styled-system/patterns";
import UserIndicator from "./UserIndicator";
import CloseModal from "./CloseModal";
import { useQuery } from "wagmi";
import { LendingStatusResponse } from "@/app/api/lending-status/route";

const paramsSchema = object({
  asset: string()
    .required()
    .oneOf(assets.filter((x) => x.isActive).map((x) => x.name.toLowerCase())),
}).required();

const tokenWhitelist = ["DAI", "USDT", "USDC", "WETH"] as const;

const tokenIconMap: Record<(typeof tokenWhitelist)[number], string> = {
  DAI: "/assets/dai.svg",
  USDC: "/assets/usdc.svg",
  USDT: "/assets/usdt.svg",
  WETH: "/assets/eth.svg",
};

export default function DefiAssets() {
  const params = useParams();

  const { data } = useQuery(["lending-status"], () =>
    fetch("/api/lending-status").then(
      (r) => r.json() as Promise<LendingStatusResponse>
    )
  );

  console.log({ data });
  paramsSchema.validateSync(params);

  const supplied = data ? data.user.totalCollateralUSD : 0;
  const borrowed = data ? data.user.totalDebtUSD : 0;
  const netWorth = supplied - borrowed;

  const currentLTV = data ? (supplied ? borrowed / supplied : 0) : 0;
  const maxLTV = data ? data.user.ltv : 0;

  return (
    <div
      className={css({
        display: "flex",
        color: "white",
        flexDirection: "column",
        alignItems: "center",
        gap: "60px",
      })}
    >
      <DashBoardSection title="Overview">
        <div className={vstack({})}>
          <div
            className={css({
              display: "flex",
              gap: "18px",
            })}
          >
            <DashBoardOverviewStatus
              description="Net Worth"
              color="#ffffff"
              balance={netWorth}
              iconSrc="/icon/net-worth.png"
            ></DashBoardOverviewStatus>
            <DashBoardOverviewStatus
              description="Supplied"
              color="#B8FF04"
              balance={supplied}
              iconSrc="/icon/supplied.png"
            ></DashBoardOverviewStatus>
            <DashBoardOverviewStatus
              description="Borrowed"
              color="#C08FFF"
              balance={borrowed}
              iconSrc="/icon/borrowed.png"
            ></DashBoardOverviewStatus>
          </div>
          <UserIndicator
            ratio={0.7}
            description="Are you Degen Apes?"
            color="red"
          ></UserIndicator>
        </div>
      </DashBoardSection>
      <DashBoardSection title="Your Positions">
        <div
          className={hstack({
            flexWrap: "wrap",
          })}
        >
          {data
            ? tokenWhitelist
                .filter((x) => x in data)
                .map((itemKey) => {
                  return (
                    <PositionCard
                      key={itemKey}
                      iconSrc={tokenIconMap[itemKey]}
                      netWorth={0}
                      supply={0}
                      borrow={0}
                      badgeColor="#D70027"
                      badgeText="Dangerous"
                    ></PositionCard>
                  );
                })
            : null}
        </div>
      </DashBoardSection>
      <CloseModal></CloseModal>
    </div>
  );
}
