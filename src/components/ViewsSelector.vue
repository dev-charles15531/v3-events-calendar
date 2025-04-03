<script setup lang="ts">
import { ref } from "vue";
import { StatusEnum } from "../types/calendar";

interface Props {
  currentCalendarView: string;
}

const props = defineProps<Props>();

const calendarView = ref(props.currentCalendarView);
const calendarViews = ref(Object.values(StatusEnum));
</script>

<template>
  <select
    v-model="calendarView"
    @change="$emit('viewChange', calendarView.toLowerCase())"
    class="h-10 px-3 border border-gray-300 rounded-md text-sm font-medium text-gray-800 bg-white hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-400 focus:border-gray-400 transition-colors cursor-pointer capitalize"
  >
    <option v-for="view in calendarViews" :key="view" :value="view">
      {{ view }}
    </option>
  </select>
</template>
