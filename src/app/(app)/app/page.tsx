"use client";

import DashboardSection from "@/app/(app)/app/DashBoardSection";
import { css } from "../../../../styled-system/css";
import DashBoardOverviewStatus from "@/app/(app)/app/DashBoardOverviewStatus";
import assets from "./defi-assets/assets";
import DashBoardAssetStatus from "./DashBoardAssetStatus";
import { useRouter } from "next/navigation";
import useLendingStatus from "@/hooks/useLendingStatus";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { center } from "../../../../styled-system/patterns";
import ReactLoading from "react-loading";

export default function DashBoard() {
  const router = useRouter();

  const [rendered, setRendered] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    setRendered(true);
  }, []);

  const { data, isLoading } = useLendingStatus();
  const supplied = data ? data.status.user.totalCollateralUSD : 0;
  const borrowed = data ? data.status.user.totalDebtUSD : 0;
  const netWorth = supplied - borrowed;

  const dashboardAssetRenderer = (asset: (typeof assets)[number]) => {
    return (
      <DashBoardAssetStatus
        onClick={() => {
          if (!asset.isActive) return;
          router.push(`/app/defi-assets/${asset.name.toLowerCase()}`);
        }}
        key={asset.name}
        assetName={asset.name}
        isActive={asset.isActive}
        iconSrc={asset.icon}
      ></DashBoardAssetStatus>
    );
  };

  if (isLoading || !rendered) {
    return (
      <div
        className={center({
          height: "300px",
        })}
      >
        <ReactLoading
          type="spin"
          height={40}
          width={40}
          color="white"
        ></ReactLoading>
      </div>
    );
  }

  if (!address) {
    return (
      <div
        className={center({
          height: "100px",
          color: "white",
        })}
      >
        Please connect your account.
      </div>
    );
  }

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "60px",
      })}
    >
      <DashboardSection title="Overview">
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
      </DashboardSection>
      <DashboardSection title="Defi Assets">
        {/* 2row */}
        <div
          className={css({
            display: {
              base: "none",
              xl: "flex",
            },
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "18px",
          })}
        >
          {[0, 1].map((x) => (
            <div
              key={x}
              className={css({
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              })}
            >
              {assets
                .filter((_, index) => index % 2 === x)
                .map(dashboardAssetRenderer)}
            </div>
          ))}
        </div>
        {/* 1row */}
        <div
          className={css({
            display: {
              base: "flex",
              xl: "none",
            },
            flexDirection: "column",
            alignItems: "center",
            gap: "18px",
          })}
        >
          {assets.map(dashboardAssetRenderer)}
        </div>
      </DashboardSection>
    </div>
  );
}
