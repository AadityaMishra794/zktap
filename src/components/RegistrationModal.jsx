import { useState } from "react";
import { useWeb3 } from "../context/Web3Context";
import { styles } from "../App";

function RegistrationModal({ isOpen, onClose, onRegister }) {
  const { contract, account, web3 } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    initialBalance: "0.01",
    secret: "",
    commitment: "",
  });

  // Generate random secret for user
  const generateSecret = () => {
    const randomSecret = Math.floor(Math.random() * 1000000000).toString();
    setFormData((prev) => ({ ...prev, secret: randomSecret }));
  };

  // Simple hash/commitment generator (demo only)
  const generateCommitment = () => {
    if (!web3) {
      alert("Web3 is not initialized. Please connect your wallet first.");
      return;
    }

    if (!formData.secret) {
      alert("Please generate a secret first!");
      return;
    }

    // This is a simplified demo hash.
    // In production, you should:
    // 1. Use Poseidon hash (circomlibjs)
    // 2. Include balance and a nonce in the hash
    const combined = formData.secret + formData.initialBalance + Date.now();

    // keccak256 returns a hex string (e.g. "0xabc123...")
    const hash = web3.utils.keccak256(combined);

    // Convert hex hash to a big decimal string for uint256
    // BigInt can parse hex strings directly.
    const commitment = BigInt(hash).toString();

    setFormData((prev) => ({ ...prev, commitment }));
    setStep(2);
  };

  const handleRegister = async () => {
    if (!web3 || !contract || !account) {
      alert("Please connect your wallet before registering.");
      return;
    }

    if (!formData.commitment) {
      alert("Please generate commitment first!");
      return;
    }

    try {
      setLoading(true);

      // Convert balance to Wei
      const balanceWei = web3.utils.toWei(formData.initialBalance, "ether");

      console.log("Registering user with:");
      console.log("Commitment:", formData.commitment);
      console.log("Balance (wei):", balanceWei);

      // Call smart contract
      const tx = await contract.methods
        .registerUser(formData.commitment, balanceWei)
        .send({ from: account });

      console.log("Registration successful!", tx);

      // Save secret securely (demo only – in real apps, use secure storage)
      localStorage.setItem("userSecret", formData.secret);
      localStorage.setItem("userCommitment", formData.commitment);

      alert(
        "Registration successful! Please save your secret key in a safe place."
      );
      onRegister && onRegister();
      onClose();
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed: " + (error.message || String(error)));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div
        style={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Register Your Wallet</h2>
          <button style={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div style={styles.modalBody}>
          {/* Step Indicator */}
          <div style={styles.stepIndicator}>
            <div
              style={{
                ...styles.step,
                ...(step >= 1 ? styles.stepActive : {}),
              }}
            >
              <div style={styles.stepNumber}>1</div>
              <span style={styles.stepLabel}>Generate Secret</span>
            </div>
            <div style={styles.stepLine}></div>
            <div
              style={{
                ...styles.step,
                ...(step >= 2 ? styles.stepActive : {}),
              }}
            >
              <div style={styles.stepNumber}>2</div>
              <span style={styles.stepLabel}>Register</span>
            </div>
          </div>

          {step === 1 && (
            <div style={styles.formSection}>
              <div style={styles.infoBox}>
                <p style={styles.infoText}>
                  ℹ️ <strong>What is registration?</strong>
                  <br />
                  Registration creates your zero-knowledge wallet identity.
                  You&apos;ll generate a secret key that only you know, which
                  is used to prove ownership without revealing your private
                  data.
                </p>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Initial Balance (ETH)</label>
                <input
                  type="number"
                  step="0.001"
                  value={formData.initialBalance}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      initialBalance: e.target.value,
                    }))
                  }
                  style={styles.input}
                  placeholder="0.01"
                />
                <span style={styles.helperText}>
                  This is your starting wallet balance
                </span>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Your Secret Key</label>
                <div style={styles.inputGroup}>
                  <input
                    type="text"
                    value={formData.secret}
                    readOnly
                    style={styles.input}
                    placeholder="Click generate to create secret"
                  />
                  <button
                    style={styles.generateButton}
                    onClick={generateSecret}
                  >
                    🔑 Generate
                  </button>
                </div>
                <span style={styles.helperText}>
                  ⚠️ Save this secret! You&apos;ll need it for transactions
                </span>
              </div>

              {formData.secret && (
                <div style={styles.warningBox}>
                  <p style={styles.warningText}>
                    🔐 <strong>IMPORTANT:</strong> Copy and save your secret
                    key:
                    <br />
                    <code style={styles.secretCode}>{formData.secret}</code>
                    <br />
                    You&apos;ll need this for all future transactions!
                  </p>
                </div>
              )}

              <button
                style={styles.primaryButton}
                onClick={generateCommitment}
                disabled={!formData.secret}
              >
                Generate Commitment &amp; Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={styles.formSection}>
              <div style={styles.successBox}>
                <p style={styles.successText}>
                  ✅ Commitment generated successfully!
                </p>
              </div>

              <div style={styles.summaryBox}>
                <h3 style={styles.summaryTitle}>Registration Summary</h3>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>Wallet Address:</span>
                  <span style={styles.summaryValue}>
                    {account ? `${account.slice(0, 10)}...` : "N/A"}
                  </span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>Initial Balance:</span>
                  <span style={styles.summaryValue}>
                    {formData.initialBalance} ETH
                  </span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>Your Secret:</span>
                  <span style={styles.summaryValue}>{formData.secret}</span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>Commitment:</span>
                  <span style={styles.summaryValue}>
                    {formData.commitment
                      ? `${formData.commitment.slice(0, 20)}...`
                      : "Not generated"}
                  </span>
                </div>
              </div>

              <div style={styles.buttonGroup}>
                <button
                  style={styles.secondaryButton}
                  onClick={() => setStep(1)}
                >
                  ← Back
                </button>
                <button
                  style={styles.primaryButton}
                  onClick={handleRegister}
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Complete Registration"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegistrationModal;
