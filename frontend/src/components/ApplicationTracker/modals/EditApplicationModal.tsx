import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import { useState, useEffect } from "react";
import { Application } from "../../../types/applications";
import { formatDateForInput } from "../../../utils/dateUtils";
import { getInstitutionsForSelect } from "../../../api/institutions";
import { Modal } from "../../ui/modal";

interface Institution {
	id: string;
	name: string;
	country: string;
}

interface EditApplicationModalProps {
	isOpen: boolean;
	data: Application;
	onSave: (data: Application) => void;
	onClose: () => void;
	isLoading?: boolean;
}

export default function EditApplicationModal({
	isOpen,
	data,
	onSave,
	onClose,
	isLoading = false,
}: EditApplicationModalProps) {
	const [formData, setData] = useState({
		id: data?.id || 0,
		institution: data?.institution || "",
		institution_id: data?.institution_id || data?.institution || "",
		institution_name: data?.institution_name || "",
		institution_country: data?.institution_country || "",
		institution_details: data?.institution_details || null,
		program_name: data?.program_name || "",
		degree_type: data?.degree_type || "Master",
		department: data?.department || "",
		duration_years: data?.duration_years || "",
		tuition_fee: data?.tuition_fee || "",
		application_link: data?.application_link || "",
		scholarship_link: data?.scholarship_link || "",
		program_info_link: data?.program_info_link || "",
		status: data?.status || "Draft",
		start_date: formatDateForInput(data?.start_date) as string | null,
		submitted_date: formatDateForInput(data?.submitted_date) as string | null,
		decision_date: formatDateForInput(data?.decision_date) as string | null,
		notes: data?.notes || "",
		created_at: data?.created_at || "",
		updated_at: data?.updated_at || "",
		user: data?.user || undefined,
	});

	const initialSearchTerm =
		data?.institution_name || (data?.institution_details?.name ?? "") || "";
	const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
	const [institutions, setInstitutions] = useState<Institution[]>([]);
	const [filteredInstitutions, setFilteredInstitutions] = useState<
		Institution[]
	>([]);
	const [showDropdown, setShowDropdown] = useState(false);
	const [isLoadingInstitutions, setIsLoadingInstitutions] = useState(false);

	useEffect(() => {
		const fetchInstitutions = async () => {
			setIsLoadingInstitutions(true);
			try {
				const institutionsList = await getInstitutionsForSelect();
				setInstitutions(institutionsList);

				let institutionIdToLookFor = data?.institution_id || data?.institution;
				let selectedInstitution = null;

				if (institutionIdToLookFor) {
					selectedInstitution = institutionsList.find(
						(inst) => inst.id === institutionIdToLookFor
					);
				}

				if (!selectedInstitution && data?.institution_details?.name) {
					selectedInstitution = institutionsList.find(
						(inst) => inst.name === data.institution_details?.name
					);
				}

				if (selectedInstitution) {
					setSearchTerm(selectedInstitution.name);

					setData((prev) => ({
						...prev,
						institution_id: selectedInstitution.id,
						institution: selectedInstitution.id,
						institution_name: selectedInstitution.name,
						institution_country: selectedInstitution.country,
					}));
				} else if (data?.institution_details) {
					const institutionName = data.institution_details?.name || "";
					const institutionCountry = data.institution_details?.country || "";

					setSearchTerm(institutionName);
					setData((prev) => ({
						...prev,
						institution_name: institutionName,
						institution_country: institutionCountry,
					}));
				}
			} catch (error) {
			} finally {
				setIsLoadingInstitutions(false);
			}
		};

		fetchInstitutions();
	}, [data?.institution_id, data?.institution, data?.institution_details]);

	useEffect(() => {
		if (data) {
			setData({
				id: data.id || 0,
				institution: data.institution || "",
				institution_id: data.institution_id || data.institution || "",
				institution_name:
					data.institution_name || (data.institution_details?.name ?? "") || "",
				institution_country:
					data.institution_country ||
					(data.institution_details?.country ?? "") ||
					"",
				institution_details: data.institution_details || null,
				program_name: data.program_name || "",
				degree_type: data.degree_type || "Master",
				department: data.department || "",
				duration_years: data.duration_years || "",
				tuition_fee: data.tuition_fee || "",
				application_link: data.application_link || "",
				scholarship_link: data.scholarship_link || "",
				program_info_link: data.program_info_link || "",
				status: data.status || "Draft",
				start_date: formatDateForInput(data.start_date),
				submitted_date: formatDateForInput(data.submitted_date),
				decision_date: formatDateForInput(data.decision_date),
				notes: data.notes || "",
				created_at: data.created_at || "",
				updated_at: data.updated_at || "",
				user: data.user || undefined,
			});

			const newSearchTerm =
				data.institution_name || (data.institution_details?.name ?? "") || "";
			if (newSearchTerm) {
				setSearchTerm(newSearchTerm);
			}
		}
	}, [data]);

	useEffect(() => {
		if (!searchTerm) {
			setFilteredInstitutions(institutions.slice(0, 100));
		} else {
			const filtered = institutions.filter((inst) =>
				inst.name.toLowerCase().includes(searchTerm.toLowerCase())
			);
			setFilteredInstitutions(filtered.slice(0, 100));
		}
	}, [searchTerm, institutions]);

	const changeForm = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;
		setData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleInstitutionSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
		setShowDropdown(true);

		if (e.target.value === "") {
			setData((prevState) => ({
				...prevState,
				institution_id: "" as any,
				institution: "",
				institution_name: "",
				institution_country: "",
			}));
		}
	};

	const selectInstitution = (institution: Institution) => {
		setData((prevState) => ({
			...prevState,
			institution_id: institution.id,
			institution: institution.id,
			institution_name: institution.name,
			institution_country: institution.country,
		}));

		setSearchTerm(institution.name);
		setShowDropdown(false);
	};

	const clearInstitutionSelection = () => {
		setSearchTerm("");
		setData((prevState) => ({
			...prevState,
			institution_id: "" as any,
			institution: "",
			institution_name: "",
			institution_country: "",
		}));
	};

	const submitForm = (e: React.FormEvent) => {
		e.preventDefault();

		const processedFormData = { ...formData };
		const dateFields = ["start_date", "submitted_date", "decision_date"];

		dateFields.forEach((field) => {
			if (processedFormData[field as keyof typeof processedFormData] === "") {
				(processedFormData as any)[field] = null;
			}
		});

		const updatedApplication: Application = {
			...(data as Application),
			...processedFormData,
			institution_details:
				processedFormData.institution_details ||
				data?.institution_details ||
				null,
			updated_at: new Date().toISOString(),
			user:
				processedFormData.user === null ? undefined : processedFormData.user,
		};

		onSave(updatedApplication);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			className="max-w-[1000px] w-full m-4"
		>
			<div className="w-full rounded-xl bg-white dark:bg-gray-900 flex flex-col">
				<div className="border-b border-gray-200 px-8 pt-6 pb-4 dark:border-gray-700">
					<h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
						Edit Application
					</h4>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Update your application details
					</p>
					{isLoading && (
						<div className="mt-2 text-sm text-brand-600 dark:text-brand-400 flex items-center">
							<svg
								className="animate-spin -ml-1 mr-2 h-4 w-4 text-brand-600 dark:text-brand-400"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Loading complete application details...
						</div>
					)}
				</div>

				<form onSubmit={submitForm} className="flex flex-col flex-grow">
					<div
						className={`flex-grow px-8 py-6 ${isLoading ? "opacity-70" : ""}`}
					>
						<div className="space-y-8">
							{/* Program Information Section */}
							<div>
								<h5 className="text-lg font-medium text-gray-700 dark:text-white/80 mb-6">
									Program Information
								</h5>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="md:col-span-2 relative">
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

										{formData.institution_id && (
											<div className="mt-2 rounded-md bg-blue-50 p-2 dark:bg-blue-900/20">
												<div className="flex justify-between items-start">
													<div>
														<p className="text-sm font-medium text-gray-900 dark:text-white">
															{formData.institution_name || searchTerm}
														</p>
														<p className="text-xs text-gray-500 dark:text-gray-400">
															{formData.institution_country}
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
																d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
																clipRule="evenodd"
															/>
														</svg>
													</button>
												</div>
											</div>
										)}

										{!formData.institution_id && !isLoadingInstitutions && (
											<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
												Search and select an institution from the database
											</p>
										)}
									</div>
									<div>
										<Label htmlFor="program_name" className="text-sm">
											Program Name
										</Label>
										<Input
											id="program_name"
											name="program_name"
											placeholder="e.g. Computer Science"
											value={formData.program_name}
											onChange={changeForm}
											className="mt-1.5"
										/>
									</div>
									<div>
										<Label htmlFor="degree_type" className="text-sm">
											Degree Type
										</Label>
										<select
											className="mt-1.5 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm shadow-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
											id="degree_type"
											name="degree_type"
											value={formData.degree_type}
											onChange={changeForm}
										>
											<option value="Associate">Associate</option>
											<option value="Bachelor">Bachelor</option>
											<option value="Master">Master</option>
											<option value="PhD">PhD</option>
											<option value="Certificate">Certificate</option>
											<option value="Diploma">Diploma</option>
											<option value="Other">Other</option>
										</select>
									</div>
									<div>
										<Label htmlFor="department" className="text-sm">
											Department
										</Label>
										<Input
											id="department"
											name="department"
											placeholder="e.g. School of Engineering"
											value={formData.department}
											onChange={changeForm}
											className="mt-1.5"
										/>
									</div>
									<div>
										<Label htmlFor="duration_years" className="text-sm">
											Duration (Years)
										</Label>
										<Input
											id="duration_years"
											name="duration_years"
											placeholder="e.g. 2"
											value={formData.duration_years}
											onChange={changeForm}
											className="mt-1.5"
										/>
									</div>
									<div>
										<Label htmlFor="tuition_fee" className="text-sm">
											Tuition Fee
										</Label>
										<Input
											id="tuition_fee"
											name="tuition_fee"
											placeholder="e.g. 50000"
											value={formData.tuition_fee}
											onChange={changeForm}
											className="mt-1.5"
										/>
									</div>
								</div>
							</div>

							{/* Links & Resources Section */}
							<div>
								<h5 className="text-lg font-medium text-gray-700 dark:text-white/80 mb-6">
									Links & Resources
								</h5>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<Label htmlFor="application_link" className="text-sm">
											Application Link
										</Label>
										<Input
											id="application_link"
											name="application_link"
											placeholder="https://..."
											value={formData.application_link}
											onChange={changeForm}
											className="mt-1.5"
										/>
									</div>
									<div>
										<Label htmlFor="scholarship_link" className="text-sm">
											Scholarship Link
										</Label>
										<Input
											id="scholarship_link"
											name="scholarship_link"
											placeholder="https://..."
											value={formData.scholarship_link}
											onChange={changeForm}
											className="mt-1.5"
										/>
									</div>
									<div>
										<Label htmlFor="program_info_link" className="text-sm">
											Program Info Link
										</Label>
										<Input
											id="program_info_link"
											name="program_info_link"
											placeholder="https://..."
											value={formData.program_info_link}
											onChange={changeForm}
											className="mt-1.5"
										/>
									</div>
								</div>
							</div>

							{/* Status & Dates Section */}
							<div>
								<h5 className="text-lg font-medium text-gray-700 dark:text-white/80 mb-6">
									Status & Dates
								</h5>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<Label htmlFor="status" className="text-sm">
											Status
										</Label>
										<select
											className="mt-1.5 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm shadow-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
											id="status"
											name="status"
											value={formData.status}
											onChange={changeForm}
										>
											<option value="Draft">Draft</option>
											<option value="In Progress">In Progress</option>
											<option value="Pending">Pending</option>
											<option value="Accepted">Accepted</option>
											<option value="Rejected">Rejected</option>
											<option value="Deferred">Deferred</option>
											<option value="Withdrawn">Withdrawn</option>
										</select>
									</div>
									<div>
										<Label htmlFor="start_date" className="text-sm">
											Program Start Date
										</Label>
										<Input
											type="date"
											id="start_date"
											name="start_date"
											value={formData.start_date || ""}
											onChange={changeForm}
											className="mt-1.5"
										/>
									</div>
									<div>
										<Label htmlFor="submitted_date" className="text-sm">
											Application Submit Date
										</Label>
										<Input
											type="date"
											id="submitted_date"
											name="submitted_date"
											value={formData.submitted_date || ""}
											onChange={changeForm}
											className="mt-1.5"
										/>
									</div>
									<div>
										<Label htmlFor="decision_date" className="text-sm">
											Decision Date
										</Label>
										<Input
											type="date"
											id="decision_date"
											name="decision_date"
											value={formData.decision_date || ""}
											onChange={changeForm}
											className="mt-1.5"
										/>
									</div>
								</div>
							</div>

							{/* Additional Information Section */}
							<div>
								<h5 className="text-lg font-medium text-gray-700 dark:text-white/80 mb-6">
									Additional Information
								</h5>
								<div>
									<Label htmlFor="notes" className="text-sm">
										Notes
									</Label>
									<textarea
										id="notes"
										name="notes"
										rows={4}
										className="mt-1.5 w-full min-h-[120px] rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
										placeholder="Additional notes about your application..."
										value={formData.notes}
										onChange={changeForm}
									></textarea>
								</div>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-3 border-t border-gray-200 px-8 py-4 dark:border-gray-700 justify-end">
						<Button
							size="sm"
							variant="outline"
							onClick={onClose}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button size="sm" type="submit" disabled={isLoading}>
							{isLoading ? "Loading..." : "Save Changes"}
						</Button>
					</div>
				</form>
			</div>
		</Modal>
	);
}
