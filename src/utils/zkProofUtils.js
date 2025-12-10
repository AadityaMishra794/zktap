// ========================================
// ZK PROOF UTILITIES (Pure JavaScript - No Dependencies)
// ========================================

/**
 * Simple hash function for mock commitment
 * In production, replace with real Poseidon hash
 */
function simpleHash(...inputs) {
  // Combine all inputs
  const combined = inputs.join('-');
  
  // Create hash using Web Crypto API
  const encoder = new TextEncoder();
  const data = encoder.encode(combined);
  
  // Simple deterministic hash
  let hash = 0n;
  for (let i = 0; i < data.length; i++) {
    hash = (hash * 31n + BigInt(data[i])) % 
           21888242871839275222246405745257275088548364400416034343698204186575808495617n;
  }
  
  return hash.toString();
}

/**
 * Generate commitment (MOCK - for development)
 */
export async function generateCommitment(secret, balance, nonce) {
  try {
    console.log("🔐 Generating commitment...");
    console.log("Inputs:", { secret, balance, nonce });
    
    // Use simple hash function
    const commitment = simpleHash(
      secret.toString(),
      balance.toString(),
      nonce.toString()
    );
    
    console.log("✅ Commitment generated (MOCK):", commitment);
    console.warn("⚠️ WARNING: Using MOCK commitment! Replace with real Poseidon in production!");
    
    return commitment;
  } catch (error) {
    console.error("❌ Error generating commitment:", error);
    throw new Error("Failed to generate commitment: " + error.message);
  }
}

/**
 * Generate ZK Proof (MOCK - for development)
 */
export async function generateZKProof(inputs) {
  try {
    console.log("🔐 Generating ZK Proof...");
    console.log("Circuit inputs:", inputs);
    
    console.warn("⚠️ WARNING: Using MOCK proof! Replace with real snarkjs in production!");
    
    // MOCK PROOF
    const mockProof = {
      pA: [
        "1234567890123456789012345678901234567890123456789012345678901234",
        "9876543210987654321098765432109876543210987654321098765432109876"
      ],
      pB: [
        [
          "1111111111111111111111111111111111111111111111111111111111111111",
          "2222222222222222222222222222222222222222222222222222222222222222"
        ],
        [
          "3333333333333333333333333333333333333333333333333333333333333333",
          "4444444444444444444444444444444444444444444444444444444444444444"
        ]
      ],
      pC: [
        "5555555555555555555555555555555555555555555555555555555555555555",
        "6666666666666666666666666666666666666666666666666666666666666666"
      ],
      publicSignals: [inputs.commitment]
    };
    
    // Simulate proof generation delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("✅ ZK Proof generated (MOCK)");
    return mockProof;
    
  } catch (error) {
    console.error("❌ Error generating ZK proof:", error);
    throw new Error("Failed to generate proof: " + error.message);
  }
}

/**
 * Hash NFC data to create secret
 */
export function hashNFCData(nfcData) {
  try {
    console.log("🏷️ Hashing NFC data:", nfcData);
    
    // Convert string to numeric secret
    const hexString = Array.from(nfcData)
      .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('');
    
    const secret = BigInt('0x' + hexString).toString();
    
    console.log("✅ NFC secret generated:", secret);
    return secret;
  } catch (error) {
    console.error("❌ Error hashing NFC data:", error);
    return BigInt(Date.now()).toString();
  }
}

/**
 * Generate random secret
 */
export function generateRandomSecret() {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  
  const secret = BigInt('0x' + Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
  ).toString();
  
  console.log("🎲 Random secret generated");
  return secret;
}

/**
 * Validate proof format
 */
export function validateProofFormat(proof) {
  if (!proof.pA || proof.pA.length !== 2) {
    throw new Error("Invalid proof format: pA must have 2 elements");
  }
  if (!proof.pB || proof.pB.length !== 2) {
    throw new Error("Invalid proof format: pB must be 2x2 array");
  }
  if (!proof.pC || proof.pC.length !== 2) {
    throw new Error("Invalid proof format: pC must have 2 elements");
  }
  if (!proof.publicSignals || proof.publicSignals.length < 1) {
    throw new Error("Invalid proof format: publicSignals must have at least 1 element");
  }
  
  console.log("✅ Proof format is valid");
  return true;
}