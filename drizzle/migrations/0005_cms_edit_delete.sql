-- Ensure staff-only update/delete policies exist for every editable CMS table.
-- Apply after apply-0003-0004.sql. Reapplying safely replaces these named policies.

-- Restrict news updates to staff and prevent non-staff from updating posts.
DROP POLICY IF EXISTS "Staff update posts" ON public.posts;
CREATE POLICY "Staff update posts" ON public.posts
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'staff'))
  WITH CHECK (public.has_role(auth.uid(), 'staff'));

-- Restrict news deletion to staff.
DROP POLICY IF EXISTS "Staff delete posts" ON public.posts;
CREATE POLICY "Staff delete posts" ON public.posts
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'staff'));

-- Restrict event updates to staff.
DROP POLICY IF EXISTS "Staff updates content" ON public.cms_events;
CREATE POLICY "Staff updates content" ON public.cms_events
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'staff'))
  WITH CHECK (public.has_role(auth.uid(), 'staff'));

-- Restrict event deletion to staff.
DROP POLICY IF EXISTS "Staff deletes content" ON public.cms_events;
CREATE POLICY "Staff deletes content" ON public.cms_events
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'staff'));

-- Restrict results updates to staff.
DROP POLICY IF EXISTS "Staff updates content" ON public.cms_results;
CREATE POLICY "Staff updates content" ON public.cms_results
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'staff'))
  WITH CHECK (public.has_role(auth.uid(), 'staff'));

-- Restrict results deletion to staff.
DROP POLICY IF EXISTS "Staff deletes content" ON public.cms_results;
CREATE POLICY "Staff deletes content" ON public.cms_results
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'staff'));

-- Restrict officials updates to staff.
DROP POLICY IF EXISTS "Staff updates content" ON public.cms_officials;
CREATE POLICY "Staff updates content" ON public.cms_officials
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'staff'))
  WITH CHECK (public.has_role(auth.uid(), 'staff'));

-- Restrict officials deletion to staff.
DROP POLICY IF EXISTS "Staff deletes content" ON public.cms_officials;
CREATE POLICY "Staff deletes content" ON public.cms_officials
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'staff'));

-- Restrict homepage settings updates to staff; it is a singleton settings row.
DROP POLICY IF EXISTS "Staff updates content" ON public.cms_homepage;
CREATE POLICY "Staff updates content" ON public.cms_homepage
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'staff'))
  WITH CHECK (public.has_role(auth.uid(), 'staff'));

-- Restrict homepage settings deletion to staff at the database layer.
DROP POLICY IF EXISTS "Staff deletes content" ON public.cms_homepage;
CREATE POLICY "Staff deletes content" ON public.cms_homepage
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'staff'));

-- Restrict application updates to staff.
DROP POLICY IF EXISTS "Staff updates applications" ON public.federation_applications;
CREATE POLICY "Staff updates applications" ON public.federation_applications
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'staff'))
  WITH CHECK (public.has_role(auth.uid(), 'staff'));

-- Restrict application deletion to staff.
DROP POLICY IF EXISTS "Staff deletes applications" ON public.federation_applications;
CREATE POLICY "Staff deletes applications" ON public.federation_applications
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'staff'));

-- The media table already has one staff-only FOR ALL policy, so no extra policies are needed.
