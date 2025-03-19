import { supabase } from '$lib/supabase';
import { redirect } from '@sveltejs/kit';

export async function load({ request }) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw redirect(303, '/');
  return {};
}