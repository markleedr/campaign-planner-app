-- Add platform and share_token columns to campaigns table
ALTER TABLE public.campaigns 
ADD COLUMN IF NOT EXISTS platform text,
ADD COLUMN IF NOT EXISTS share_token text UNIQUE;

-- Create index on share_token for faster lookups
CREATE INDEX IF NOT EXISTS idx_campaigns_share_token ON public.campaigns(share_token);

-- Update RLS policies for campaigns to allow inserts and updates
CREATE POLICY "Users can insert campaigns"
ON public.campaigns
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update campaigns"
ON public.campaigns
FOR UPDATE
USING (true);

CREATE POLICY "Users can delete campaigns"
ON public.campaigns
FOR DELETE
USING (true);

-- Function to generate unique share token for campaigns
CREATE OR REPLACE FUNCTION public.generate_campaign_share_token()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  new_token text;
  token_exists boolean;
BEGIN
  LOOP
    -- Generate a random 12-character token
    new_token := encode(gen_random_bytes(9), 'base64');
    new_token := replace(new_token, '/', '_');
    new_token := replace(new_token, '+', '-');
    new_token := substring(new_token, 1, 12);
    
    -- Check if token already exists
    SELECT EXISTS(SELECT 1 FROM public.campaigns WHERE share_token = new_token) INTO token_exists;
    
    EXIT WHEN NOT token_exists;
  END LOOP;
  
  RETURN new_token;
END;
$$;