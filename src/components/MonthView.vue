<script setup lang="ts">
import { computed, ComputedRef, watch } from "vue";
import "@vuepic/vue-datepicker/dist/main.css";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isToday as isTodayFn,
  isSameMonth,
  parseISO,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { useUtils } from "../composables/useUtils";
import { CalendarEvent, CalendarProps } from "../types/calendar";

interface WeekDays {
  date: string;
  isCurrentMonth: boolean;
  events: CalendarEvent[];
  isToday: boolean;
}


const emit = defineEmits(["togglePopover", "openModal"]);

/**************************************
 * PROPS
 **************************************/
const props = defineProps<CalendarProps>();

/**************************************
 * DAYS GENERATION
 **************************************/
const { daysOfWeekArr } = useUtils();

const days = computed(() => {
  let som = startOfMonth(props.currentDate);
  const start = startOfWeek(som, {
    weekStartsOn: props.sundayStartWeek ? 0 : 1,
  });

  let eom = endOfMonth(props.currentDate);
  const end = endOfWeek(eom, {
    weekStartsOn: props.sundayStartWeek ? 0 : 1,
  });

  return eachDayOfInterval({ start, end }).map((date) => {
    const zonedDate = toZonedTime(date, props.timezone);
    return {
      date: format(zonedDate, "yyyy-MM-dd"),
      isCurrentMonth: isSameMonth(zonedDate, props.currentDate),
      events: [],
      isToday: isTodayFn(zonedDate),
    };
  });
});

/**
 * Maps the events to the days array.
 *
 * Goes through each event, converts its start time to the correct timezone and
 * then finds the corresponding day in the days array and adds the event to it.
 *
 * @param days - The computed days array
 * @param events - The events to add to the days array
 */
const mapEventsToDays = (
  days: ComputedRef<WeekDays[]>,
  events: CalendarEvent[]
): void => {
  events.forEach((event) => {
    const eventDate = format(
      toZonedTime(parseISO(event.time.start), props.timezone),
      "yyyy-MM-dd"
    );
    const day = days.value.find((d) => d.date === eventDate);
    if (day) day.events.push(event);
  });
};

/**
 * Emit a togglePopover event with the event target and the calendar event.
 *
 * @param {MouseEvent} evt - The mouse event triggered by the user interaction.
 * @param {CalendarEvent} event - The calendar event to toggle the popover for.
 */
const handlePopoverToggle = (evt: MouseEvent, event: CalendarEvent): void => {
  emit("togglePopover", evt.currentTarget, event);
};

/**
 * Emit an openModal event with the date and events
 *
 * @param {string} day - The date to open the modal for in ISO format
 * @param {CalendarEvent[]} events - The events to show in the modal
 */
const handleModalOpen = (day: string, events: CalendarEvent[]): void => {
  emit("openModal", day, events);
};

/**
 * Checks if an event has a background color.
 *
 * @param {CalendarEvent} event - The event to check.
 * @returns {boolean} Whether the event has a background color.
 */
const isEventBackground = (event: CalendarEvent): boolean => !!event.background;

watch(
  () => props.events,
  () => mapEventsToDays(days, props.events)
);

watch(
  () => props.currentDate,
  () => mapEventsToDays(days, props.events)
);
</script>

<template>
  <div class="lg:flex-1">
    <div
      class="h-full shadow ring-1 ring-gray-300 ring-opacity-5 lg:flex lg:flex-auto lg:flex-col"
    >
      <div
        class="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none"
      >
        <div v-for="day in daysOfWeekArr(currentDate, sundayStartWeek)" :key="day" class="bg-white py-2">
          {{ day }}
          <span class="sr-only sm:not-sr-only">{{ day.slice(3) }}</span>
        </div>
      </div>

      <div class="bg-gray-200 text-xs text-gray-700 lg:flex-1">
        <div class="hidden w-full h-full lg:grid lg:grid-cols-7 lg:gap-px">
          <div
            v-for="day in days"
            :key="day.date"
            :class="[
              day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400',
              'flex flex-col h-full w-full',
            ]"
          >
            <div class="relative h-full p-2">
              <time
                :datetime="day.date"
                :class="[
                  'flex h-6 w-6 items-center justify-center rounded-full',
                  day.isToday ? `bg-${primaryColor}-600 text-white` : '',
                ]"
              >
                {{ format(parseISO(day.date), "d") }}
              </time>
              <ol v-if="day.events.length" class="mt-3 pop-here">
                <li
                  v-for="(event, idx) in day.events.slice(0, 3)"
                  :key="event.id"
                >
                  <h5
                    :class="[
                      'group flex cursor-pointer px-1.5 py-0.5',
                      idx > 0 ? 'mt-1' : '',
                      isEventBackground(event)
                        ? `rounded-md bg-${event.background}-50`
                        : '',
                    ]"
                    @click="handlePopoverToggle($event, event)"
                  >
                    <p
                      :class="[
                        'flex-auto truncate font-medium text-gray-800',
                        `hover:text-${primaryColor}-600`,
                      ]"
                    >
                      {{ event.title }}
                    </p>
                  </h5>
                </li>
                <li
                  v-if="day.events.length > 3"
                  class="text-gray-500 cursor-pointer mx-1.5 mt-1"
                  @click="handleModalOpen(day.date, day.events)"
                >
                  + {{ day.events.length - 3 }} more
                </li>
              </ol>
            </div>
          </div>
        </div>

        <div class="isolate grid w-full grid-cols-7 gap-px lg:hidden">
          <button
            v-for="day in days"
            :key="day.date"
            type="button"
            :class="[
              day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
              'flex h-14 w-full flex-col px-3 py-2 hover:bg-gray-100 focus:z-10',
            ]"
            @click="day.events.length && handleModalOpen(day.date, day.events)"
          >
            <time
              :datetime="day.date"
              :class="[
                'flex flex-col h-[1.35rem] w-[1.35rem] items-center justify-center rounded-full',
                day.isToday ? `bg-${primaryColor}-600 text-white` : '',
              ]"
            >
              {{ format(parseISO(day.date), "d") }}
            </time>
            <h5
              v-if="day.events.length"
              class="w-full mt-1.5 flex justify-center flex-wrap"
            >
              <span
                v-for="(event, index) in day.events"
                :key="event.id"
                :class="[
                  'mb-1 h-1.5 w-1.5 rounded-full',
                  isEventBackground(event)
                    ? `bg-${event.background}-500`
                    : 'bg-gray-400',
                  (index + 1) % 2 ? 'mr-1' : '',
                ]"
              />
            </h5>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
