"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import {
  configureChains,
  createConfig,
  createStorage,
  sepolia,
  WagmiConfig,
} from "wagmi";
import {
  mainnet,
  polygonMumbai,
  avalancheFuji,
  base,
  scroll,
} from "wagmi/chains";
import { enableMapSet } from "immer";
import localFont from "next/font/local";
// import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

// https://nextjs.org/docs/app/api-reference/components/font

// setup immer
enableMapSet();

const { chains, publicClient } = configureChains(
  [mainnet, base, scroll, sepolia, polygonMumbai, avalancheFuji],
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
      <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
    </WagmiConfig>
  );
}
