-- Add logo_url column to clients table
ALTER TABLE public.clients ADD COLUMN logo_url text;

-- Add RLS policies for clients table
CREATE POLICY "Users can insert clients"
ON public.clients
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update clients"
ON public.clients
FOR UPDATE
USING (true);

CREATE POLICY "Users can delete clients"
ON public.clients
FOR DELETE
USING (true);