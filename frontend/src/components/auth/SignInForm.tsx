import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { signIn, storeAuthTokens } from "../../api/auth";
import { AuthContext } from "../../context/AuthContext";
import { adaptUserDataToUserInfo } from "../../utils/userAdapter";
import { motion } from "framer-motion";

// Create icons for inputs
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
		<circle cx="10" cy="14.1667" r="1.25" fill="currentColor" />
	</svg>
);

export default function SignInForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [isChecked, setIsChecked] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const {
		signIn: updateAuth,
		accessToken,
		setProfile,
		setIsFirstLogin,
	} = useContext(AuthContext);

	// If already signed in, redirect away
	useEffect(() => {
		if (accessToken) {
			navigate("/");
		}
	}, [accessToken, navigate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const response = await signIn({ email, password });
			if (response.status === "success") {
				// Store auth tokens with persistence preference
				storeAuthTokens(
					response.access_token,
					response.refresh_token,
					isChecked
				);

				// Update auth context with user info and token
				// Pass refresh token as third argument and isChecked as fourth
				updateAuth(
					response.user,
					response.access_token,
					response.refresh_token,
					isChecked
				);

				// Convert UserData to UserInfo before setting profile
				const userInfo = adaptUserDataToUserInfo(response.user);
				setProfile(userInfo);

				toast.success("Successfully signed in!");

				// Check if profile is new (for example, if created_at equals updated_at)
				const isFirstTimeUser =
					response.user.created_at === response.user.updated_at;
				setIsFirstLogin(isFirstTimeUser);

				// Redirect based on whether it's first login or not
				if (isFirstTimeUser) {
					setTimeout(() => navigate("/profile/information"), 100);
				} else {
					setTimeout(() => navigate("/"), 100);
				}
			}
		} catch (err: any) {
			let errorMessage = "Sign in failed. Please try again.";
			if (err.response?.data) {
				// Handle specific API error responses
				if (err.response.status === 401) {
					errorMessage = "Invalid email or password";
				} else {
					errorMessage =
						err.response.data.error ||
						err.response.data.message ||
						err.response.data.detail ||
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
		<div className="flex flex-col w-full">
			<div className="flex flex-col justify-center w-full">
				<div>
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="mb-5 sm:mb-8 text-center"
					>
						<h1 className="mb-2 font-bold text-gray-800 text-title-md dark:text-white/90 sm:text-title-lg">
							Welcome Back!
						</h1>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Enter your credentials to continue your journey
						</p>
					</motion.div>
					<div>
						<form onSubmit={handleSubmit}>
							<div className="space-y-6">
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.1, duration: 0.4 }}
								>
									<Label>
										Email <span className="text-error-500">*</span>
									</Label>
									<Input
										type="email"
										placeholder="info@gmail.com"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										className="transition-all focus:scale-[1.01] focus:shadow-md"
										icon={<EmailIcon />}
									/>
								</motion.div>
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.2, duration: 0.4 }}
								>
									<Label>
										Password <span className="text-error-500">*</span>
									</Label>
									<div className="relative">
										<Input
											type={showPassword ? "text" : "password"}
											placeholder="Enter your password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											required
											className="transition-all focus:scale-[1.01] focus:shadow-md"
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
								</motion.div>
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.3, duration: 0.4 }}
									className="flex items-center justify-between"
								>
									<div className="flex items-center gap-3">
										<Checkbox checked={isChecked} onChange={setIsChecked} />
										<span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
											Keep me logged in
										</span>
									</div>
									<Link
										to="/reset-password"
										className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 font-medium transition-all hover:underline"
									>
										Forgot password?
									</Link>
								</motion.div>
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.4, duration: 0.4 }}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<Button
										className="w-full bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
										size="sm"
										type="submit"
										disabled={isLoading}
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
												Signing in...
											</>
										) : (
											"Sign in"
										)}
									</Button>
								</motion.div>
							</div>
						</form>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5, duration: 0.5 }}
							className="mt-8 text-center"
						>
							<div className="relative py-3">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
								</div>
								<div className="relative flex justify-center">
									<span className="px-4 text-sm text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-400">
										New to School Tracker?
									</span>
								</div>
							</div>

							<Link
								to="/signup"
								className="mt-3 inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-brand-500 transition-all duration-300 bg-transparent border border-brand-500 rounded-lg hover:bg-brand-50 dark:hover:bg-gray-700/50 group"
							>
								Create New Account
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
