import { TokenKey } from "@/app/(app)/app/defi-assets/assets";
import {
  AAVE_V3_A_TOKENS,
  AAVE_V3_DEBT_TOKENS,
  MINTABLE_ERC20_TOKENS,
  leveragerAddress,
} from "@/hardhat/constants";
import { Network } from "@/hooks/useLendingStatus";
import { writeContract } from "@wagmi/core";
import { maxUint256, parseAbi } from "viem";
import { erc20ABI } from "wagmi";
import { object, string } from "yup";

export function prettify(value: string, n?: number) {
  const [front, back] = value.split(".");
  if (back) {
    return parseFloat(front).toLocaleString() + "." + back.slice(0, n ?? 2);
  }
  return parseFloat(front).toLocaleString();
}

export const lendingStatusRequestSchema = object({
  address: string().required(),
  network: string()
    .required()
    .oneOf([
      "ethereumSepolia",
      "polygonMumbai",
      "avalancheFuji",
      "scrollSepolia",
    ] as const),
});

export function leverageApprove({
  network,
  token,
  address,
}: {
  network: Network;
  token: TokenKey;
  address: `0x${string}`;
}) {
  return writeContract({
    abi: erc20ABI,
    functionName: "approve",
    args: [leveragerAddress[network] as `0x${string}`, maxUint256],
    address: address,
  });
}

export function leverageApproveDelegation({
  network,
  token,
}: {
  network: Network;
  token: TokenKey;
}) {
  return writeContract({
    abi: parseAbi([
      "function approveDelegation(address delegatee, uint256 amount)",
    ]),
    functionName: "approveDelegation",
    args: [leveragerAddress[network] as `0x${string}`, maxUint256],
    address: AAVE_V3_DEBT_TOKENS[network][token] as `0x${string}`,
  });
}
