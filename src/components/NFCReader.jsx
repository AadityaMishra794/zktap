// ==================== NFC READER COMPONENT ====================

import { styles } from "../App";
import { useState ,useEffect } from "react";
function NFCReader({ onPaymentData, onError, isScanning }) {
  const [nfcSupported, setNfcSupported] = useState(false);
  const [reader, setReader] = useState(null);

  useEffect(() => {
    // Check NFC support
    if ('NDEFReader' in window) {
      setNfcSupported(true);
    }
  }, []);

  useEffect(() => {
    if (!isScanning || !nfcSupported) return;

    const startNFCScanning = async () => {
      try {
        const ndef = new NDEFReader();
        await ndef.scan();
        console.log('NFC scanning started...');
        setReader(ndef);

        ndef.addEventListener('reading', ({ message, serialNumber }) => {
          console.log('NFC tag detected! Serial:', serialNumber);
          
          try {
            // Parse NFC NDEF message
            const textDecoder = new TextDecoder();
            let paymentData = null;

            for (const record of message.records) {
              if (record.recordType === 'text') {
                const text = textDecoder.decode(record.data);
                console.log('NFC Data:', text);
                
                // Parse JSON data from NFC tag
                paymentData = JSON.parse(text);
                break;
              }
            }

            if (paymentData) {
              onPaymentData(paymentData);
            } else {
              throw new Error('No valid payment data found on NFC tag');
            }
          } catch (error) {
            console.error('Error parsing NFC data:', error);
            onError('Invalid NFC tag data format');
          }
        });

        ndef.addEventListener('readingerror', () => {
          console.error('NFC read error');
          onError('Failed to read NFC tag');
        });

      } catch (error) {
        console.error('NFC scanning error:', error);
        onError('Failed to start NFC scanning. Make sure NFC is enabled.');
      }
    };

    startNFCScanning();

    // Cleanup
    return () => {
      if (reader) {
        // Note: NDEFReader doesn't have a stop method, scanning stops when component unmounts
        setReader(null);
      }
    };
  }, [isScanning, nfcSupported, onPaymentData, onError]);

  if (!isScanning) return null;

  return (
    <div style={styles.nfcReader}>
      <div style={styles.nfcAnimation}>
        <div style={styles.nfcWave}></div>
        <div style={styles.nfcWave}></div>
        <div style={styles.nfcWave}></div>
      </div>
      <p style={styles.nfcText}>
        {nfcSupported 
          ? '📱 Hold your phone near the NFC tag...' 
          : '⚠️ NFC not supported on this device'}
      </p>
    </div>
  );
}
export default NFCReader;