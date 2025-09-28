<template>
  <tr class="hover:bg-gray-50 transition-colors duration-150">
    <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-left">
      {{ guest.email }}
    </td>
    <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500 text-left">
      {{ guest.tickets }}
    </td>
    <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium text-left">
      <div class="flex gap-2 sm:gap-3 items-center">
        <button
          @click="$emit('edit-guest', guest, index)"
          :disabled="isLoading"
          class="text-indigo-600 hover:text-indigo-900 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base px-2 py-1 sm:px-0 sm:py-0"
        >
          Edit
        </button>
        <button
          @click="$emit('delete-guest', index)"
          :disabled="isLoading"
          class="text-red-600 hover:text-red-900 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base px-2 py-1 sm:px-0 sm:py-0"
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import type { GuestType } from '../services/guest-repository';

// Props interface for individual guest row data
interface Props {
  guest: GuestType;       
  index: number;          
  isLoading: boolean;    
}
defineProps<Props>();

// Event emissions for parent component communication
defineEmits<{
  'edit-guest': [guest: GuestType, index: number];  
  'delete-guest': [index: number];                  
}>();
</script>
