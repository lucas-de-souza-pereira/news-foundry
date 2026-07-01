// External Libraries
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatShortFrenchDate(dateString: string): string {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}

export function formatLongFrenchDate(dateString: string): string {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export function formatHourMinutes(dateString: string): string {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(dateString));
}

export function formatWeekNumber(dateString: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);

  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));

  const diffInMs = date.getTime() - yearStart.getTime();
  const weekNumber = Math.ceil((diffInMs / 86400000 + 1) / 7);

  return weekNumber.toString();
}
