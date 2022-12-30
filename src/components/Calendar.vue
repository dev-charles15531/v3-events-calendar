<template>
  <div ref="calendarContainer" class="min-h-full min-w-full text-gray-800">
    <div class="w-full border grid grid-cols-7">
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
        class="h-16 md:h-36 w-full border opacity-50"
      ></div>

      <div
        v-for="day in daysInCurrentMonth"
        :key="day"
        class="h-16 md:h-36 w-full border align-top"
      >
        <div
          class="w-full h-full text-xs md:text-sm lg:text-base text-center transition-colors"
          :class="{
            'bg-slate-200 text-gray-600 font-medium': isToday(day),
            'hover:bg-gray-100 hover:text-gray-700': !isToday(day),
          }"
        >
          {{ day }}

          <div
            v-if="maxThreeTodaysEvent(day, events).length"
            v-for="evt in maxThreeTodaysEvent(day, events)"
            class="hidden md:block"
          >
            <div
              class="w-full px-2 py-1 flex space-x-1 items-center whitespace-nowrap overflow-hidden hover:border hover:border-gray-200 cursor-pointer rounded-sm"
              @click="togglePopover($event, evt)"
            >
              <div class="w-1/12">
                <div class="h-2 w-2 rounded-full bg-purple-600"></div>
              </div>
              <div class="w-11/12">
                <h5 class="text-xs tracking-tight text-clip overflow-hidden">
                  {{ evt.title }}
                </h5>
              </div>
            </div>
          </div>

          <div
            v-if="allTodaysEvent(day, events).length > 3"
            class="hidden md:flex mt-2 w-full px-2 py-1 space-x-2 items-center whitespace-nowrap overflow-hidden hover:text-gray-800 hover:font-medium cursor-pointer rounded-sm"
            @click="openModal(day, allTodaysEvent(day, events))"
          >
            <div class="w-1/12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 6v12m6-6H6"
                />
              </svg>
            </div>
            <div class="w-11/12">
              <h6
                class="text-xs tracking-tight text-clip text-left overflow-hidden"
              >
                {{ allTodaysEvent(day, events).length - 3 + " more events" }}
              </h6>
            </div>
          </div>

          <div
            v-if="allTodaysEvent(day, events).length > 0"
            class="flex md:hidden h-2/3 w-full justify-center items-center"
            @click="openModal(day, allTodaysEvent(day, events))"
          >
            <div
              class="h-6 w-6 flex justify-center items-center text-xs bg-purple-600 rounded-full shadow-sm"
            >
              <h3 class="font-medium text-white">
                {{ allTodaysEvent(day, events).length }}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="lastEmptyCells > 0"
        v-for="day in lastEmptyCells"
        :key="day"
        class="h-16 md:h-36 w-full border opacity-50"
      ></div>

      <!-- mobile navigation -->
      <div class="md:hidden col-span-7 flex justify-between items-center p-2">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5 hover:text-gray-500 cursor-pointer hover:h-6 hover:w-6 transition-all"
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
            class="w-5 h-5 hover:text-gray-500 cursor-pointer hover:h-6 hover:w-6 transition-all"
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
  </div>

  <!-- use the modal component -->
  <transition name="modal">
    <Modal
      v-if="modalShow"
      @close-modal="closeModal"
      @toggle-popover="togglePopover"
      :day="modalDay"
      :month="calendarStore.getMonth"
      :year="calendarStore.getYear"
      :events="modalEvents"
    />
  </transition>

  <!-- popover component  -->
  <div
    ref="popoverRef"
    :class="{ hidden: !popoverShow, block: popoverShow }"
    class="bg-gray-100 mb-3 block z-50 max-w-xs rounded-lg shadow-md"
  >
    <slot
      name="eventDialog"
      :eventDialogData="todaysEvent"
      :closeEventDialog="togglePopover"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUpdated } from "vue";
import Top from "@/components/Top.vue";
import Modal from "@/components/EventsModal.vue";
import { useCalendarStore } from "../stores/calendar";
import { usePopover } from "../composables/popover";

/**************************************
 * PROPS
 * ************************************
 */
const props = defineProps({
  events: {
    type: Object,
    required: true,
  },
});

// Store initialization and subscription
const calendarStore = useCalendarStore();
calendarStore.$subscribe((mutation, state) => {
  getDaysInMonth();
  getFirstDayOfMonth();
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
const lastEmptyCells = ref(0);
const modalShow = ref(false);
const modalDay = ref(0);
const popoverRef = ref(null);
const modalEvents = ref([]);

// popover composable
const { popoverShow, todaysEvent, togglePopover } = usePopover(popoverRef);

/**
 * Gets the number of days present in a month
 * The month is gotten from the calendar store
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
 * Gets the last empty cells (if any) on the calendar grid
 */
const lastCalendarCells = () => {
  let totalGrid = firstDayOfCurrentMonth.value <= 5 ? 35 : 42;

  lastEmptyCells.value =
    totalGrid - daysInCurrentMonth.value - firstDayOfCurrentMonth.value;
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

/**
 * Validates a day to check if event start date is current calendar date or not
 *
 * @param {number} day The calendar month date to check against
 * @param {string} startdate The event start date
 * @return boolean True or false if event is today or not
 */
const isEventToday = (day, startdate) => {
  if (
    calendarStore.getYear == startdate.substring(0, 4) &&
    calendarStore.getMonth + 1 == startdate.substring(5, 7) &&
    day == startdate.substring(8, 10)
  )
    return true;

  return false;
};

/**
 * Gets at most, 3 calendar events on a given day
 * This events are displayed on the calendar grid (>= Large screens)
 *
 * @param {number} day calendar month day whose event(s) we're getting
 * @param {array} events Array of events objects to filter through
 *
 * @return array Array of the filtered day's event(s)
 */
const maxThreeTodaysEvent = (day, events) => {
  if (!events.length) return [];

  let threeTodaysEventArr = [];

  events.forEach((event) => {
    if (threeTodaysEventArr.length == 3) return threeTodaysEventArr;

    if (isEventToday(day, event.time.start)) {
      threeTodaysEventArr.push(event);
    }
  });

  return threeTodaysEventArr;
};

/**
 * Gets all the calendar events on a given day
 *
 * @param {number} day calendar month day whose event(s) we're getting
 * @param {array} events Array of events objects to filter through
 *
 * @return array Array of the filtered day's event(s)
 */
const allTodaysEvent = (day, events) => {
  if (!events.length) return [];

  let todaysEvent = [];
  events.forEach((event) => {
    if (isEventToday(day, event.time.start)) {
      todaysEvent.push(event);
    }
  });

  return todaysEvent;
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

/************************************************************************
 *  LIFECYCLE HOOKS
 * **********************************************************************
 */
onMounted(() => {
  getDaysInMonth();
  getFirstDayOfMonth();
  lastCalendarCells();
});

onUpdated(() => {
  getFirstDayOfMonth();
  lastCalendarCells();
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
