// // // Follow this setup guide to integrate the Deno language server with your editor:
// // // https://deno.land/manual/getting_started/setup_your_environment
// // // This enables autocomplete, go to definition, etc.

// // // Setup type definitions for built-in Supabase Runtime APIs
// // import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// // import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
// // import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// // const supabase = createClient(
// //   Deno.env.get('SUPABASE_URL')!,
// //   Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
// // );

// // serve(async (req) => {
// //   const { bookingDate } = await req.json();

// //   // Check if the slot is taken (simplified logic)
// //   const { data, error } = await supabase
// //     .from('bookings')
// //     .select('id')
// //     .eq('booking_date', bookingDate);

// //   if (error) {
// //     return new Response(JSON.stringify({ error: error.message }), {
// //       status: 500,
// //       headers: { 'Content-Type': 'application/json' }
// //     });
// //   }

// //   const available = data.length === 0;
// //   return new Response(JSON.stringify({ available }), {
// //     status: 200,
// //     headers: { 'Content-Type': 'application/json' }
// //   });
// // });

// // /* To invoke locally:

// //   1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
// //   2. Make an HTTP request:

// //   curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/check-availability' \
// //     --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
// //     --header 'Content-Type: application/json' \
// //     --data '{"name":"Functions"}'

// // */


// import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
// import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// // Initialize Supabase client with service role key for full access
// const supabase = createClient(
//   Deno.env.get('SUPABASE_URL')!,
//   Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
// );

// // CORS headers to allow requests from your Vercel frontend
// const corsHeaders = {
//   // 'Access-Control-Allow-Origin': 'https://booking-system-lime.vercel.app', // Your frontend origin
//   'Access-Control-Allow-Origin': '*', // Your frontend origin
//   'Access-Control-Allow-Methods': 'POST, OPTIONS', // Allowed methods
//   'Access-Control-Allow-Headers': 'Content-Type', // Allowed headers
// };

// serve(async (req) => {
//   // Handle preflight OPTIONS request
//   if (req.method === 'OPTIONS') {
//     return new Response(null, {
//       status: 204, // No Content
//       headers: corsHeaders,
//     });
//   }

//   // Handle POST request
//   if (req.method === 'POST') {
//     const { bookingDate } = await req.json();

//     // Check availability
//     const { data, error } = await supabase
//       .from('bookings')
//       .select('id')
//       .eq('booking_date', bookingDate);

//     if (error) {
//       return new Response(JSON.stringify({ error: error.message }), {
//         status: 500,
//         headers: {
//           'Content-Type': 'application/json',
//           ...corsHeaders, // Include CORS headers
//         },
//       });
//     }

//     const available = data.length === 0;
//     return new Response(JSON.stringify({ available }), {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//         ...corsHeaders, // Include CORS headers
//       },
//     });
//   }

//   // Handle other methods (e.g., GET) with a 405 Method Not Allowed
//   return new Response('Method Not Allowed', {
//     status: 405,
//     headers: corsHeaders,
//   });
// });

import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Initialize Supabase client with service role key
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Add Authorization
};

serve(async (req) => {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }

  // Extract and verify JWT from Authorization header
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Missing or invalid Authorization header' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }

  const token = authHeader.split('Bearer ')[1];
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }

  // Process the request if JWT is valid
  const { bookingDate } = await req.json();

  const { data, error } = await supabase
    .from('bookings')
    .select('id')
    .eq('booking_date', bookingDate);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }

  const available = data.length === 0;
  return new Response(JSON.stringify({ available }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
});