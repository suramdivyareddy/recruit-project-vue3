<template>
  <main
    class="
      min-h-screen w-full
      flex justify-start items-start sm:items-center flex-col
      text-slate-700
      bg-gray-50
    "
  >
    <guest-list></guest-list>
  </main>
</template>

<script setup lang="ts">
import GuestList from '../components/GuestList.vue';
</script>
