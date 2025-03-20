<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let email = '';
  let password = '';
  let error = '';
  let isSignedIn = false;

  onMount(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    isSignedIn = !!session;
    if (session) goto('/bookings');
  });

  async function signUp() {
    const { data, error: signupError } = await supabase.auth.signUp({ email, password });
    if (signupError) {
      error = signupError.message;
    } else if (data.session) {
      await supabase.auth.setSession(data.session);
      document.cookie = `sb-tvbhjurykizoolduqamh-auth-token=${data.session.access_token}; path=/; SameSite=Lax`;
      goto('/bookings');
    } else {
      error = 'Please check your email to confirm your account.';
    }
  }

  async function signIn() {
    const { data, error: signinError } = await supabase.auth.signInWithPassword({ email, password });
    if (signinError) {
      error = signinError.message;
    } else if (data.session) {
      await supabase.auth.setSession(data.session);
      document.cookie = `sb-tvbhjurykizoolduqamh-auth-token=${data.session.access_token}; path=/; SameSite=Lax`;
      isSignedIn = true;
      goto('/bookings');
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    isSignedIn = false;
    document.cookie = 'sb-tvbhjurykizoolduqamh-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    goto('/');
  }
</script>

<div class="min-h-screen bg-gray-900 flex items-center justify-center p-4">
  <div class="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
    <h1 class="text-2xl font-bold text-teal-400 mb-6 text-center">Booking System</h1>
    
    {#if !isSignedIn}
      <div class="space-y-4">
        <input
          type="email"
          bind:value={email}
          placeholder="Email"
          class="w-full p-3 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <input
          type="password"
          bind:value={password}
          placeholder="Password"
          class="w-full p-3 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <div class="flex space-x-4">
          <button
            on:click={signUp}
            class="flex-1 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
          >
            Sign Up
          </button>
          <button
            on:click={signIn}
            class="flex-1 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    {/if}

    {#if isSignedIn}
      <button
        on:click={signOut}
        class="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Sign Out
      </button>
    {/if}

    {#if error}
      <p class="mt-4 text-red-400 text-center">{error}</p>
    {/if}
  </div>
</div>