import { LendingStatusResponse } from "@/app/api/lending-status/route";
import { css } from "../../../../../../../styled-system/css";
import { hstack } from "../../../../../../../styled-system/patterns";
import Spinner from "../Spinner";
import { TokenKey } from "../../assets";
import { getFloatValueDivDecimals } from "@/hardhat/utils";
import { prettify } from "@/utils";
import { AAVE_V3_A_TOKENS, MINTABLE_ERC20_TOKENS } from "@/hardhat/constants";
import { encodeFunctionData, parseUnits } from "viem";
import { Network } from "@/hooks/useLendingStatus";
import { leverageABI } from "@/generated";

type WithdrawProps = {
  supplyAmount: string;
  utilizationRate: number;
  availableLiquidity: number;
  supplyAPR: string;
  rewardAPR: string;
  borrowAmount: string;
  withdrawableAmount: string;
};

export function getWithdrawProps({
  data,
  tokenName: token,
  network,
  inputAmount,
}: {
  data: LendingStatusResponse;
  tokenName: TokenKey;
  network: Network;
  inputAmount: number;
}): WithdrawProps & { data: `0x${string}` } {
  const { status, balances, incentiveStatus } = data;

  const aToken = `a${token}` as const;
  const vToken = `v${token}` as const;

  const supplyAmount = getFloatValueDivDecimals(
    balances[aToken]["balance"],
    balances[aToken]["decimals"]
  );
  const borrowAmount = getFloatValueDivDecimals(
    balances[vToken]["balance"],
    balances[vToken]["decimals"]
  );

  let supplyRewardAPR = 0;
  incentiveStatus[token]["rewards"].forEach((reward) => {
    if (reward.token !== "AAVE") {
      return;
    }

    const rewardAPR = getFloatValueDivDecimals(reward.APR, "6");

    if (reward.isAToken) {
      supplyRewardAPR += rewardAPR;
    }
  });

  const withdrawableAmount = Math.min(
    (status["user"]["totalCollateralUSD"] -
      status["user"]["totalDebtUSD"] / status["user"]["ltv"]) /
      status[token]["price"],
    supplyAmount
  );

  const withdrawProps: WithdrawProps = {
    supplyAmount: prettify(supplyAmount.toString()) + " " + token,
    borrowAmount: prettify(borrowAmount.toString()) + " " + token,
    utilizationRate: status[token]["utilizationRate"],
    availableLiquidity: status[token].availableLiquidityUSD,
    supplyAPR: prettify(status[token]["supplyAPR"].toString()) + "%",
    rewardAPR: prettify(supplyRewardAPR.toString()) + "%",
    withdrawableAmount: withdrawableAmount.toString(),
  };

  const params = {
    asset: MINTABLE_ERC20_TOKENS[network][token] as `0x${string}`,
    counterAsset: AAVE_V3_A_TOKENS[network][token] as `0x${string}`,
    amount: parseUnits(
      inputAmount.toString(),
      Number(balances[token].decimals)
    ),
    flags: 1,
    data: "0x" as `0x${string}`,
  };

  const txData = encodeFunctionData({
    functionName: "withdraw",
    abi: leverageABI,
    args: [params],
  });

  return {
    ...withdrawProps,
    data: txData,
  };
}

function Withdraw(props: WithdrawProps) {
  const data = [
    { label: "Amount Supplied", value: props.supplyAmount },
    { label: "Amount Borrowed", value: props.borrowAmount },
    { label: "Supply APR", value: props.supplyAPR },
    { label: "Reward APR", value: props.rewardAPR },
  ];
  return (
    <div>
      <div
        className={css({
          color: "#53544E",
          margin: "20px 0",
          fontSize: "16px",
        })}
      >
        My Stats
      </div>
      <div>
        {data.map((item) => {
          return (
            <div
              key={item.label}
              className={hstack({
                justifyContent: "space-between",
                marginBottom: "12px",
              })}
            >
              <div
                className={css({
                  fontWeight: "semibold",
                  color: "#BEC3AF",
                })}
              >
                {item.label}
              </div>
              <div>{item.value}</div>
            </div>
          );
        })}
      </div>
      <Spinner
        color="#C08FFF"
        ratio={props.utilizationRate / 100}
        description={{
          start: (
            <span>
              <span
                className={css({
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "semibold",
                })}
              >
                {Math.floor(props.utilizationRate * 100) / 100}%
              </span>
              <span
                className={css({
                  fontSize: "12px",
                })}
              >
                {" "}
                | Borrow used
              </span>
            </span>
          ),
          end: (
            <span
              className={css({
                fontWeight: "semibold",
                color: "white",
              })}
            >
              ${prettify(props.availableLiquidity.toString())}
            </span>
          ),
        }}
      ></Spinner>
    </div>
  );
}

export default Withdraw;
