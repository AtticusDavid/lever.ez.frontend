/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IERC1820Implementer,
  IERC1820ImplementerInterface,
} from "../../../../../xdeployer/src/contracts/Create2Deployer.sol/IERC1820Implementer";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "interfaceHash",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "canImplementInterfaceForAddress",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class IERC1820Implementer__factory {
  static readonly abi = _abi;
  static createInterface(): IERC1820ImplementerInterface {
    return new Interface(_abi) as IERC1820ImplementerInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): IERC1820Implementer {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as IERC1820Implementer;
  }
}
