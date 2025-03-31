import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  parseISO,
  isToday,
  differenceInMinutes,
  isSameDay,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { computed, ComputedRef } from "vue";
import { CalendarEvent, CalendarProps } from "../types/calendar";

// interface WeekDays {
//   date: Date;
//   isToday: boolean;
//   events: (CalendarEvent & { eventCount: number })[];
// }

interface EnhancedCalendarEvent extends CalendarEvent {
  eventCount: number;
  timeSlotEvents?: CalendarEvent[];
}

interface WeekDays {
  date: Date;
  isToday: boolean;
  events: EnhancedCalendarEvent[];
}

export const useWeekView = (
  props: CalendarProps
): {
  weekDays: ComputedRef<WeekDays[]>;
  formatHour: (hour: number) => string;
  formatDate: (date: Date, formatStr: string) => string;
  eventPosition: (event: CalendarEvent) => { top: string; height: string };
  eventTime: (event: CalendarEvent) => string[];
} => {
  const getZonedDate = (date: Date) => toZonedTime(date, props.timezone);

  /**
   * Compute the days of the week for the current date
   * along with any events that fall on those days.
   */
  const weekDays = computed(() => {
    const start = startOfWeek(props.currentDate, {
      weekStartsOn: props.sundayStartWeek ? 0 : 1,
    });
    const end = endOfWeek(props.currentDate, {
      weekStartsOn: props.sundayStartWeek ? 0 : 1,
    });
  
    const days: WeekDays[] = eachDayOfInterval({ start, end }).map<WeekDays>((date) => {
      const eventsForDay = props.events.filter((event: CalendarEvent) =>
        isSameDay(getZonedDate(parseISO(event.time.start)), date)
      );
  
      // Group events by their start time
      const groupedEvents = eventsForDay.reduce((acc: Record<string, CalendarEvent[]>, event) => {
        const eventStart = getZonedDate(parseISO(event.time.start));
        const hourKey = `${eventStart.getHours()}:${String(eventStart.getMinutes()).padStart(2, '0')}`;
        
        acc[hourKey] = acc[hourKey] || [];
        acc[hourKey].push(event);
        return acc;
      }, {});
  
      // Create enhanced event objects
      const enhancedEvents = Object.entries(groupedEvents).map(([timeSlot, events]) => {
        const baseEvent = events[0];
        return {
          ...baseEvent,
          eventCount: events.length,
          timeSlotEvents: events.length > 1 ? events : undefined,
        };
      });
  
      return {
        date,
        isToday: isToday(date),
        events: enhancedEvents,
      };
    });
  
    return days;
  });

  /**
   * Format a given hour in a 12-hour format with AM/PM.
   * @param {number} hour - The hour to format (0-23).
   * @returns {string} - The formatted hour string.
   */
  const formatHour = (hour: number): string => {
    const date = getZonedDate(props.currentDate);
    date.setHours(hour % 24);
    date.setMinutes(0);
    return format(date, "ha");
  };

  /**
   * Calculate the top and height CSS properties for an event element
   * so that it spans the correct portion of the day in the week view.
   * @param {CalendarEvent} event - The event to calculate the position for.
   * @returns {Object} - An object with "top" and "height" properties containing the CSS values.
   */
  const eventPosition = (
    event: CalendarEvent
  ): { top: string; height: string } => {
    const start = getZonedDate(parseISO(event.time.start));
    const end = getZonedDate(parseISO(event.time.end));
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const duration = differenceInMinutes(end, start);

    const topPercentage = ((startMinutes + 30) / 1440) * 100;
    const heightPercentage = Math.min(
      ((duration + 60) / 1440) * 100,
      100 - topPercentage
    );

    return {
      // Used mins in 22(1320) hours instead of the normal 24(1440)
      // This is to account for the added row in the time column for the display of weekdays and the 12AM row
      top: `${((startMinutes + 30) / 1440) * 100}%`,
      height: `${heightPercentage}%`,
    };
  };

  /**
   * Return the start and end times of an event in a human-readable format.
   * @param {CalendarEvent} event - The event to get the times for.
   * @returns {string[]} - An array with two elements, the start time in 12-hour format with AM/PM,
   * and the end time in the same format.
   */

  const eventTime = (event: CalendarEvent): string[] => {
    const start = getZonedDate(parseISO(event.time.start));
    const end = getZonedDate(parseISO(event.time.end));

    const formatTime = (date: Date) =>
      date.getMinutes() === 0
        ? format(date, "ha").toLowerCase()
        : format(date, "h:mma").toLowerCase();

    return [formatTime(start), formatTime(end)];
  };

  /**
   * Format a given date in the given format string.
   * @param {Date} date - The date to format.
   * @param {string} formatStr - The format string to use.
   * @returns {string} - The formatted date string.
   */
  const formatDate = (date: Date, formatStr: string): string =>
    format(getZonedDate(date), formatStr);

  return {
    weekDays,
    formatHour,
    eventPosition,
    eventTime,
    formatDate,
  };
};
