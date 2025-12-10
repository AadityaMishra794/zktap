import { useWeb3 } from "../context/Web3Context";
import { styles } from "../App";
import { useState ,useEffect } from "react";
import RegistrationModal from "./RegistrationModal";
import HeroSection from "./HeroSection";
import TapAndPayButton from "./TapAndPayButton";
function MainContent() {
  const { account, contract } = useWeb3();
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(true);

  // Check if user is registered
  useEffect(() => {
    const checkRegistration = async () => {
      if (!account || !contract) {
        setCheckingRegistration(false);
        return;
      }

      try {
        const user = await contract.methods.getUser(account).call();
        setIsRegistered(user.isRegistered);
        
        if (!user.isRegistered) {
          setShowRegistration(true);
        }
      } catch (error) {
        console.error('Error checking registration:', error);
        setIsRegistered(false);
      } finally {
        setCheckingRegistration(false);
      }
    };

    checkRegistration();
  }, [account, contract]);

  const handleRegistrationComplete = () => {
    setIsRegistered(true);
    setShowRegistration(false);
  };

  if (!account) {
    return (
      <main style={styles.main}>
        <HeroSection />
      </main>
    );
  }

  if (checkingRegistration) {
    return (
      <main style={styles.main}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Checking registration status...</p>
        </div>
      </main>
    );
  }

  if (!isRegistered) {
    return (
      <main style={styles.main}>
        <div style={styles.registrationPrompt}>
          <h2 style={styles.promptTitle}>Welcome to ZK Tap Wallet!</h2>
          <p style={styles.promptText}>
            Before you can start making payments, you need to register your wallet 
            with a zero-knowledge commitment.
          </p>
          <button 
            style={styles.registerButton}
            onClick={() => setShowRegistration(true)}
          >
            Register Now
          </button>
        </div>
        <RegistrationModal 
          isOpen={showRegistration}
          onClose={() => setShowRegistration(false)}
          onRegister={handleRegistrationComplete}
        />
      </main>
    );
  }

  return (
    <main style={styles.main}>
      <TapAndPayButton />
    </main>
  );
}
export default MainContent 