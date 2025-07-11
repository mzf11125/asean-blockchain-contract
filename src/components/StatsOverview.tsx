
import { FileText, Shield, Globe, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { KPICarousel } from "./KPICarousel";
import { AnimatedCounter } from "./AnimatedCounter";

interface StatCard {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: string;
  tooltip?: string;
}

const stats: StatCard[] = [
  {
    title: "Total Contracts",
    value: "1,247",
    description: "Processed this month",
    icon: <FileText className="w-6 h-6 text-primary" />,
    trend: "+12.5%",
    tooltip: "Total contracts parsed through OCR and AI standardization pipeline"
  },
  {
    title: "Blockchain Verified",
    value: "1,156",
    description: "Successfully anchored",
    icon: <Shield className="w-6 h-6 text-success" />,
    trend: "+8.2%",
    tooltip: "Contracts with cryptographic proof stored on blockchain for immutable verification"
  },
  {
    title: "ASEAN Countries",
    value: "10",
    description: "Active jurisdictions",
    icon: <Globe className="w-6 h-6 text-accent" />,
    tooltip: "Southeast Asian nations with active cross-border contract processing"
  },
  {
    title: "Verified Parties",
    value: "2,847",
    description: "KYC completed users",
    icon: <Users className="w-6 h-6 text-warning" />,
    trend: "+15.3%",
    tooltip: "Business entities with completed Know Your Customer verification for secure contract execution"
  }
];

export function StatsOverview() {
  return (
    <div>
      {/* Mobile Carousel */}
      <KPICarousel stats={stats} />
      
      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
        <TooltipProvider>
          {stats.map((stat) => (
            <Tooltip key={stat.title}>
              <TooltipTrigger asChild>
                <Card className="hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    {stat.icon}
                  </CardHeader>
                  <CardContent>
                    <AnimatedCounter value={stat.value} trend={stat.trend} />
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              {stat.tooltip && (
                <TooltipContent>
                  <p className="max-w-xs">{stat.tooltip}</p>
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
}
