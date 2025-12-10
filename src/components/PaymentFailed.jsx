function PaymentFail({ details, onReset }) {
  return (
    <div style={styles.resultContainer}>
      <div style={styles.resultContent}>
        <div style={styles.failIcon}>✕</div>
        <h2 style={styles.resultTitle}>Payment Failed</h2>
        
        {details && (
          <div style={styles.paymentDetails}>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Attempted Amount:</span>
              <span style={styles.detailValue}>{details.amount} ETH</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Purpose:</span>
              <span style={styles.detailValue}>{details.purpose}</span>
            </div>
          </div>
        )}
        
        <p style={styles.resultDescription}>
          Something went wrong with your transaction. Please check your balance and try again.
        </p>
        <button style={styles.resultButton} onClick={onReset}>
          Try Again
        </button>
      </div>
    </div>
  );
}

export default PaymentFail