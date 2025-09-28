<template>
  <div class="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3">
    <button
      @click="$emit('add-guest')"
      :disabled="isLoading || isEventFull"
      :title="isEventFull ? 'Cannot add more guests, the event is at full capacity.' : 'Add a new guest'"
      class="px-4 py-3 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 text-sm sm:text-base"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
      </svg>
      Add Guest
    </button>
    
    <button
      @click="$emit('reset-data')"
      :disabled="isLoading"
      class="px-4 py-3 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
      </svg>
      Reset Data
    </button>
  </div>
</template>

<script setup lang="ts">
// Props interface for button state management
interface Props {
  isLoading: boolean;  // Controls button disabled state during async operations
  isEventFull: boolean;  // Controls Add Guest button when capacity is reached
}

defineProps<Props>();

// Event emissions for parent component communication
defineEmits<{
  'add-guest': [];      // Emitted when Add Guest button is clicked
  'reset-data': [];      // Emitted when Reset Data button is clicked
}>();
</script>
