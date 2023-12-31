/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IVariableDebtToken,
  IVariableDebtTokenInterface,
} from "../../../../contracts/interfaces/IAave.sol/IVariableDebtToken";

const _abi = [
  {
    inputs: [],
    name: "scaledTotalSupply",
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

export class IVariableDebtToken__factory {
  static readonly abi = _abi;
  static createInterface(): IVariableDebtTokenInterface {
    return new Interface(_abi) as IVariableDebtTokenInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): IVariableDebtToken {
    return new Contract(address, _abi, runner) as unknown as IVariableDebtToken;
  }
}
