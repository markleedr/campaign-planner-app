import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CampaignView = () => {
  const { shareToken } = useParams();

  const { data: campaign, isLoading } = useQuery({
    queryKey: ["campaign-shared", shareToken],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*, clients(name)")
        .eq("share_token", shareToken)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: adProofs } = useQuery({
    queryKey: ["ad-proofs-shared", campaign?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ad_proofs")
        .select("*")
        .eq("campaign_id", campaign?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!campaign?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-background">
          <div className="mx-auto px-6 py-6">
            <h1 className="text-2xl font-bold text-foreground">Ad Proof Manager</h1>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-6 py-8">
          <p className="text-muted-foreground">Loading...</p>
        </main>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-background">
          <div className="mx-auto px-6 py-6">
            <h1 className="text-2xl font-bold text-foreground">Ad Proof Manager</h1>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-6 py-8">
          <p className="text-muted-foreground">Campaign not found</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-foreground">Ad Proof Manager</h1>
          <p className="text-sm text-muted-foreground">Review Campaign</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">{campaign.name}</h2>
          <p className="text-sm text-muted-foreground">{campaign.clients?.name}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ad Proofs for Review</CardTitle>
          </CardHeader>
          <CardContent>
            {!adProofs || adProofs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No ad proofs available yet.
              </p>
            ) : (
              <div className="space-y-3">
                {adProofs.map((proof) => (
                  <div
                    key={proof.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">
                        {proof.platform} - {proof.ad_format}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Version {proof.current_version} • {proof.status}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = `/proof/${proof.share_token}`}
                    >
                      Review
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CampaignView;
