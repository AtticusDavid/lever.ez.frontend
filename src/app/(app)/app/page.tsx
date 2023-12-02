import DashboardSection from "@/app/(app)/app/DashBoardSection";
import { css } from "../../../../styled-system/css";
import DashBoardOverviewStatus from "@/app/(app)/app/DashBoardOverviewStatus";
import assets from "./defi-assets/assets";
import DashBoardAssetStatus from "./DashBoardAssetStatus";

export default function DashBoard() {
  return (
    <div
      className={css({
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      })}
    >
      <div
        className={css({
          display: "flex",
          justifyContent: "center",
          // alignItems: "stretch",
          flexDirection: "column",
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
        <DashboardSection title="DefiAssets">
          <div
            className={css({
              display: "inline-flex",
              flexDirection: {
                base: "column",
                xl: "row",
              },
              alignItems: "center",
              flexWrap: {
                base: "nowrap",
                xl: "wrap",
              },
              gap: "18px",
            })}
          >
            {assets.map((asset) => (
              <DashBoardAssetStatus
                key={asset.name}
                assetName={asset.name}
                isActive={asset.isActive}
                iconSrc={asset.icon}
              ></DashBoardAssetStatus>
            ))}
          </div>
        </DashboardSection>
      </div>
    </div>
  );
}
