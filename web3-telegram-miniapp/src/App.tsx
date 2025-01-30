import { IExecDataProtector } from "@iexec/dataprotector";
import { Web3Modal, useWeb3Modal } from "@web3modal/react";
import { useEffect, useState } from "react";
import { useAccount, useConnect } from "wagmi";

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
    ethereum?: any;
  }
}

const App = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const web3Modal = useWeb3Modal();
  const [protectedData, setProtectedData] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
    }
  }, []);

  // ✅ Detect Mobile Device
  const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // ✅ Connect Wallet & Handle Mobile Deep Linking
  const connectWallet = async () => {
    try {
      setErrorMessage(null);
      if (isConnected) return;

      console.log("🔗 Connecting Wallet...");
      console.log(address);

      if (isMobile()) {
        await web3Modal.open(); // ✅ Opens MetaMask via WalletConnect
      } else {
        await connect({ connector: connectors[0] });
      }
    } catch (error) {
      console.error("❌ Wallet Connection Error:", error);
      setErrorMessage((error as Error).message || "Unknown error occurred.");
    }
  };

  // ✅ Protect Data Using iExec
  const protectData = async () => {
    try {
      await connectWallet();
      setErrorMessage(null);
      if (!isConnected) {
        throw new Error("Please connect your wallet first.");
      }

      console.log("🔄 Initiating iExec data protection...");
      const iexecDataProtector = new IExecDataProtector(window.ethereum);

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

      <button onClick={protectData}>Protect My Data</button>

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

      <Web3Modal projectId="b2e4ce8c8c62a7815f1b264f625182dd" />
    </div>
  );
};

export default App;
