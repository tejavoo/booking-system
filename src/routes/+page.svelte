<script lang="ts">
    import { supabase } from '$lib/supabase';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
  
    let email = '';
    let password = '';
    let error = '';
  
    onMount(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          console.log('Already signed in, redirecting...', session);
          goto('/bookings', { replaceState: true });
        }
      });
    });
  
    async function signUp() {
      const { data, error: signupError } = await supabase.auth.signUp({ email, password });
      if (signupError) {
        error = signupError.message;
      } else if (data.session) {
        console.log('SignUp successful, session:', data.session);
        await supabase.auth.setSession(data.session);
        document.cookie = `sb-tvbhjurykizoolduqamh-auth-token=${data.session.access_token}; path=/; SameSite=Lax`;
        goto('/bookings', { replaceState: true });
      } else {
        error = 'Please check your email to confirm your account.';
      }
    }
  
    async function signIn() {
      const { data, error: signinError } = await supabase.auth.signInWithPassword({ email, password });
      if (signinError) {
        error = signinError.message;
      } else if (data.session) {
        console.log('SignIn successful, session:', data.session);
        await supabase.auth.setSession(data.session);
        document.cookie = `sb-tvbhjurykizoolduqamh-auth-token=${data.session.access_token}; path=/; SameSite=Lax`;
        goto('/bookings', { replaceState: true });
      }
    }
  </script>
  
  <h1>Booking System</h1>
  <input type="email" bind:value={email} placeholder="Email" />
  <input type="password" bind:value={password} placeholder="Password" />
  <button on:click={signUp}>Sign Up</button>
  <button on:click={signIn}>Sign In</button>
  {#if error}
    <p>{error}</p>
  {/if}