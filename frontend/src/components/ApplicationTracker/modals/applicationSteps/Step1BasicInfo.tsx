import { useState, useEffect } from "react";
import { Application } from "../../../../types/applications";
import FormField from "../../../ui/form/FormField";

interface Institution {
	id: string;
	name: string;
	country: string;
}

interface Step1Props {
	data: Partial<Application>;
	updateData: (data: Partial<Application>) => void;
	institutions?: Institution[];
	isLoadingInstitutions?: boolean;
	handleChange?: (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => void;
}

export default function Step1BasicInfo({
	data,
	updateData,
	institutions = [],
	isLoadingInstitutions = false,
}: Step1Props) {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredInstitutions, setFilteredInstitutions] = useState<
		Institution[]
	>([]);
	const [showDropdown, setShowDropdown] = useState(false);

	// Initialize search term with institution name if editing
	useEffect(() => {
		if (data.institution && !searchTerm) {
			setSearchTerm(data.institution);
		}
	}, [data.institution]);

	// Filter institutions based on search term
	useEffect(() => {
		if (!searchTerm) {
			setFilteredInstitutions(institutions.slice(0, 100)); // Show first 100 by default
		} else {
			const filtered = institutions.filter((inst) =>
				inst.name.toLowerCase().includes(searchTerm.toLowerCase())
			);
			setFilteredInstitutions(filtered.slice(0, 100)); // Limit results
		}
	}, [searchTerm, institutions]);

	const handleInstitutionSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
		setShowDropdown(true);

		// Clear institution ID when user types to search
		if (data.institution_id) {
			updateData({
				institution_id: undefined,
				institution: undefined, // Also clear the institution field
			});
		}
	};

	const selectInstitution = (institution: Institution) => {
		console.log("Selected institution:", institution);

		// Important: Set both institution_id (for local use) and institution (for API)
		// The API expects the institution ID in the 'institution' field
		updateData({
			institution_id: institution.id,
			institution: institution.id, // Set the institution field to the ID for API
			institution_name: institution.name, // Store the name separately for display
			institution_country: institution.country,
		});

		setSearchTerm(institution.name);
		setShowDropdown(false);
	};

	// Clear all institution data
	const clearInstitutionSelection = () => {
		setSearchTerm("");
		updateData({
			institution_id: undefined,
			institution: undefined, // Clear the institution field too
			institution_name: "",
			institution_country: "",
		});
	};

	return (
		<div className="space-y-6">
			<div className="mb-6">
				<h2 className="text-lg font-medium text-gray-900 dark:text-white">
					Basic Information
				</h2>
				<p className="text-sm text-gray-500 dark:text-gray-400">
					Fill in the basic details about your application
				</p>
			</div>

			{/* Institution Search Field */}
			<div className="relative">
				<label
					htmlFor="institution_search"
					className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
				>
					Institution*
				</label>
				{isLoadingInstitutions ? (
					<div className="flex items-center space-x-2 h-10 mt-1">
						<div className="w-5 h-5 border-2 border-t-2 border-gray-300 border-t-brand-600 rounded-full animate-spin"></div>
						<span className="text-sm text-gray-500">
							Loading institutions...
						</span>
					</div>
				) : (
					<>
						<div className="relative">
							<input
								type="text"
								id="institution_search"
								name="institution_search"
								value={searchTerm}
								onChange={handleInstitutionSearch}
								onFocus={() => setShowDropdown(true)}
								placeholder="Search for an institution..."
								className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
								required
							/>
							{searchTerm && (
								<button
									type="button"
									onClick={clearInstitutionSelection}
									className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
											clipRule="evenodd"
										/>
									</svg>
								</button>
							)}
						</div>

						{/* Institution Dropdown */}
						{showDropdown && (
							<div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white py-1 shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
								{filteredInstitutions.length > 0 ? (
									filteredInstitutions.map((institution) => (
										<div
											key={institution.id}
											className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex flex-col"
											onClick={() => selectInstitution(institution)}
										>
											<span className="font-medium text-gray-900 dark:text-white">
												{institution.name}
											</span>
											<span className="text-xs text-gray-500 dark:text-gray-400">
												{institution.country}
											</span>
										</div>
									))
								) : (
									<div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
										{searchTerm
											? "No institutions found"
											: "Type to search for institutions"}
									</div>
								)}
							</div>
						)}
					</>
				)}

				{/* Selected Institution Info - Display ID for debugging too */}
				{data.institution_id && (
					<div className="mt-2 rounded-md bg-blue-50 p-2 dark:bg-blue-900/20">
						<div className="flex justify-between items-start">
							<div>
								<p className="text-sm font-medium text-gray-900 dark:text-white">
									{data.institution_name || searchTerm}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									{data.institution_country}
								</p>
							</div>
							<button
								type="button"
								onClick={clearInstitutionSelection}
								className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</button>
						</div>
					</div>
				)}

				{!data.institution_id && !isLoadingInstitutions && (
					<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
						Search and select an institution from the database
					</p>
				)}
			</div>

			{/* Other fields */}
			<FormField
				label="Program Name*"
				name="program_name"
				type="text"
				value={data.program_name || ""}
				onChange={(e) => updateData({ program_name: e.target.value })}
				required
				placeholder="e.g., Computer Science, MBA, etc."
			/>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<FormField
					label="Degree Type"
					name="degree_type"
					type="select"
					value={data.degree_type || "Master"}
					onChange={(e) => updateData({ degree_type: e.target.value })}
					options={[
						{ value: "Associate", label: "Associate" },
						{ value: "Bachelor", label: "Bachelor" },
						{ value: "Master", label: "Master" },
						{ value: "PhD", label: "PhD" },
						{ value: "Certificate", label: "Certificate" },
						{ value: "Diploma", label: "Diploma" },
						{ value: "Other", label: "Other" },
					]}
				/>

				<FormField
					label="Department"
					name="department"
					type="text"
					value={data.department || ""}
					onChange={(e) => updateData({ department: e.target.value })}
					placeholder="e.g., Computer Science, Business School, etc."
				/>
			</div>
		</div>
	);
}
