import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddClientDialog({ open, onOpenChange }: AddClientDialogProps) {
  const [clientName, setClientName] = useState("");
  const [clientUrl, setClientUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createClient = useMutation({
    mutationFn: async () => {
      // Extract domain from URL for logo
      let finalLogoUrl = logoUrl;
      if (clientUrl && !logoUrl) {
        try {
          const url = new URL(clientUrl.startsWith('http') ? clientUrl : `https://${clientUrl}`);
          const domain = url.hostname.replace('www.', '');
          finalLogoUrl = `https://logo.clearbit.com/${domain}`;
        } catch (e) {
          // Invalid URL, continue without logo
        }
      }

      const { data, error } = await supabase
        .from("clients")
        .insert({
          name: clientName,
          logo_url: finalLogoUrl || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Client added",
        description: "The client has been successfully added.",
      });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      setClientName("");
      setClientUrl("");
      setLogoUrl("");
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add client: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a client name",
        variant: "destructive",
      });
      return;
    }
    createClient.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Add a new client to your dashboard. The logo will be automatically fetched from the website.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Company Name</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientUrl">Website URL</Label>
              <Input
                id="clientUrl"
                value={clientUrl}
                onChange={(e) => setClientUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createClient.isPending}>
              {createClient.isPending ? "Adding..." : "Add Client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
