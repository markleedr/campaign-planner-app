import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import Navigation from "@/components/Navigation";

const CreateAdProof = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get("campaignId");
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);

  const platforms = [
    { id: "facebook", name: "Facebook", icon: Facebook, color: "text-blue-600" },
    { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-600" },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "text-blue-700" },
    { id: "youtube", name: "YouTube", icon: Youtube, color: "text-red-600" },
    { id: "google_pmax", name: "Google Performance Max", icon: SiGoogle, color: "text-blue-500" },
  ];

  const formatsByPlatform: Record<string, Array<{ id: string; name: string; description: string }>> = {
    facebook: [
      { id: "single_image", name: "Single Image Feed", description: "Single image ad for Facebook feed" },
      { id: "story", name: "Story", description: "Vertical format story ad" },
      { id: "carousel", name: "Carousel", description: "Multiple images in carousel format" },
    ],
    instagram: [
      { id: "single_image", name: "Single Image Feed", description: "Single image ad for Instagram feed" },
      { id: "story", name: "Story", description: "Vertical format story ad" },
      { id: "carousel", name: "Carousel", description: "Multiple images in carousel format" },
    ],
    linkedin: [
      { id: "single_image", name: "Single Image", description: "Single image/video feed ad" },
      { id: "carousel", name: "Carousel", description: "Multiple images in carousel format" },
    ],
    youtube: [
      { id: "video", name: "Video Ad", description: "Video advertisement for YouTube" },
    ],
    google_pmax: [
      { id: "pmax", name: "Performance Max", description: "Multi-format Performance Max campaign" },
    ],
  };

  const handlePlatformSelect = (platformId: string) => {
    setSelectedPlatform(platformId);
    setSelectedFormat(null);
  };

  const handleFormatSelect = (formatId: string) => {
    setSelectedFormat(formatId);
  };

  const handleContinue = () => {
    if (selectedPlatform && selectedFormat && campaignId) {
      navigate(`/ad-builder?campaignId=${campaignId}&platform=${selectedPlatform}&format=${selectedFormat}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto px-6 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Create New Ad Proof</h1>
          <p className="text-muted-foreground">Select platform and format for your ad</p>
        </div>

        <div className="mx-auto max-w-5xl space-y-8">
          {/* Step 1: Select Platform */}
          <div>
            <h2 className="mb-4 text-xl font-semibold">Step 1: Select Ad Channel</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <Card
                    key={platform.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedPlatform === platform.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => handlePlatformSelect(platform.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Icon className={`h-8 w-8 ${platform.color}`} />
                        <CardTitle className="text-lg">{platform.name}</CardTitle>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Step 2: Select Format */}
          {selectedPlatform && (
            <div className="animate-fade-in">
              <h2 className="mb-4 text-xl font-semibold">Step 2: Select Ad Format</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {formatsByPlatform[selectedPlatform]?.map((format) => (
                  <Card
                    key={format.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedFormat === format.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => handleFormatSelect(format.id)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{format.name}</CardTitle>
                      <CardDescription>{format.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Continue Button */}
          {selectedPlatform && selectedFormat && (
            <div className="flex justify-end animate-fade-in">
              <Button 
                size="lg" 
                onClick={handleContinue}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateAdProof;
