
import { useWeb3 } from "../context/Web3Context";
import { styles } from "../App";
function ConnectWalletButton() {
  const { connectWallet, loading } = useWeb3();

  return (
    <button 
      style={styles.connectButton}
      onClick={connectWallet}
      disabled={loading}
    >
      {loading ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}
export default ConnectWalletButton