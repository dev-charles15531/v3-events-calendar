<template>
  <div ref="calendarContainer" class="min-h-full min-w-full text-gray-800">
    <div v-if="!willUpdate" class="w-full border grid grid-cols-7 moveLeft">
      <Top />
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
          class="w-full h-full text-center transition-colors"
          :class="{
            'bg-gray-300 text-gray-600 font-bold': isToday(day),
            'hover:bg-gray-100 hover:text-gray-700': !isToday(day),
          }"
        >
          {{ day }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUpdated } from "vue";
import Top from "@/components/Top.vue";
import { useCalendarStore } from "../stores/calendar";

const willUpdate = ref(false);

// Store initialization and subscription
const calendarStore = useCalendarStore();
calendarStore.$subscribe((mutation, state) => {
  getDaysInMonth();
  getFirstDayOfMonth();
  willUpdate.value = true;
});

// component variables
const daysOfTheWeek = {
  1: "Sunday",
  2: "Monday",
  3: "Tuesday",
  4: "Wednesday",
  5: "Thursday",
  6: "Friday",
  7: "Saturday",
};
const daysInCurrentMonth = ref(0);
const firstDayOfCurrentMonth = ref(0);

/**
 * Gets the number of days present in a month
 * The month is gottenn from the calendar store
 */
const getDaysInMonth = () => {
  daysInCurrentMonth.value = new Date(
    calendarStore.getYear,
    calendarStore.getMonth + 1, // 👈️ months are 0-based
    0
  ).getDate();
};

/**
 * Gets in number, the first day of a month
 * The month is gottenn from the calendar store
 */
const getFirstDayOfMonth = () => {
  firstDayOfCurrentMonth.value = new Date(
    calendarStore.getYear,
    calendarStore.getMonth,
    1
  ).getDay();
};

/**
 * Validates a day to check if it's today or not
 *
 * @param {number} day The day to validate
 * @return boolean True or false if it's today or not
 */
const isToday = (day) => {
  let today = new Date();
  if (
    calendarStore.getYear == today.getFullYear() &&
    calendarStore.getMonth == today.getMonth() &&
    day == today.getDate()
  )
    return true;

  return false;
};

/************************************************************************
 *  LIFECYCLE HOOKS
 * **********************************************************************
 */
onMounted(() => {
  getDaysInMonth();
  getFirstDayOfMonth();
});

onUpdated(() => {
  willUpdate.value = false;
});
</script>

<style scoped>
.moveLeft {
  transition: left 0.3s ease-in-out;
  -webkit-transition: left 0.3s ease-in-out;
}
</style>
