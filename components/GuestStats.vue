<template>
  <div class="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
    <p class="text-base sm:text-lg font-semibold text-blue-800">
      Total Guests: <span class="text-xl sm:text-2xl">{{ totalGuests }}</span>
    </p>
    <p class="text-xs sm:text-sm text-blue-600">
      Total Tickets: {{ totalTickets }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { GuestType } from '../services/guest-repository';

// Props interface for type safety
interface Props {
  guests: GuestType[];
}

const props = defineProps<Props>();

// Computed property to calculate total number of guests
const totalGuests = computed(() => props.guests.length);

// Sums up all tickets from all guests for capacity tracking
const totalTickets = computed(() => 
  props.guests.reduce((sum, guest) => sum + guest.tickets, 0)
);
</script>
