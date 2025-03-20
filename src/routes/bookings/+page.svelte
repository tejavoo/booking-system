<!-- <script lang="ts">
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  type Booking = {
    id: string;
    user_id: string;
    booking_date: string;
    description: string;
    created_at: string;
  };

  let bookings: Booking[] = [];
  let bookingDate = '';
  let description = '';
  let error = '';

  onMount(async () => {
    const { data, error } = await supabase.from('bookings').select('*');
    if (error) console.error(error);
    else bookings = data || [];
  });

  async function addBooking() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      error = 'You must be signed in to add a booking.';
      return;
    }

    const response = await fetch('https://tvbhjurykizoolduqamh.supabase.co/functions/v1/check-availability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ bookingDate, user_id: session.user.id }),
    });

    const result = await response.json();
    if (!response.ok || !result.available) {
      error = result.error || 'Slot unavailable';
      return;
    }

    const { error: insertError } = await supabase
      .from('bookings')
      .insert({
        booking_date: bookingDate,
        description,
        user_id: session.user.id,
      });

    if (insertError) {
      error = insertError.message;
    } else {
      bookings = [...bookings, { booking_date: bookingDate, description, user_id: session.user.id } as Booking];
      bookingDate = '';
      description = '';
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    document.cookie = 'sb-tvbhjurykizoolduqamh-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    goto('/');
  }
</script>

<div class="min-h-screen bg-gray-900 p-6">
  <div class="max-w-2xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-teal-400">Your Bookings</h1>
      <button
        on:click={signOut}
        class="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Sign Out
      </button>
    </div>

    <div class="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
      <input
        type="datetime-local"
        bind:value={bookingDate}
        class="w-full p-3 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
      <input
        type="text"
        bind:value={description}
        placeholder="Description"
        class="w-full p-3 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
      <button
        on:click={addBooking}
        class="w-full py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
      >
        Add Booking
      </button>

      {#if error}
        <p class="text-red-400 text-center">{error}</p>
      {/if}
    </div>

    {#if bookings.length > 0}
      <ul class="mt-6 space-y-4">
        {#each bookings as booking}
          <li class="bg-gray-800 p-4 rounded-md shadow-md text-gray-200">
            <span class="text-teal-400">{new Date(booking.booking_date).toLocaleString()}</span>
            - {booking.description} <span class="text-gray-400">(User: {booking.user_id})</span>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="mt-6 text-gray-400 text-center">No bookings yet.</p>
    {/if}
  </div>
</div> -->

<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  type Booking = {
    id: string;
    user_id: string;
    booking_date: string;
    description: string;
    created_at: string;
  };

  let bookings: Booking[] = [];
  let bookingDate = '';
  let description = '';
  let error = '';

  onMount(async () => {
    const { data, error } = await supabase.from('bookings').select('*');
    if (error) console.error('Fetch Error:', error);
    else bookings = data || [];
  });

  async function addBooking() {
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Session:', session);
    if (!session) {
      error = 'You must be signed in to add a booking.';
      return;
    }

    // Decode JWT to check sub claim
    const jwtPayload = JSON.parse(atob(session.access_token.split('.')[1]));
    console.log('JWT Payload:', jwtPayload);
    console.log('Session User ID:', session.user.id);

    const response = await fetch('https://tvbhjurykizoolduqamh.supabase.co/functions/v1/check-availability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ bookingDate, user_id: session.user.id }),
    });

    const result = await response.json();
    if (!response.ok || !result.available) {
      error = result.error || 'Slot unavailable';
      return;
    }

    console.log('Inserting with user_id:', session.user.id);
    const { data, error: insertError } = await supabase
      .from('bookings')
      .insert({
        booking_date: bookingDate,
        description,
        user_id: session.user.id,
      })
      .select(); // Return the inserted row for debugging
    console.log('Inserted Data:', data);
    console.log('Insert Error:', insertError);

    if (insertError) {
      error = insertError.message;
    } else {
      bookings = [...bookings, { booking_date: bookingDate, description, user_id: session.user.id } as Booking];
      bookingDate = '';
      description = '';
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    document.cookie = 'sb-tvbhjurykizoolduqamh-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    goto('/');
  }
</script>

<div class="min-h-screen bg-gray-900 p-6">
  <div class="max-w-2xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-teal-400">Your Bookings</h1>
      <button
        on:click={signOut}
        class="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Sign Out
      </button>
    </div>

    <div class="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
      <input
        type="datetime-local"
        bind:value={bookingDate}
        class="w-full p-3 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
      <input
        type="text"
        bind:value={description}
        placeholder="Description"
        class="w-full p-3 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
      <button
        on:click={addBooking}
        class="w-full py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
      >
        Add Booking
      </button>

      {#if error}
        <p class="text-red-400 text-center">{error}</p>
      {/if}
    </div>

    {#if bookings.length > 0}
      <ul class="mt-6 space-y-4">
        {#each bookings as booking}
          <li class="bg-gray-800 p-4 rounded-md shadow-md text-gray-200">
            <span class="text-teal-400">{new Date(booking.booking_date).toLocaleString()}</span>
            - {booking.description} <span class="text-gray-400">(User: {booking.user_id})</span>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="mt-6 text-gray-400 text-center">No bookings yet.</p>
    {/if}
  </div>
</div>