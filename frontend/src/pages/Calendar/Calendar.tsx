import { useState, useRef, useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { useModal } from "../../hooks/useModal";
import PageMeta from "../../components/common/PageMeta";
import { Events } from "../../types/events";
import { useEvents } from "../../context/EventContext";
import EventFormModal from "../../components/Calendar/EventFormModal";

const Calendar: React.FC = () => {
	const { events, fetchEvents, isLoading } = useEvents();
	const [selectedEvent, setSelectedEvent] = useState<Events | null>(null);
	const [selectedDate, setSelectedDate] = useState<string>("");
	const calendarRef = useRef<FullCalendar>(null);
	const { isOpen, openModal, closeModal } = useModal();

	// Track if we've already initialized to prevent multiple API calls
	const [initialized, setInitialized] = useState(false);

	// Initial event data loading - use a ref to ensure it only runs once
	const initRef = useRef(false);

	useEffect(() => {
		// Only fetch if we haven't already and we're not initialized
		if (!initRef.current && !initialized) {
			initRef.current = true; // Mark that we've started initialization

			// Fetch events
			fetchEvents().then(() => {
				setInitialized(true); // Mark that we're fully initialized
			});
		}
	}, [fetchEvents, initialized]);

	const handleDateSelect = useCallback(
		(selectInfo: DateSelectArg) => {
			setSelectedEvent(null);
			setSelectedDate(selectInfo.startStr);
			openModal();
		},
		[openModal]
	);

	const handleEventClick = useCallback(
		(clickInfo: EventClickArg) => {
			const eventId = Number(clickInfo.event.id);
			const eventObj = events.find((e) => e.id === eventId);

			if (eventObj) {
				setSelectedEvent(eventObj);
				setSelectedDate("");
				openModal();
			}
		},
		[events, openModal]
	);

	const handleCloseModal = useCallback(() => {
		closeModal();
		setSelectedEvent(null);
		setSelectedDate("");
		// Refresh events after modal closes, but with a slight delay
		// to avoid interfering with animation and ensure small operations have completed
		setTimeout(() => fetchEvents(true), 500);
	}, [closeModal, fetchEvents]);

	// Prepare the calendar events for rendering
	const calendarEvents = events.map((event) => ({
		id: String(event.id),
		title: event.event_title,
		start: event.event_date,
		extendedProps: {
			calendar: event.event_color,
			notes: event.notes,
			application: event.application,
		},
	}));

	return (
		<>
			<PageMeta
				title="Calendar | School Tracker"
				description="Calendar page for School Tracker application"
			/>
			<div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
						Calendar
					</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
						Manage your important application dates and deadlines
					</p>
				</div>
			</div>

			<div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
				<div className="custom-calendar p-4">
					{isLoading && !initialized ? (
						<CalendarSkeleton />
					) : (
						<FullCalendar
							ref={calendarRef}
							plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
							initialView="dayGridMonth"
							headerToolbar={{
								left: "prev,next addEventButton",
								center: "title",
								right: "dayGridMonth,timeGridWeek,timeGridDay",
							}}
							events={calendarEvents}
							selectable={true}
							select={handleDateSelect}
							eventClick={handleEventClick}
							eventContent={renderEventContent}
							customButtons={{
								addEventButton: {
									text: "Add Event +",
									click: () => {
										setSelectedEvent(null);
										setSelectedDate("");
										openModal();
									},
								},
							}}
						/>
					)}
				</div>
				<EventFormModal
					isOpen={isOpen}
					onClose={handleCloseModal}
					selectedEvent={selectedEvent}
					selectedDate={selectedDate}
				/>
			</div>
		</>
	);
};

const renderEventContent = (eventInfo: any) => {
	const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
	return (
		<div
			className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}
		>
			<div className="fc-daygrid-event-dot"></div>
			<div className="fc-event-time">{eventInfo.timeText}</div>
			<div className="fc-event-title">{eventInfo.event.title}</div>
		</div>
	);
};

const CalendarSkeleton = () => {
	return (
		<div className="animate-pulse">
			{/* Calendar Header Skeleton */}
			<div className="flex items-center justify-between mb-4">
				<div className="flex gap-2">
					<div className="h-10 w-10 rounded bg-gray-200 dark:bg-gray-700"></div>
					<div className="h-10 w-10 rounded bg-gray-200 dark:bg-gray-700"></div>
					<div className="h-10 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
				</div>
				<div className="h-10 w-36 rounded bg-gray-200 dark:bg-gray-700"></div>
				<div className="flex gap-2">
					<div className="h-10 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
					<div className="h-10 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
					<div className="h-10 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
				</div>
			</div>

			{/* Calendar Month View Skeleton */}
			<div className="mt-4">
				<div className="grid grid-cols-7 gap-2 mb-2">
					{Array.from({ length: 7 }).map((_, i) => (
						<div
							key={`day-header-${i}`}
							className="h-8 rounded bg-gray-200 dark:bg-gray-700"
						></div>
					))}
				</div>

				{/* Calendar Cells - 6 rows for maximum month view */}
				{Array.from({ length: 6 }).map((_, weekIndex) => (
					<div
						key={`week-${weekIndex}`}
						className="grid grid-cols-7 gap-2 mb-2"
					>
						{Array.from({ length: 7 }).map((_, dayIndex) => (
							<div
								key={`day-${weekIndex}-${dayIndex}`}
								className="h-24 rounded bg-gray-100 dark:bg-gray-800 p-2 flex flex-col gap-1"
							>
								<div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700 self-end"></div>

								{/* Random event placeholders */}
								{Math.random() > 0.7 && (
									<div className="h-5 w-4/5 rounded bg-gray-200 dark:bg-gray-700"></div>
								)}
								{Math.random() > 0.8 && (
									<div className="h-5 w-3/5 rounded bg-gray-200 dark:bg-gray-700"></div>
								)}
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
};

export default Calendar;
