"use client";
import { useParams } from "next/navigation";
import { object, string } from "yup";
import assets, { TokenKey, tokenIconMap, tokenWhitelist } from "../assets";
import DashBoardSection from "../../DashBoardSection";
import ReactLoading from "react-loading";
import { css } from "../../../../../../styled-system/css";
import DashBoardOverviewStatus from "../../DashBoardOverviewStatus";
import PositionCard from "./PositionCard";
import {
  center,
  hstack,
  vstack,
} from "../../../../../../styled-system/patterns";
import UserIndicator from "./UserIndicator";
import useLendingStatus, { mapChainName } from "@/hooks/useLendingStatus";
import { formatUnits } from "viem";
import { prettify } from "@/utils";
import { useAccount, useNetwork } from "wagmi";
import { useEffect, useMemo, useState } from "react";
import { getFloatValueDivDecimals } from "@/hardhat/utils";

const paramsSchema = object({
  asset: string()
    .required()
    .oneOf(assets.filter((x) => x.isActive).map((x) => x.name.toLowerCase())),
}).required();

/**
 * 
 * 
 * 
 * 
 * 
- newbee
    - 0 ≤ current ltv < max ltv / 4
- degen
    - max ltv / 4 ≤ current ltv < max ltv + (liquidation threshold-max ltv)* 0.5
- degen ape
    - max ltv + (liquidation threshold-max ltv)* 0.5 < current ltv

 */

export default function DefiAssets() {
  const params = useParams();
  const [rendered, setRendered] = useState(false);

  const { data, isLoading } = useLendingStatus();
  const { chain } = useNetwork();
  const { address } = useAccount();

  function getStatus(token: TokenKey): {
    color: string;
    text: string;
    ratio: number;
    position: string;
    description: string;
  } | null {
    const network = mapChainName(chain?.name);
    if (!network) return null;
    if (!data) return null;

    const aToken = `a${token}` as const;
    const vToken = `v${token}` as const;

    const supplyAmount = getFloatValueDivDecimals(
      data.balances[aToken]["balance"],
      data.balances[aToken]["decimals"]
    );

    const borrowAmount = getFloatValueDivDecimals(
      data.balances[vToken]["balance"],
      data.balances[vToken]["decimals"]
    );

    const currentLTV =
      supplyAmount === 0 ? 0 : (borrowAmount / supplyAmount) * 100;
    const maxLTV = data.status[token].maxLTV;
    const liquidationThreshold = data.status[token].liquidationThreshold;

    console.log({ currentLTV, maxLTV, liquidationThreshold, token });

    if (currentLTV >= 0 && maxLTV / 4 >= currentLTV) {
      return {
        color: "#0ED883",
        text: "Safe",
        ratio: 0.15,
        position: "flex-start",
        description: "Are you Web3 Newbie?",
      };
    }

    if (
      maxLTV / 4 <= currentLTV &&
      currentLTV <= maxLTV + (liquidationThreshold - maxLTV) / 2
    ) {
      return {
        color: "#ffffff",
        text: "Normal",
        ratio: 0.5,
        position: "center",
        description: "Are you Degen?",
      };
    }

    if (maxLTV + (liquidationThreshold - maxLTV) / 2 < currentLTV) {
      return {
        color: "#D70027",
        text: "Degen Ape",
        ratio: 0.75,
        position: "flex-end",
        description: "Are you Degen Apes?",
      };
    }
    return null;
  }
  paramsSchema.validateSync(params);

  const supplied = data ? data.status.user.totalCollateralUSD : 0;
  const borrowed = data ? data.status.user.totalDebtUSD : 0;
  const netWorth = supplied - borrowed;

  const overviewStatus = useMemo(() => {
    if (!data) return null;

    const result = tokenWhitelist
      .filter((x) => x in data.status)
      .map(getStatus)
      .sort((a, b) => (b?.ratio ?? 0) - (a?.ratio ?? 0))[0];

    return result;
  }, [data]);

  useEffect(() => {
    setRendered(true);
  }, []);

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
          {overviewStatus ? (
            <UserIndicator
              ratio={overviewStatus.ratio}
              description={overviewStatus.description}
              color={overviewStatus.color}
              position={overviewStatus.position}
            ></UserIndicator>
          ) : null}
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

                  const badge = getStatus(itemKey) ?? {
                    color: "",
                    text: "",
                  };

                  return (
                    <PositionCard
                      key={itemKey}
                      tokenName={itemKey}
                      iconSrc={tokenIconMap[itemKey]}
                      netWorth={prettify(netWorth)}
                      supply={prettify(supply)}
                      borrow={prettify(borrow)}
                      badgeColor={badge.color}
                      badgeText={badge.text}
                    ></PositionCard>
                  );
                })
            : null}
        </div>
      </DashBoardSection>
    </div>
  );
}
