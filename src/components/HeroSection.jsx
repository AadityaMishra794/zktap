
import { styles } from "../App";
function HeroSection() {
  return (
    <div style={styles.hero}>
      <div style={styles.heroContent}>
        <h1 style={styles.heroTitle}>ZK Tap Wallet</h1>
        <p style={styles.heroSubtitle}>Fast • Secure • Private</p>
        <p style={styles.heroDescription}>
          Experience the future of payments with zero-knowledge proof technology. 
          Tap your phone to make instant, secure crypto payments while keeping 
          your transaction details private.
        </p>
        
        <div style={styles.features}>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>🔒</div>
            <h3 style={styles.featureTitle}>Private</h3>
            <p style={styles.featureText}>Zero-knowledge proofs keep your data secure</p>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>⚡</div>
            <h3 style={styles.featureTitle}>Fast</h3>
            <p style={styles.featureText}>Instant NFC-based payments</p>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>🛡️</div>
            <h3 style={styles.featureTitle}>Secure</h3>
            <p style={styles.featureText}>Blockchain-verified transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HeroSection