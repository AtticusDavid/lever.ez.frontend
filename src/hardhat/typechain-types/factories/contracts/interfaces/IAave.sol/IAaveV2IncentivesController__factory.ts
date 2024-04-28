/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IAaveV2IncentivesController,
  IAaveV2IncentivesControllerInterface,
} from "../../../../contracts/interfaces/IAave.sol/IAaveV2IncentivesController";

const _abi = [
  {
    inputs: [
      {
        internalType: "address[]",
        name: "assets",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "bool",
        name: "stake",
        type: "bool",
      },
    ],
    name: "claimRewards",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "assets",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getRewardsBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class IAaveV2IncentivesController__factory {
  static readonly abi = _abi;
  static createInterface(): IAaveV2IncentivesControllerInterface {
    return new Interface(_abi) as IAaveV2IncentivesControllerInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): IAaveV2IncentivesController {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as IAaveV2IncentivesController;
  }
}
