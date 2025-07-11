
import { Filter, Calendar, Globe, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface ContractFiltersProps {
  onFilterChange: (filters: {
    status?: string;
    country?: string;
    dateSort?: string;
  }) => void;
}

export function ContractFilters({ onFilterChange }: ContractFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-muted/30 rounded-lg">
      <div className="flex items-center space-x-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filter & Sort:</span>
      </div>
      
      <Select onValueChange={(value) => onFilterChange({ status: value })}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="verified">Verified</SelectItem>
          <SelectItem value="processing">Processing</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => onFilterChange({ country: value })}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Countries</SelectItem>
          <SelectItem value="singapore">Singapore</SelectItem>
          <SelectItem value="thailand">Thailand</SelectItem>
          <SelectItem value="malaysia">Malaysia</SelectItem>
          <SelectItem value="vietnam">Vietnam</SelectItem>
          <SelectItem value="philippines">Philippines</SelectItem>
          <SelectItem value="indonesia">Indonesia</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => onFilterChange({ dateSort: value })}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" size="sm" onClick={() => onFilterChange({})}>
        Clear All
      </Button>
    </div>
  );
}
