// import { ref, onMounted, onUnmounted } from "vue";
import { format, addDays, startOfMonth, startOfWeek } from "date-fns";
// import { toZonedTime } from "date-fns-tz";

export function useUtils() {
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

  return { daysOfWeekArr };
}
