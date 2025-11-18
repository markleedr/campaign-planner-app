import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CampaignBuilder = () => {
  const { campaignId } = useParams();

  const { data: campaign } = useQuery({
    queryKey: ["campaign", campaignId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select(`
          *,
          client:clients(name)
        `)
        .eq("id", campaignId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{campaign?.name}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">{campaign?.client?.name}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Builder</CardTitle>
            <CardDescription>
              Build and manage your campaign ads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Campaign builder coming soon...
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CampaignBuilder;
