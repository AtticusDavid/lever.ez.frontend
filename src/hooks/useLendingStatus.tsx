import { LendingStatusResponse } from "@/app/api/lending-status/route";
import { lendingStatusRequestSchema } from "@/utils";
import { useAccount, useNetwork, useQuery } from "wagmi";

export type Network =
  | "ethereumSepolia"
  | "avalancheFuji"
  | "polygonMumbai"
  | "scrollSepolia";

export function mapChainName(name: undefined | string): Network | undefined {
  if (name === "Sepolia") return "ethereumSepolia" as const;
  if (name === "Avalanche Fuji") return "avalancheFuji" as const;
  if (name === "Polygon Mumbai") return "polygonMumbai" as const;
  if (name === "Scroll Sepolia") return "scrollSepolia" as const;
  return undefined;
}

function useLendingStatus() {
  const { chain } = useNetwork();
  const { address } = useAccount();

  const body = {
    address: address,
    network: mapChainName(chain?.name),
  };

  const isOk = lendingStatusRequestSchema.isValidSync(body);

  console.log({ body, isOk });

  return useQuery(
    ["lending-status", body.address, body.network],
    () =>
      fetch(
        `/api/lending-status?address=${body.address}&network=${body.network}`
      ).then((r) => r.json() as Promise<LendingStatusResponse>),
    {
      enabled: isOk,
    }
  );
}

export default useLendingStatus;
