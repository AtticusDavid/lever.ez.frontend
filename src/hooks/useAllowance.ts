import { useNetwork } from "wagmi";
import useLendingStatus, { mapChainName } from "./useLendingStatus";
import { TokenKey } from "@/app/(app)/app/defi-assets/assets";

function useAllowance({
  // chainAddress,
  token,
}: {
  // chainAddress: `0x${string}`;
  token: TokenKey | `a${TokenKey}` | `v${TokenKey}`;
}) {
  const { chain } = useNetwork();
  const network = mapChainName(chain?.name);

  const { data } = useLendingStatus();

  if (!data || !network) {
    return {
      data: undefined,
    };
  }
  return {
    data: data.balances[token].allowance,
  };
}

export default useAllowance;
