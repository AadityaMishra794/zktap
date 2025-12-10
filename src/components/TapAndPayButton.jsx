import { useState ,useEffect } from "react";
import { useWeb3 } from "../context/Web3Context";
import { styles } from "../App";
import NFCReader from "./NFCReader";
function TapAndPayButton() {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const { contract, account, fetchBalance } = useWeb3();

  const handleStartScan = () => {
    setIsScanning(true);
    setPaymentStatus(null);
    setTransactionDetails(null);
  };

  const handlePaymentData = async (nfcData) => {
    console.log('Received NFC payment data:', nfcData);
    setIsScanning(false);
    
    // Store transaction details for display
    setTransactionDetails(nfcData);
    
    // Process payment
    await processPayment(nfcData);
  };

  const handleNFCError = (errorMessage) => {
    console.error('NFC Error:', errorMessage);
    setIsScanning(false);
    setPaymentStatus('fail');
    alert(errorMessage);
  };

  const processPayment = async (paymentData) => {
    try {
      const { recipient, amount, purpose, merchant } = paymentData;

      if (!recipient || !amount) {
        throw new Error('Invalid payment data: missing recipient or amount');
      }

      console.log(`Processing payment: ${amount} ETH to ${recipient} for ${purpose}`);

      // Convert amount to Wei
      const amountWei = Web3.utils.toWei(amount.toString(), 'ether');

      // Create transaction on smart contract
      const tx = await contract.methods
        .createTransaction(recipient, amountWei)
        .send({ from: account });

      console.log('Transaction created successfully:', tx);

      // Payment successful
      setPaymentStatus('success');
      
      // Refresh balance
      await fetchBalance(contract, account);

    } catch (error) {
      console.error('Payment processing failed:', error);
      setPaymentStatus('fail');
    }
  };

  const resetPayment = () => {
    setPaymentStatus(null);
    setIsScanning(false);
    setTransactionDetails(null);
  };

  // Show payment result
  if (paymentStatus === 'success') {
    return <PaymentSuccess details={transactionDetails} onReset={resetPayment} />;
  }

  if (paymentStatus === 'fail') {
    return <PaymentFail details={transactionDetails} onReset={resetPayment} />;
  }

  return (
    <div style={styles.tapContainer}>
      <div style={styles.tapContent}>
        <h2 style={styles.tapTitle}>Ready to Pay</h2>
        <p style={styles.tapDescription}>
          Tap the button below and hold your phone near the NFC tag to make a secure payment
        </p>
        
        {!isScanning ? (
          <button 
            style={styles.tapButton}
            onClick={handleStartScan}
          >
            <div style={styles.tapButtonContent}>
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <circle cx="30" cy="30" r="25" stroke="white" strokeWidth="2" />
                <path d="M20 25 C20 20, 25 15, 30 15 C35 15, 40 20, 40 25" stroke="white" strokeWidth="2" fill="none" />
                <path d="M22 30 C22 26, 26 22, 30 22 C34 22, 38 26, 38 30" stroke="white" strokeWidth="2" fill="none" />
                <circle cx="30" cy="35" r="3" fill="white" />
              </svg>
              <span>TAP TO PAY</span>
            </div>
          </button>
        ) : (
          <NFCReader 
            onPaymentData={handlePaymentData}
            onError={handleNFCError}
            isScanning={isScanning}
          />
        )}

        <p style={styles.tapNote}>
          📱 Make sure NFC is enabled on your device
        </p>
      </div>
    </div>
  );
}
export default TapAndPayButton