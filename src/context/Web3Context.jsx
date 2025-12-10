// src/context/Web3Context.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";

// Create Context
const Web3Context = createContext();

// Contract Configuration
const CONTRACT_ADDRESS =
  import.meta.env.VITE_WALLET_ADDRESS ||
  "0xfB51ddCBd96743467F86D24a0AdAc78dAADCC60F";

const RPC_URL = `https://eth-sepolia.g.alchemy.com/v2/${
  import.meta.env.VITE_ALCHEMY_API_KEY
}`;

// ⚠️ same ABI you already had
const CONTRACT_ABI = [
  { "inputs":[{"internalType":"address","name":"_verifier","type":"address"}],"stateMutability":"nonpayable","type":"constructor" },
  { "anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"BalanceUpdated","type":"event" },
  { "anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"txId","type":"uint256"},{"indexed":false,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TransactionCreated","type":"event" },
  { "anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"txId","type":"uint256"},{"indexed":false,"internalType":"bool","name":"success","type":"bool"}],"name":"TransactionVerified","type":"event" },
  { "anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"commitment","type":"uint256"}],"name":"UserRegistered","type":"event" },
  { "inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"createTransaction","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function" },
  { "inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function" },
  { "inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function" },
  { "inputs":[{"internalType":"uint256","name":"_txId","type":"uint256"}],"name":"getTransaction","outputs":[{"components":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"bool","name":"verified","type":"bool"},{"internalType":"string","name":"txHash","type":"string"}],"internalType":"struct ZKTapWallet.Transaction","name":"","type":"tuple"}],"stateMutability":"view","type":"function" },
  { "inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getUser","outputs":[{"components":[{"internalType":"uint256","name":"commitment","type":"uint256"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"bool","name":"isRegistered","type":"bool"},{"internalType":"uint256","name":"lastTxTime","type":"uint256"}],"internalType":"struct ZKTapWallet.User","name":"","type":"tuple"}],"stateMutability":"view","type":"function" },
  { "inputs":[{"internalType":"uint256","name":"_txId","type":"uint256"}],"name":"isTransactionVerified","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function" },
  { "inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function" },
  { "inputs":[{"internalType":"uint256","name":"_commitment","type":"uint256"},{"internalType":"uint256","name":"_initialBalance","type":"uint256"}],"name":"registerUser","outputs":[],"stateMutability":"nonpayable","type":"function" },
  { "inputs":[{"internalType":"address","name":"_newVerifier","type":"address"}],"name":"setVerifier","outputs":[],"stateMutability":"nonpayable","type":"function" },
  { "inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"transactions","outputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"bool","name":"verified","type":"bool"},{"internalType":"string","name":"txHash","type":"string"}],"stateMutability":"view","type":"function" },
  { "inputs":[],"name":"txCounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function" },
  { "inputs":[{"internalType":"address","name":"","type":"address"}],"name":"users","outputs":[{"internalType":"uint256","name":"commitment","type":"uint256"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"bool","name":"isRegistered","type":"bool"},{"internalType":"uint256","name":"lastTxTime","type":"uint256"}],"stateMutability":"view","type":"function" },
  { "inputs":[],"name":"verifier","outputs":[{"internalType":"contract Groth16Verifier","name":"","type":"address"}],"stateMutability":"view","type":"function" },
  { "inputs":[{"internalType":"uint256","name":"_txId","type":"uint256"},{"internalType":"uint256[2]","name":"_pA","type":"uint256[2]"},{"internalType":"uint256[2][2]","name":"_pB","type":"uint256[2][2]"},{"internalType":"uint256[2]","name":"_pC","type":"uint256[2]"},{"internalType":"uint256[1]","name":"_pubSignals","type":"uint256[1]"}],"name":"verifyAndExecuteTransaction","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function" },
  { "inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdrawBalance","outputs":[],"stateMutability":"nonpayable","type":"function" }
];

// Web3 Provider Component
export function Web3Provider({ children }) {
  const [web3, setWeb3] = useState(null);
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState("0");
  const [loading, setLoading] = useState(false);

  // Connect Wallet Function (MetaMask or WalletConnect)
  const connectWallet = async () => {
    try {
      setLoading(true);

      let activeProvider;

      if (window.ethereum) {
        // Desktop MetaMask / MetaMask browser
        activeProvider = window.ethereum;
        await activeProvider.request({ method: "eth_requestAccounts" });
      } else {
        // Chrome mobile etc. → use WalletConnect to reach MetaMask Mobile
        const wcProvider = new WalletConnectProvider({
          rpc: {
            11155111: RPC_URL, // Sepolia
          },
          chainId: 11155111,
        });

        await wcProvider.enable();
        activeProvider = wcProvider;
      }

      const web3Instance = new Web3(activeProvider);
      const accounts = await web3Instance.eth.getAccounts();

      // sanity check: contract address really is a contract
      const code = await web3Instance.eth.getCode(CONTRACT_ADDRESS);
      if (!code || code === "0x") {
        alert("Configured contract address is not a contract. Check VITE_WALLET_ADDRESS.");
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

      console.log("Wallet connected:", accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert(error.message || "Failed to connect wallet");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Balance Function
  const fetchBalance = async (contractInstance, userAccount) => {
    try {
      const userBalance = await contractInstance.methods
        .getBalance(userAccount)
        .call();
      setBalance(Web3.utils.fromWei(userBalance.toString(), "ether"));
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance("0");
    }
  };

  // Disconnect Wallet Function
  const disconnectWallet = async () => {
    if (provider && provider.close) {
      try {
        await provider.close();
      } catch (_) {}
    }
    setProvider(null);
    setWeb3(null);
    setAccount(null);
    setContract(null);
    setBalance("0");
    console.log("Wallet disconnected");
  };

  // Listen for account changes on whatever provider is active
  useEffect(() => {
    if (!provider || !provider.on) return;

    const handleAccountsChanged = (accounts) => {
      if (!accounts || accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
        if (contract) {
          fetchBalance(contract, accounts[0]);
        }
      }
    };

    provider.on("accountsChanged", handleAccountsChanged);

    return () => {
      if (provider.removeListener) {
        provider.removeListener("accountsChanged", handleAccountsChanged);
      }
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

  return (
    <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
  );
}

// Custom hook to use Web3 context
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within Web3Provider");
  }
  return context;
};
