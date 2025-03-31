import { Color } from ".";

export interface CalendarEvent {
  id: number;
  url: string;
  title: string;
  time: {
    start: string;
    end: string;
  };
  description: string;
  image?: string;
  tags?: string;
  location?: string;
  background?: string;
  [key: string]: any;
}

export interface CalendarProps {
  currentDate: Date;
  timezone: string;
  events: CalendarEvent[];
  primaryColor: Color;
  sundayStartWeek: boolean;
}

export enum StatusEnum {
  MONTH_VIEW = "month",
  WEEK_VIEW = "week",
  DAY_VIEW = "day",
}