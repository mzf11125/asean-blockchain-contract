
import { Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface BlockchainHashTooltipProps {
  hash: string;
  isExpanded?: boolean;
}

export function BlockchainHashTooltip({ hash, isExpanded = false }: BlockchainHashTooltipProps) {
  const { toast } = useToast();
  
  const fullHash = `0x1a2b3c4d5e6f7890abcdef1234567890abcdef12`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullHash);
    toast({
      title: "Copied!",
      description: "Blockchain hash copied to clipboard",
    });
  };

  const openExplorer = () => {
    // Open in PolygonScan (example)
    window.open(`https://polygonscan.com/tx/${fullHash}`, '_blank');
  };

  if (isExpanded) {
    return (
      <div className="flex items-center space-x-2 text-xs">
        <span>Blockchain:</span>
        <code className="font-mono bg-muted px-1 rounded text-xs">
          {fullHash}
        </code>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-6 w-6 p-0"
        >
          <Copy className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={openExplorer}
          className="h-6 w-6 p-0"
        >
          <ExternalLink className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="flex items-center space-x-1 cursor-pointer hover:text-primary transition-colors">
            <span>Blockchain:</span>
            <code className="font-mono">{hash}</code>
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">
          <div className="space-y-2">
            <p className="text-sm font-medium">Full Hash:</p>
            <code className="text-xs break-all block bg-muted p-2 rounded">
              {fullHash}
            </code>
            <div className="flex space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="text-xs h-7"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={openExplorer}
                className="text-xs h-7"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Explorer
              </Button>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
