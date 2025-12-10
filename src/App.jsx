import Header from "./components/Header";
import MainContent from "./components/Main";

import{Web3Provider , useWeb3} from "../src/context/Web3Context"
import Footer from "./components/Footer";
function App() {
  return (
    <Web3Provider>
      <div style={styles.app}>
        <Header />
        <MainContent />
        <Footer />
      </div>
    </Web3Provider>
  );
}
export const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#0f172a',
    color: '#fff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    backgroundColor: '#1e293b',
    borderBottom: '1px solid #334155',
    padding: '1rem 0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  connectButton: {
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  profileContainer: {
    position: 'relative',
  },
  profileButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  profileIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#6366f1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    color: 'white',
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '50px',
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '0.5rem',
    padding: '1rem',
    minWidth: '250px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
  },
  dropdownItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    borderBottom: '1px solid #334155',
  },
  dropdownLabel: {
    color: '#94a3b8',
    fontSize: '0.875rem',
  },
  dropdownValue: {
    color: '#fff',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
  disconnectButton: {
    width: '100%',
    marginTop: '1rem',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    padding: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  main: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  hero: {
    maxWidth: '1000px',
    textAlign: 'center',
  },
  heroContent: {
    padding: '2rem',
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '1.5rem',
    color: '#94a3b8',
    marginBottom: '1.5rem',
  },
  heroDescription: {
    fontSize: '1.125rem',
    color: '#cbd5e1',
    lineHeight: '1.8',
    maxWidth: '700px',
    margin: '0 auto 3rem',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginTop: '3rem',
  },
  feature: {
    backgroundColor: '#1e293b',
    padding: '2rem',
    borderRadius: '1rem',
    border: '1px solid #334155',
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  featureTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  featureText: {
    color: '#94a3b8',
    fontSize: '0.938rem',
  },
  tapContainer: {
    width: '100%',
    maxWidth: '500px',
  },
  tapContent: {
    textAlign: 'center',
    backgroundColor: '#1e293b',
    padding: '3rem',
    borderRadius: '1.5rem',
    border: '1px solid #334155',
  },
  tapTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  tapDescription: {
    color: '#94a3b8',
    marginBottom: '2rem',
    lineHeight: '1.6',
  },
  tapButton: {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    border: 'none',
    cursor: 'pointer',
    margin: '2rem auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s',
    boxShadow: '0 10px 40px rgba(99, 102, 241, 0.4)',
  },
  tapButtonContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  tapNote: {
    color: '#64748b',
    fontSize: '0.875rem',
    marginTop: '1rem',
  },
  nfcReader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
    padding: '2rem',
  },
  nfcAnimation: {
    position: 'relative',
    width: '150px',
    height: '150px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nfcWave: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    border: '3px solid #6366f1',
    animation: 'nfcPulse 2s ease-out infinite',
  },
  nfcText: {
    color: '#94a3b8',
    fontSize: '1rem',
    textAlign: 'center',
  },
  resultContainer: {
    width: '100%',
    maxWidth: '500px',
  },
  resultContent: {
    textAlign: 'center',
    backgroundColor: '#1e293b',
    padding: '3rem',
    borderRadius: '1.5rem',
    border: '1px solid #334155',
  },
  successIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#22c55e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    margin: '0 auto 1.5rem',
    color: 'white',
  },
  failIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#ef4444',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    margin: '0 auto 1.5rem',
    color: 'white',
  },
  resultTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  paymentDetails: {
    backgroundColor: '#0f172a',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    marginBottom: '1.5rem',
    textAlign: 'left',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    borderBottom: '1px solid #334155',
  },
  detailLabel: {
    color: '#94a3b8',
    fontSize: '0.938rem',
  },
  detailValue: {
    color: '#fff',
    fontSize: '0.938rem',
    fontWeight: '600',
  },
  resultDescription: {
    color: '#94a3b8',
    marginBottom: '2rem',
    lineHeight: '1.6',
  },
  resultButton: {
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '0.75rem 2rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  footer: {
    backgroundColor: '#1e293b',
    borderTop: '1px solid #334155',
    padding: '1.5rem',
    textAlign: 'center',
  },
  footerText: {
    color: '#64748b',
    fontSize: '0.875rem',
  },
  // Registration Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderRadius: '1rem',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    border: '1px solid #334155',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid #334155',
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: 0,
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#94a3b8',
    fontSize: '2rem',
    cursor: 'pointer',
    padding: 0,
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    padding: '2rem',
  },
  stepIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '2rem',
  },
  step: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    opacity: 0.5,
  },
  stepActive: {
    opacity: 1,
  },
  stepNumber: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#334155',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.125rem',
    fontWeight: 'bold',
  },
  stepLabel: {
    fontSize: '0.875rem',
    color: '#94a3b8',
  },
  stepLine: {
    flex: 1,
    height: '2px',
    backgroundColor: '#334155',
    margin: '0 1rem',
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  infoBox: {
    backgroundColor: '#0f172a',
    padding: '1rem',
    borderRadius: '0.5rem',
    border: '1px solid #334155',
  },
  infoText: {
    color: '#94a3b8',
    fontSize: '0.875rem',
    lineHeight: '1.6',
    margin: 0,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    color: '#cbd5e1',
    fontSize: '0.938rem',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '0.5rem',
    padding: '0.75rem',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
  },
  inputGroup: {
    display: 'flex',
    gap: '0.5rem',
  },
  generateButton: {
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '0.75rem 1rem',
    fontSize: '0.938rem',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  helperText: {
    color: '#64748b',
    fontSize: '0.813rem',
  },
  warningBox: {
    backgroundColor: '#451a03',
    border: '1px solid #ea580c',
    borderRadius: '0.5rem',
    padding: '1rem',
  },
  warningText: {
    color: '#fb923c',
    fontSize: '0.875rem',
    lineHeight: '1.6',
    margin: 0,
  },
  secretCode: {
    backgroundColor: '#0f172a',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    color: '#6366f1',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  successBox: {
    backgroundColor: '#14532d',
    border: '1px solid #22c55e',
    borderRadius: '0.5rem',
    padding: '1rem',
  },
  successText: {
    color: '#86efac',
    fontSize: '0.875rem',
    margin: 0,
  },
  summaryBox: {
    backgroundColor: '#0f172a',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    border: '1px solid #334155',
  },
  summaryTitle: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    borderBottom: '1px solid #334155',
  },
  summaryLabel: {
    color: '#94a3b8',
    fontSize: '0.875rem',
  },
  summaryValue: {
    color: '#fff',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '0.875rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#334155',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '0.875rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  registrationPrompt: {
    textAlign: 'center',
    maxWidth: '500px',
    backgroundColor: '#1e293b',
    padding: '3rem',
    borderRadius: '1.5rem',
    border: '1px solid #334155',
  },
  promptTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  promptText: {
    color: '#94a3b8',
    lineHeight: '1.6',
    marginBottom: '2rem',
  },
  registerButton: {
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '0.875rem 2rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  loadingContainer: {
    textAlign: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: '1rem',
  },
};

// Add keyframe animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes nfcPulse {
    0% {
      transform: scale(0.8);
      opacity: 1;
    }
    100% {
      transform: scale(1.4);
      opacity: 0;
    }
  }
  
  .nfcWave:nth-child(2) {
    animation-delay: 0.5s;
  }
  
  .nfcWave:nth-child(3) {
    animation-delay: 1s;
  }
  
  @media (max-width: 768px) {
    .heroTitle {
      font-size: 2.5rem !important;
    }
    .heroSubtitle {
      font-size: 1.25rem !important;
    }
    .features {
      grid-template-columns: 1fr !important;
    }
  }
`;
document.head.appendChild(styleSheet);
export default App