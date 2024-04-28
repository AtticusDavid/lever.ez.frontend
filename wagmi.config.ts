import { defineConfig } from "@wagmi/cli";
import LeveragerABI from "./src/abis/Leverager.json";

export default defineConfig({
  out: "src/generated.ts",
  contracts: [
    {
      name: "leverage",
      abi: LeveragerABI.abi as any,
    },
  ],
  plugins: [],
});
