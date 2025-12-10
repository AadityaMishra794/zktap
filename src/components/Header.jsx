import {useWeb3} from "../context/Web3Context"
import { useState } from "react";
import {styles} from "../App"
import ConnectWalletButton from "./ConnectWalletButton";
function Header() {
  const { account, balance, disconnectWallet } = useWeb3();
  const [showDropdown, setShowDropdown] = useState(false);

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header style={styles.header}>
      <div style={styles.headerContent}>
        <div style={styles.logo}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" fill="#6366f1" />
            <path d="M20 10L28 20L20 30L12 20L20 10Z" fill="white" />
          </svg>
          <span style={styles.logoText}>ZK Tap</span>
        </div>
        
        {account ? (
          <div style={styles.profileContainer}>
            <button 
              style={styles.profileButton}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div style={styles.profileIcon}>
                {account.slice(0, 2).toUpperCase()}
              </div>
            </button>
            
            {showDropdown && (
              <div style={styles.dropdown}>
                <div style={styles.dropdownItem}>
                  <span style={styles.dropdownLabel}>Address:</span>
                  <span style={styles.dropdownValue}>{formatAddress(account)}</span>
                </div>
                <div style={styles.dropdownItem}>
                  <span style={styles.dropdownLabel}>Balance:</span>
                  <span style={styles.dropdownValue}>{parseFloat(balance).toFixed(4)} ETH</span>
                </div>
                <button 
                  style={styles.disconnectButton}
                  onClick={() => {
                    disconnectWallet();
                    setShowDropdown(false);
                  }}
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        ) : (
          <ConnectWalletButton />
        )}
      </div>
    </header>
  );
}
export default Header