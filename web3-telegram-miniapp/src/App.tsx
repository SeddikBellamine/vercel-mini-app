import { IExecDataProtector } from "@iexec/dataprotector";
import { useAppKit, useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { useEffect, useState } from "react";
import { EIP1193Provider } from "viem";

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        initDataUnsafe: unknown;
      };
    };
  }
}

const App = () => {
  const { open } = useAppKit(); // ✅ Wallet Connection
  const { walletProvider } = useAppKitProvider("eip155"); // ✅ Use WalletConnect v3 Provider
  const { address, isConnected } = useAppKitAccount();

  const [protectedData, setProtectedData] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
    }
  }, []);

  // ✅ Connect Wallet - Works for Both Web & Mobile
  const connectWallet = async () => {
    try {
      setErrorMessage(null);
      console.log("🔗 Connecting Wallet...");

      await open(); // 🚀 Opens Web3Modal (Handles Deep Linking & MetaMask)
      console.log("✅ Wallet connected:", address);
    } catch (error) {
      console.error("❌ Wallet Connection Error:", error);
      setErrorMessage((error as Error).message || "Failed to connect wallet.");
    }
  };

  // ✅ Protect Data Using iExec
  const protectData = async () => {
    try {
      if (!isConnected) {
        await connectWallet(); // ✅ Ensure Wallet is Connected Before Proceeding
      }

      console.log("🔄 Initiating iExec Data Protection...");
      const providerToUse = walletProvider as EIP1193Provider;

      if (!providerToUse) {
        throw new Error("❌ No valid Web3 provider found.");
      }

      const iexecDataProtector = new IExecDataProtector(providerToUse);
      const dataToProtect = {
        email: "user@example.com",
        telegramId: "12345678",
      };

      const { transactionHash } = await iexecDataProtector.core.protectData({
        data: dataToProtect,
      });

      console.log("✅ Data protected successfully:", transactionHash);
      setProtectedData(transactionHash);
    } catch (error) {
      console.error("❌ Data Protection Error:", error);
      setErrorMessage((error as Error).message || "Unknown error occurred.");
    }
  };

  return (
    <div className="container">
      <h1>Web3 Telegram Mini App</h1>
      <p>Protect your data on iExec using MetaMask!</p>

      {/* Show Wallet Connection Status */}
      {!isConnected ? (
        <button onClick={connectWallet}>🔗 Connect Wallet</button>
      ) : (
        <div>
          <p>✅ Connected as: <strong>{address}</strong></p>
          <button onClick={protectData} disabled={!isConnected}>🛡 Protect My Data</button>
        </div>
      )}

      {protectedData && (
        <p style={{ color: "green" }}>
          ✅ Protected Data Hash: {protectedData}
        </p>
      )}
      {errorMessage && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          ❌ Error: {errorMessage}
        </p>
      )}
    </div>
  );
};

export default App;
