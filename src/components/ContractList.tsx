
import { useState } from "react";
import { FileText, CheckCircle, Clock, AlertTriangle, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContractFilters } from "./ContractFilters";
import { ContractExpandedView } from "./ContractExpandedView";
import { BlockchainHashTooltip } from "./BlockchainHashTooltip";

interface Contract {
  id: string;
  title: string;
  parties: string[];
  status: 'pending' | 'processing' | 'verified' | 'failed';
  uploadDate: string;
  blockchainHash?: string;
  ipfsHash?: string;
  lastUpdated?: string;
}

const mockContracts: Contract[] = [
  {
    id: "1",
    title: "Supply Agreement - Electronics Export",
    parties: ["TechCorp Singapore", "Import Solutions Thailand"],
    status: "verified",
    uploadDate: "2024-01-15",
    blockchainHash: "0x1a2b3c...",
    ipfsHash: "QmX5Y6Z...",
    lastUpdated: "2h ago"
  },
  {
    id: "2",
    title: "Shipping Contract - Textile Goods",
    parties: ["Fabric Industries Malaysia", "Retail Group Vietnam"],
    status: "processing",
    uploadDate: "2024-01-14",
    lastUpdated: "processing since 30m ago"
  },
  {
    id: "3",
    title: "Service Agreement - IT Consulting",
    parties: ["DevStudio Philippines", "Enterprise Corp Indonesia"],
    status: "pending",
    uploadDate: "2024-01-13",
    lastUpdated: "pending since yesterday"
  }
];

export function ContractList() {
  const [expandedContract, setExpandedContract] = useState<string | null>(null);
  const [filteredContracts, setFilteredContracts] = useState(mockContracts);

  const handleFilterChange = (filters: { status?: string; country?: string; dateSort?: string }) => {
    let filtered = [...mockContracts];
    
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(contract => contract.status === filters.status);
    }
    
    if (filters.dateSort === 'oldest') {
      filtered.sort((a, b) => new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime());
    } else {
      filtered.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
    }
    
    setFilteredContracts(filtered);
  };

  const toggleExpanded = (contractId: string) => {
    setExpandedContract(expandedContract === contractId ? null : contractId);
  };

  const getStatusIcon = (status: Contract['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
    }
  };

  const getStatusColor = (status: Contract['status']) => {
    switch (status) {
      case 'verified':
        return 'success';
      case 'processing':
        return 'warning';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract History</CardTitle>
        <CardDescription>
          Track your uploaded contracts and their verification status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ContractFilters onFilterChange={handleFilterChange} />
        
        <div className="space-y-4">
          {filteredContracts.map((contract) => (
            <div key={contract.id}>
              <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors">
                <div className="flex items-start space-x-3 flex-1">
                  <FileText className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-foreground truncate">{contract.title}</h3>
                      {getStatusIcon(contract.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 truncate">
                      {contract.parties.join(" ↔ ")}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs text-muted-foreground">
                      <span>Uploaded: {contract.uploadDate}</span>
                      {contract.lastUpdated && (
                        <span className="flex items-center space-x-1">
                          <Badge variant="outline" className="text-xs">
                            {contract.status} {contract.lastUpdated}
                          </Badge>
                        </span>
                      )}
                      {contract.blockchainHash && (
                        <BlockchainHashTooltip hash={contract.blockchainHash} />
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Badge variant={getStatusColor(contract.status) as any}>
                    {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(contract.id)}
                  >
                    {expandedContract === contract.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {expandedContract === contract.id && (
                <ContractExpandedView contract={contract} />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
