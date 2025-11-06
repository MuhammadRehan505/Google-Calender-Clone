import { createContext, useEffect, useState } from "react";
import type { UnionOmit } from "../utils/types";
import type { EVENT_COLORS } from "./useEvent";

export type Event = {
  id: string;
  name: string;
  color: (typeof EVENT_COLORS)[number];
  date: Date;
} & (
  | { allday: false; startTime: string; endTime: string }
  | { allday: true; startTime?: never; endTime?: never }
);

type EventContext = {
  events: Event[];
  addEvent: (event: UnionOmit<Event, "id">) => void;
  updateEvent: (id: string, eventDetails: UnionOmit<Event, "id">) => void;
  deleteEvent: (id: string) => void;
};
export const Context = createContext<EventContext | null>(null);

type EventsProviderProps = {
  children: React.ReactNode;
};

export function EventsProvider({ children }: EventsProviderProps) {
  const [events, setEvents] = useLocalStorage("EVENTS", []);

  function addEvent(eventDetails: UnionOmit<Event, "id">) {
    setEvents((e) => [...e, { ...eventDetails, id: crypto.randomUUID() }]);
  }
  function updateEvent(id: string, eventDetails: UnionOmit<Event, "id">) {
    setEvents((e) => {
      return e.map((event) => {
        return event.id === id ? { id, ...eventDetails } : event;
      });
    });
  }

  function deleteEvent(id: string) {
    setEvents((e) => e.filter((event) => event.id !== id));
  }
  return (
    <Context.Provider value={{ events, addEvent, updateEvent, deleteEvent }}>
      {children}
    </Context.Provider>
  );
}

function useLocalStorage(key: string, initialValue: Event[]) {
  const [value, setValue] = useState<Event[]>(() => {
    const jsonValue = localStorage.getItem(key);
    if (jsonValue === null) return initialValue;
    return (JSON.parse(jsonValue) as Event[]).map((event) => {
      if (event.date instanceof Date) return event;
      return { ...event, date: new Date(event.date) };
    });
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue] as const;
}
