import { format, addDays, startOfMonth, startOfWeek } from "date-fns";
import { CalendarEvent } from "../types/calendar";
import { toZonedTime } from "date-fns-tz";

export function useUtils(
  emit?: (event: "togglePopover" | "openModal", ...args: any[]) => void
) {
  const getZonedDate = (date: Date, tz: string) => toZonedTime(date, tz);

  /**
   * Format a given hour in a 12-hour format with AM/PM.
   * @param {number} hour - The hour to format (0-23).
   * @returns {string} - The formatted hour string.
   */
  const formatHour = (
    hour: number,
    props: { currentDate: Date; timezone: string }
  ): string => {
    const date = getZonedDate(props.currentDate, props.timezone);
    date.setHours(hour % 24);
    date.setMinutes(0);
    return format(date, "ha");
  };

  /**
   * Format a given date in the given format string.
   * @param {Date} date - The date to format.
   * @param {string} formatStr - The format string to use.
   * @returns {string} - The formatted date string.
   */
  const formatDate = (
    date: Date,
    formatStr: string,
    timezone: string
  ): string => format(getZonedDate(date, timezone), formatStr);

  /**
   * Generates an array of abbreviated day names (e.g., ["Sun", "Mon", ...])
   * for the week starting from the first day of the week, based on the
   * provided current date and week start preference.
   *
   * @param currentDate - The date used to determine the month and starting week.
   * @param sundayStartWeek - Boolean indicating if the week should start on Sunday (true) or Monday (false).
   * @returns An array of strings representing the abbreviated names of the days of the week.
   */
  const daysOfWeekArr = (
    currentDate: Date,
    sundayStartWeek: boolean
  ): string[] => {
    const daysOfWeek = Array.from({ length: 7 }).map((_, i) => {
      const startOfWeekDate = startOfWeek(startOfMonth(currentDate), {
        weekStartsOn: sundayStartWeek ? 0 : 1,
      });
      const day = addDays(startOfWeekDate, i);

      return format(day, "EEE");
    });

    return daysOfWeek;
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

  return {
    getZonedDate,
    formatHour,
    formatDate,
    daysOfWeekArr,
    handlePopoverToggle,
    handleModalOpen,
  };
}
