<template>
  <Transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="$emit('close')"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-md w-full mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900">
            {{ isEditing ? 'Edit Guest' : 'Add New Guest' }}
          </h3>
        </div>
        
        <form @submit.prevent="handleSubmit" class="px-4 sm:px-6 py-4">
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="guest@example.com"
            />
          </div>
          
          <div class="mb-6">
            <label for="tickets" class="block text-sm font-medium text-gray-700 mb-2">
              Number of Tickets
            </label>
            <input
              id="tickets"
              v-model.number="formData.tickets"
              type="number"
              min="1"
              :max="maxAllowedTickets"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="1"
            />
            <p class="mt-1 text-xs text-gray-500">
              Maximum {{ maxAllowedTickets }} tickets available ({{ remainingTickets }} remaining)
            </p>
            <!-- Inline error message for capacity validation -->
            <p v-if="formError" class="mt-1 text-xs text-red-600">
              {{ formError }}
            </p>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
            <button
              type="button"
              @click="$emit('close')"
              :disabled="isLoading"
              class="px-4 py-3 sm:py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="px-4 py-3 sm:py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <!-- Spinner icon when loading -->
              <svg
                v-if="isLoading"
                class="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ isLoading ? 'Saving...' : (isEditing ? 'Update Guest' : 'Add Guest') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { GuestType } from '../services/guest-repository';

// Props interface for type safety and clear component contract
interface Props {
  isOpen: boolean;
  isEditing: boolean;
  isLoading: boolean;
  guest?: GuestType;
  guests: GuestType[];
  editingIndex: number;
  originalGuestTickets: number;
}

const props = defineProps<Props>();

// Event emissions for parent component communication
const emit = defineEmits<{
  close: [];
  save: [formData: { email: string; tickets: number }];
}>();

// Form state management
const formData = ref({
  email: '',
  tickets: 1
});

// Error state for validation feedback
const formError = ref('');

// Computed properties for dynamic form behavior
const totalTickets = computed(() => 
  props.guests.reduce((sum, guest) => sum + guest.tickets, 0)
);

// Calculate remaining capacity for the event
const remainingTickets = computed(() => 20 - totalTickets.value);

// Dynamic max tickets calculation based on edit vs add mode
const maxAllowedTickets = computed(() => {
  if (props.isEditing) {
    // In edit mode: remaining tickets + tickets being released by current guest
    return remainingTickets.value + props.originalGuestTickets;
  }
  // In add mode: just use remaining capacity
  return remainingTickets.value;
});

// Ensures form is populated with existing guest data when modal opens
watch(() => props.guest, (newGuest) => {
  if (newGuest) {
    // Populate form with existing guest data
    formData.value = { ...newGuest };
  } else {
    // Reset to default values for new guest
    formData.value = { email: '', tickets: 1 };
  }
  // Clear any previous validation errors
  formError.value = '';
}, { immediate: true });

// Watch for modal state changes to reset form errors
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    // Clear validation errors when modal closes
    formError.value = '';
  }
});

// Email validation: prevents duplicate email addresses
const validateEmail = (): boolean => {
  const emailToCheck = formData.value.email.toLowerCase().trim();
  
  if (props.isEditing && props.editingIndex >= 0) {
    // In edit mode: exclude current guest from duplicate check
    const existingEmails = props.guests
      .filter((_, index) => index !== props.editingIndex)
      .map(guest => guest.email.toLowerCase().trim());
    
    if (existingEmails.includes(emailToCheck)) {
      formError.value = 'This email address is already on the guest list.';
      return false;
    }
  } else {
    // In add mode: check against all existing guests
    const existingEmails = props.guests.map(guest => guest.email.toLowerCase().trim());
    
    if (existingEmails.includes(emailToCheck)) {
      formError.value = 'This email address is already on the guest list.';
      return false;
    }
  }
  
  return true;
};

// Capacity validation: enforces 20-ticket event limit
const validateCapacity = (): boolean => {
  const newTicketCount = formData.value.tickets;
  
  if (props.isEditing && props.editingIndex >= 0) {
    // In edit mode: subtract original tickets before adding new count
    const adjustedTotal = (totalTickets.value - props.originalGuestTickets) + newTicketCount;
    if (adjustedTotal > 20) {
      formError.value = `This would exceed the 20 ticket capacity. Maximum allowed: ${maxAllowedTickets.value}`;
      return false;
    }
  } else {
    // In add mode: simply add new tickets to current total
    if (totalTickets.value + newTicketCount > 20) {
      formError.value = `This would exceed the 20 ticket capacity. Maximum allowed: ${maxAllowedTickets.value}`;
      return false;
    }
  }
  
  return true;
};

// Form submission handler with comprehensive validation
const handleSubmit = () => {
  // Run both validations before proceeding
  if (!validateEmail() || !validateCapacity()) {
    return;
  }
  
  // Emit validated form data to parent component
  emit('save', { ...formData.value });
};
</script>

<style scoped>
/* Modal transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
