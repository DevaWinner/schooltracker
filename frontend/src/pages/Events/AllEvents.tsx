import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../../context/EventContext";
import { useApplications } from "../../context/ApplicationContext";
import { Events } from "../../types/events";
import { format, parseISO, isBefore } from "date-fns";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import EventFormModal from "../../components/Calendar/EventFormModal";
import { useModal } from "../../hooks/useModal";
import Button from "../../components/ui/button/Button";

const AllEvents: React.FC = () => {
	const { events, fetchEvents, removeEvent } = useEvents();
	const { applications } = useApplications();
	const navigate = useNavigate();
	const [selectedEvent, setSelectedEvent] = useState<Events | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [filteredEvents, setFilteredEvents] = useState<Events[]>([]);
	const [filter, setFilter] = useState<string>("all"); // "all", "upcoming", "past"
	const [search, setSearch] = useState<string>("");
	const eventsLoadedRef = useRef(false);

	// Modal for editing events
	const { isOpen, openModal, closeModal } = useModal();

	// Load events on component mount - FIXED to properly fetch data
	useEffect(() => {
		const loadEvents = async () => {
			if (!eventsLoadedRef.current) {
				setIsLoading(true);
				// Force refresh if events array is empty
				await fetchEvents(events.length === 0);
				eventsLoadedRef.current = true;
				setIsLoading(false);
			} else {
				setIsLoading(false);
			}
		};

		loadEvents();

		// Reset the loaded flag when component unmounts
		return () => {
			eventsLoadedRef.current = false;
		};
	}, [fetchEvents, events.length]); // Added events.length back as dependency

	// Apply filters and search
	useEffect(() => {
		let result = [...events];

		// Apply date filter
		const now = new Date();
		if (filter === "upcoming") {
			result = result.filter((event) => new Date(event.event_date) >= now);
		} else if (filter === "past") {
			result = result.filter((event) => new Date(event.event_date) < now);
		}

		// Apply search
		if (search) {
			const searchLower = search.toLowerCase();
			result = result.filter(
				(event) =>
					event.event_title.toLowerCase().includes(searchLower) ||
					event.notes?.toLowerCase().includes(searchLower) ||
					// Search by application name if the event is linked to an application
					(event.application &&
						applications.some(
							(app) =>
								app.id === event.application &&
								app.program_name.toLowerCase().includes(searchLower)
						))
			);
		}

		// Sort by date (upcoming first, then most recent past)
		result.sort((a, b) => {
			const dateA = new Date(a.event_date);
			const dateB = new Date(b.event_date);

			// If one is upcoming and one is past
			const aIsUpcoming = dateA >= now;
			const bIsUpcoming = dateB >= now;

			if (aIsUpcoming && !bIsUpcoming) return -1;
			if (!aIsUpcoming && bIsUpcoming) return 1;

			// Both upcoming: show closest first
			// Both past: show most recent first
			return aIsUpcoming
				? dateA.getTime() - dateB.getTime()
				: dateB.getTime() - dateA.getTime();
		});

		setFilteredEvents(result);
	}, [events, applications, filter, search]);

	// Find application details for an event
	const getApplicationDetails = (applicationId: number | null) => {
		if (!applicationId) return null;
		return applications.find((app) => app.id === applicationId);
	};

	// Format event date
	const formatEventDate = (dateStr: string): string => {
		try {
			const date = parseISO(dateStr);
			return format(date, "MMMM d, yyyy");
		} catch (error) {
			return "Invalid date";
		}
	};

	// Get color class for event
	const getEventColorClass = (color: string) => {
		switch (color) {
			case "danger":
				return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/30";
			case "success":
				return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/30";
			case "primary":
				return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30";
			case "warning":
				return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800/30";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600";
		}
	};

	// Handle event edit
	const handleEditEvent = (event: Events) => {
		setSelectedEvent(event);
		openModal();
	};

	// Handle event delete
	const handleDeleteEvent = async (id: number) => {
		if (window.confirm("Are you sure you want to delete this event?")) {
			await removeEvent(id);
			// Event will be automatically removed from the list when the context updates
		}
	};

	// Navigate to application detail
	const navigateToApplication = (
		applicationId: number | null,
		event: React.MouseEvent
	) => {
		event.stopPropagation(); // Prevent triggering the event edit
		if (applicationId) {
			navigate(`/applications/detail/${applicationId}`);
		}
	};

	// After closing the modal, always refresh to ensure we have latest data
	const handleCloseModal = () => {
		closeModal();
		// Force a refresh after editing or adding an event
		eventsLoadedRef.current = false;
		fetchEvents(true);
		setSelectedEvent(null);
	};

	// Render event card
	const renderEventCard = (event: Events) => {
		const application = getApplicationDetails(event.application);
		const isPast = isBefore(parseISO(event.event_date), new Date());

		return (
			<div
				key={event.id}
				className={`rounded-lg border p-4 mb-4 ${getEventColorClass(
					event.event_color
				)} cursor-pointer hover:shadow-md transition-shadow`}
				onClick={() => handleEditEvent(event)}
			>
				<div className="flex justify-between">
					<div>
						<h3 className="font-medium text-lg">{event.event_title}</h3>
						<p
							className={`text-sm mt-1 ${
								isPast ? "text-red-600 dark:text-red-400 font-medium" : ""
							}`}
						>
							Due: {formatEventDate(event.event_date)}
							{isPast && " (Past due)"}
						</p>

						{application && (
							<div
								className="mt-2 inline-flex items-center px-2 py-1 rounded-md bg-gray-200 text-gray-800 text-sm dark:bg-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
								onClick={(e) => navigateToApplication(event.application, e)}
							>
								<svg
									className="w-4 h-4 mr-1"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
									></path>
								</svg>
								{application.program_name}
							</div>
						)}

						{event.notes && (
							<p className="mt-2 text-sm opacity-90">{event.notes}</p>
						)}
					</div>

					<div className="flex gap-2">
						<button
							className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
							onClick={(e) => {
								e.stopPropagation();
								handleDeleteEvent(event.id);
							}}
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
								></path>
							</svg>
						</button>
					</div>
				</div>
			</div>
		);
	};

	return (
		<>
			<PageMeta
				title="All Events | School Tracker"
				description="View and manage all your events and deadlines"
			/>

			<div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
				<PageBreadcrumb pageTitle="All Events" />
				<div className="flex gap-2">
					<Button
						size="sm"
						variant="outline"
						onClick={() => navigate("/calendar")}
					>
						Calendar View
					</Button>
					<Button
						size="sm"
						onClick={() => {
							setSelectedEvent(null);
							openModal();
						}}
					>
						Add Event
					</Button>
				</div>
			</div>

			{/* Filters and Search */}
			<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div className="flex items-center gap-3">
						<span className="text-sm font-medium text-gray-600 dark:text-gray-300">
							Filter:
						</span>
						<div className="flex rounded-md overflow-hidden border border-gray-300 dark:border-gray-600">
							<button
								className={`px-3 py-1.5 text-sm ${
									filter === "all"
										? "bg-blue-500 text-white"
										: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
								}`}
								onClick={() => setFilter("all")}
							>
								All
							</button>
							<button
								className={`px-3 py-1.5 text-sm ${
									filter === "upcoming"
										? "bg-blue-500 text-white"
										: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
								}`}
								onClick={() => setFilter("upcoming")}
							>
								Upcoming
							</button>
							<button
								className={`px-3 py-1.5 text-sm ${
									filter === "past"
										? "bg-blue-500 text-white"
										: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
								}`}
								onClick={() => setFilter("past")}
							>
								Past
							</button>
						</div>
					</div>

					<div className="relative">
						<input
							type="text"
							placeholder="Search events..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="w-full md:w-72 pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<svg
							className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 dark:text-gray-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							></path>
						</svg>
					</div>
				</div>
			</div>

			{/* Events List */}
			<div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
				{isLoading ? (
					<div className="flex justify-center items-center py-8">
						<div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
					</div>
				) : filteredEvents.length > 0 ? (
					<>
						<h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
							{filteredEvents.length}{" "}
							{filteredEvents.length === 1 ? "Event" : "Events"}
						</h2>
						<div className="space-y-1">
							{filteredEvents.map(renderEventCard)}
						</div>
					</>
				) : (
					<div className="flex flex-col items-center justify-center py-10">
						<div className="bg-gray-100 dark:bg-gray-700 rounded-full p-4 mb-4">
							<svg
								className="w-8 h-8 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								></path>
							</svg>
						</div>
						<h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
							No events found
						</h3>
						<p className="text-gray-500 dark:text-gray-400 mb-4">
							{search
								? "Try a different search term"
								: filter !== "all"
								? "Try changing your filter"
								: "Add your first event to get started"}
						</p>
						<Button
							onClick={() => {
								setSelectedEvent(null);
								openModal();
							}}
						>
							Add New Event
						</Button>
					</div>
				)}
			</div>

			{/* Event Form Modal */}
			<EventFormModal
				isOpen={isOpen}
				onClose={handleCloseModal}
				selectedEvent={selectedEvent}
				selectedDate=""
			/>
		</>
	);
};

export default AllEvents;
