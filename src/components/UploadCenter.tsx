
import { Upload, FileText, AlertCircle, CheckCircle, Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export function UploadCenter() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'complete' | 'error'>('idle');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Simulate upload process
    setUploadStatus('uploading');
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadStatus('processing');
          setTimeout(() => setUploadStatus('complete'), 2000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
      case 'processing':
        return <Upload className="w-6 h-6 text-primary animate-pulse" />;
      case 'complete':
        return <CheckCircle className="w-6 h-6 text-success" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-destructive" />;
      default:
        return <FileText className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Uploading contract...';
      case 'processing':
        return 'Processing with OCR/NLP...';
      case 'complete':
        return 'Contract processed successfully!';
      case 'error':
        return 'Upload failed. Please try again.';
      default:
        return 'Drop your contract files here or click to browse';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <span>Upload Contract</span>
              <Shield className="w-5 h-5 text-success" />
            </CardTitle>
            <CardDescription>
              Upload PDF, PNG, or JPG files (max 20MB). Our AI will extract and standardize contract clauses.
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="success" className="text-xs">
              <Lock className="w-3 h-3 mr-1" />
              Secure by Design
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-colors ${
            isDragging 
              ? 'border-accent bg-accent-light' 
              : uploadStatus === 'complete'
              ? 'border-success bg-success-light'
              : uploadStatus === 'error'
              ? 'border-destructive bg-destructive-light'
              : 'border-muted-foreground/25 hover:border-accent hover:bg-accent-light/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            {getStatusIcon()}
            <div>
              <p className="text-base sm:text-lg font-medium">{getStatusText()}</p>
              {uploadStatus === 'idle' && (
                <p className="text-sm text-muted-foreground mt-1">
                  Supported formats: PDF, PNG, JPG
                </p>
              )}
            </div>
            
            {(uploadStatus === 'uploading' || uploadStatus === 'processing') && (
              <div className="w-full max-w-md">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-muted-foreground mt-2">
                  {uploadProgress}% complete
                </p>
              </div>
            )}
            
            {uploadStatus === 'idle' && (
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Browse Files
              </Button>
            )}
            
            {uploadStatus === 'complete' && (
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button variant="accent" size="sm">
                  Review Contract
                </Button>
                <Button variant="outline" size="sm" onClick={() => setUploadStatus('idle')}>
                  Upload Another
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {uploadStatus === 'idle' && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Shield className="w-4 h-4 text-success" />
              <span>End-to-end encryption • ASEAN compliance • Blockchain verified</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
