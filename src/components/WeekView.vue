<script setup lang="ts">
import {
  onBeforeUnmount,
  onMounted,
  ref,
  useTemplateRef,
  watchEffect,
} from "vue";
import { useUtils } from "../composables/useUtils";
import { useWeekView } from "../composables/useWeekView";
import { CalendarProps } from "../types/calendar";

/**************************************
 * PROPS
 **************************************/
const props = defineProps<CalendarProps>();

const emit = defineEmits(["event-click"]);

const { weekDays, formatHour, formatDate, eventPosition, eventTime } =
  useWeekView(props);

const timeColumn = ref(null);
const daysGrid = ref(null);
let isScrolling = false;

/**
 * Syncs the scroll position of the time column and the days grid.
 *
 * When the user scrolls one of the elements, this function is called to update the
 * scroll position of the other element. This is necessary because the two elements
 * do not share the same scroll position, but they need to be in sync.
 *
 * We use requestAnimationFrame to defer the setting of isScrolling to false until
 * the next frame, so that we can handle the case where the user scrolls both
 * elements at the same time.
 *
 * @param {Event} event - The event object that triggered the scroll event.
 */
const syncScroll = (event: Event) => {
  if (isScrolling) return;

  isScrolling = true;

  ubbopu();

  if (event.target === timeColumn.value) {
    daysGrid.value.scrollTop = timeColumn.value.scrollTop;
  } else {
    timeColumn.value.scrollTop = daysGrid.value.scrollTop;
  }

  requestAnimationFrame(() => {
    isScrolling = false;
  });
};

const dayHeader = useTemplateRef("day-header");
const bottomBorderEl = useTemplateRef("bottom-border-el");
const dayHeaderYPos = ref(0);
const updateDayHeaderYPos = () => {
  const { y } = dayHeader.value[0].getBoundingClientRect();
  dayHeaderYPos.value = y;
};

// Update Bottom Border On Position Update
const ubbopu = () => {
  const els = bottomBorderEl.value;

  if (!els) return;

  els.forEach((el) => {
    const { y } = el.getBoundingClientRect();
    if (y < dayHeaderYPos.value) {
      el.classList.replace("border-b", "border-none");
    } else if (y > dayHeaderYPos.value) {
      el.classList.replace("border-none", "border-b");
    }
  });
};

onMounted(() => {
  updateDayHeaderYPos();

  window.addEventListener("resize", updateDayHeaderYPos);
  window.addEventListener("scroll", updateDayHeaderYPos);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateDayHeaderYPos);
  window.removeEventListener("scroll", updateDayHeaderYPos);
});

watchEffect(() => {
  if (dayHeaderYPos.value !== 0) updateDayHeaderYPos();
});
</script>

<template>
  <div class="h-full shadow ring-1 ring-gray-300 ring-opacity-5 flex">
    <!-- Time Column -->
    <div
      ref="timeColumn"
      class="w-16 md:w-20 flex-shrink-0 ring-1 ring-gray-300 ring-opacity bg-gray-50 overflow-y-auto hide-scrollbar"
      @scroll="syncScroll"
    >
      <div
        v-for="(hour, idx) in 25"
        :key="hour"
        class="h-[60px] relative text-xs px-2 py-1 border-b border-gray-300 text-gray-600 flex items-end justify-end"
      >
        <span v-if="hour > 1">
          {{ formatHour(idx - 1) }}
        </span>
      </div>
    </div>

    <!-- Days Grid -->
    <div
      ref="daysGrid"
      class="flex-1 grid grid-cols-7 overflow-auto hide-scrollbar"
      @scroll="syncScroll"
    >
      <div
        v-for="day in weekDays"
        :key="day.date.toDateString"
        class="relative border-l border-gray-300"
      >
        <!-- Day Header -->
        <div
          class="h-[60px] sticky top-0 border-b border-gray-300 z-10 px-2 py-1 text-sm font-medium"
          ref="day-header"
        >
          <div class="text-gray-700 text-center hidden md:block">
            {{ formatDate(day.date, "EEE") }}
          </div>
          <div class="text-gray-700 text-center md:hidden">
            {{ formatDate(day.date, "EEEEE") }}
          </div>
          <div class="flex items-center justify-center">
            <div
              :class="[
                'h-6 w-6 flex justify-center items-center rounded-full',
                day.isToday ? `bg-${primaryColor}-600 text-white` : '',
              ]"
            >
              {{ formatDate(day.date, "d") }}
            </div>
          </div>
        </div>

        <!-- Time Slots -->
        <div class="relative">
          <div
            v-for="hour in 24"
            :key="hour"
            class="h-[60px] border-b border-gray-300"
            ref="bottom-border-el"
          ></div>
        </div>

        <!-- Events -->
        <div class="absolute inset-0 pointer-events-none">
          <div
            v-for="event in day.events"
            :key="event.id"
            class="absolute left-1 right-1 rounded-lg p-2 text-sm shadow-sm border pointer-events-auto"
            :class="[
              `bg-${event.color}-100 border-${event.color}-200 text-${event.color}-800`,
            ]"
            :style="eventPosition(event)"
            @click.stop="console.log(event)"
          >
            <div class="font-medium truncate">{{ event.title }}</div>
            <div class="text-xs mt-1">{{ eventTime(event) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
