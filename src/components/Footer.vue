<script setup lang="ts">
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/vue/20/solid";

const emit = defineEmits(['dateChange', 'goToPrevMonth', 'goToNextMonth', 'goToToday', 'addEvent']);
</script>


<template>
    <div
      class="md:hidden relative shadow ring-1 ring-gray-300 ring-opacity-5 flex items-center bg-white"
    >
      <button
        type="button"
        class="flex md:hidden h-9 w-1/3 items-center justify-center pr-1 text-gray-400 hover:text-gray-500 focus:relative"
        @click="$emit('goToPrevMonth')"
      >
        <span class="sr-only">Previous month</span>
        <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
      </button>
      <span class="relative mx-px h-5 w-px bg-gray-300" />
      <button
        type="button"
        class="md:hidden h-9 w-1/3 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative"
        @click="$emit('goToToday')"
      >
        Today
      </button>
      <span class="relative -mx-px h-5 w-px bg-gray-300" />
      <button
        type="button"
        class="flex md:hidden h-9 w-1/3 items-center justify-center pl-1 text-gray-400 hover:text-gray-500 focus:relative"
        @click="$emit('goToNextMonth')"
      >
        <span class="sr-only">Next month</span>
        <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
</template>