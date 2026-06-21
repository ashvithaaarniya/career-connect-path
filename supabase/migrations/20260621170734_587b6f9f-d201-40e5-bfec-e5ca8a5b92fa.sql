
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM public, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_set_updated_at() FROM public, anon, authenticated;

-- Storage policies for resumes bucket (path = {user_id}/filename)
CREATE POLICY "Users upload own resume" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users view own resume" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'resumes' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin')));
CREATE POLICY "Users update own resume" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users delete own resume" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
