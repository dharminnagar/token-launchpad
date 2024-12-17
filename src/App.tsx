// CSS Imports
import "./App.css";

// wallet adapter imports
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

// Component Imports
import { TokenLaunchpad } from "./components/TokenLaunchpad";

function App() {
  return (
    <>
      <div className="h-screen bg-zinc-800">
        <ConnectionProvider endpoint="https://api.devnet.solana.com">
          <WalletProvider wallets={[]}>
            <WalletModalProvider>
              <div className="flex justify-end items-center p-4">
                <WalletMultiButton />
                <WalletDisconnectButton />
              </div>

              <TokenLaunchpad />
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </div>
    </>
  );
}

export default App;
