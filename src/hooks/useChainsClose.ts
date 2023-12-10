import { LendingStatusResponse } from "@/app/api/lending-status/route";
import { Network } from "./useLendingStatus";
import { TokenKey } from "@/app/(app)/app/defi-assets/assets";
import {
  calculateFlashloanDeleverageBaseAmount,
  getFloatValueDivDecimals,
} from "@/hardhat/utils";
import { useAccount, useQuery } from "wagmi";

export const networks: Network[] = [
  "ethereumSepolia",
  "avalancheFuji",
  "polygonMumbai",
];

function useChainsClose({ token }: { token: TokenKey }) {
  const { address } = useAccount();
  return useQuery(
    ["chains-close"],
    async () => {
      const results = (
        await Promise.all(
          networks.map((network) => {
            return fetch(
              `/api/lending-status?address=${address}&network=${network}`
            ).then((r) => r.json() as Promise<LendingStatusResponse>);
          })
        )
      ).map((result, index) => {
        const aToken = `a${token}` as const;
        const vToken = `v${token}` as const;

        const supplyAmount = getFloatValueDivDecimals(
          result.balances[aToken]["balance"],
          result.balances[aToken]["decimals"]
        );
        const borrowAmount = getFloatValueDivDecimals(
          result.balances[vToken]["balance"],
          result.balances[vToken]["decimals"]
        );

        const ltv = result.status.user.currentLTV;
        const needApprove =
          result.balances[token].allowance === "0" ||
          result.balances[aToken].allowance === "0";

        const { flashloanAmount } = calculateFlashloanDeleverageBaseAmount(
          0,
          supplyAmount,
          supplyAmount === 0 ? 0 : borrowAmount / supplyAmount,
          0,
          1,
          1,
          0.001
        );

        return {
          networkName: networks[index],
          supplyAmount,
          borrowAmount,
          ltv,
          needApprove,
          flashloanAmount,
          decimals: parseInt(result.balances[token].decimals),
        };
      });
      return results;
    },
    {
      enabled: Boolean(address),
    }
  );
}

export type ChainsCloseResponse = ReturnType<typeof useChainsClose>["data"];

export default useChainsClose;
