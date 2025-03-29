<script setup>
import { ref } from "vue";
import Header from "./Header.vue";
import Body from "./Body.vue";
import { addMonths, subMonths } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import Footer from "./Footer.vue";
import { usePopover } from "../composables/popover";
import Modal from "./Modal.vue";

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
 * DATE UTILITIES
 **************************************/
const now = toZonedTime(new Date(), props.timezone);
const currentDate = ref(now);

/**************************************
 * DATE NAVIGATION
 **************************************/
const goToNextMonth = () =>
  (currentDate.value = addMonths(currentDate.value, 1));
const goToPrevMonth = () =>
  (currentDate.value = subMonths(currentDate.value, 1));
const jumpToToday = () => (currentDate.value = now);
const changeDate = (date) =>
  (currentDate.value = toZonedTime(date, props.timezone));

/**************************************
 * POPOVER
 **************************************/
const popoverRef = ref(null);
const { popoverShow, todaysEvent, togglePopover } =
  usePopover(popoverRef);

/**************************************
 * MODAL
 **************************************/
const modalShow = ref(false);
const modalDay = ref(null);
const modalEvents = ref([]);
/**
 * Open the event listing modal
 *
 * @param {number} day current calendar month day
 * @param {array} events Array of events objects to show on the modal
 *
 * @return null
 */
const openModal = (day, events) => {
  console.log(day);
  
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
      :primary-color="primaryColor"
      :show-add-btn="showAddBtn"
      @go-to-today="jumpToToday"
      @go-to-next-month="goToNextMonth"
      @go-to-prev-month="goToPrevMonth"
      @date-change="changeDate"
    />

    <Body
      :current-date="currentDate"
      :timezone="timezone"
      :primary-color="primaryColor"
      :events="events"
      :sunday-start-week="sundayStartWeek"
      @toggle-popover="togglePopover"
      @open-modal="openModal"
    />

    <Footer
      @go-to-today="jumpToToday"
      @go-to-next-month="goToNextMonth"
      @go-to-prev-month="goToPrevMonth"
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
          :closeEventDialog="togglePopover"
        />
      </div>

    <!-- modal component -->
    <transition name="modal">
      <Modal
        v-if="modalShow"
        @close-modal="closeModal"
        @toggle-popover="togglePopover"
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
