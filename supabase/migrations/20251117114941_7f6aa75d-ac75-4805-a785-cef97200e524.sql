-- Fix search_path security issue for generate_campaign_share_token function
CREATE OR REPLACE FUNCTION public.generate_campaign_share_token()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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