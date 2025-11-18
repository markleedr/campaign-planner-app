import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

// Previews
import { FacebookSingleImagePreview } from "@/components/ad-previews/FacebookSingleImagePreview";
import { LinkedInSingleImagePreview } from "@/components/ad-previews/LinkedInSingleImagePreview";
import { InstagramSingleImagePreview } from "@/components/ad-previews/InstagramSingleImagePreview";
import { FacebookStoryPreview } from "@/components/ad-previews/FacebookStoryPreview";

interface AdData {
  [key: string]: any;
}

const AdProofView = () => {
  const { adProofId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: adProof, isLoading: loadingProof } = useQuery({
    queryKey: ["ad-proof", adProofId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ad_proofs")
        .select("*")
        .eq("id", adProofId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!adProofId,
  });

  const { data: latestVersion, isLoading: loadingVersion } = useQuery({
    queryKey: ["ad-proof-latest-version", adProofId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ad_proof_versions")
        .select("*")
        .eq("ad_proof_id", adProofId)
        .order("version_number", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data || null;
    },
    enabled: !!adProofId,
  });

  const [adData, setAdData] = useState<AdData>({});

  useEffect(() => {
    if (latestVersion?.ad_data) {
      setAdData(latestVersion.ad_data as AdData);
    }
  }, [latestVersion]);

  const handleChange = (key: string, value: string) => {
    setAdData((prev) => ({ ...prev, [key]: value }));
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!adProof) throw new Error("No ad proof loaded");
      const nextVersion = (adProof.current_version || 0) + 1;

      const { error: insertErr } = await supabase
        .from("ad_proof_versions")
        .insert({
          ad_proof_id: adProof.id,
          version_number: nextVersion,
          ad_data: adData,
        });
      if (insertErr) throw insertErr;

      const { error: updateErr } = await supabase
        .from("ad_proofs")
        .update({ current_version: nextVersion })
        .eq("id", adProof.id);
      if (updateErr) throw updateErr;
    },
    onSuccess: () => {
      toast.success("Saved new version");
      queryClient.invalidateQueries({ queryKey: ["ad-proof", adProofId] });
      queryClient.invalidateQueries({ queryKey: ["ad-proof-latest-version", adProofId] });
    },
    onError: () => toast.error("Failed to save changes"),
  });

  const Preview = useMemo(() => {
    if (!adProof) return null;
    const platform: string = adProof.platform;
    const format: string = adProof.ad_format;

    if (platform === "facebook" && format === "single-image") return FacebookSingleImagePreview as any;
    if (platform === "facebook" && format === "story") return FacebookStoryPreview as any;
    if (platform === "instagram" && format === "single-image") return InstagramSingleImagePreview as any;
    if (platform === "linkedin" && format === "single-image") return LinkedInSingleImagePreview as any;

    return null;
  }, [adProof]);

  const renderPreview = () => {
    if (!Preview) {
      return (
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground">
          Preview not available for this format yet
        </div>
      );
    }

    // Map generic adData keys to preview props
    const props: any = {
      primaryText: adData.primaryText,
      headline: adData.headline,
      description: adData.description,
      callToAction: adData.callToAction,
      imageUrl: adData.imageUrl,
      clientName: adData.clientName,
      clientLogoUrl: adData.clientLogoUrl,
    };

    return <Preview {...props} />;
  };

  const keysToRender = useMemo(() => {
    // Prefer a stable order for common ad fields; append others
    const common = [
      "headline",
      "primaryText",
      "description",
      "callToAction",
      "imageUrl",
      "clientName",
      "clientLogoUrl",
      "url",
    ];
    const others = Object.keys(adData).filter((k) => !common.includes(k));
    return [...common, ...others];
  }, [adData]);

  const isLoading = loadingProof || loadingVersion;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-6 py-6 flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Ad Proof Editor</h1>
            <p className="text-sm text-muted-foreground">
              {adProof ? `${adProof.platform} • ${adProof.ad_format} • v${adProof.current_version}` : "Loading..."}
            </p>
          </div>
          <div className="ml-auto">
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || isLoading}>
              <Save className="mr-2 h-4 w-4" /> {saveMutation.isPending ? "Saving..." : "Save as New Version"}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Ad Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : keysToRender.length === 0 ? (
                <p className="text-sm text-muted-foreground">No editable fields found.</p>
              ) : (
                keysToRender.map((key) => (
                  <div className="space-y-2" key={key}>
                    <Label htmlFor={key}>{key}</Label>
                    {key.toLowerCase().includes("text") || key === "description" ? (
                      <Textarea
                        id={key}
                        value={adData[key] ?? ""}
                        onChange={(e) => handleChange(key, e.target.value)}
                        rows={4}
                      />
                    ) : (
                      <Input
                        id={key}
                        value={adData[key] ?? ""}
                        onChange={(e) => handleChange(key, e.target.value)}
                        placeholder={`Enter ${key}`}
                      />
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent>{renderPreview()}</CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdProofView;
