function PaymentSuccess({ details, onReset }) {
  return (
    <div style={styles.resultContainer}>
      <div style={styles.resultContent}>
        <div style={styles.successIcon}>✓</div>
        <h2 style={styles.resultTitle}>Payment Successful!</h2>
        
        {details && (
          <div style={styles.paymentDetails}>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Amount:</span>
              <span style={styles.detailValue}>{details.amount} ETH</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Purpose:</span>
              <span style={styles.detailValue}>{details.purpose}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Merchant:</span>
              <span style={styles.detailValue}>{details.merchant}</span>
            </div>
          </div>
        )}
        
        <p style={styles.resultDescription}>
          Your transaction has been verified and completed securely using zero-knowledge proofs.
        </p>
        <button style={styles.resultButton} onClick={onReset}>
          Make Another Payment
        </button>
      </div>
    </div>
  );
}
export default PaymentSuccess