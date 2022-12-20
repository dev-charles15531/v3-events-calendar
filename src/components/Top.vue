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
          ><span>{{ yearNum }}</span>
        </div>
      </div>
      <!-- -------------------------- -->

      <!-- Naviigation -->
      <div class="hidden md:flex w-1/3 items-center justify-center">
        <div class="flex space-x-3">
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
              class="w-6 h-6"
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
          <div
            class="flex space-x-1 md:space-x-2 justify-around items-center border rounded-sm px-2 md:px-5 py-1 md:py-2"
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
          <div
            class="flex justify-center items-center border rounded-sm px-2 md:px-5 py-1 md:py-2"
          >
            <h1 class="text-xs md:text-base font-medium md:font-semibold">
              Month
            </h1>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  today: {
    type: Date,
    required: true,
  },
});

const today = props.today;
let yearNum = ref(today.getFullYear());
let monthStr = ref(
  new Intl.DateTimeFormat("en-US", { month: "long" }).format(today)
);
let shortMonthStr = ref(monthStr.value.substring(0, 3));
</script>
