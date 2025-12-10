// src/context/Web3Context.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import Web3 from "web3";

// Create Context
const Web3Context = createContext();

// ---------------- CONFIG ----------------

// Your deployed ZKTapWallet
const CONTRACT_ADDRESS = "0xfB51ddCBd96743467F86D24a0AdAc78dAADCC60F";

// Alchemy RPC (Sepolia)
const RPC_URL = import.meta.env.VITE_ALCHEMY_API_KEY
  ? `https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`
  : "https://eth-sepolia.g.alchemy.com/v2/demo";

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

// Helper: Detect if in MetaMask's browser
const isMetaMaskBrowser = () => {
  return window.ethereum && window.ethereum.isMetaMask;
};

// Helper: Detect mobile device
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// --------------- PROVIDER COMPONENT ---------------

export function Web3Provider({ children }) {
  const [web3, setWeb3] = useState(null);
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      let activeProvider;

      // Check if MetaMask is available
      if (window.ethereum && window.ethereum.isMetaMask) {
        console.log("🦊 Using MetaMask");
        activeProvider = window.ethereum;
        
        // Request accounts
        const accounts = await activeProvider.request({ 
          method: "eth_requestAccounts" 
        });
        
        console.log("✅ Connected to MetaMask:", accounts[0]);
      } 
      // Mobile but not in MetaMask browser - show instruction
      else if (isMobile()) {
        console.log("📱 Mobile detected without MetaMask");
        
        // Create deep link to open your dApp in MetaMask browser
        const currentUrl = window.location.href;
        const metamaskDeepLink = `https://metamask.app.link/dapp/${currentUrl.replace(/^https?:\/\//, '')}`;
        
        const shouldOpenMetaMask = confirm(
          "⚠️ For best experience on mobile, please use MetaMask's built-in browser.\n\n" +
          "Tap OK to open this app in MetaMask, or Cancel to continue anyway."
        );
        
        if (shouldOpenMetaMask) {
          window.location.href = metamaskDeepLink;
          return;
        }
        
        // User chose to continue - show error
        throw new Error(
          "MetaMask not detected. Please install MetaMask mobile app and open this site in MetaMask's browser."
        );
      } 
      // Desktop without MetaMask
      else {
        console.log("🖥️ Desktop without MetaMask");
        throw new Error(
          "MetaMask not detected. Please install MetaMask extension: https://metamask.io/download/"
        );
      }

      // Initialize Web3
      const web3Instance = new Web3(activeProvider);
      
      // Get accounts
      const accounts = await web3Instance.eth.getAccounts();
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found. Please unlock MetaMask.");
      }

      console.log("📋 Account:", accounts[0]);

      // Check network
      const chainId = await web3Instance.eth.getChainId();
      console.log("🔗 Chain ID:", chainId);
      
      const sepoliaChainId = 11155111;
      
      if (Number(chainId) !== sepoliaChainId) {
        console.log("⚠️ Wrong network, switching to Sepolia...");
        
        try {
          // Try to switch to Sepolia
          await activeProvider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }], // Sepolia hex
          });
          console.log("✅ Switched to Sepolia");
        } catch (switchError) {
          // If Sepolia not added, add it
          if (switchError.code === 4902) {
            console.log("➕ Adding Sepolia network...");
            try {
              await activeProvider.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0xaa36a7',
                  chainName: 'Sepolia Test Network',
                  nativeCurrency: {
                    name: 'Sepolia ETH',
                    symbol: 'SepoliaETH',
                    decimals: 18
                  },
                  rpcUrls: [RPC_URL],
                  blockExplorerUrls: ['https://sepolia.etherscan.io'],
                }],
              });
              console.log("✅ Sepolia network added");
            } catch (addError) {
              console.error("❌ Failed to add Sepolia:", addError);
              throw new Error("Please manually add Sepolia network in MetaMask");
            }
          } else {
            console.error("❌ Network switch failed:", switchError);
            throw new Error("Please manually switch to Sepolia network in MetaMask");
          }
        }
      }

      // Verify contract deployment
      console.log("🔍 Checking contract...");
      const code = await web3Instance.eth.getCode(CONTRACT_ADDRESS);
      if (!code || code === "0x" || code === "0x0") {
        throw new Error(
          `Contract not deployed at ${CONTRACT_ADDRESS} on Sepolia. Please verify the contract address.`
        );
      }
      console.log("✅ Contract found");

      // Create contract instance
      const contractInstance = new web3Instance.eth.Contract(
        CONTRACT_ABI,
        CONTRACT_ADDRESS
      );

      // Set state
      setProvider(activeProvider);
      setWeb3(web3Instance);
      setAccount(accounts[0]);
      setContract(contractInstance);

      // Fetch balance
      console.log("💰 Fetching balance...");
      await fetchBalance(contractInstance, accounts[0]);
      
      console.log("🎉 Successfully connected!");
    } catch (error) {
      console.error("❌ Connection error:", error);
      
      // Set user-friendly error
      let message = error?.message || "Failed to connect wallet";
      
      // Don't show alert for user cancellation
      if (message.includes("User rejected") || 
          message.includes("User denied") ||
          message.includes("rejected the request")) {
        console.log("User cancelled connection");
        setError("Connection cancelled by user");
        return;
      }
      
      setError(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async (contractInstance, userAccount) => {
    if (!contractInstance || !userAccount) return;
    try {
      const bal = await contractInstance.methods.getBalance(userAccount).call();
      const balanceInEth = Web3.utils.fromWei(bal.toString(), "ether");
      setBalance(balanceInEth);
      console.log("💰 Balance:", balanceInEth, "ETH");
    } catch (e) {
      console.error("❌ Balance fetch error:", e);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setWeb3(null);
    setAccount(null);
    setContract(null);
    setBalance("0");
    setError(null);
    console.log("🔌 Wallet disconnected");
  };

  // Event listeners for MetaMask
  useEffect(() => {
    if (!provider || !window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      console.log("👤 Accounts changed:", accounts);
      if (!accounts || accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
        if (contract) fetchBalance(contract, accounts[0]);
      }
    };

    const handleChainChanged = (chainId) => {
      console.log("🔗 Chain changed:", chainId);
      // Reload on chain change
      window.location.reload();
    };

    const handleDisconnect = () => {
      console.log("🔌 Disconnected");
      disconnectWallet();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    window.ethereum.on("disconnect", handleDisconnect);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
        window.ethereum.removeListener("disconnect", handleDisconnect);
      }
    };
  }, [provider, contract]);

  const value = {
    web3,
    account,
    contract,
    balance,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    fetchBalance,
    isMetaMaskAvailable: isMetaMaskBrowser(),
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

// Hook
export const useWeb3 = () => {
  const ctx = useContext(Web3Context);
  if (!ctx) throw new Error("useWeb3 must be used within Web3Provider");
  return ctx;
};
