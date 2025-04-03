<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { CalendarProps } from "../types/calendar";
import { useUtils } from "../composables/useUtils";
import { useDayView } from "../composables/useDayView";

const emit = defineEmits([
  "togglePopover",
  "openModal",
  "event-click",
  "cleanPopover",
]);
const { formatHour, formatDate, handlePopoverToggle, handleModalOpen } =
  useUtils(emit);

/**************************************
 * PROPS
 **************************************/
const props = defineProps<CalendarProps>();

const { dayEvents, eventPosition, eventTime } = useDayView(props);

const timeColumn = ref(null);
const daysGrid = ref(null);
const isScrolling = ref(false);

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
  emit("cleanPopover"); // destroy and clean any open popover

  if (isScrolling.value) return;

  isScrolling.value = true;

  if (event.target === timeColumn.value) {
    daysGrid.value.scrollTop = timeColumn.value.scrollTop;
  } else {
    timeColumn.value.scrollTop = daysGrid.value.scrollTop;
  }

  requestAnimationFrame(() => {
    isScrolling.value = false;
  });
};

onBeforeUnmount(() => {
  emit("cleanPopover");
});
</script>

<template>
  <div
    class="mb-1 w-full shadow ring-1 ring-gray-300 ring-opacity-5 flex flex-grow overflow-hidden"
  >
    <!-- Time Column -->
    <div
      ref="timeColumn"
      class="w-5 md:w-16 flex-shrink-0 ring-1 ring-gray-300 ring-opacity bg-gray-50 overflow-y-auto hide-scrollbar"
      @scroll="syncScroll"
    >
      <div
        v-for="(hour, idx) in 25"
        :key="hour"
        class="h-[50px] relative text-[0.37rem] md:text-xs tracking-tighter md:tracking-tight px-0.5 md:px-2 py-1 border-b border-gray-300 text-gray-600 font-medium flex items-end justify-end"
      >
        <span v-if="hour > 1">
          {{
            formatHour(idx - 1, {
              currentDate: props.currentDate,
              timezone: props.timezone,
            })
          }}
        </span>
      </div>
    </div>

    <!-- Days Grid -->
    <div
      ref="daysGrid"
      class="flex-1 grid grid-cols-1 overflow-auto hide-scrollbar"
      @scroll="syncScroll"
    >
      <div class="relative border-l border-gray-300">
        <!-- Day Header -->
        <div
          class="h-[50px] w-[99.7%] bg-white sticky top-0 border-b border-gray-300 z-10 pl-5 md:pl-8 pr-1 py-1 text-xs md:text-sm font-medium"
        >
          <div class="h-full flex flex-col justify-center">
            <div class="flex items-center">
              <div class="text-gray-700 text-center font-medium">
                {{ formatDate(dayEvents.date, "EEEE", props.timezone) }}
              </div>
              <div
                class="ml-1.5 flex justify-center items-center text-[0.65rem] md:text-sm"
              >
                <div
                  :class="[
                    'h-6 md:h-7 w-6 md:w-7 flex flex-col justify-center items-center rounded-full text-center',

                    dayEvents.isToday
                      ? `bg-${primaryColor}-600 text-white`
                      : 'font-bold text-gray-700 text-base',
                  ]"
                >
                  {{ formatDate(dayEvents.date, "d", props.timezone) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Time Slots -->
        <div class="relative">
          <div
            v-for="hour in 24"
            :key="hour"
            class="h-[50px] border-b border-gray-300"
          ></div>
        </div>

        <!-- Events -->
        <div class="absolute inset-0 pointer-events-none">
          <div
            v-for="event in dayEvents.events"
            :key="event.id"
            class="absolute w-[80%] md:w-1/2 left-[10%] md:left-1/4 rounded md:rounded-lg px-0.5 md:px-1.5 lg:px-2 py-2 md:py-2.5 text-[0.4rem] md:text-sm md:border shadow-sm pointer-events-auto cursor-pointer"
            :class="[
              `border-${event.background ?? primaryColor}-600 bg-${
                event.background ?? primaryColor
              }-50 text-${event.background ?? primaryColor}-600`,
            ]"
            :style="eventPosition(event, dayEvents.date)"
            @click.stop="
              event.eventCount === 1
                ? handlePopoverToggle($event, event)
                : handleModalOpen(
                    dayEvents.date.toString(),
                    event.timeSlotEvents
                  )
            "
          >
            <div
              v-if="event.eventCount > 1"
              class="font-medium truncate text-center"
            >
              {{ `${event.eventCount} events` }}
            </div>
            <div v-else class="font-medium truncate text-center">
              <div class="font-semibold truncate text-center">
                {{ event.title }}
              </div>
            </div>
            <div class="my-1 flex justify-center">
              <div class="text-center">{{ eventTime(event)[0] }}</div>
              <div class="text-center mx-0.5 md:mx-1">-</div>
              <div class="text-center">{{ eventTime(event)[1] }}</div>
            </div>
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
