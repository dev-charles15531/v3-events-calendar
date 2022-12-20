<template>
  <div ref="calendarContainer" class="min-h-full min-w-full text-gray-800">
    <div class="w-full border grid grid-cols-7">
      <Top :today="today" />
      <div
        v-for="day in daysOfTheWeek"
        class="text-center text-sm md:text-base lg:text-lg font-medium border"
      >
        {{ day.substring(0, 3) }}
      </div>

      <div
        v-if="firstDayOfCurrentMonth > 0"
        v-for="day in firstDayOfCurrentMonth"
        :key="day"
        class="h-36 w-full border opacity-50"
      ></div>

      <div
        v-for="day in daysInCurrentMonth"
        :key="day"
        class="h-36 w-full border align-top"
      >
        <div
          class="w-full h-full text-center"
          :class="{ 'bg-gray-300 text-gray-600 font-bold': day == currentDay }"
        >
          {{ day }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { vElementSize } from "@vueuse/components";
import { useElementSize } from "@vueuse/core";
import Top from "@/components/Top.vue";

const daysOfTheWeek = {
  1: "Sunday",
  2: "Monday",
  3: "Tuesday",
  4: "Wednesday",
  5: "Thursday",
  6: "Friday",
  7: "Saturday",
};

const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

const today = ref(new Date());
const currentYear = today.value.getFullYear();
const currentMonth = today.value.getMonth();
const currentDay = today.value.getDate();

// 👇️ Current Month
const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth + 1); // 👈️ months are 0-based
const firstDayOfCurrentMonth = getFirstDayOfMonth(currentYear, currentMonth);

const getNulledDaysInMonth = computed(() => {
  if (daysInCurrentMonth == 28) return 0;
  return 35 - daysInCurrentMonth;
});
</script>
