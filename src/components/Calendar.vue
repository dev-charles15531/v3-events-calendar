<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import Header from "./Header.vue";
import { addMonths, addWeeks, subMonths, subWeeks } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import Footer from "./Footer.vue";
import { usePopover } from "../composables/popover";
import Modal from "./Modal.vue";
import { CalendarEvent, StatusEnum } from "../types/calendar";
import { Color } from "../types";
import MonthView from "./MonthView.vue";
import WeekView from "./WeekView.vue";

/**************************************
 * PROPS
 **************************************/
const props = defineProps({
  timezone: {
    type: String,
    default: "Africa/Lagos",
  },
  primaryColor: {
    type: String,
    default: "indigo",
  },
  showAddBtn: {
    type: Boolean,
    default: true,
  },
  sundayStartWeek: {
    type: Boolean,
    required: false,
    default: true,
  },
  events: {
    type: Object,
    required: true,
  },
});

/**************************************
 * CALENDAR VIEW
 **************************************/
const viewComponents = {
  month: MonthView,
  week: WeekView,
};

const currentCalendarView = ref(StatusEnum.MONTH_VIEW);

/**
 * Changes the current calendar view to the given view.
 *
 * @param {StatusEnum} view - The new view for the calendar.
 */
const changeCalendarView = (view: StatusEnum) => {
  if (view === StatusEnum.MONTH_VIEW) {
    currentCalendarView.value = StatusEnum.MONTH_VIEW;
  } else if (view === StatusEnum.WEEK_VIEW) {
    currentCalendarView.value = StatusEnum.WEEK_VIEW;
  }
};

/**************************************
 * DATE UTILITIES
 **************************************/
const now: Date = toZonedTime(new Date(), props.timezone);
const currentDate = ref(now);

/**************************************
 * DATE NAVIGATION
 **************************************/
/**
 * Changes the current date to the next month/week/day in the calendar.
 */
const goToNext = () => {
  if (currentCalendarView.value === StatusEnum.MONTH_VIEW) {
    currentDate.value = addMonths(currentDate.value, 1);
  } else if (currentCalendarView.value === StatusEnum.WEEK_VIEW) {
    currentDate.value = addWeeks(currentDate.value, 1);
  }
};

/**
 * Changes the current date to the previous month/week/day in the calendar.
 */
const goToPrev = () => {
  if (currentCalendarView.value === StatusEnum.MONTH_VIEW) {
    currentDate.value = subMonths(currentDate.value, 1);
  } else if (currentCalendarView.value === StatusEnum.WEEK_VIEW) {
    currentDate.value = subWeeks(currentDate.value, 1);
  }
};

/**
 * Sets the current date to today's date.
 */
const jumpToToday = () => (currentDate.value = now);

/**
 * Sets the current date to the given date.
 *
 * @param {Date} date - The new date to set in the calendar.
 */
const changeDate = (date: Date) =>
  (currentDate.value = toZonedTime(date, props.timezone));

/**************************************
 * POPOVER
 **************************************/
const popoverRef = ref(null);
const { popoverShow, todaysEvent, openPopover, closePopover } = usePopover(popoverRef);

/**************************************
 * MODAL
 **************************************/
const modalShow = ref(false);
const modalDay = ref(null);
const modalEvents = ref([]);

/**
 * Open the event listing modal
 *
 * @param {string} day current calendar month day
 * @param {CalendarEvent[]} events Array of events objects to show on the modal
 */
const openModal = (day: string, events: CalendarEvent[]) => {
  popoverShow.value = false;
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
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <Header
      :now="now"
      :current-date="currentDate"
      :timezone="timezone"
      :primary-color="primaryColor as Color"
      :show-add-btn="showAddBtn"
      :current-calendar-view="currentCalendarView"
      @go-to-today="jumpToToday"
      @go-to-next="goToNext"
      @go-to-prev="goToPrev"
      @date-change="changeDate"
      @view-change="changeCalendarView"
    />

    <component
      :is="viewComponents[currentCalendarView]"
      :current-date="currentDate"
      :timezone="timezone"
      :primary-color="primaryColor"
      :events="events"
      :sunday-start-week="sundayStartWeek"
      :popover-element="popoverRef"
      @toggle-popover="openPopover"
      @clean-popover="closePopover"
      @open-modal="openModal"
    ></component>

    <Footer
      @go-to-today="jumpToToday"
      @go-to-next-month="goToNext"
      @go-to-prev-month="goToPrev"
    />

    <!-- popover component  -->
    <div
      ref="popoverRef"
      :class="{ hidden: !popoverShow, block: popoverShow }"
      class="absolute bg-gray-50 z-50 max-w-2xs rounded-lg shadow-md"
    >
      <slot
        name="eventDialog"
        :eventDialogData="todaysEvent"
        :closeEventDialog="closePopover"
      />
    </div>

    <!-- modal component -->
    <transition name="modal">
      <Modal
        v-if="modalShow"
        @close-modal="closeModal"
        @toggle-popover="openPopover"
        :day="modalDay"
        :events="modalEvents"
        :primary-color="primaryColor"
        :timezone="timezone"
      />
    </transition>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: translate 0.5s ease;
}

.modal-enter-from,
.modal-leave-to {
  translate: 0px 100%;
}
</style>
