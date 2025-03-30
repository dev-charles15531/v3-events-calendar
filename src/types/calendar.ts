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
  MONTHLY_VIEW = "month",
  WEEKLY_VIEW = "week",
  DAILY_VIEW = "day",
}