// src/context/Web3Context.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import Web3 from "web3";
import EthereumProvider from "@walletconnect/ethereum-provider";

// Create Context
const Web3Context = createContext();

// ---------------- CONFIG ----------------

// Your deployed ZKTapWallet
const CONTRACT_ADDRESS = "0xfB51ddCBd96743467F86D24a0AdAc78dAADCC60F";

// Alchemy RPC (Sepolia)
const RPC_URL = import.meta.env.VITE_ALCHEMY_API_KEY
  ? `https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`
  : "https://eth-sepolia.g.alchemy.com/v2/demo";

// WalletConnect v2 Project ID (you gave)
const WC_PROJECT_ID = "7e5997b3d52e7a9f1d75fa1a3940b132";

// ZKTapWallet ABI
const CONTRACT_ABI = [
  {"inputs":[{"internalType":"address","name":"_verifier","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"BalanceUpdated","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"txId","type":"uint256"},{"indexed":false,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TransactionCreated","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"txId","type":"uint256"},{"indexed":false,"internalType":"bool","name":"success","type":"bool"}],"name":"TransactionVerified","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"commitment","type":"uint256"}],"name":"UserRegistered","type":"event"},
  {"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"createTransaction","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_txId","type":"uint256"}],"name":"getTransaction","outputs":[{"components":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"bool","name":"verified","type":"bool"},{"internalType":"string","name":"txHash","type":"string"}],"internalType":"struct ZKTapWallet.Transaction","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getUser","outputs":[{"components":[{"internalType":"uint256","name":"commitment","type":"uint256"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"bool","name":"isRegistered","type":"bool"},{"internalType":"uint256","name":"lastTxTime","type":"uint256"}],"internalType":"struct ZKTapWallet.User","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_txId","type":"uint256"}],"name":"isTransactionVerified","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_commitment","type":"uint256"},{"internalType":"uint256","name":"_initialBalance","type":"uint256"}],"name":"registerUser","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"_newVerifier","type":"address"}],"name":"setVerifier","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"transactions","outputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"bool","name":"verified","type":"bool"},{"internalType":"string","name":"txHash","type":"string"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"txCounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"users","outputs":[{"internalType":"uint256","name":"commitment","type":"uint256"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"bool","name":"isRegistered","type":"bool"},{"internalType":"uint256","name":"lastTxTime","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"verifier","outputs":[{"internalType":"contract Groth16Verifier","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_txId","type":"uint256"},{"internalType":"uint256[2]","name":"_pA","type":"uint256[2]"},{"internalType":"uint256[2][2]","name":"_pB","type":"uint256[2][2]"},{"internalType":"uint256[2]","name":"_pC","type":"uint256[2]"},{"internalType":"uint256[1]","name":"_pubSignals","type":"uint256[1]"}],"name":"verifyAndExecuteTransaction","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdrawBalance","outputs":[],"stateMutability":"nonpayable","type":"function"}
];

// --------------- PROVIDER COMPONENT ---------------

export function Web3Provider({ children }) {
  const [web3, setWeb3] = useState(null);
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState("0");
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    try {
      setLoading(true);
      let activeProvider;

      // 1) Desktop / MetaMask browser → use injected provider
      if (window.ethereum) {
        console.log("🦊 Using injected MetaMask");
        activeProvider = window.ethereum;
        await activeProvider.request({ method: "eth_requestAccounts" });
      } else {
        // 2) Normal mobile browser (Chrome) → WalletConnect v2
        if (!WC_PROJECT_ID) {
          alert("WalletConnect Project ID not configured");
          return;
        }
        console.log("🔗 Using WalletConnect v2");

        const wc = await EthereumProvider.init({
          projectId: WC_PROJECT_ID,
          chains: [11155111], // Sepolia
          optionalChains: [1, 137], // Add optional chains for better compatibility
          rpcMap: {
            11155111: RPC_URL,
            1: "https://eth-mainnet.g.alchemy.com/v2/demo",
          },
          showQrModal: true,
          qrModalOptions: {
            themeMode: "dark",
            themeVariables: {
              "--wcm-z-index": "9999"
            },
            explorerRecommendedWalletIds: [
              "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // MetaMask
            ],
          },
          metadata: {
            name: "ZK Tap Wallet",
            description: "Zero-knowledge NFC tap wallet",
            url: window.location.origin,
            icons: ["https://zktapwallet.netlify.app/icon.png"],
          },
        });

        // Enable session with proper error handling
        try {
          await wc.enable();
        } catch (enableError) {
          console.error("WalletConnect enable error:", enableError);
          // Retry connection with connect() if enable() fails
          await wc.connect();
        }
        
        activeProvider = wc;
      }

      const web3Instance = new Web3(activeProvider);
      
      // Wait a bit for provider to be ready
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const accounts = await web3Instance.eth.getAccounts();
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found from wallet");
      }

      // Verify we're on the right network
      const chainId = await web3Instance.eth.getChainId();
      if (Number(chainId) !== 11155111) {
        console.warn(`Connected to chain ${chainId}, expected Sepolia (11155111)`);
      }

      const code = await web3Instance.eth.getCode(CONTRACT_ADDRESS);
      if (!code || code === "0x") {
        throw new Error("Contract not deployed at configured address");
      }

      const contractInstance = new web3Instance.eth.Contract(
        CONTRACT_ABI,
        CONTRACT_ADDRESS
      );

      setProvider(activeProvider);
      setWeb3(web3Instance);
      setAccount(accounts[0]);
      setContract(contractInstance);

      await fetchBalance(contractInstance, accounts[0]);
      console.log("✅ Connected:", accounts[0]);
    } catch (error) {
      console.error("Connection error:", error);
      // Show cleaner message
      const message = error?.message || "Failed to connect wallet";
      if (!message.includes("User rejected")) {
        alert(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async (contractInstance, userAccount) => {
    if (!contractInstance || !userAccount) return;
    try {
      const bal = await contractInstance.methods.getBalance(userAccount).call();
      setBalance(Web3.utils.fromWei(bal.toString(), "ether"));
    } catch (e) {
      console.error("Balance fetch error:", e);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (provider && provider.disconnect) {
        await provider.disconnect();
      }
    } catch (e) {
      console.warn("Provider disconnect error:", e);
    }
    setProvider(null);
    setWeb3(null);
    setAccount(null);
    setContract(null);
    setBalance("0");
    console.log("🔌 Wallet disconnected");
  };

  // Listen for account changes
  useEffect(() => {
    if (!provider || !provider.on) return;

    const onAccountsChanged = (accounts) => {
      if (!accounts || accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
        if (contract) fetchBalance(contract, accounts[0]);
      }
    };

    const onChainChanged = () => {
      window.location.reload();
    };

    provider.on("accountsChanged", onAccountsChanged);
    provider.on("chainChanged", onChainChanged);

    return () => {
      provider.removeListener?.("accountsChanged", onAccountsChanged);
      provider.removeListener?.("chainChanged", onChainChanged);
    };
  }, [provider, contract]);

  const value = {
    web3,
    account,
    contract,
    balance,
    loading,
    connectWallet,
    disconnectWallet,
    fetchBalance,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

// Hook
export const useWeb3 = () => {
  const ctx = useContext(Web3Context);
  if (!ctx) throw new Error("useWeb3 must be used within Web3Provider");
  return ctx;
};
