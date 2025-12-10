// src/context/Web3Context.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import Web3 from "web3";
import EthereumProvider from "@walletconnect/ethereum-provider";

// Create Context
const Web3Context = createContext();

// ------------------------- IMPORTANT CONFIG -------------------------

// Your Deployed Wallet Contract
const CONTRACT_ADDRESS = "0xfB51ddCBd96743467F86D24a0AdAc78dAADCC60F";

// Alchemy RPC (Sepolia)
const RPC_URL = `https://eth-sepolia.g.alchemy.com/v2/${
  import.meta.env.VITE_ALCHEMY_API_KEY
}`;

// WalletConnect Project ID (YOU PROVIDED)
const WC_PROJECT_ID = "7e5997b3d52e7a9f1d75fa1a3940b132";

// ------------------------- CONTRACT ABI -------------------------
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

// ------------------------- MAIN CONTEXT LOGIC -------------------------

export function Web3Provider({ children }) {
  const [web3, setWeb3] = useState(null);
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState("0");
  const [loading, setLoading] = useState(false);

  // Connect Wallet
  const connectWallet = async () => {
    try {
      setLoading(true);

      let activeProvider;

      // CASE 1 → Desktop Chrome or MetaMask in-app browser
      if (window.ethereum) {
        console.log("🦊 Using MetaMask injected provider");
        activeProvider = window.ethereum;
        await activeProvider.request({ method: "eth_requestAccounts" });

      } else {
        // CASE 2 → Phone Chrome → must use WalletConnect v2
        console.log("🔗 Using WalletConnect v2 provider");

        const wc = await EthereumProvider.init({
          projectId: WC_PROJECT_ID,
          chains: [11155111],
          rpcMap: {
            11155111: RPC_URL,
          },
          showQrModal: true,
        });

        await wc.connect();
        activeProvider = wc;
      }

      const web3Instance = new Web3(activeProvider);
      const accounts = await web3Instance.eth.getAccounts();

      const code = await web3Instance.eth.getCode(CONTRACT_ADDRESS);
      if (!code || code === "0x") {
        alert("❌ Invalid contract address — not deployed on chain!");
        return;
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

      console.log("🎉 Connected:", accounts[0]);

    } catch (error) {
      console.error("Connection error:", error);
      alert(error.message || "Wallet connection failed");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Balance
  const fetchBalance = async (contractInstance, userAccount) => {
    if (!contractInstance || !userAccount) return;

    try {
      const bal = await contractInstance.methods.getBalance(userAccount).call();
      setBalance(Web3.utils.fromWei(bal.toString(), "ether"));
    } catch (error) {
      console.error("Balance fetch error:", error);
    }
  };

  // Disconnect Wallet
  const disconnectWallet = async () => {
    try {
      if (provider && provider.disconnect) {
        await provider.disconnect();
      }
    } catch (e) {
      console.warn("Provider close error:", e);
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

    const handler = (accounts) => {
      if (!accounts || accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
        if (contract) fetchBalance(contract, accounts[0]);
      }
    };

    provider.on("accountsChanged", handler);

    return () => {
      provider.removeListener?.("accountsChanged", handler);
    };
  }, [provider, contract]);

  // Context value
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
