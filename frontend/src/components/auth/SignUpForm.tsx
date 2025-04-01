import { useState } from "react";
import { Link } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";

export default function SignUpForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [isChecked, setIsChecked] = useState(false);
	return (
		<div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
			<div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
				<div>
					<div className="mb-5 sm:mb-8">
						<h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
							Sign Up
						</h1>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Enter your email and password to sign up!
						</p>
					</div>
					<div>
						<form>
							<div className="space-y-5">
								<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
									{/* <!-- First Name --> */}
									<div className="sm:col-span-1">
										<Label>
											First Name<span className="text-error-500">*</span>
										</Label>
										<Input
											type="text"
											id="fname"
											name="fname"
											placeholder="Enter your first name"
										/>
									</div>
									{/* <!-- Last Name --> */}
									<div className="sm:col-span-1">
										<Label>
											Last Name<span className="text-error-500">*</span>
										</Label>
										<Input
											type="text"
											id="lname"
											name="lname"
											placeholder="Enter your last name"
										/>
									</div>
								</div>
								{/* <!-- Email --> */}
								<div>
									<Label>
										Email<span className="text-error-500">*</span>
									</Label>
									<Input
										type="email"
										id="email"
										name="email"
										placeholder="Enter your email"
									/>
								</div>
								{/* <!-- Password --> */}
								<div>
									<Label>
										Password<span className="text-error-500">*</span>
									</Label>
									<div className="relative">
										<Input
											placeholder="Enter your password"
											type={showPassword ? "text" : "password"}
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
								{/* <!-- Checkbox --> */}
								<div className="flex items-center gap-3">
									<Checkbox
										className="w-5 h-5"
										checked={isChecked}
										onChange={setIsChecked}
									/>
									<p className="inline-block font-normal text-gray-500 dark:text-gray-400">
										By creating an account means you agree to the{" "}
										<span className="text-gray-800 dark:text-white/90">
											Terms and Conditions,
										</span>{" "}
										and our{" "}
										<span className="text-gray-800 dark:text-white">
											Privacy Policy
										</span>
									</p>
								</div>
								{/* <!-- Button --> */}
								<div>
									<button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
										Sign Up
									</button>
								</div>
							</div>
						</form>

						<div className="mt-5">
							<p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
								Already have an account? {""}
								<Link
									to="/signin"
									className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
								>
									Sign In
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
