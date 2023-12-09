"use client";
import { useParams, useRouter } from "next/navigation";
import { object, string } from "yup";
import assets, { tokenIconMap, tokenWhitelist } from "../assets";
import DashBoardSection from "../../DashBoardSection";
import { css } from "../../../../../../styled-system/css";
import DashBoardOverviewStatus from "../../DashBoardOverviewStatus";
import PositionCard from "./PositionCard";
import { hstack, vstack } from "../../../../../../styled-system/patterns";
import UserIndicator from "./UserIndicator";
import CloseModal from "./CloseModal";
import useLendingStatus from "@/hooks/useLendingStatus";
import { formatUnits } from "viem";
import { prettify } from "@/utils";

const paramsSchema = object({
  asset: string()
    .required()
    .oneOf(assets.filter((x) => x.isActive).map((x) => x.name.toLowerCase())),
}).required();

export default function DefiAssets() {
  const params = useParams();

  const { data } = useLendingStatus();

  console.log({ data });

  paramsSchema.validateSync(params);

  const supplied = data ? data.status.user.totalCollateralUSD : 0;
  const borrowed = data ? data.status.user.totalDebtUSD : 0;
  const netWorth = supplied - borrowed;

  const currentLTV = data ? (supplied ? borrowed / supplied : 0) : 0;
  const maxLTV = data ? data.status.user.ltv : 0;

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
                .filter((x) => x in data.status)
                .map((itemKey) => {
                  const info = data.status[itemKey];
                  const supplyTokenName = `a${itemKey}` as const;
                  const debtTokenName = `v${itemKey}` as const;

                  const supplyBalance = data.balances[supplyTokenName];
                  const debtBalance = data.balances[debtTokenName];

                  const supply = formatUnits(
                    BigInt(supplyBalance.balance) * BigInt(info.price),
                    parseInt(supplyBalance.decimals)
                  );

                  const borrow = formatUnits(
                    BigInt(debtBalance.balance) * BigInt(info.price),
                    parseInt(debtBalance.decimals)
                  );

                  const netWorth = formatUnits(
                    (BigInt(supplyBalance.balance) -
                      BigInt(debtBalance.balance)) *
                      BigInt(info.price),
                    parseInt(debtBalance.decimals)
                  );

                  return (
                    <PositionCard
                      key={itemKey}
                      tokenName={itemKey}
                      iconSrc={tokenIconMap[itemKey]}
                      netWorth={prettify(netWorth)}
                      supply={prettify(supply)}
                      borrow={prettify(borrow)}
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
