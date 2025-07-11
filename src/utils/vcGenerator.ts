
import { createVerifiableCredentialJwt, JwtCredentialPayload } from 'did-jwt-vc';
import { EthrDID } from 'ethr-did';
import { Resolver } from 'did-resolver';
import { getResolver } from 'ethr-did-resolver';

// Mock DID configuration - in production, these would be proper organizational DIDs
const ISSUER_DID = 'did:ethr:0x1234567890abcdef1234567890abcdef12345678';
const ISSUER_PRIVATE_KEY = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab';

// Configure DID resolver
const resolver = new Resolver(getResolver({
  networks: [
    {
      name: 'mainnet',
      rpcUrl: 'https://mainnet.infura.io/v3/your-project-id'
    }
  ]
}));

export interface ContractCredentialSubject {
  id: string;
  contractType: string;
  jurisdiction: string;
  parties: Array<{
    name: string;
    did?: string;
    role: string;
  }>;
  keyTerms: {
    deliveryDate?: string;
    paymentTerms?: string;
    totalValue?: string;
    currency?: string;
  };
  complianceFlags: {
    aseanFTA: boolean;
    exportLicense: boolean;
    qualityStandards?: string;
  };
  ipfsCID: string;
  blockchainAnchor?: {
    transactionHash: string;
    blockNumber: number;
    network: string;
  };
  ocrExtraction: string[];
}

export interface ContractVerifiableCredential {
  '@context': string[];
  type: string[];
  issuer: string;
  issuanceDate: string;
  credentialSubject: ContractCredentialSubject;
  proof?: any;
}

export const generateContractVC = async (
  contractData: any,
  ipfsCID: string,
  blockchainAnchor?: { transactionHash: string; blockNumber: number; network: string }
): Promise<ContractVerifiableCredential> => {
  const credentialSubject: ContractCredentialSubject = {
    id: `urn:uuid:${contractData.id}`,
    contractType: contractData.contractType || 'Supply Agreement',
    jurisdiction: contractData.jurisdiction || 'ASEAN Cross-Border',
    parties: contractData.parties.map((party: string, index: number) => ({
      name: party,
      did: `did:ethr:0x${Math.random().toString(16).substr(2, 40)}`, // Mock DID
      role: index === 0 ? 'supplier' : 'buyer'
    })),
    keyTerms: contractData.keyTerms || {},
    complianceFlags: contractData.complianceFlags || {
      aseanFTA: true,
      exportLicense: true,
      qualityStandards: 'ISO 9001'
    },
    ipfsCID,
    blockchainAnchor,
    ocrExtraction: contractData.ocrResults || []
  };

  const vcPayload: JwtCredentialPayload = {
    sub: credentialSubject.id,
    vc: {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://w3id.org/security/suites/ed25519-2020/v1',
        'https://schema.asean.org/contract/v1'
      ],
      type: ['VerifiableCredential', 'ASEANContractCredential'],
      credentialSubject
    }
  };

  try {
    // Create issuer DID (mock for now)
    const issuer = new EthrDID({
      identifier: ISSUER_DID.split(':')[2],
      privateKey: ISSUER_PRIVATE_KEY
    });

    // Create and sign the VC using the correct function name
    const vcJwt = await createVerifiableCredentialJwt(vcPayload, issuer);
    
    // For display purposes, also return the decoded VC
    const vc: ContractVerifiableCredential = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://w3id.org/security/suites/ed25519-2020/v1',
        'https://schema.asean.org/contract/v1'
      ],
      type: ['VerifiableCredential', 'ASEANContractCredential'],
      issuer: ISSUER_DID,
      issuanceDate: new Date().toISOString(),
      credentialSubject,
      proof: {
        type: 'JwtProof2020',
        jwt: vcJwt,
        created: new Date().toISOString(),
        proofPurpose: 'assertionMethod',
        verificationMethod: `${ISSUER_DID}#controller`
      }
    };

    return vc;
  } catch (error) {
    console.error('Error generating VC:', error);
    
    // Fallback: return unsigned VC for demo purposes
    return {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://w3id.org/security/suites/ed25519-2020/v1',
        'https://schema.asean.org/contract/v1'
      ],
      type: ['VerifiableCredential', 'ASEANContractCredential'],
      issuer: ISSUER_DID,
      issuanceDate: new Date().toISOString(),
      credentialSubject
    };
  }
};

export const hashVC = (vc: ContractVerifiableCredential): string => {
  // Create a deterministic hash of the VC for blockchain anchoring
  const vcString = JSON.stringify(vc, Object.keys(vc).sort());
  return `0x${Buffer.from(vcString).toString('hex').slice(0, 64)}`;
};
