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
            'bg-slate-200 text-gray-600 font-medium': isToday(day),
            'hover:bg-gray-100 hover:text-gray-700': !isToday(day),
          }"
        >
          {{ day }}

          <div
            v-if="maxThreeTodaysEvent(day, events).length"
            v-for="evt in maxThreeTodaysEvent(day, events)"
          >
            <div
              class="w-full px-2 py-1 flex space-x-1 items-center whitespace-nowrap overflow-hidden hover:border hover:border-gray-200 cursor-pointer rounded-sm"
              @click="togglePopover($event, evt)"
            >
              <div class="w-1/12">
                <div class="h-2 w-2 rounded-full bg-green-500"></div>
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
            class="mt-2 w-full px-2 py-1 flex space-x-2 items-center whitespace-nowrap overflow-hidden hover:text-gray-800 hover:font-medium cursor-pointer rounded-sm"
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
    class="bg-gray-100 border mb-3 block z-50 max-w-xs rounded-lg shadow-md"
  >
    <slot
      name="eventDialog"
      :eventDialogData="todaysEvent"
      :closeEventDialog="togglePopover"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
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
const modalShow = ref(false);
const modalDay = ref(0);
const popoverRef = ref(null);
const modalEvents = ref([]);

// popover composable
const { popoverShow, todaysEvent, togglePopover } = usePopover(popoverRef);

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
 */
const openModal = (day, events) => {
  popoverShow.value = false; // close any open popover before opening modal
  modalEvents.value = events;
  modalShow.value = true;
  modalDay.value = day;
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
