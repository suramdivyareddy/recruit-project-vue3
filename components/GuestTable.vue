<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full min-w-[600px]">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th class="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tickets
            </th>
            <th class="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <!-- TransitionGroup for smooth animations when guests are added/removed -->
        <TransitionGroup
          name="guest-row"
          tag="tbody"
          class="bg-white divide-y divide-gray-200"
        >
          <GuestRow
            v-for="(guest, index) in guests"
            :key="`${guest.email}-${index}`"
            :guest="guest"
            :index="index"
            :is-loading="isLoading"
            @edit-guest="(guest, index) => $emit('edit-guest', guest, index)"
            @delete-guest="$emit('delete-guest', $event)"
          />
          
          <!-- Empty State -->
          <tr v-if="guests.length === 0" key="empty-state">
            <td colspan="3" class="px-3 sm:px-6 py-8 sm:py-12 text-center text-gray-500">
              <div class="flex flex-col items-center">
                <svg class="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <p class="text-base sm:text-lg font-medium">No guests yet</p>
                <p class="text-xs sm:text-sm">Click "Add Guest" to get started</p>
              </div>
            </td>
          </tr>
        </TransitionGroup>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import GuestRow from './GuestRow.vue';
import type { GuestType } from '../services/guest-repository';

// Props interface for table data and state
interface Props {
  guests: GuestType[];   
  isLoading: boolean;    
}

defineProps<Props>();

// Event emissions for parent component communication
defineEmits<{
  'edit-guest': [guest: GuestType, index: number];  
  'delete-guest': [index: number];                  
}>();
</script>

<style scoped>
/* Guest row transition animations */
.guest-row-enter-active {
  transition: all 0.3s ease;
}

.guest-row-leave-active {
  transition: all 0.3s ease;
}

.guest-row-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.guest-row-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.guest-row-move {
  transition: transform 0.3s ease;
}
</style>
