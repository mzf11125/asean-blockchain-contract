
import { useState, useEffect } from "react";
import { FileText, Calendar, Users, Globe, Code, Shield, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { VCViewer } from "./VCViewer";
import { generateContractVC, ContractVerifiableCredential, hashVC } from "@/utils/vcGenerator";

interface ContractExpandedViewProps {
  contract: {
    id: string;
    title: string;
    parties: string[];
    status: string;
    uploadDate: string;
    blockchainHash?: string;
    ipfsHash?: string;
  };
}

export function ContractExpandedView({ contract }: ContractExpandedViewProps) {
  const [vc, setVc] = useState<ContractVerifiableCredential | null>(null);
  const [showVCViewer, setShowVCViewer] = useState(false);
  const [vcHash, setVcHash] = useState<string>('');

  // Mock contract data for VC generation
  const mockContractData = {
    id: contract.id,
    contractType: "Supply Agreement",
    jurisdiction: "ASEAN Cross-Border",
    parties: contract.parties,
    keyTerms: {
      deliveryDate: "2024-03-15",
      paymentTerms: "Net 30 days",
      totalValue: "$125,000 USD",
      currency: "USD"
    },
    complianceFlags: {
      aseanFTA: true,
      exportLicense: true,
      qualityStandards: "ISO 9001"
    },
    ocrResults: [
      "Party 1: TechCorp Singapore Pte Ltd",
      "Party 2: Import Solutions (Thailand) Co., Ltd",
      "Contract Date: January 15, 2024",
      "Total Contract Value: $125,000.00",
      "Payment Terms: Net 30 days from delivery",
      "Governing Law: Singapore Law with ASEAN Trade Agreement provisions"
    ]
  };

  useEffect(() => {
    const generateVC = async () => {
      if (contract.ipfsHash) {
        const blockchainAnchor = contract.blockchainHash ? {
          transactionHash: `0x${contract.blockchainHash.replace('0x', '')}abcdef1234567890`,
          blockNumber: 12345678,
          network: 'ethereum'
        } : undefined;

        const generatedVC = await generateContractVC(
          mockContractData,
          contract.ipfsHash,
          blockchainAnchor
        );
        
        setVc(generatedVC);
        setVcHash(hashVC(generatedVC));
      }
    };

    generateVC();
  }, [contract]);

  if (!vc) {
    return (
      <div className="mt-4 p-4 text-center">
        <p>Generating Verifiable Credential...</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-4 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Shield className="w-5 h-5 text-success" />
                <span>Verifiable Credential</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Credential Type</label>
                  <p className="text-sm text-muted-foreground">
                    {vc.type.join(', ')}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Issuer DID</label>
                  <p className="text-xs text-muted-foreground break-all">
                    {vc.issuer}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Issued Date</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(vc.issuanceDate).toLocaleString()}
                  </p>
                </div>

                <Separator />

                <div className="flex space-x-2">
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={() => setShowVCViewer(true)}
                    className="flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Full VC</span>
                  </Button>
                  <Badge variant="success" className="text-xs">
                    <Shield className="w-3 h-3 mr-1" />
                    Cryptographically Signed
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <span>Blockchain Anchoring</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">VC Hash (Anchored)</label>
                  <code className="text-xs bg-muted p-1 rounded block mt-1 break-all">
                    {vcHash}
                  </code>
                </div>
                
                {vc.credentialSubject.blockchainAnchor && (
                  <>
                    <div>
                      <label className="text-sm font-medium">Transaction Hash</label>
                      <code className="text-xs bg-muted p-1 rounded block mt-1 break-all">
                        {vc.credentialSubject.blockchainAnchor.transactionHash}
                      </code>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Block Number</label>
                      <p className="text-sm text-muted-foreground">
                        {vc.credentialSubject.blockchainAnchor.blockNumber}
                      </p>
                    </div>
                  </>
                )}

                <Badge variant="outline" className="text-xs">
                  Hash anchored on {vc.credentialSubject.blockchainAnchor?.network || 'Ethereum'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Contract Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Timeline</span>
                </div>
                <div className="pl-6 space-y-1">
                  <p>Uploaded: {contract.uploadDate}</p>
                  <p>VC Issued: {new Date(vc.issuanceDate).toLocaleDateString()}</p>
                  <p>Status: {contract.status}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Verified Parties</span>
                </div>
                <div className="pl-6 space-y-1">
                  {vc.credentialSubject.parties.map((party, index) => (
                    <div key={index} className="flex items-center space-x-1">
                      <p className="text-xs">{party.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {party.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Compliance</span>
                </div>
                <div className="pl-6 space-y-1">
                  <Badge variant="success" className="text-xs">ASEAN FTA</Badge>
                  <Badge variant="success" className="text-xs">Export Ready</Badge>
                  <Badge variant="outline" className="text-xs">
                    {vc.credentialSubject.complianceFlags.qualityStandards}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showVCViewer && (
        <VCViewer
          vc={vc}
          isOpen={showVCViewer}
          onClose={() => setShowVCViewer(false)}
        />
      )}
    </>
  );
}
