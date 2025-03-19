<script lang="ts">
    import { supabase } from '$lib/supabase';
    import { goto } from '$app/navigation';
  
    let email = '';
    let password = '';
    let error = '';
  
    async function signUp() {
      const { error: signupError } = await supabase.auth.signUp({ email, password });
      if (signupError) error = signupError.message;
      else goto('/bookings');
    }
  
    async function signIn() {
      const { error: signinError } = await supabase.auth.signInWithPassword({ email, password });
      if (signinError) error = signinError.message;
      else goto('/bookings');
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