
import { DashboardHeader } from "@/components/DashboardHeader";
import { StatsOverview } from "@/components/StatsOverview";
import { UploadCenter } from "@/components/UploadCenter";
import { ContractList } from "@/components/ContractList";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Welcome to ASEAN Blockchain Contract Platform
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Digitize, standardize, and verify cross-border contracts with blockchain technology
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <StatsOverview />
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
            <UploadCenter />
            <ContractList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
