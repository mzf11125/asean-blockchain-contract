
import { Resolver } from 'did-resolver';
import { getResolver } from 'ethr-did-resolver';

// Configure DID resolver with multiple networks
const resolver = new Resolver({
  ...getResolver({
    networks: [
      {
        name: 'mainnet',
        rpcUrl: 'https://mainnet.infura.io/v3/demo-key', // Replace with actual key
      },
      {
        name: 'goerli',
        rpcUrl: 'https://goerli.infura.io/v3/demo-key', // Replace with actual key
      },
    ],
  }),
});

export interface DIDDocument {
  id: string;
  verificationMethod?: Array<{
    id: string;
    type: string;
    controller: string;
    publicKeyHex?: string;
  }>;
  authentication?: string[];
  assertionMethod?: string[];
  keyAgreement?: string[];
}

export const resolveDID = async (did: string): Promise<DIDDocument | null> => {
  try {
    const doc = await resolver.resolve(did);
    return doc.didDocument as DIDDocument;
  } catch (error) {
    console.error('Error resolving DID:', error);
    
    // Return mock DID document for demo purposes
    return {
      id: did,
      verificationMethod: [
        {
          id: `${did}#controller`,
          type: 'EcdsaSecp256k1RecoveryMethod2020',
          controller: did,
          publicKeyHex: '0x' + Math.random().toString(16).substr(2, 64)
        }
      ],
      authentication: [`${did}#controller`],
      assertionMethod: [`${did}#controller`]
    };
  }
};

export const validateDID = (did: string): boolean => {
  // Basic DID format validation
  const didRegex = /^did:[a-z0-9]+:[a-zA-Z0-9._-]+$/;
  return didRegex.test(did);
};

export const generateMockDID = (type: 'ethr' | 'key' = 'ethr'): string => {
  const identifier = Math.random().toString(16).substr(2, 40);
  return `did:${type}:0x${identifier}`;
};
