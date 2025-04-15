import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Fixed import
import { useEvents } from "../../context/EventContext";
import { Events } from "../../interfaces/events";
import { BsBellFill } from "react-icons/bs";
import { IoCalendarOutline } from "react-icons/io5";
import {
	format,
	isSameDay,
	formatDistanceToNow,
	parseISO,
	isBefore,
} from "date-fns";
import { Dropdown } from "../ui/dropdown/Dropdown";

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
		if (
			!isDropdownOpen &&
			events.length === 0 &&
			!fetchedRef.current &&
			!isLoading
		) {
			fetchEvents();
		}
	};

	const closeDropdown = () => {
		setIsDropdownOpen(false);
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
				className="flex items-center text-gray-700 dark:text-gray-400"
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

			<Dropdown
				isOpen={isDropdownOpen}
				onClose={closeDropdown}
				className="absolute z-50 mt-[17px] flex w-[300px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:right-0 right-[-220px]"
			>
				<div>
					<span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
						Notifications
					</span>
					<span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
						{recentEvents.length > 0
							? `${recentEvents.length} recent event${
									recentEvents.length > 1 ? "s" : ""
							  }`
							: "No recent events"}
					</span>
				</div>

				<div className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
					<div className="max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar">
						{isLoading ? (
							<div className="flex justify-center py-4">
								<div className="animate-spin h-6 w-6 border-2 border-t-transparent border-blue-500 rounded-full"></div>
							</div>
						) : recentEvents.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-4">
								<div className="mb-3 rounded-full bg-gray-100 p-3 dark:bg-gray-700">
									<IoCalendarOutline
										size={20}
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
									<li key={event.id}>
										<Link
											to={
												event.application
													? `/applications/detail/${event.application}`
													: "/calendar"
											}
											onClick={() => setIsDropdownOpen(false)}
											className="flex items-start gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
										>
											<div
												className={`mt-1 h-2 w-2 rounded-full ${getEventBadgeColor(
													event.event_color
												)}`}
											></div>
											<div className="flex-1">
												<h6 className="font-medium text-gray-900 dark:text-white">
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
							</ul>
						)}
					</div>
				</div>
				<button
					onClick={handleViewAllClick}
					className="flex items-center justify-center gap-2 px-4 py-2 mt-4 font-medium text-gray-500 border border-gray-500 rounded-lg shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:text-gray-400 dark:border-gray-400 dark:hover:bg-gray-600/10 dark:focus:ring-gray-500"
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="fill-gray-500 dark:fill-gray-400"
					>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M16 4H8C6.89543 4 6 4.89543 6 6V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V6C18 4.89543 17.1046 4 16 4ZM8 2C5.79086 2 4 3.79086 4 6V18C4 20.2091 5.79086 22 8 22H16C18.2091 22 20 20.2091 20 18V6C20 3.79086 18.2091 2 16 2H8Z"
						/>
						<path d="M8 7C8 6.44772 8.44772 6 9 6H15C15.5523 6 16 6.44772 16 7C16 7.55228 15.5523 8 15 8H9C8.44772 8 8 7.55228 8 7Z" />
						<path d="M9 10C8.44772 10 8 10.4477 8 11C8 11.5523 8.44772 12 9 12H15C15.5523 12 16 11.5523 16 11C16 10.4477 15.5523 10 15 10H9Z" />
						<path d="M9 14C8.44772 14 8 14.4477 8 15C8 15.5523 8.44772 16 9 16H13C13.5523 16 14 15.5523 14 15C14 14.4477 13.5523 14 13 14H9Z" />
					</svg>
					View All Events
				</button>
			</Dropdown>
		</div>
	);
};

export default NotificationDropdown;
