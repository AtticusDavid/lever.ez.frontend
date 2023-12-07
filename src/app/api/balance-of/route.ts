import {
  multicall3Address,
  MINTABLE_ERC20_TOKENS,
  leveragerAddress,
  AAVE_V3_A_TOKENS,
  AAVE_V3_DEBT_TOKENS,
} from "@/hardhat/constants";
import {
  Multicall3,
  Multicall3__factory,
  MockERC20__factory,
} from "@/hardhat/typechain-types";
import { getProviderRpcUrl, getPrivateKey } from "@/hardhat/utils";
import { ethers, Wallet } from "ethers";

export const dynamic = "force-dynamic"; // defaults to force-static

export async function GET(request: Request) {
  const blockchain = "ethereumSepolia" as const;

  const rpcProviderUrl = getProviderRpcUrl(blockchain);

  const provider = new ethers.JsonRpcProvider(rpcProviderUrl);
  const privateKey = getPrivateKey();
  const wallet = new Wallet(privateKey);
  const signer = wallet.connect(provider);

  const multicall: Multicall3 = Multicall3__factory.connect(
    multicall3Address,
    signer
  );

  const mockERC20 = MockERC20__factory.createInterface();
  const calls: Multicall3.Call3Struct[] = [];

  const tokens = ["DAI", "USDC", "USDT", "WETH", "WBTC"] as const;

  for (const token of tokens) {
    calls.push({
      target: MINTABLE_ERC20_TOKENS[blockchain][token],
      allowFailure: true,
      callData: mockERC20.encodeFunctionData("name"),
    });
    calls.push({
      target: MINTABLE_ERC20_TOKENS[blockchain][token],
      allowFailure: true,
      callData: mockERC20.encodeFunctionData("decimals"),
    });
    calls.push({
      target: MINTABLE_ERC20_TOKENS[blockchain][token],
      allowFailure: true,
      callData: mockERC20.encodeFunctionData("balanceOf", [wallet.address]),
    });

    calls.push({
      target: MINTABLE_ERC20_TOKENS[blockchain][token],
      allowFailure: true,
      callData: mockERC20.encodeFunctionData("allowance", [
        wallet.address,
        leveragerAddress[blockchain],
      ]),
    });
    calls.push({
      target: AAVE_V3_A_TOKENS[blockchain][token],
      allowFailure: true,
      callData: mockERC20.encodeFunctionData("name"),
    });
    calls.push({
      target: AAVE_V3_A_TOKENS[blockchain][token],
      allowFailure: true,
      callData: mockERC20.encodeFunctionData("decimals"),
    });
    calls.push({
      target: AAVE_V3_A_TOKENS[blockchain][token],
      allowFailure: true,
      callData: mockERC20.encodeFunctionData("balanceOf", [wallet.address]),
    });
    calls.push({
      target: AAVE_V3_A_TOKENS[blockchain][token],
      allowFailure: true,
      callData: mockERC20.encodeFunctionData("allowance", [
        wallet.address,
        leveragerAddress[blockchain],
      ]),
    });
    calls.push({
      target: AAVE_V3_DEBT_TOKENS[blockchain][token],
      allowFailure: true,
      callData: mockERC20.encodeFunctionData("name"),
    });
    calls.push({
      target: AAVE_V3_DEBT_TOKENS[blockchain][token],
      allowFailure: true,
      callData: mockERC20.encodeFunctionData("decimals"),
    });
    calls.push({
      target: AAVE_V3_DEBT_TOKENS[blockchain][token],
      allowFailure: true,
      callData: mockERC20.encodeFunctionData("balanceOf", [wallet.address]),
    });
    calls.push({
      target: AAVE_V3_DEBT_TOKENS[blockchain][token],
      allowFailure: true,
      callData: mockERC20.encodeFunctionData("borrowAllowance", [
        wallet.address,
        leveragerAddress[blockchain],
      ]),
    });
  }

  const results = await multicall.aggregate3.staticCall(calls);

  const walletStatus: Record<string, Record<string, string>> = {};

  let name = "";
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.success) {
      if (i % 4 === 0) {
        name = mockERC20
          .decodeFunctionResult("name", result.returnData)
          .toString();
        walletStatus[name] = {};
      }
      if (i % 4 === 1) {
        walletStatus[name]["decimals"] = mockERC20
          .decodeFunctionResult("decimals", result.returnData)
          .toString();
      }
      if (i % 4 === 2) {
        walletStatus[name]["balance"] = mockERC20
          .decodeFunctionResult("balanceOf", result.returnData)
          .toString();
      }
      if (i % 4 === 3) {
        walletStatus[name]["allowance"] =
          i % 9 == 8
            ? mockERC20
                .decodeFunctionResult("borrowAllowance", result.returnData)
                .toString()
            : mockERC20
                .decodeFunctionResult("allowance", result.returnData)
                .toString();
      }
    }
  }

  walletStatus["NATIVE"] = {};
  walletStatus["NATIVE"]["decimals"] = "18";

  walletStatus["NATIVE"]["balance"] = (
    await provider.getBalance(wallet.address)
  ).toString();
  console.log(walletStatus);

  return Response.json(walletStatus);
}
