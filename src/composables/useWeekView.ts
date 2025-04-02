import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  parseISO,
  isToday,
  differenceInMinutes,
  isSameDay,
  startOfDay,
  endOfDay,
  differenceInCalendarDays,
  isWithinInterval,
  differenceInDays,
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
  eventPosition: (
    event: CalendarEvent,
    currentDate: Date
  ) => { top: string; height: string };
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

    const days: WeekDays[] = eachDayOfInterval({ start, end }).map<WeekDays>(
      (date) => {
        const eventsForDay = props.events?.filter((event: CalendarEvent) => {
          const eventStart = getZonedDate(parseISO(event.time.start));
          const eventEnd = getZonedDate(parseISO(event.time.end));
          const currDate = getZonedDate(date);

          const diffBtwEvents =
            differenceInDays(startOfDay(eventEnd), startOfDay(eventStart)) + 1;

          if (diffBtwEvents <= 1) {
            return isSameDay(
              getZonedDate(parseISO(event.time.start)),
              currDate
            );
          } else {
            return isWithinInterval(currDate, {
              start: startOfDay(eventStart),
              end: eventEnd,
            });
          }
        });

        const groupedEvents = eventsForDay
          .sort(
            (a, b) =>
              getZonedDate(parseISO(a.time.start)).getTime() -
              getZonedDate(parseISO(b.time.start)).getTime()
          )
          // Merge overlapping events
          .reduce(
            (
              groups: Array<{
                start: Date;
                end: Date;
                events: CalendarEvent[];
              }>,
              event
            ) => {
              const eventStart = getZonedDate(parseISO(event.time.start));
              const eventEnd = getZonedDate(parseISO(event.time.end));

              // Find overlapping group
              const overlappingGroup = groups.find(
                (group) => eventStart < group.end && eventEnd > group.start
              );

              if (overlappingGroup) {
                // Expand group time bounds
                overlappingGroup.start =
                  overlappingGroup.start < eventStart
                    ? overlappingGroup.start
                    : eventStart;
                overlappingGroup.end =
                  overlappingGroup.end > eventEnd
                    ? overlappingGroup.end
                    : eventEnd;
                overlappingGroup.events.push(event);
              } else {
                // Create new group
                groups.push({
                  start: eventStart,
                  end: eventEnd,
                  events: [event],
                });
              }

              return groups;
            },
            []
          )
          // Convert to hour-key format
          .reduce((acc: Record<string, CalendarEvent[]>, group) => {
            // Get earliest start time in the group
            const earliestStart = group.events.reduce((min, event) => {
              const eventStart = getZonedDate(parseISO(event.time.start));
              return eventStart < min ? eventStart : min;
            }, group.start);

            const hourKey = `${earliestStart.getHours()}:${String(
              earliestStart.getMinutes()
            ).padStart(2, "0")}`;

            acc[hourKey] = acc[hourKey] || [];
            acc[hourKey].push(...group.events);

            return acc;
          }, {});

        // Create enhanced event objects
        const enhancedEvents = Object.entries(groupedEvents).map(
          ([_, events]) => {
            const baseEvent = events[0];
            return {
              ...baseEvent,
              eventCount: events.length,
              timeSlotEvents: events.length > 1 ? events : undefined,
            };
          }
        );

        return {
          date,
          isToday: isToday(date),
          events: enhancedEvents,
        };
      }
    );

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
    event: CalendarEvent,
    currentDate: Date
  ): { top: string; height: string } => {
    const DAY_MINUTES = 1440; // Keep original constant
    const START_OFFSET = 30; // Your original start offset
    const DURATION_EXTRA = 60; // Your original duration padding

    const eventStart = getZonedDate(parseISO(event.time.start));
    const eventEnd = getZonedDate(parseISO(event.time.end));

    // Get current day boundaries
    const dayStart = startOfDay(currentDate);
    const dayEnd = endOfDay(currentDate);

    // Calculate visible portion of event for this day
    const visibleStart = eventStart < dayStart ? dayStart : eventStart;
    const visibleEnd = eventEnd > dayEnd ? dayEnd : eventEnd;

    // Convert to minutes with original offsets
    const visibleStartMinutes =
      differenceInMinutes(visibleStart, dayStart) + START_OFFSET;
    const visibleDuration =
      differenceInMinutes(visibleEnd, visibleStart) + DURATION_EXTRA;

    // Clamp values to stay within day bounds
    const clampedStart = Math.max(
      0,
      Math.min(visibleStartMinutes, DAY_MINUTES)
    );
    const maxPossibleHeight = DAY_MINUTES - clampedStart;
    const clampedHeight = Math.max(
      0,
      Math.min(visibleDuration, maxPossibleHeight)
    );

    const top = (clampedStart / DAY_MINUTES) * 100;

    return {
      top: `${top < 4 ? 4 : top}%`,
      height: `${(clampedHeight / DAY_MINUTES) * 100}%`,
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
