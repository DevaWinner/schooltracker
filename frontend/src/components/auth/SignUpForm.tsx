import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { signUp } from "../../api/auth";
import { SignUpRequest } from "../../interfaces/auth";
import { countries } from "../../utils/countries";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";

// Create icons for form fields
const UserIcon = () => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 20 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M16.6667 17.5V15.8333C16.6667 14.9493 16.3155 14.1014 15.6904 13.4763C15.0653 12.8512 14.2174 12.5 13.3334 12.5H6.66671C5.78265 12.5 4.93481 12.8512 4.30968 13.4763C3.68456 14.1014 3.33337 14.9493 3.33337 15.8333V17.5M13.3334 5.83333C13.3334 7.67428 11.841 9.16667 10 9.16667C8.15909 9.16667 6.66671 7.67428 6.66671 5.83333C6.66671 3.99238 8.15909 2.5 10 2.5C11.841 2.5 13.3334 3.99238 13.3334 5.83333Z"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const EmailIcon = () => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 20 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M18.3333 5C18.3333 4.08334 17.5833 3.33334 16.6667 3.33334H3.33333C2.41667 3.33334 1.66667 4.08334 1.66667 5M18.3333 5V15C18.3333 15.9167 17.5833 16.6667 16.6667 16.6667H3.33333C2.41667 16.6667 1.66667 15.9167 1.66667 15V5M18.3333 5L10 10.8333L1.66667 5"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const LockIcon = () => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 20 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M5.83333 9.16666V5.83332C5.83333 3.53214 7.69881 1.66666 10 1.66666C12.3012 1.66666 14.1667 3.53214 14.1667 5.83332V9.16666M5.83333 9.16666H14.1667M5.83333 9.16666H4.16667C3.24619 9.16666 2.5 9.91285 2.5 10.8333V16.6667C2.5 17.5871 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6667V10.8333C17.5 9.91285 16.7538 9.16666 15.8333 9.16666H14.1667"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const CalendarIcon = () => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 20 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M13.3333 1.66666V4.99999M6.66667 1.66666V4.99999M2.5 8.33332H17.5M4.16667 3.33332H15.8333C16.7538 3.33332 17.5 4.07952 17.5 4.99999V16.6667C17.5 17.5871 16.7538 18.3333 15.8333 18.3333H4.16667C3.24619 18.3333 2.5 17.5871 2.5 16.6667V4.99999C2.5 4.07952 3.24619 3.33332 4.16667 3.33332Z"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const GenderIcon = () => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 20 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M14.1667 3.33334H5.83334C4.91287 3.33334 4.16667 4.07954 4.16667 5.00001V15C4.16667 15.9205 4.91287 16.6667 5.83334 16.6667H14.1667C15.0872 16.6667 15.8333 15.9205 15.8333 15V5.00001C15.8333 4.07954 15.0872 3.33334 14.1667 3.33334Z"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M7.5 7.5H12.5"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M7.5 10.8333H12.5"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M7.5 14.1667H10"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const WorldIcon = () => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 20 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M1.66667 10H18.3333"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M10 1.66667C12.0844 3.94863 13.269 6.91003 13.3333 10C13.269 13.09 12.0844 16.0514 10 18.3333C7.9156 16.0514 6.73104 13.09 6.66667 10C6.73104 6.91003 7.9156 3.94863 10 1.66667Z"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export default function SignUpForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [isChecked, setIsChecked] = useState(false);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [phone, setPhone] = useState<string>("");
	const [dateOfBirth, setDateOfBirth] = useState("");
	const [gender, setGender] = useState("");
	const [country, setCountry] = useState("");

	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleDateChange = (date: Date | null) => {
		setDateOfBirth(date ? date.toISOString().split("T")[0] : "");
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!isChecked) {
			toast.warn("Please agree to the Terms and Conditions");
			return;
		}

		setIsLoading(true);
		const payload: SignUpRequest = {
			email: email.toLowerCase(),
			password,
			first_name: firstName,
			last_name: lastName,
			phone,
			date_of_birth: dateOfBirth,
			gender:
				gender === "" ? undefined : (gender as "Male" | "Female" | "Other"),
			country,
		};

		try {
			const response = await signUp(payload);
			if (response.status === "User registered successfully") {
				// Don't automatically sign in - instead show success message and redirect to sign in
				toast.success("Account created successfully! Please sign in.");
				navigate("/signin");
			}
		} catch (err: any) {
			let errorMessage = "Sign up failed. Please try again.";
			if (err.response?.data) {
				const errorData = err.response.data;
				if (typeof errorData === "object" && !Array.isArray(errorData)) {
					const fieldErrors = Object.entries(errorData)
						.map(([field, errors]) => {
							if (Array.isArray(errors)) {
								return `${field}: ${errors.join(", ")}`;
							}
							return `${field}: ${errors}`;
						})
						.join("; ");

					errorMessage = fieldErrors || errorMessage;
				} else {
					errorMessage =
						err.response.data.message ||
						err.response.data.detail ||
						err.response.data.error ||
						(typeof err.response.data === "string"
							? err.response.data
							: errorMessage);
				}
			} else if (err.message) {
				errorMessage = err.message;
			}
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col flex-1 w-full lg:w-full pt-4 sm:pt-0">
			<div className="flex flex-col justify-center flex-1 w-full max-w-2xl mx-auto">
				<div>
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="mb-5 sm:mb-8 text-center"
					>
						<h1 className="mb-2 font-bold text-gray-800 text-title-md dark:text-white/90 sm:text-title-lg">
							Join Our Community
						</h1>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Create your account and start your educational journey!
						</p>
					</motion.div>
					<div>
						<form onSubmit={handleSubmit}>
							<div className="space-y-5">
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.1, duration: 0.4 }}
									className="grid grid-cols-1 gap-5 sm:grid-cols-2"
								>
									<div className="sm:col-span-1">
										<Label>
											First Name<span className="text-error-500">*</span>
										</Label>
										<Input
											type="text"
											id="fname"
											name="fname"
											placeholder="Enter your first name"
											value={firstName}
											onChange={(e) => setFirstName(e.target.value)}
											required
											className="transition-all focus:scale-[1.01] focus:shadow-md"
											icon={<UserIcon />}
										/>
									</div>
									<div className="sm:col-span-1">
										<Label>
											Last Name<span className="text-error-500">*</span>
										</Label>
										<Input
											type="text"
											id="lname"
											name="lname"
											placeholder="Enter your last name"
											value={lastName}
											onChange={(e) => setLastName(e.target.value)}
											required
											className="transition-all focus:scale-[1.01] focus:shadow-md"
											icon={<UserIcon />}
										/>
									</div>
								</motion.div>

								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.2, duration: 0.4 }}
									className="grid grid-cols-1 gap-5 sm:grid-cols-2"
								>
									<div>
										<Label>
											Email<span className="text-error-500">*</span>
										</Label>
										<Input
											type="email"
											id="email"
											name="email"
											placeholder="Enter your email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
											className="transition-all focus:scale-[1.01] focus:shadow-md"
											icon={<EmailIcon />}
										/>
									</div>
									<div>
										<Label>
											Password<span className="text-error-500">*</span>
										</Label>
										<div className="relative">
											<Input
												placeholder="Enter your password"
												type={showPassword ? "text" : "password"}
												value={password}
												onChange={(e) => setPassword(e.target.value)}
												required
												className="transition-all focus:scale-[1.01] focus:shadow-md pr-10"
												icon={<LockIcon />}
											/>
											<span
												onClick={() => setShowPassword(!showPassword)}
												className="absolute z-30 right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
											>
												{showPassword ? (
													<EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
												) : (
													<EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
												)}
											</span>
										</div>
									</div>
								</motion.div>

								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.3, duration: 0.4 }}
									className="grid grid-cols-1 gap-5 sm:grid-cols-2"
								>
									<div>
										<Label>Phone</Label>
										<PhoneInput
											defaultCountry="US"
											value={phone}
											onChange={(phoneNumber) => setPhone(phoneNumber || "")}
											className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 transition-all focus:scale-[1.01] focus:shadow-md"
										/>
									</div>
									<div>
										<Label>Date of Birth</Label>
										<div className="relative w-full">
											<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400 z-10">
												<CalendarIcon />
											</div>
											<DatePicker
												selected={dateOfBirth ? new Date(dateOfBirth) : null}
												onChange={handleDateChange}
												wrapperClassName="w-full"
												className="w-full h-11 rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10"
												dateFormat="yyyy-MM-dd"
												placeholderText="Select your date of birth"
												showMonthDropdown
												showYearDropdown
												dropdownMode="select"
												yearDropdownItemNumber={100}
												scrollableYearDropdown
											/>
										</div>
									</div>
								</motion.div>

								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.4, duration: 0.4 }}
									className="grid grid-cols-1 gap-5 sm:grid-cols-2"
								>
									<div>
										<Label>Gender</Label>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
												<GenderIcon />
											</div>
											<select
												id="gender"
												name="gender"
												value={gender}
												onChange={(e) => setGender(e.target.value)}
												className="w-full h-11 rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 dark:bg-gray-900 dark:text-white/90 appearance-none transition-all focus:scale-[1.01] focus:shadow-md focus:outline-hidden focus:ring-3 focus:ring-brand-500/10"
											>
												<option value="">Select your gender</option>
												<option value="Male">Male</option>
												<option value="Female">Female</option>
												<option value="Other">Other</option>
											</select>
											<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
												<svg
													width="12"
													height="12"
													viewBox="0 0 12 12"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M6 9L1.5 4.5L2.55 3.45L6 6.9L9.45 3.45L10.5 4.5L6 9Z"
														fill="currentColor"
													/>
												</svg>
											</div>
										</div>
									</div>
									<div>
										<Label>
											Country<span className="text-error-500">*</span>
										</Label>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
												<WorldIcon />
											</div>
											<select
												id="country"
												name="country"
												value={country}
												onChange={(e) => setCountry(e.target.value)}
												className="w-full h-11 rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 dark:bg-gray-900 dark:text-white/90 appearance-none transition-all focus:scale-[1.01] focus:shadow-md focus:outline-hidden focus:ring-3 focus:ring-brand-500/10"
												required
											>
												<option value="">Select your country</option>
												{countries.map((country) => (
													<option key={country.code} value={country.name}>
														{country.name}
													</option>
												))}
											</select>
											<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
												<svg
													width="12"
													height="12"
													viewBox="0 0 12 12"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M6 9L1.5 4.5L2.55 3.45L6 6.9L9.45 3.45L10.5 4.5L6 9Z"
														fill="currentColor"
													/>
												</svg>
											</div>
										</div>
									</div>
								</motion.div>

								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.5, duration: 0.4 }}
									className="flex items-center gap-3 mt-8"
								>
									<Checkbox
										className="w-5 h-5"
										checked={isChecked}
										onChange={setIsChecked}
									/>
									<p className="inline-block font-normal text-gray-500 dark:text-gray-400">
										By creating an account you agree to our{" "}
										<span className="text-gray-800 dark:text-white/90 hover:text-brand-500 cursor-pointer transition-colors">
											Terms and Conditions,
										</span>{" "}
										and our{" "}
										<span className="text-gray-800 dark:text-white hover:text-brand-500 cursor-pointer transition-colors">
											Privacy Policy
										</span>
									</p>
								</motion.div>

								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.6, duration: 0.4 }}
									className="flex items-center justify-center"
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<button
										type="submit"
										disabled={isLoading}
										className="flex items-center justify-center w-75 px-6 py-3 text-sm font-medium text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-600 hover:to-indigo-700 shadow-lg hover:shadow-xl disabled:opacity-70"
									>
										{isLoading ? (
											<>
												<svg
													className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
												Creating Account...
											</>
										) : (
											"Sign Up"
										)}
									</button>
								</motion.div>
							</div>
						</form>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.7, duration: 0.5 }}
							className="mt-8 text-center"
						>
							<div className="relative py-3">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
								</div>
								<div className="relative flex justify-center">
									<span className="px-4 text-sm text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-400">
										Already have an account?
									</span>
								</div>
							</div>

							<Link
								to="/signin"
								className="mt-3 inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-white/90 transition-all duration-300 bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 group"
							>
								Sign In to Your Account
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M14 5l7 7m0 0l-7 7m7-7H3"
									/>
								</svg>
							</Link>
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
}
