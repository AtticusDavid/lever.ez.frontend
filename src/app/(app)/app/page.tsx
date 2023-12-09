"use client";

import DashboardSection from "@/app/(app)/app/DashBoardSection";
import { css } from "../../../../styled-system/css";
import DashBoardOverviewStatus from "@/app/(app)/app/DashBoardOverviewStatus";
import assets from "./defi-assets/assets";
import DashBoardAssetStatus from "./DashBoardAssetStatus";
import { useRouter } from "next/navigation";

export default function DashBoard() {
  const router = useRouter();

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
            balance={0}
            iconSrc="/icon/net-worth.png"
          ></DashBoardOverviewStatus>
          <DashBoardOverviewStatus
            description="Supplied"
            color="#B8FF04"
            balance={0}
            iconSrc="/icon/supplied.png"
          ></DashBoardOverviewStatus>
          <DashBoardOverviewStatus
            description="Borrowed"
            color="#C08FFF"
            balance={0}
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
