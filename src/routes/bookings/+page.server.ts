import { createClient } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ request }) => {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookieMatch = cookieHeader.match(/sb-tvbhjurykizoolduqamh-auth-token=([^;]+)/);
  const authToken = cookieMatch ? cookieMatch[1] : null;

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true,
      },
      global: {
        headers: {
          Authorization: authToken ? `Bearer ${authToken}` : '',
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser(authToken);
  if (!user || error) throw redirect(303, '/');
  return {};
};