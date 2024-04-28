"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import {
  configureChains,
  createConfig,
  createStorage,
  WagmiConfig,
} from "wagmi";
import { Toaster } from "react-hot-toast";
import {
  sepolia,
  polygonMumbai,
  avalancheFuji,
  scrollSepolia,
} from "wagmi/chains";
import { enableMapSet } from "immer";
// import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

// https://nextjs.org/docs/app/api-reference/components/font

// setup immer
enableMapSet();

const { chains, publicClient } = configureChains(
  [sepolia, polygonMumbai, avalancheFuji, scrollSepolia],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "hi",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  storage:
    typeof window === "undefined"
      ? undefined
      : createStorage({
          storage: window.sessionStorage,
        }),
  publicClient,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <Toaster position="top-right"></Toaster>
      <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
    </WagmiConfig>
  );
}
