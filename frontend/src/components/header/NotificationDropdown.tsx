import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useEvents } from "../../context/EventContext";
import { Events } from "../../types/events";
import { BsBellFill } from "react-icons/bs";
import { IoCalendarOutline } from "react-icons/io5";
import {
	format,
	isSameDay,
	formatDistanceToNow,
	parseISO,
	isBefore,
} from "date-fns";

const NotificationDropdown: React.FC = () => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const { events, fetchEvents, isLoading } = useEvents();
	const navigate = useNavigate();
	const fetchedRef = useRef(false);

	// Get only the last 3 events, sorted by event_date (closest upcoming first, then most recent past)
	const recentEvents = [...events]
		.sort((a, b) => {
			const dateA = new Date(a.event_date);
			const dateB = new Date(b.event_date);
			const now = new Date();

			// If one date is in the future and one is in the past, prioritize future dates
			const aIsFuture = dateA >= now;
			const bIsFuture = dateB >= now;

			if (aIsFuture && !bIsFuture) return -1;
			if (!aIsFuture && bIsFuture) return 1;

			// Otherwise sort chronologically (ascending for future dates, descending for past dates)
			return aIsFuture
				? dateA.getTime() - dateB.getTime() // Sort upcoming events by closest first
				: dateB.getTime() - dateA.getTime(); // Sort past events by most recent first
		})
		.slice(0, 3);

	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen);

		// Only fetch events when opening the dropdown if we haven't already
		// This reduces API calls while ensuring fresh data when user checks notifications
		if (
			!isDropdownOpen &&
			events.length === 0 &&
			!fetchedRef.current &&
			!isLoading
		) {
			fetchEvents();
		}
	};

	// Handle clicks outside the dropdown to close it
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		};

		// Attach the event listener
		document.addEventListener("mousedown", handleClickOutside);

		// Clean up
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Ensure we fetch events when needed
	useEffect(() => {
		// Always fetch events on first mount to ensure notifications are up-to-date
		if (!fetchedRef.current && !isLoading) {
			fetchedRef.current = true;
			fetchEvents(false); // Use false to allow caching if available
		}

		return () => {
			fetchedRef.current = false;
		};
	}, [fetchEvents, isLoading]);

	// Get notification badge color based on event color
	const getEventBadgeColor = (color: string) => {
		const colorMap: Record<string, string> = {
			primary: "bg-blue-500",
			danger: "bg-red-500",
			warning: "bg-yellow-500",
			success: "bg-green-500",
		};

		return colorMap[color] || "bg-gray-500";
	};

	// Format event date for display
	const formatEventDate = (dateStr: string): string => {
		try {
			const date = parseISO(dateStr);
			const now = new Date();

			if (isSameDay(date, now)) {
				return "Today";
			}

			// Format upcoming/past dates differently
			return isBefore(date, now)
				? `${formatDistanceToNow(date)} ago`
				: format(date, "MMM d, yyyy");
		} catch (error) {
			return "Invalid date";
		}
	};

	// Handle click on View All Notifications
	const handleViewAllClick = () => {
		navigate("/events");
		setIsDropdownOpen(false);
	};

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={toggleDropdown}
				className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-lg dark:hover:bg-gray-800"
			>
				<span className="relative">
					<BsBellFill className="text-gray-500 dark:text-gray-400" size={24} />
					{recentEvents.length > 0 && (
						<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
							{recentEvents.length}
						</span>
					)}
				</span>
			</button>

			{isDropdownOpen && (
				<div className="absolute right-0 mt-2 w-80 origin-top-right rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 z-50">
					<div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">
						<h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
							Notifications
						</h5>
					</div>

					<div className="max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
						{isLoading ? (
							<div className="flex justify-center py-8">
								<div className="animate-spin h-6 w-6 border-2 border-t-transparent border-blue-500 rounded-full"></div>
							</div>
						) : recentEvents.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-8 px-5">
								<div className="mb-3 rounded-full bg-gray-100 p-3 dark:bg-gray-700">
									<IoCalendarOutline
										size={24}
										className="text-gray-500 dark:text-gray-400"
									/>
								</div>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									No upcoming events
								</p>
							</div>
						) : (
							<ul>
								{recentEvents.map((event: Events) => (
									<li
										key={event.id}
										className="border-b border-gray-200 dark:border-gray-700 last:border-0"
									>
										<Link
											to={
												event.application
													? `/applications/detail/${event.application}`
													: "/calendar"
											}
											onClick={() => setIsDropdownOpen(false)}
											className="flex items-start gap-4 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30"
										>
											<div
												className={`mt-1 h-2 w-2 rounded-full ${getEventBadgeColor(
													event.event_color
												)}`}
											></div>
											<div className="flex-1">
												<h6 className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
													{event.event_title}
												</h6>
												<p className="text-xs text-gray-500 dark:text-gray-400">
													<span className="font-medium">Due: </span>
													<span
														className={
															isBefore(parseISO(event.event_date), new Date())
																? "text-red-500 dark:text-red-400"
																: ""
														}
													>
														{formatEventDate(event.event_date)}
													</span>
												</p>
												{event.notes && (
													<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
														{event.notes.length > 50
															? `${event.notes.substring(0, 50)}...`
															: event.notes}
													</p>
												)}
											</div>
										</Link>
									</li>
								))}
								<li className="px-5 py-3">
									<button
										onClick={handleViewAllClick}
										className="block w-full rounded-lg bg-gray-50 px-4 py-2 text-center text-xs font-medium text-gray-700 hover:bg-gray-100 dark:bg-gray-700/50 dark:text-gray-200 dark:hover:bg-gray-700"
									>
										View All Events
									</button>
								</li>
							</ul>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default NotificationDropdown;
