"use client";
import { useParams, useRouter } from "next/navigation";
import { object, string } from "yup";
import assets from "../assets";
import DashBoardSection from "../../DashBoardSection";
import { css } from "../../../../../../styled-system/css";
import DashBoardOverviewStatus from "../../DashBoardOverviewStatus";
import PositionCard from "./PositionCard";
import { vstack } from "../../../../../../styled-system/patterns";
import UserIndicator from "./UserIndicator";
import TXDialog from "./TXDialog";
import CloseModal from "./CloseModal";

const paramsSchema = object({
  asset: string()
    .required()
    .oneOf(assets.map((x) => x.name.toLowerCase())),
}).required();

export default function DefiAssets() {
  const params = useParams();

  paramsSchema.validateSync(params);

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
          <UserIndicator
            ratio={0.7}
            description="Are you Degen Apes?"
            color="red"
          ></UserIndicator>
        </div>
      </DashBoardSection>
      <DashBoardSection title="Your Positions">
        <PositionCard
          iconSrc="/assets/uniswap-v3.png"
          netWorth={0}
          supply={0}
          borrow={0}
          badgeColor="#D70027"
          badgeText="Dangerous"
        ></PositionCard>
      </DashBoardSection>
      <TXDialog></TXDialog>
      <CloseModal></CloseModal>
    </div>
  );
}
