<template>
  <div class="w-full max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
    <!-- Header Section -->
    <div class="mb-6 sm:mb-8">
      <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Nyan Cat Event Guest List</h2>
      <p class="text-sm sm:text-base text-gray-600">Capacity: 20 people</p>
      
      <!-- Guest Count Display -->
      <GuestStats :guests="guests" />
    </div>

    <!-- Action Buttons -->
    <ActionButtons
      @add-guest="openAddModal"
      :is-loading="isLoading"
      :is-event-full="isEventFull"
      @reset-data="resetData"
    />

    <!-- Guests Table -->
    <GuestTable
      :guests="guests"
      :is-loading="isLoading"
      @edit-guest="openEditModal"
      @delete-guest="deleteGuest"
    />

    <!-- Modal for Add/Edit Guest  -->
    <GuestModal
      :is-open="isModalOpen"
      :is-editing="isEditing"
      :is-loading="isLoading"
      :guest="editingGuest"
      :guests="guests"
      :editing-index="editingIndex"
      :original-guest-tickets="originalGuestTickets"
      @close="closeModal"
      @save="handleSaveGuest"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import GuestRepository, { type GuestType } from '../services/guest-repository';
import GuestStats from './GuestStats.vue';
import ActionButtons from './ActionButtons.vue';
import GuestTable from './GuestTable.vue';
import GuestModal from './GuestModal.vue';

// Repository instance for data persistence
const repo = new GuestRepository();

// Toast notification system
const toast = useToast();

// Using local component state with refs. For a larger app, I'd move this to a Pinia store
const guests = ref<GuestType[]>([]);
const isModalOpen = ref(false);
const isEditing = ref(false);
const editingIndex = ref(-1);
const isLoading = ref(false);
const originalGuestTickets = ref(0);
const editingGuest = ref<GuestType | undefined>(undefined);

// Computed properties for derived state
const totalTickets = computed(() => 
  guests.value.reduce((sum, guest) => sum + guest.tickets, 0)
);

const isEventFull = computed(() => totalTickets.value >= 20);

// Modal state management functions
const openAddModal = () => {
  isEditing.value = false;
  editingIndex.value = -1;
  originalGuestTickets.value = 0;
  editingGuest.value = undefined;
  isModalOpen.value = true;
};

const openEditModal = (guest: GuestType, index: number) => {
  isEditing.value = true;
  editingIndex.value = index;
  originalGuestTickets.value = guest.tickets;
  editingGuest.value = guest;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  // Small delay to prevent form submission if user clicks outside
  setTimeout(() => {
    isEditing.value = false;
    editingIndex.value = -1;
    originalGuestTickets.value = 0;
    editingGuest.value = undefined;
  }, 150);
};

// CRUD operations
const handleSaveGuest = async (formData: { email: string; tickets: number }) => {
  isLoading.value = true;
  try {
    // console.log('Form data on save:', { ...formData.value });
    
    if (isEditing.value && editingIndex.value >= 0) {
      // Update existing guest
      guests.value[editingIndex.value] = { ...formData };
      await repo.save(guests.value);
      toast.success('Guest updated successfully!');
    } else {
      // Add new guest
      guests.value.push({ ...formData });
      await repo.save(guests.value);
      toast.success('Guest added successfully!');
    }
    
    closeModal();
  } catch (error) {
    console.error('Failed to save guest:', error);
    toast.error('Failed to save guest. Please try again.');
  } finally {
    isLoading.value = false;
  }
};

const deleteGuest = async (index: number) => {
  if (confirm('Are you sure you want to delete this guest?')) {
    isLoading.value = true;
    try {
      guests.value.splice(index, 1);
      await repo.save(guests.value);
      toast.success('Guest has been removed.');
    } catch (error) {
      console.error('Failed to delete guest:', error);
      toast.error('Failed to delete guest. Please try again.');
    } finally {
      isLoading.value = false;
    }
  }
};

const resetData = () => {
  if (confirm('Are you sure you want to reset all guest data? This action cannot be undone.')) {
    isLoading.value = true;
    
    repo.reset()
      .then(() => loadGuests())
      .then(() => {
        toast.info('The guest list has been reset.');
      })
      .catch((error) => {
        console.error('Failed to reset data:', error);
        toast.error('Failed to reset data. Please try again.');
      })
      .finally(() => {
        isLoading.value = false;
      });
  }
};

// Data loading function
const loadGuests = async () => {
  try {
    guests.value = await repo.load();
  } catch (error) {
    console.error('Failed to load guests:', error);
    // Fallback to empty array if loading fails 
    guests.value = [];
  }
};

onMounted(() => {
  loadGuests();
});
</script>