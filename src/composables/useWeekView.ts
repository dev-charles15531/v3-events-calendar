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
  isWithinInterval,
  differenceInDays,
} from "date-fns";
import { computed, ComputedRef } from "vue";
import { CalendarEvent, CalendarProps } from "../types/calendar";
import { useUtils } from "./useUtils";

interface EnhancedCalendarEvent extends CalendarEvent {
  eventCount: number;
  timeSlotEvents?: CalendarEvent[];
}

interface WeekDays {
  date: Date;
  isToday: boolean;
  events: EnhancedCalendarEvent[];
}

export const useWeekView = (props: CalendarProps) => {
  const { getZonedDate } = useUtils();

  /**
   * Compute the days of the week for the current date
   * along with any events that fall on those days.
   */
  const weekDays: ComputedRef<WeekDays[]> = computed(() => {
    const start = startOfWeek(props.currentDate, {
      weekStartsOn: props.sundayStartWeek ? 0 : 1,
    });
    const end = endOfWeek(props.currentDate, {
      weekStartsOn: props.sundayStartWeek ? 0 : 1,
    });

    const days: WeekDays[] = eachDayOfInterval({ start, end }).map<WeekDays>(
      (date) => {
        const eventsForDay = props.events?.filter((event: CalendarEvent) => {
          const eventStart = getZonedDate(
            parseISO(event.time.start),
            props.timezone
          );
          const eventEnd = getZonedDate(
            parseISO(event.time.end),
            props.timezone
          );
          const currDate = getZonedDate(date, props.timezone);

          const diffBtwEvents =
            differenceInDays(startOfDay(eventEnd), startOfDay(eventStart)) + 1;

          if (diffBtwEvents <= 1) {
            return isSameDay(
              getZonedDate(parseISO(event.time.start), props.timezone),
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
              getZonedDate(parseISO(a.time.start), props.timezone).getTime() -
              getZonedDate(parseISO(b.time.start), props.timezone).getTime()
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
              const eventStart = getZonedDate(
                parseISO(event.time.start),
                props.timezone
              );
              const eventEnd = getZonedDate(
                parseISO(event.time.end),
                props.timezone
              );

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
              const eventStart = getZonedDate(
                parseISO(event.time.start),
                props.timezone
              );
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
   * Calculate the top and height CSS properties for an event element
   * so that it spans the correct portion of the day in the week view.
   * @param {CalendarEvent} event - The event to calculate the position for.
   * @returns {Object} - An object with "top" and "height" properties containing the CSS values.
   */
  const eventPosition = (
    event: CalendarEvent,
    currentDate: Date
  ): { top: string; height: string } => {
    const DAY_MINUTES = 1440; // 24 hrs in one day(24 * 60)
    const START_OFFSET = 30; // for some reason, maybe due to the added rows, top position is off, hence this offset :(
    const DURATION_EXTRA = 60; // same thing here to account for added rows and time starting from 12AM

    const eventStart = getZonedDate(parseISO(event.time.start), props.timezone);
    const eventEnd = getZonedDate(parseISO(event.time.end), props.timezone);

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
    const start = getZonedDate(parseISO(event.time.start), props.timezone);
    const end = getZonedDate(parseISO(event.time.end), props.timezone);

    const formatTime = (date: Date) =>
      date.getMinutes() === 0
        ? format(date, "ha").toLowerCase()
        : format(date, "h:mma").toLowerCase();

    return [formatTime(start), formatTime(end)];
  };

  return {
    weekDays,
    eventPosition,
    eventTime,
  };
};
