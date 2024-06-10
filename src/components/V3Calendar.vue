<template>
  <div class="lg:flex lg:h-full lg:flex-col">
    <header
      class="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none"
    >
      <h1 class="text-base font-semibold leading-6 text-gray-900">
        <time datetime="2022-01">{{ monthNames[month] }} {{ year }}</time>
      </h1>
      <div class="flex items-center">
        <div
          class="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch"
        >
          <button
            type="button"
            class="hidden md:flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
            @click="prevMonth()"
          >
            <span class="sr-only">Previous month</span>
            <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
            @click="jumpToToday()"
          >
            Today
          </button>
          <span class="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
          <button
            type="button"
            class="hidden md:flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
            @click="nextMonth()"
          >
            <span class="sr-only">Next month</span>
            <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
          </button>
          <Datepicker
            v-model="dpDate"
            auto-apply
            close-on-scroll
            @update:modelValue="handleDate"
          >
            <template #trigger>
              <div
                class="ml-2 lg:ml-5 flex space-x-1 md:space-x-2 justify-around items-center border rounded-md px-2 md:px-4 py-1 md:py-1.5 cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <div>
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
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 class="text-xs lg:text-sm font-medium">
                    {{ monthNames[month].substring(0, 3) }}
                  </h1>
                </div>
              </div>
            </template>
          </Datepicker>
        </div>
        <div v-if="showAddBtn" class="hidden md:ml-4 md:flex md:items-center">
          <button
            type="button"
            :class="[
              'ml-4 rounded-md bg-' +
                primaryColor +
                '-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-' +
                primaryColor +
                '-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-' +
                primaryColor +
                '-500',
            ]"
            @click="$emit('addEvent')"
          >
            Add event
          </button>
        </div>
        <Menu v-if="showAddBtn" as="div" class="relative ml-6 md:hidden">
          <MenuButton
            class="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500"
          >
            <span class="sr-only">Open menu</span>
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
              class="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div class="py-1">
                <MenuItem v-slot="{ active }">
                  <h4
                    :class="[
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm',
                    ]"
                    @click="$emit('addEvent')"
                  >
                    Create event
                  </h4>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
      </div>
    </header>
    <div
      class="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col"
    >
      <div
        class="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none"
      >
        <div class="bg-white py-2">
          S<span class="sr-only sm:not-sr-only">un</span>
        </div>
        <div class="bg-white py-2">
          M<span class="sr-only sm:not-sr-only">on</span>
        </div>
        <div class="bg-white py-2">
          T<span class="sr-only sm:not-sr-only">ue</span>
        </div>
        <div class="bg-white py-2">
          W<span class="sr-only sm:not-sr-only">ed</span>
        </div>
        <div class="bg-white py-2">
          T<span class="sr-only sm:not-sr-only">hu</span>
        </div>
        <div class="bg-white py-2">
          F<span class="sr-only sm:not-sr-only">ri</span>
        </div>
        <div class="bg-white py-2">
          S<span class="sr-only sm:not-sr-only">at</span>
        </div>
      </div>
      <div
        class="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto"
      >
        <div class="hidden w-full lg:grid lg:grid-cols-7 lg:gap-px">
          <div
            v-for="day in days"
            :key="day.date"
            :class="[
              day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400',
              'relative px-3 py-2',
            ]"
          >
            <time
              :datetime="day.date"
              :class="
                day.isToday
                  ? 'flex h-6 w-6 items-center justify-center rounded-full bg-' +
                    primaryColor +
                    '-600 font-semibold text-white'
                  : undefined
              "
              >{{ day.date.split("-").pop().replace(/^0/, "") }}</time
            >
            <ol v-if="day.events.length > 0" class="mt-2">
              <li
                v-for="(event, idx) in day.events.slice(0, 2)"
                :key="event.id"
              >
                <h5
                  class="group flex cursor-pointer"
                  :class="[
                    idx > 0 ? 'mt-1' : '',
                    isEventBackground(event)
                      ? 'px-1 rounded-md bg-' + event.background + '-50'
                      : '',
                  ]"
                  @click="togglePopover($event, event)"
                >
                  <p
                    :class="[
                      'flex-auto truncate font-medium text-gray-800 ',
                      'hover:text-' + primaryColor + '-600',
                    ]"
                  >
                    {{ event.title }}
                  </p>
                </h5>
              </li>
              <li
                v-if="day.events.length > 2"
                class="text-gray-500 cursor-pointer"
                @click="
                  openModal(
                    day.date.split('-').pop().replace(/^0/, ''),
                    day.events
                  )
                "
              >
                + {{ day.events.length - 2 }} more
              </li>
            </ol>
          </div>
        </div>
        <div class="isolate grid w-full grid-cols-7 gap-px lg:hidden">
          <button
            v-for="day in days"
            :key="day.date"
            type="button"
            :class="[
              day.isCurrentMonth
                ? 'bg-white text-gray-900'
                : 'bg-gray-50 text-gray-400',
              'flex h-14 flex-col px-3 py-2 hover:bg-gray-100 focus:z-10',
            ]"
            @click="
              day.events.length > 0
                ? openModal(
                    day.date.split('-').pop().replace(/^0/, ''),
                    day.events
                  )
                : null
            "
          >
            <time
              :datetime="day.date"
              :class="[
                'flex flex-col h-6 w-6 items-center justify-center rounded-full',
                day.isToday ? 'bg-' + primaryColor + '-600 text-white' : '',
              ]"
              >{{ day.date.split("-").pop().replace(/^0/, "") }}</time
            >
            <span class="sr-only">{{ day.events.length }} events</span>
            <h5 v-if="day.events.length > 0" class="flex flex-wrap">
              <span
                v-for="event in day.events"
                :key="event.id"
                :class="[
                  'mr-1.5 mb-1 h-1.5 w-1.5 rounded-full bg-gray-400',
                  isEventBackground(event)
                    ? 'bg-' + event.background + '-500'
                    : '',
                ]"
              />
            </h5>
          </button>
        </div>
      </div>
    </div>
    <div
      class="md:hidden relative shadow ring-1 ring-black ring-opacity-5 flex items-center bg-white"
    >
      <button
        type="button"
        class="flex md:hidden h-9 w-1/3 items-center justify-center pr-1 text-gray-400 hover:text-gray-500 focus:relative"
        @click="prevMonth()"
      >
        <span class="sr-only">Previous month</span>
        <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
      </button>
      <span class="relative mx-px h-5 w-px bg-gray-300" />
      <button
        type="button"
        class="md:hidden h-9 w-1/3 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative"
        @click="jumpToToday()"
      >
        Today
      </button>
      <span class="relative -mx-px h-5 w-px bg-gray-300" />
      <button
        type="button"
        class="flex md:hidden h-9 w-1/3 items-center justify-center pl-1 text-gray-400 hover:text-gray-500 focus:relative"
        @click="nextMonth()"
      >
        <span class="sr-only">Next month</span>
        <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
      </button>
    </div>

    <!-- use the modal component -->
    <transition name="modal">
      <Modal
        v-if="modalShow"
        @close-modal="closeModal"
        @toggle-popover="togglePopover"
        :day="modalDay"
        :month="month"
        :year="year"
        :events="modalEvents"
        :primary-color="primaryColor"
      />
    </transition>

    <!-- popover component  -->
    <div
      ref="popoverRef"
      :class="{ hidden: !popoverShow, block: popoverShow }"
      class="bg-gray-50 mb-3 block z-50 max-w-xs rounded-lg shadow-md"
    >
      <slot
        name="eventDialog"
        :eventDialogData="todaysEvent"
        :closeEventDialog="togglePopover"
      />
    </div>
  </div>
</template>

<script setup>
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/vue/20/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ref, onBeforeMount, onMounted, onUpdated, watch } from "vue";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { usePopover } from "../composables/popover";
import Modal from "@/components/EventsModal.vue";

/**************************************
 * PROPS
 * ************************************
 */
const props = defineProps({
  events: {
    type: Object,
    required: true,
  },
  primaryColor: {
    type: String,
    required: false,
    default: "indigo",
  },
  showAddBtn: {
    type: Boolean,
    required: false,
    default: true,
  },
});

const modalShow = ref(false);
const modalDay = ref(0);
const popoverRef = ref(null);
const modalEvents = ref([]);
const dpDate = ref(null); // Datepicker date
const days = ref([]);
const now = new Date();
const year = ref(now.getFullYear());
const month = ref(now.getMonth());
const day = ref(now.getDay());
const today = now.toISOString().split("T")[0]; // Format the current date as YYYY-MM-DD
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// popover composable
const { popoverShow, todaysEvent, togglePopover } = usePopover(popoverRef);

const getDaysInCurrentMonth = (now, year, month) => {
  // Get the first day of the current month
  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayOfWeek = firstDayOfMonth.getDay();

  // Get the last day of the current month
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const lastDateOfMonth = lastDayOfMonth.getDate();
  const lastDayOfWeek = lastDayOfMonth.getDay();

  // Calculate the days to be included from the previous month
  const daysFromPrevMonth = firstDayOfWeek > 0 ? firstDayOfWeek : 7;
  const prevMonthLastDate = new Date(year, month, 0).getDate();

  // Generate days from the previous month
  const days = [];
  for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDate - i);
    days.push({
      date: date.toISOString().split("T")[0],
      isCurrentMonth: false,
      events: [],
      isToday: date.toISOString().split("T")[0] === today,
    });
  }

  // Generate days for the current month
  for (let i = 1; i <= lastDateOfMonth; i++) {
    const date = new Date(year, month, i);
    days.push({
      date: date.toISOString().split("T")[0],
      isCurrentMonth: true,
      events: [],
      isToday: date.toISOString().split("T")[0] === today,
    });
  }

  // Calculate the days to be included from the next month
  const daysFromNextMonth = 6 - lastDayOfWeek;

  // Generate days for the next month
  for (let i = 1; i <= daysFromNextMonth; i++) {
    const date = new Date(year, month + 1, i);
    days.push({
      date: date.toISOString().split("T")[0],
      isCurrentMonth: false,
      events: [],
      isToday: date.toISOString().split("T")[0] === today,
    });
  }

  return days;
};

/**
 *  Function to map events to days
 */
const mapEventsToDays = (days, events) => {
  events.forEach((event) => {
    const eventDate = event.time.start.split("T")[0];
    const day = days.find((day) => day.date === eventDate);
    if (day) {
      day.events.push(event);
    }
  });
};

const nextMonth = () => {
  if (month.value == 11) {
    month.value = 0;
    year.value++;
  } else {
    month.value++;
  }
};

const prevMonth = () => {
  if (month.value == 0) {
    month.value = 11;
    year.value--;
  } else {
    month.value--;
  }
};

const jumpToToday = () => {
  year.value = now.getFullYear();
  month.value = now.getMonth();
};

/**
 * Change date from the datepicker
 * @param {Date} date The selected date from the datepicker
 */
const handleDate = (date) => {
  dpDate.value = date;

  if (date.getMonth() == month.value && date.getFullYear() != year.value) {
    days.value = getDaysInCurrentMonth(
      now,
      date.getFullYear(),
      date.getMonth()
    );
  }

  month.value = date.getMonth();
  year.value = date.getFullYear();
};

/**
 * Open the event details modal
 *
 * @param {number} day current calendar month day
 * @param {array} events Array of events objects to show on the modal
 *
 * @return null
 */
const openModal = (day, events) => {
  popoverShow.value = false; // close any open popover before opening modal
  modalEvents.value = events;
  modalDay.value = day;
  modalShow.value = true;
};

/**
 * Close the event details modal
 */
const closeModal = () => {
  modalEvents.value = [];
  modalShow.value = false;
  modalDay.value = 0;
};

/**
 * Initiializes the datepicker with computed date data
 */
const initializeDatePicker = (year, month, day) => {
  dpDate.value = new Date(year, month, day);
};

/**
 * Computes if an event has background
 */
const isEventBackground = (event) => {
  if (event.hasOwnProperty("background")) {
    if (event.background != null) {
      return true;
    }
  }
  return false;
};

watch(month, (newMonth) => {
  days.value = getDaysInCurrentMonth(now, year.value, newMonth);
  initializeDatePicker(year.value, newMonth + 1, day.value);
  mapEventsToDays(days.value, props.events);
});

onBeforeMount(() => {
  days.value = getDaysInCurrentMonth(now, year.value, month.value);
  initializeDatePicker(year.value, month.value + 1, day.value);
  mapEventsToDays(days.value, props.events);
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: translate 0.5s ease;
}

.modal-enter-from,
.modal-leave-to {
  /** opacity: 0; **/
  translate: 0px 100%;
}
</style>
