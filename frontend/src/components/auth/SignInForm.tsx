// src/components/auth/SignInForm.tsx
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { signIn } from "../../api/auth";
import { getProfile } from "../../api/profile";
import { AuthContext } from "../../context/AuthContext";

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
				updateAuth(response.user, response.access_token);
				// Fetch user profile using the new token
				const profileData = await getProfile(response.access_token);
				setProfile(profileData);
				toast.success("Successfully signed in!");

				// Check if profile is new (for example, if created_at equals updated_at)
				if (profileData.created_at === profileData.updated_at) {
					navigate("/profile/information");
				} else {
					navigate("/");
				}
			}
		} catch (err: any) {
			let errorMessage = "Sign in failed. Please try again.";
			if (err.response?.data) {
				errorMessage =
					err.response.data.message ||
					err.response.data.detail ||
					err.response.data.error ||
					(typeof err.response.data === "string"
						? err.response.data
						: errorMessage);
			} else if (err.message) {
				errorMessage = err.message;
			}
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col flex-1">
			<div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
				<div>
					<div className="mb-5 sm:mb-8">
						<h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
							Sign In
						</h1>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Enter your email and password to sign in!
						</p>
					</div>
					<div>
						<form onSubmit={handleSubmit}>
							<div className="space-y-6">
								<div>
									<Label>
										Email <span className="text-error-500">*</span>
									</Label>
									<Input
										type="email"
										placeholder="info@gmail.com"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
								</div>
								<div>
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
										/>
										<span
											onClick={() => setShowPassword(!showPassword)}
											className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
										>
											{showPassword ? (
												<EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
											) : (
												<EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
											)}
										</span>
									</div>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<Checkbox checked={isChecked} onChange={setIsChecked} />
										<span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
											Keep me logged in
										</span>
									</div>
									<Link
										to="/reset-password"
										className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
									>
										Forgot password?
									</Link>
								</div>
								<div>
									<Button
										className="w-full"
										size="sm"
										type="submit"
										disabled={isLoading}
									>
										{isLoading ? "Signing in..." : "Sign in"}
									</Button>
								</div>
							</div>
						</form>
						<div className="mt-5">
							<p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
								Don&apos;t have an account?{" "}
								<Link
									to="/signup"
									className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
								>
									Sign Up
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
