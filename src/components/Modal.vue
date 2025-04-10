<script setup lang="ts">
import { computed } from "vue";
import { format } from "date-fns-tz";
import { CalendarEvent } from "../types/calendar";

interface ComponentProps {
  day: string;
  events: CalendarEvent[];
  primaryColor: string;
  timezone: string;
}

const props = defineProps<ComponentProps>();

/**************************************
 * EMITS
 * ************************************
 */
const emit = defineEmits(["togglePopover", "closeModal"]);
/**
 * Emit a togglePopover event with the event target and the calendar event.
 *
 * @param {MouseEvent} evt - The mouse event triggered by the user interaction.
 * @param {CalendarEvent} event - The calendar event to toggle the popover for.
 */
const eventClick = (evt: MouseEvent, event: CalendarEvent): void => {
  emit("togglePopover", evt.target, event);
};

// Computed date properties
const modalWeekDay = computed(() =>
  format(props.day, "EEEE", { timeZone: props.timezone })
);
const modalShortMonth = computed(() =>
  format(props.day, "MMM", { timeZone: props.timezone })
);
const modalDayNumber = computed(() =>
  format(props.day, "d", { timeZone: props.timezone })
);

/**
 * Format a time string with timezone.
 *
 * @param {string} timeStr - Time string in ISO format (e.g. "2022-12-25T10:00:00.000Z").
 * @returns {string} Formatted time string (e.g. "10:00 AM").
 */
const formatTime = (timeStr: string): string => {
  const date = new Date(timeStr);
  return format(date, "p:mm a", {
    timeZone: props.timezone,
  });
};
</script>

<template>
  <div class="fixed inset-0 grid place-items-center z-30">
    <div
      class="modal-container bg-gray-50 w-4/5 sm:w-3/5 lg:w-3/6 xl:w-2/6 h-3/6 lg:h-4/6 rounded-xl shadow-sm border border-gray-300 overflow-y-auto"
    >
      <div class="modal-header w-full h-[14%]">
        <slot name="header">
          <div
            class="w-full flex justify-between items-center border-b-2 border-gray-200 py-2 md:py-3"
          >
            <div class="w-2/3 pl-4">
              <h4
                class="text-xl lg:text-2xl text-left font-semibold text-gray-800"
              >
                {{ modalWeekDay }} {{ modalDayNumber }}
                <span class="font-medium text-sm lg:text-base">
                  {{ modalShortMonth }}
                </span>
              </h4>
            </div>

            <div class="w-1/3 pr-3" align="right">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6 text-gray-700"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </slot>
      </div>

      <div class="modal-body h-[72%] overflow-y-auto transition-none">
        <slot name="body">
          <div class="md:px-5">
            <div class="w-full pl-3 flex space-x-2 items-center">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  :class="[`w-5 h-5 text-${primaryColor}-600`]"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                  />
                </svg>
              </div>
              <div>
                <h5 class="text-xs md:text-sm text-left">
                  {{ events.length + " Total Events" }}
                </h5>
              </div>
            </div>

            <div class="w-full mt-5">
              <div
                v-for="event in events"
                :key="event.id"
                @click="eventClick($event, event)"
                class="w-full px-2 md:px-4 py-2 md:py-4 flex space-x-3 md:space-x-5 items-center cursor-pointer border lg:border-none border-gray-200 hover:shadow-md hover:bg-gray-100 transition-colors"
              >
                <!-- Time display -->
                <div class="">
                  <h2 class="text-lg md:text-xl text-gray-800 font-medium">
                    <span>{{
                      formatTime(event.time.start).split(" ")[0]
                    }}</span>
                    <span class="text-xs uppercase">{{
                      formatTime(event.time.start).split(" ")[1]
                    }}</span>
                  </h2>
                </div>

                <!-- Event details -->
                <div
                  :class="[
                    `border-l-4 border-${primaryColor}-600 rounded overflow-x-hidden`,
                  ]"
                >
                  <div class="w-full">
                    <p
                      class="tracking-tight text-clip text-left overflow-hidden text-sm md:text-base font-medium pl-2 whitespace-nowrap"
                    >
                      {{ event.title }}
                    </p>
                  </div>
                  <div>
                    <h5 class="text-left text-xs md:text-sm pl-2 uppercase">
                      {{ formatTime(event.time.start) }} -
                      {{ formatTime(event.time.end) }}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </slot>
      </div>

      <!-- Footer -->
      <div
        class="modal-foooter w-full flex justify-center items-center h-[14%]"
      >
        <slot name="footer">
          <div
            class="flex space-x-1 items-center cursor-pointer hover:transform hover:scale-105 transition-all duration-300"
            @click="$emit('closeModal')"
          >
            <div>
              <h3 class="text-sm md:text-base font-medium">close</h3>
            </div>
            <div class="font-semibold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>
