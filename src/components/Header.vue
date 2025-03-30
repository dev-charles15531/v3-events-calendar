<script setup lang="ts">
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  PlusIcon,
} from "@heroicons/vue/20/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ref, computed } from "vue";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { format, getYear, getMonth } from "date-fns";
import { format as tzFormat } from "date-fns-tz";
import { CalendarProps, StatusEnum } from "../types/calendar";

type ComponentProps = Omit<CalendarProps, "events" | "sundayStartWeek"> & {
  now: Date;
  showAddBtn: boolean;
  currentCalendarView: StatusEnum;
};

/**************************************
 * PROPS
 **************************************/
const props = defineProps<ComponentProps>();

const emit = defineEmits([
  "dateChange",
  "goToPrev",
  "goToNext",
  "goToToday",
  "addEvent",
  "viewChange",
]);

/**************************************
 * DATE UTILITIES
 **************************************/
const monthNames = Array.from({ length: 12 }, (_, i) =>
  tzFormat(new Date(0, i), "MMMM", { timeZone: props.timezone })
);
const currentYear = computed(() => getYear(props.currentDate));
const currentMonth = computed(() => getMonth(props.currentDate));

/**************************************
 * DATEPICKER HANDLING
 **************************************/
const dpDate = ref(props.currentDate);
const handleDate = (date: Date) => {
  emit("dateChange", date);
};

/**************************************
 * CALENDAR VIEW HANDLING
 **************************************/
const calendarView = ref(props.currentCalendarView);
</script>

<template>
  <header
    class="flex items-center justify-between border-b border-gray-200 px-6 py-2 lg:flex-none"
  >
    <h1 class="font-bold leading-6 text-gray-800">
      {{ monthNames[currentMonth] }} {{ currentYear }}
    </h1>

    <div class="flex space-x-1.5 items-center">
      <div class="flex items-center gap-2">
        <div
          class="relative hidden md:flex items-center rounded-md bg-white shadow-sm"
        >
          <button
            type="button"
            class="h-10 w-9 flex items-center justify-center rounded-l-md border-y border-l border-gray-300 text-gray-400 hover:text-gray-500 cursor-pointer focus:relative hover:bg-gray-100 active:bg-gray-200"
            @click="$emit('goToPrev')"
          >
            <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            class="h-10 border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-800 text-center hover:bg-gray-100 focus:relative cursor-pointer active:bg-gray-200"
            @click="$emit('goToToday')"
          >
            Today
          </button>

          <button
            type="button"
            class="h-10 w-9 flex items-center justify-center rounded-r-md border-y border-r border-gray-300 text-gray-400 hover:text-gray-500 focus:relative cursor-pointer hover:bg-gray-100 active:bg-gray-200"
            @click="$emit('goToNext')"
          >
            <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <Datepicker
          v-model="dpDate"
          auto-apply
          close-on-scroll
          @update:model-value="handleDate"
        >
          <template #trigger>
            <div
              class="flex items-center border border-gray-300 rounded-md px-2 md:px-4 py-1.5 md:py-2 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-800">
                  {{ format(currentDate, "MMM yyyy") }}
                </span>
              </div>
            </div>
          </template>
        </Datepicker>

        <select
          v-model="calendarView"
          @change="$emit('viewChange', calendarView.toLowerCase())"
          class="h-10 px-3 border border-gray-300 rounded-md text-sm font-medium text-gray-800 bg-white hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-400 focus:border-gray-400 transition-colors cursor-pointer"
        >
          <option value="month">Month</option>
          <option value="week">Week</option>
          <option value="day">Day</option>
        </select>
      </div>

      <div v-if="showAddBtn" class="hidden md:flex md:items-center">
        <button
          type="button"
          :class="[
            `ml-4 rounded-md bg-${primaryColor}-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm cursor-pointer hover:bg-${primaryColor}-500 
           focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-${primaryColor}-500`,
          ]"
          @click="$emit('addEvent')"
        >
          Add event
        </button>
      </div>

      <Menu v-if="showAddBtn" as="div" class="relative ml-6 md:hidden">
        <MenuButton
          class="-mx-2 flex items-center rounded-md border border-gray-300 p-1.5 text-gray-400 hover:text-gray-500 active:bg-gray-100 transition-all ease-in-out"
        >
          <EllipsisHorizontalIcon class="h-5 w-5" aria-hidden="true" />
        </MenuButton>

        <transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <MenuItems
            :class="[
              `absolute right-0 z-20 mt-3 w-36 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-gray-400 ring-opacity-5 focus:outline-none`,
            ]"
          >
            <div class="py-1">
              <MenuItem v-slot="{ active }">
                <button
                  :class="[
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'flex items-center w-full px-4 py-2 text-sm',
                  ]"
                  @click="$emit('addEvent')"
                >
                  <PlusIcon
                    :class="[`mr-1.5 h-5 w-5 text-${primaryColor}-600`]"
                    aria-hidden="true"
                  />
                  <span
                    :class="[`font-medium text-sm text-${primaryColor}-600`]"
                  >
                    Create Event
                  </span>
                </button>
              </MenuItem>
            </div>
          </MenuItems>
        </transition>
      </Menu>
    </div>
  </header>
</template>
