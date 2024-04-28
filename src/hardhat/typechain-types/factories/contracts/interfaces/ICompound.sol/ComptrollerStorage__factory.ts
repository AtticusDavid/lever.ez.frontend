/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  ComptrollerStorage,
  ComptrollerStorageInterface,
} from "../../../../contracts/interfaces/ICompound.sol/ComptrollerStorage";

const _abi = [
  {
    inputs: [],
    name: "getAllMarkets",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class ComptrollerStorage__factory {
  static readonly abi = _abi;
  static createInterface(): ComptrollerStorageInterface {
    return new Interface(_abi) as ComptrollerStorageInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ComptrollerStorage {
    return new Contract(address, _abi, runner) as unknown as ComptrollerStorage;
  }
}
