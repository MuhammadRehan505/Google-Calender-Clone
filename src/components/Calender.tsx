import { useMemo, useState } from "react";
import {
  startOfWeek,
  startOfMonth,
  endOfWeek,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isBefore,
  endOfDay,
  isToday,
  subMonths,
  addMonths,
} from "date-fns";
import { formatDate } from "../utils/formatDate";
import { cc } from "../utils/cc";
import { useEvents } from "../context/useEvent";
import { Modal, type ModalProps } from "./Modal";
import type { UnionOmit } from "../utils/types";
import type { Event } from "../context/Events";
export function Calender() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const calenderDays = useMemo(() => {
    const firstWeekStart = startOfWeek(startOfMonth(selectedMonth));
    const lastWeekEnd = endOfWeek(endOfMonth(selectedMonth));

    return eachDayOfInterval({
      start: firstWeekStart,
      end: lastWeekEnd,
    });
  }, [selectedMonth]);

  return (
    <div className="calendar">
      <div className="header">
        <button className="btn" onClick={() => setSelectedMonth(new Date())}>
          Today
        </button>
        <div>
          <button
            className="month-change-btn"
            onClick={() => {
              setSelectedMonth((m) => subMonths(m, 1));
            }}
          >
            &lt;
          </button>
          <button
            className="month-change-btn"
            onClick={() => {
              setSelectedMonth((m) => addMonths(m, 1));
            }}
          >
            &gt;
          </button>
        </div>
        <span className="month-title">
          {formatDate(selectedMonth, { month: "long", year: "numeric" })}
        </span>
      </div>
      <div className="days">
        {calenderDays.map((day, index) => (
          <CalendarDay
            key={day.getTime()}
            day={day}
            showWeekName={index < 7}
            selectedMonth={selectedMonth}
          />
        ))}
      </div>
    </div>
  );
}

type CalendarDayProps = {
  day: Date;
  showWeekName: boolean;
  selectedMonth: Date;
};

function CalendarDay({ day, showWeekName, selectedMonth }: CalendarDayProps) {
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  console.log(isNewEventModalOpen);
  const { addEvent } = useEvents();
  return (
    <>
      <div
        className={cc(
          "day",
          !isSameMonth(day, selectedMonth) && "non-month-day",
          isBefore(endOfDay(day), new Date()) && "old-month-day"
        )}
      >
        <div className="day-header">
          {showWeekName && (
            <div className="week-name">
              {formatDate(day, { weekday: "short" })}
            </div>
          )}
          <div className={cc("day-number", isToday(day) && "today ")}>
            {formatDate(day, { day: "numeric" })}
          </div>
          <button
            className="add-event-btn"
            onClick={() => setIsNewEventModalOpen(true)}
          >
            +
          </button>
        </div>
        <div className="events">
          <button className="all-day-event blue event">
            <div className="event-name">Short</div>
          </button>
          <button className="all-day-event green event">
            <div className="event-name">
              Long Event Name That Just Keeps Going
            </div>
          </button>
          <button className="event">
            <div className="color-dot blue"></div>
            <div className="event-time">7am</div>
            <div className="event-name">Event Name</div>
          </button>
        </div>
      </div>

      <div className="day non-month-day old-month-day">
        {/* <div className="day-header">
          <div className="week-name">Mon</div>
          <div className="day-number">29</div>
          <button className="add-event-btn">+</button>
        </div>
      </div>

      <div className="day non-month-day old-month-day">
        <div className="day-header">
          <div className="week-name">Tue</div>
          <div className="day-number">30</div>
          <button className="add-event-btn">+</button>
        </div>
      </div>

      <div className="day non-month-day old-month-day">
        <div className="day-header">
          <div className="week-name">Wed</div>
          <div className="day-number">31</div>
          <button className="add-event-btn">+</button>
        </div> */}
        <EventFormModal
          date={day}
          isOpen={isNewEventModalOpen}
          onClose={() => setIsNewEventModalOpen(false)}
          onSubmit={addEvent}
        />
      </div>
    </>
  );
}

type EventFormModalProps = {
  onSubmit: (event: UnionOmit<Event, "id">) => void;
} & (
  | { onDelete: () => void; event: Event; date?: never }
  | { onDelete?: never; event?: never; date: Date }
) &
  Omit<ModalProps, "children">;
function EventFormModal({
  // onSubmit,
  // onDelete,
  event,
  date,
  ...modalProps
}: EventFormModalProps) {
  const isNew = event == null;
  // const handleSubmit = () => {
  //   if (!date) return;

  //   const newEvent = {
  //     name: "My Event", // you can replace with actual form input
  //     date: date,
  //     color: "blue", // replace with selected color
  //     allDay: false,
  //     startTime: "07:00",
  //     endTime:
  //   };

  //   modalProps.onSubmit(newEvent); // update calendar
  //   modalProps.onClose(); // close modal
  // };

  return (
    <Modal {...modalProps}>
      <div className="modal-title">
        <div>{isNew ? "Add" : "Edit"}</div>
        <small>{formatDate(date || event.date, { dateStyle: "short" })}</small>
        <button className="close-btn" onClick={modalProps.onClose}>
          &times;
        </button>
      </div>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" id="name" />
          </div>
          <div className="form-group checkbox">
            <input type="checkbox" name="all-day" id="all-day" />
            <label htmlFor="all-day">All Day?</label>
          </div>
          <div className="row">
            <div className="form-group">
              <label htmlFor="start-time">Start Time</label>
              <input type="time" name="start-time" id="start-time" />
            </div>
            <div className="form-group">
              <label htmlFor="end-time">End Time</label>
              <input type="time" name="end-time" id="end-time" />
            </div>
          </div>
          <div className="form-group">
            <label>Color</label>
            <div className="row left">
              <input
                type="radio"
                name="color"
                value="blue"
                id="blue"
                checked
                className="color-radio"
              />
              <label htmlFor="blue">
                <span className="sr-only">Blue</span>
              </label>
              <input
                type="radio"
                name="color"
                value="red"
                id="red"
                className="color-radio"
              />
              <label htmlFor="red">
                <span className="sr-only">Red</span>
              </label>
              <input
                type="radio"
                name="color"
                value="green"
                id="green"
                className="color-radio"
              />
              <label htmlFor="green">
                <span className="sr-only">Green</span>
              </label>
            </div>
          </div>
          <div className="row">
            <button className="btn btn-success" type="submit">
              Add
            </button>
            <button className="btn btn-delete" type="button">
              Delete
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
