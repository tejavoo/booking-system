<!-- <script lang="ts">
    import { supabase } from '$lib/supabase';
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
      const { data, error: fetchError } = await supabase.functions.invoke('check-availability', {
        body: { bookingDate }
      });
      if (fetchError || !data?.available) {
        error = fetchError?.message || 'Slot unavailable';
        return;
      }
  
      const { error: insertError } = await supabase
        .from('bookings')
        .insert({ booking_date: bookingDate, description });
      if (insertError) {
        error = insertError.message;
      } else {
        bookings = [...bookings, { booking_date: bookingDate, description } as Booking];
        bookingDate = '';
        description = '';
      }
    }
  </script>
  
  <h1>Your Bookings</h1>
  <input type="datetime-local" bind:value={bookingDate} />
  <input type="text" bind:value={description} placeholder="Description" />
  <button on:click={addBooking}>Add Booking</button>
  {#if error}
    <p>{error}</p>
  {/if}
  <ul>
    {#each bookings as booking}
      <li>{booking.booking_date} - {booking.description}</li>
    {/each}
  </ul> -->


  <script lang="ts">
    import { supabase } from '$lib/supabase';
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
      // Get the current session to access the JWT
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        error = 'You must be signed in to add a booking.';
        return;
      }
  
      // Call the Edge Function with the JWT in the Authorization header
      const response = await fetch('https://tvbhjurykizoolduqamh.supabase.co/functions/v1/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`, // Send the JWT
        },
        body: JSON.stringify({ bookingDate }),
      });
  
      const result = await response.json();
      if (!response.ok || !result.available) {
        error = result.error || 'Slot unavailable';
        return;
      }
  
      const { error: insertError } = await supabase
        .from('bookings')
        .insert({ booking_date: bookingDate, description });
  
      if (insertError) {
        error = insertError.message;
      } else {
        bookings = [...bookings, { booking_date: bookingDate, description } as Booking];
        bookingDate = '';
        description = '';
      }
    }
  </script>
  
  <h1>Your Bookings</h1>
  <input type="datetime-local" bind:value={bookingDate} />
  <input type="text" bind:value={description} placeholder="Description" />
  <button on:click={addBooking}>Add Booking</button>
  {#if error}
    <p>{error}</p>
  {/if}
  <ul>
    {#each bookings as booking}
      <li>{booking.booking_date} - {booking.description}</li>
    {/each}
  </ul>