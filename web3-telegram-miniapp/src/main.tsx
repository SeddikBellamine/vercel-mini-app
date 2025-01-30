import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // ✅ Import QueryClientProvider
import React from "react";
import ReactDOM from "react-dom/client";
import { http } from "viem";
import { WagmiConfig, createConfig, createStorage } from "wagmi";
import { walletConnect } from "wagmi/connectors";
import App from "./App";

// ✅ Create QueryClient instance
const queryClient = new QueryClient();

// Define Bellecour Chain
const CHAIN_ID = 0x86;
const projectId = "b2e4ce8c8c62a7815f1b264f625182dd";

const bellecour = {
  id: CHAIN_ID,
  name: "iExec Sidechain",
  network: "bellecour",
  nativeCurrency: {
    decimals: 18,
    name: "xRLC",
    symbol: "xRLC",
  },
  rpcUrls: {
    default: { http: ["https://bellecour.iex.ec"] },
  },
  blockExplorers: {
    default: { name: "Blockscout", url: "https://blockscout-bellecour.iex.ec" },
  },
};

// ✅ Use `createStorage()`
const storage = createStorage({
  storage: window.localStorage,
});

// ✅ Correct WagmiConfig Setup
const wagmiConfig = createConfig({
  chains: [bellecour], // ✅ FIXED: Added `chains` explicitly
  connectors: [
    walletConnect({
      projectId,
      showQrModal: false,
      metadata: {
        name: "Web3 Telegram Mini App",
        description: "A Telegram Mini App for Web3 transactions.",
        url: "https://your-dapp-url.com",
        icons: ["https://your-icon-url.com/icon.png"],
      },
    }),
  ],
  transports: {
    [bellecour.id]: http("https://bellecour.iex.ec"),
  },
  storage,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}> {/* ✅ Wrap with QueryClientProvider */}
      <WagmiConfig config={wagmiConfig}>
        <App />
      </WagmiConfig>
    </QueryClientProvider>
  </React.StrictMode>
);
