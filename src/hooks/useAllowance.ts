import { erc20ABI, useNetwork, useQuery } from "wagmi";
import { Network, mapChainName } from "./useLendingStatus";
import { leveragerAddress } from "@/hardhat/constants";
import { readContract } from "@wagmi/core";

function useAllowance({
  chainAddress,
  address,
}: {
  chainAddress: `0x${string}`;
  address?: `0x${string}`;
}) {
  const { chain } = useNetwork();
  const network = mapChainName(chain?.name);

  return useQuery(
    ["allowance", address, chainAddress],
    () => {
      return readContract({
        abi: erc20ABI,
        address: chainAddress,
        functionName: "allowance",
        args: [
          address as `0x${string}`,
          leveragerAddress[network as Network] as `0x${string}`,
        ],
      });
    },
    {
      enabled: address && Boolean(network),
    }
  );
}

export default useAllowance;
