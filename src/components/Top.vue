<template>
  <div class="col-span-7">
    <div class="w-full flex justify-between items-center">
      <!-- Current month and year -->
      <div class="w-1/3 p-2 md:p-4">
        <div
          class="w-full inline-flex space-x-1 text-sm md:text-xl lg:text-2xl text-left font-bold md:font-semibold"
        >
          <span class="md:hidden">{{ shortMonthStr }}</span
          ><span class="hidden md:block">{{ monthStr }}</span
          ><span>{{ calendarStore.getYear }}</span>
        </div>
      </div>
      <!-- -------------------------- -->

      <!-- Naviigation -->
      <div
        class="hidden md:flex w-1/3 items-center justify-center text-gray-600"
      >
        <div class="flex space-x-3 items-center">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5 hover:text-gray-800 cursor-pointer hover:h-6 hover:w-6 transition-all"
              @click="calendarStore.decrementMonth(1)"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
              />
            </svg>
          </div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5 hover:text-gray-800 cursor-pointer hover:h-6 hover:w-6 transition-all"
              @click="calendarStore.incrementMonth(1)"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
              />
            </svg>
          </div>
        </div>
      </div>
      <!-- ----------------------------- -->

      <!-- Date picker and date view -->
      <div class="w-2/3 md:w-1/3 flex justify-end pr-2 md:pr-4">
        <div class="flex space-x-2 md:space-x-5">
          <Datepicker
            v-model="date"
            auto-apply
            close-on-scroll
            @update:modelValue="handleDate"
          >
            <template #trigger>
              <div
                class="flex space-x-1 md:space-x-2 justify-around items-center border rounded-sm px-2 md:px-5 py-1 md:py-2 cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 class="text-xs md:text-base font-medium md:font-semibold">
                    {{ shortMonthStr }}
                  </h1>
                </div>
              </div>
            </template>
          </Datepicker>

          <div
            class="flex justify-center items-center border rounded-sm px-2 md:px-5 py-1 md:py-2 cursor-pointer hover:bg-gray-200 transition-colors"
            @click="calendarStore.resetDate()"
          >
            <h1 class="text-xs md:text-base font-medium md:font-semibold">
              Today
            </h1>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCalendarStore } from "../stores/calendar";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

// Store initialization and subscription
const calendarStore = useCalendarStore();
calendarStore.$subscribe((mutation, state) => {
  prepareMonths();
  initializeDatePicker();
});

// Component variables
const date = ref(); // for datepicker
const monthStr = ref("");
const shortMonthStr = ref("");

/**
 * Populate the month variable with month data from store
 */
const prepareMonths = () => {
  monthStr.value = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    new Date(
      calendarStore.getYear,
      calendarStore.getMonth,
      calendarStore.getDay
    )
  );
  shortMonthStr.value = monthStr.value.substring(0, 3);
};

/**
 * Initiializes the datepicker with data gotten from store
 */
const initializeDatePicker = () => {
  date.value = new Date(
    calendarStore.getYear,
    calendarStore.getMonth,
    calendarStore.getDay
  );
};

/**
 * Change date from the datepicker
 * @param {Date} modelData The selected date from the datepicker
 */
const handleDate = (modelData) => {
  date.value = modelData;

  calendarStore.setMonth(date.value.getMonth());
  calendarStore.setYear(date.value.getFullYear());

  // do something else with the data
};

/************************************************************************
 *  LIFECYCLE HOOKS
 * **********************************************************************
 */
onMounted(() => {
  prepareMonths();
  initializeDatePicker();
});
</script>
