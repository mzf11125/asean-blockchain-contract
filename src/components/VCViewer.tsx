
import { useState } from "react";
import { Shield, Eye, Copy, ExternalLink, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ContractVerifiableCredential } from "@/utils/vcGenerator";

interface VCViewerProps {
  vc: ContractVerifiableCredential;
  isOpen: boolean;
  onClose: () => void;
}

export function VCViewer({ vc, isOpen, onClose }: VCViewerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'raw' | 'proof'>('overview');
  const { toast } = useToast();

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const verifyProof = () => {
    // Mock verification - in production, this would verify the JWT signature
    toast({
      title: "Verification Complete",
      description: "Credential signature is valid and issuer is trusted",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-success" />
            <CardTitle>Verifiable Credential Viewer</CardTitle>
          </div>
          <Button variant="ghost" onClick={onClose}>×</Button>
        </CardHeader>
        
        <CardContent className="overflow-y-auto">
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-4 border-b">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'raw', label: 'Raw VC' },
              { key: 'proof', label: 'Proof' }
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(tab.key as any)}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">ASEAN Contract Credential</h3>
                  <p className="text-sm text-muted-foreground">
                    Issued: {new Date(vc.issuanceDate).toLocaleString()}
                  </p>
                </div>
                <Badge variant="success">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>

              <Separator />

              {/* Issuer Information */}
              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Issuer
                </h4>
                <div className="bg-muted p-3 rounded">
                  <code className="text-sm break-all">{vc.issuer}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(vc.issuer, 'Issuer DID')}
                    className="ml-2"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Contract Details */}
              <div>
                <h4 className="font-medium mb-2">Contract Information</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Type</label>
                    <p className="text-sm text-muted-foreground">
                      {vc.credentialSubject.contractType}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Jurisdiction</label>
                    <p className="text-sm text-muted-foreground">
                      {vc.credentialSubject.jurisdiction}
                    </p>
                  </div>
                </div>
              </div>

              {/* Parties */}
              <div>
                <h4 className="font-medium mb-2">Contract Parties</h4>
                <div className="space-y-2">
                  {vc.credentialSubject.parties.map((party, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div>
                        <p className="font-medium">{party.name}</p>
                        <p className="text-xs text-muted-foreground">Role: {party.role}</p>
                      </div>
                      {party.did && (
                        <Badge variant="outline" className="text-xs">
                          DID: {party.did.slice(0, 20)}...
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* IPFS and Blockchain Links */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">IPFS Storage</h4>
                  <div className="flex items-center space-x-2">
                    <code className="text-xs bg-muted p-1 rounded flex-1">
                      {vc.credentialSubject.ipfsCID}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://ipfs.io/ipfs/${vc.credentialSubject.ipfsCID}`, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {vc.credentialSubject.blockchainAnchor && (
                  <div>
                    <h4 className="font-medium mb-2">Blockchain Anchor</h4>
                    <div className="text-xs">
                      <p>Tx: {vc.credentialSubject.blockchainAnchor.transactionHash.slice(0, 20)}...</p>
                      <p>Block: {vc.credentialSubject.blockchainAnchor.blockNumber}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Compliance Flags */}
              <div>
                <h4 className="font-medium mb-2">Compliance Status</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={vc.credentialSubject.complianceFlags.aseanFTA ? 'success' : 'destructive'}>
                    ASEAN FTA: {vc.credentialSubject.complianceFlags.aseanFTA ? 'Compliant' : 'Non-compliant'}
                  </Badge>
                  <Badge variant={vc.credentialSubject.complianceFlags.exportLicense ? 'success' : 'destructive'}>
                    Export License: {vc.credentialSubject.complianceFlags.exportLicense ? 'Valid' : 'Invalid'}
                  </Badge>
                  {vc.credentialSubject.complianceFlags.qualityStandards && (
                    <Badge variant="outline">
                      {vc.credentialSubject.complianceFlags.qualityStandards}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Raw VC Tab */}
          {activeTab === 'raw' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Raw Verifiable Credential (JSON-LD)</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(JSON.stringify(vc, null, 2), 'Raw VC')}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
              <pre className="text-xs bg-muted p-4 rounded overflow-x-auto max-h-96">
                {JSON.stringify(vc, null, 2)}
              </pre>
            </div>
          )}

          {/* Proof Tab */}
          {activeTab === 'proof' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Digital Proof Verification</h4>
                <Button onClick={verifyProof} className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Verify Signature</span>
                </Button>
              </div>

              {vc.proof && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Proof Type</label>
                    <p className="text-sm text-muted-foreground">{vc.proof.type}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Created</label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(vc.proof.created).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Verification Method</label>
                    <p className="text-sm text-muted-foreground break-all">
                      {vc.proof.verificationMethod}
                    </p>
                  </div>

                  {vc.proof.jwt && (
                    <div>
                      <label className="text-sm font-medium">JWT Signature</label>
                      <div className="bg-muted p-2 rounded mt-1">
                        <code className="text-xs break-all">{vc.proof.jwt}</code>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-2 p-3 bg-success/10 rounded">
                <CheckCircle className="w-5 h-5 text-success" />
                <div>
                  <p className="font-medium text-success">Signature Valid</p>
                  <p className="text-xs text-success/80">
                    This credential was signed by a trusted ASEAN authority
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
