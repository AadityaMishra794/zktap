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

// WalletConnect v2 Project ID
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

// Helper: Check if in MetaMask browser
const isMetaMaskBrowser = () => {
  return window.ethereum?.isMetaMask && /MetaMask/i.test(navigator.userAgent);
};

// Helper: Detect mobile
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
  const [wcProvider, setWcProvider] = useState(null);

  const connectWallet = async () => {
    try {
      setLoading(true);
      let activeProvider;

      // Check if user is in MetaMask browser (NFC won't work here!)
      if (isMetaMaskBrowser()) {
        alert(
          "⚠️ NFC NOT SUPPORTED IN METAMASK BROWSER\n\n" +
          "For NFC tap functionality, please:\n" +
          "1. Open Chrome browser on your Android phone\n" +
          "2. Visit: " + window.location.hostname + "\n" +
          "3. Connect wallet (will use WalletConnect)\n" +
          "4. Then you can use NFC tap features!\n\n" +
          "MetaMask browser doesn't support Web NFC API."
        );
        throw new Error("Please use Chrome browser for NFC support");
      }

      // Desktop or injected provider (like MetaMask extension)
      if (window.ethereum && !isMobile()) {
        console.log("🦊 Desktop - Using injected provider");
        activeProvider = window.ethereum;
        await activeProvider.request({ method: "eth_requestAccounts" });
      } 
      // Mobile without injected provider - use WalletConnect
      else if (isMobile() && !window.ethereum) {
        console.log("📱 Mobile Chrome - Using WalletConnect for MetaMask");
        
        if (!WC_PROJECT_ID) {
          throw new Error("WalletConnect Project ID not configured");
        }

        // Initialize WalletConnect - MINIMAL config to avoid MetaMask bugs
        const wc = await EthereumProvider.init({
          projectId: WC_PROJECT_ID,
          showQrModal: true,
          metadata: {
            name: "ZK Tap Wallet",
            description: "Zero-knowledge NFC tap wallet",
            url: window.location.origin,
            icons: ["https://zktapwallet.netlify.app/icon.png"],
          },
          // CRITICAL: Use ONLY optionalChains, NO chains parameter
          optionalChains: [11155111, 1, 137],
          // CRITICAL: Use ONLY optionalMethods, NO methods parameter
          optionalMethods: [
            "eth_sendTransaction",
            "eth_signTransaction", 
            "personal_sign",
            "eth_signTypedData",
          ],
          // REQUIRED
          events: ["chainChanged", "accountsChanged"],
          rpcMap: {
            11155111: RPC_URL,
            1: "https://eth-mainnet.g.alchemy.com/v2/demo",
            137: "https://polygon-rpc.com",
          },
          qrModalOptions: {
            themeMode: "dark",
          },
        });

        console.log("✅ WalletConnect initialized");

        // Event listeners
        wc.on("display_uri", (uri) => {
          console.log("📱 WalletConnect URI ready");
          console.log("💡 TIP: Tap MetaMask in the modal to connect");
        });

        wc.on("connect", () => {
          console.log("✅ WalletConnect connected!");
        });

        wc.on("disconnect", () => {
          console.log("🔌 WalletConnect disconnected");
          disconnectWallet();
        });

        // Connect - use enable() instead of connect() for better MetaMask compatibility
        console.log("⏳ Connecting to wallet...");
        await wc.enable();
        
        console.log("✅ Connected via WalletConnect");
        activeProvider = wc;
        setWcProvider(wc);
      }
      // Mobile with injected provider (Trust Wallet, etc.)
      else if (window.ethereum) {
        console.log("📱 Mobile - Using injected provider");
        activeProvider = window.ethereum;
        await activeProvider.request({ method: "eth_requestAccounts" });
      }
      else {
        throw new Error("No wallet detected. Please install MetaMask.");
      }

      // Initialize Web3
      const web3Instance = new Web3(activeProvider);
      
      // Small delay for provider
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get accounts
      const accounts = await web3Instance.eth.getAccounts();
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found. Please unlock your wallet.");
      }

      console.log("✅ Account:", accounts[0]);

      // Check network
      const chainId = await web3Instance.eth.getChainId();
      console.log("🔗 Chain ID:", chainId);
      
      if (Number(chainId) !== 11155111) {
        console.log("⚠️ Wrong network, switching to Sepolia...");
        
        try {
          await activeProvider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }],
          });
          console.log("✅ Switched to Sepolia");
        } catch (switchError) {
          if (switchError.code === 4902) {
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
              console.log("✅ Sepolia added");
            } catch (addError) {
              throw new Error("Please add Sepolia network in your wallet");
            }
          } else {
            throw new Error("Please switch to Sepolia network");
          }
        }
      }

      // Check contract
      console.log("🔍 Verifying contract...");
      const code = await web3Instance.eth.getCode(CONTRACT_ADDRESS);
      if (!code || code === "0x" || code === "0x0") {
        throw new Error("Contract not deployed on Sepolia");
      }
      console.log("✅ Contract verified");

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
      await fetchBalance(contractInstance, accounts[0]);
      
      console.log("🎉 Successfully connected!");
      console.log("📱 NFC should work in Chrome on Android");
    } catch (error) {
      console.error("❌ Connection error:", error);
      
      let message = error?.message || "Failed to connect wallet";
      
      // Don't show alert for user cancellation
      if (message.includes("User rejected") || 
          message.includes("rejected the request") ||
          message.includes("User denied")) {
        console.log("User cancelled");
        return;
      }
      
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
      console.error("❌ Balance error:", e);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (wcProvider && wcProvider.disconnect) {
        await wcProvider.disconnect();
      }
    } catch (e) {
      console.warn("Disconnect error:", e);
    }
    
    setProvider(null);
    setWeb3(null);
    setAccount(null);
    setContract(null);
    setBalance("0");
    setWcProvider(null);
    console.log("🔌 Disconnected");
  };

  // Event listeners
  useEffect(() => {
    if (!provider) return;

    const handleAccountsChanged = (accounts) => {
      console.log("👤 Accounts changed:", accounts);
      if (!accounts || accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
        if (contract) fetchBalance(contract, accounts[0]);
      }
    };

    const handleChainChanged = () => {
      console.log("🔗 Chain changed");
      window.location.reload();
    };

    const handleDisconnect = () => {
      console.log("🔌 Disconnected");
      disconnectWallet();
    };

    if (provider.on) {
      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);
    }

    return () => {
      if (provider.removeListener) {
        provider.removeListener("accountsChanged", handleAccountsChanged);
        provider.removeListener("chainChanged", handleChainChanged);
        provider.removeListener("disconnect", handleDisconnect);
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

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

// Hook
export const useWeb3 = () => {
  const ctx = useContext(Web3Context);
  if (!ctx) throw new Error("useWeb3 must be used within Web3Provider");
  return ctx;
};
