import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import { Events, EventRequest } from "../../types/events";
import { Application } from "../../types/applications";
import { useApplications } from "../../context/ApplicationContext";
import { useEvents } from "../../context/EventContext";
import Button from "../ui/button/Button";

interface EventFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	selectedEvent: Events | null;
	selectedDate?: string;
	initialApplicationId?: number | null;
}

const EventFormModal: React.FC<EventFormModalProps> = ({
	isOpen,
	onClose,
	selectedEvent,
	selectedDate,
	initialApplicationId = null,
}) => {
	const { applications } = useApplications();
	const { addEvent, updateEventById } = useEvents();

	const [eventTitle, setEventTitle] = useState("");
	const [eventDate, setEventDate] = useState("");
	const [eventColor, setEventColor] = useState("primary");
	const [eventNotes, setEventNotes] = useState("");
	const [applicationId, setApplicationId] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const calendarsEvents = {
		danger: "danger",
		success: "success",
		primary: "primary",
		warning: "warning",
	};

	// Reset form fields when the modal opens/closes or when selected event changes
	useEffect(() => {
		if (isOpen) {
			if (selectedEvent) {
				setEventTitle(selectedEvent.event_title);
				setEventDate(selectedEvent.event_date);
				setEventColor(selectedEvent.event_color);
				setEventNotes(selectedEvent.notes || "");
				setApplicationId(
					selectedEvent.application ? String(selectedEvent.application) : ""
				);
			} else {
				// For new event
				setEventTitle("");
				setEventDate(selectedDate || "");
				setEventColor("primary");
				setEventNotes("");
				// If initialApplicationId is provided, set it
				setApplicationId(
					initialApplicationId ? String(initialApplicationId) : ""
				);
			}
		}
	}, [isOpen, selectedEvent, selectedDate, initialApplicationId]);

	const handleAddOrUpdateEvent = async () => {
		if (!eventTitle || !eventDate) {
			alert("Please fill in the required fields");
			return;
		}

		setIsSubmitting(true);

		try {
			if (selectedEvent) {
				// Update existing event
				await updateEventById(selectedEvent.id, {
					event_title: eventTitle,
					event_date: eventDate,
					event_color: eventColor,
					notes: eventNotes,
					application: applicationId ? Number(applicationId) : null,
				});
			} else {
				// Add new event
				const newEvent: EventRequest = {
					application: applicationId ? Number(applicationId) : null,
					event_title: eventTitle,
					event_color: eventColor,
					event_date: eventDate,
					notes: eventNotes,
				};
				await addEvent(newEvent);
			}

			onClose();
		} catch (error) {
			console.error("Error saving event:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} className="w-[700px]">
			<div className="flex flex-col h-[85vh] bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
				{/* Fixed Header */}
				<div className="w-full flex-shrink-0 border-b border-gray-200 px-8 pt-6 pb-4 dark:border-gray-700">
					<h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
						{selectedEvent ? "Edit Event" : "Add Event"}
					</h4>
					<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
						Plan your next big moment: schedule or edit an event to stay on
						track
					</p>
				</div>

				{/* Scrollable Content */}
				<div className="flex-1 overflow-y-auto min-h-0">
					<div className="w-full px-8 py-4">
						<div className="mb-6">
							<label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
								Event Title
							</label>
							<input
								id="event-title"
								type="text"
								value={eventTitle}
								onChange={(e) => setEventTitle(e.target.value)}
								className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
								required
							/>
						</div>

						<div className="mb-6">
							<label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
								Associated Application
							</label>
							<select
								className="block w-full h-11 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
								value={applicationId}
								onChange={(e) => setApplicationId(e.target.value)}
							>
								<option value="">None</option>
								{applications.map((app: Application) => (
									<option key={app.id} value={app.id}>
										{app.program_name} at{" "}
										{app.institution_name ||
											app.institution_details?.name ||
											app.institution}
									</option>
								))}
							</select>
						</div>

						<div className="mb-6">
							<label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
								Event Date
							</label>
							<input
								id="event-date"
								type="date"
								value={eventDate}
								onChange={(e) => setEventDate(e.target.value)}
								className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
								required
							/>
						</div>

						<div className="mb-6">
							<label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
								Notes
							</label>
							<input
								id="notes"
								type="text"
								value={eventNotes}
								onChange={(e) => setEventNotes(e.target.value)}
								className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
							/>
						</div>

						<div className="mb-6">
							<label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
								Event Color
							</label>
							<div className="flex flex-wrap items-center gap-4 sm:gap-5">
								{Object.entries(calendarsEvents).map(([key, value]) => (
									<div key={key} className="n-chk">
										<div
											className={`form-check form-check-${value} form-check-inline`}
										>
											<label
												className="flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400"
												htmlFor={`modal${key}`}
											>
												<span className="relative">
													<input
														className="sr-only form-check-input"
														type="radio"
														name="event-color"
														value={key}
														id={`modal${key}`}
														checked={eventColor === key}
														onChange={() => setEventColor(key)}
													/>
													<span className="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700">
														<span
															className={`h-2 w-2 rounded-full bg-white ${
																eventColor === key ? "block" : "hidden"
															}`}
														></span>
													</span>
												</span>
												{key}
											</label>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Fixed Footer */}
				<div className="w-full flex-shrink-0 flex items-center justify-between border-t border-gray-200 px-8 py-4 bg-white dark:bg-gray-900 dark:border-gray-700">
					<div></div>
					<div className="flex items-center gap-3">
						<Button
							size="sm"
							variant="outline"
							onClick={onClose}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button
							size="sm"
							onClick={handleAddOrUpdateEvent}
							disabled={isSubmitting}
						>
							{isSubmitting
								? "Saving..."
								: selectedEvent
								? "Update Event"
								: "Add Event"}
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default EventFormModal;
