CREATE TYPE public.app_role AS ENUM ('staff');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users see own roles; staff see all" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'staff'));

CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  cover_image_url text,
  cover_alt text,
  content jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','scheduled','published')),
  published_at timestamptz,
  tags text[] NOT NULL DEFAULT '{}',
  seo_title text,
  seo_description text,
  author_name text,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX posts_pub_idx ON public.posts (status, published_at DESC);
GRANT SELECT ON public.posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads live posts" ON public.posts FOR SELECT TO anon, authenticated
  USING (status IN ('published','scheduled') AND published_at IS NOT NULL AND published_at <= now());
CREATE POLICY "Staff read all posts" ON public.posts FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'staff'));
CREATE POLICY "Staff insert posts" ON public.posts FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'staff'));
CREATE POLICY "Staff update posts" ON public.posts FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'staff')) WITH CHECK (public.has_role(auth.uid(),'staff'));
CREATE POLICY "Staff delete posts" ON public.posts FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'staff'));

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER posts_touch BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL UNIQUE,
  url text NOT NULL,
  alt text,
  width int,
  height int,
  size_bytes int,
  mime_type text,
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media TO authenticated;
GRANT ALL ON public.media TO service_role;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage media" ON public.media FOR ALL TO authenticated USING (public.has_role(auth.uid(),'staff')) WITH CHECK (public.has_role(auth.uid(),'staff'));

CREATE POLICY "Staff read media objects" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'media' AND public.has_role(auth.uid(),'staff'));
CREATE POLICY "Staff upload media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(),'staff'));
CREATE POLICY "Staff update media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media' AND public.has_role(auth.uid(),'staff'));
CREATE POLICY "Staff delete media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.has_role(auth.uid(),'staff'));

INSERT INTO public.posts (title, slug, excerpt, content, status, published_at, tags, author_name) VALUES
('Welcome to the new IYSF newsroom', 'welcome-to-the-new-iysf-newsroom',
 'Sample article: federation news, championship updates and Academy announcements will now be published here.',
 '[{"id":"b1","type":"paragraph","text":"This is a sample article created to show how the new IYSF newsroom works. Staff can now publish news straight from the admin area."},{"id":"b2","type":"heading","level":2,"text":"What you will find here"},{"id":"b3","type":"list","ordered":false,"items":["Championship announcements","Federation membership news","Academy and certification updates"]},{"id":"b4","type":"callout","text":"Sample content — replace or delete this post before launch."}]'::jsonb,
 'published', now() - interval '2 days', ARRAY['Announcements'], 'IYSF Communications'),
('Sample: preparing for the World Championship 2026', 'sample-preparing-for-world-championship-2026',
 'Sample article showing quotes, dividers and buttons inside a news post.',
 '[{"id":"c1","type":"paragraph","text":"Sample text: national federations are finalising their delegations for the upcoming World Championship."},{"id":"c2","type":"quote","text":"Every pose codified, every athlete certified.","attribution":"IYSF"},{"id":"c3","type":"divider"},{"id":"c4","type":"button","label":"View the championship","href":"/events/world-championship-2026"}]'::jsonb,
 'published', now() - interval '1 day', ARRAY['Championships','Sample'], 'IYSF Communications'),
('Draft: Academy recertification update', 'draft-academy-recertification-update',
 'Sample draft — only visible to staff.',
 '[{"id":"d1","type":"paragraph","text":"This draft is only visible inside the admin area."}]'::jsonb,
 'draft', NULL, ARRAY['Academy'], 'IYSF Academy');