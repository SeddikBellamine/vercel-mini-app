import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { defineChain } from "@reown/appkit/networks";
import { createAppKit } from "@reown/appkit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from 'wagmi';
import App from "./App";

// ✅ Define Bellecour Blockchain
const bellecour = defineChain({
  id: 0x86, // Bellecour Chain ID
  caipNetworkId: "eip155:134", // CAIP-2 compliant network ID
  chainNamespace: "eip155",
  name: "iExec Sidechain",
  nativeCurrency: {
    decimals: 18,
    name: "xRLC",
    symbol: "xRLC",
  },
  rpcUrls: {
    default: {
      http: ["https://bellecour.iex.ec"],
      webSocket: ["wss://bellecour.iex.ec/ws"], // WebSocket support
    },
  },
  blockExplorers: {
    default: { name: "Blockscout", url: "https://blockscout-bellecour.iex.ec" },
  },
});

// ✅ Create QueryClient for React Query
const queryClient = new QueryClient();

// ✅ Set up Wagmi Adapter with Bellecour
const wagmiAdapter = new WagmiAdapter({
  networks: [bellecour],
  projectId: "b2e4ce8c8c62a7815f1b264f625182dd", // 🔥 Replace with your WalletConnect Project ID
});

// ✅ Create AppKit instance
createAppKit({
  adapters: [wagmiAdapter],
  networks: [bellecour],
  projectId: "b2e4ce8c8c62a7815f1b264f625182dd", // 🔥 Replace with your Reown Cloud Project ID
});

// ✅ Render App with Providers
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>

    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <App />

      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
