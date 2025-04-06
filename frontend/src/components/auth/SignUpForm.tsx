import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { signUp, storeAuthTokens } from "../../api/auth";
import { SignUpRequest } from "../../interfaces/auth";
import { AuthContext } from "../../context/AuthContext";
import { adaptUserDataToUserInfo } from "../../utils/userAdapter";
import { countries } from "../../utils/countries";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  const {
    signIn: updateAuth,
    setProfile,
    setIsFirstLogin,
  } = useContext(AuthContext);

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
      email,
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
        // Store tokens
        storeAuthTokens(response.access_token, response.refresh_token);

        // Update auth context with user info and token
        updateAuth(response.user, response.access_token);

        // Convert UserData to UserInfo before setting profile
        const userInfo = adaptUserDataToUserInfo(response.user);
        setProfile(userInfo);

        setIsFirstLogin(true);

        toast.success("Account created successfully!");
        navigate("/profile/information");
      }
    } catch (err: any) {
      let errorMessage = "Sign up failed. Please try again.";
      if (err.response?.data) {
        // Handle specific API error responses
        const errorData = err.response.data;
        if (typeof errorData === "object" && !Array.isArray(errorData)) {
          // Extract field-specific errors
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
    <div className="flex flex-col flex-1 w-full lg:w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-2xl mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your details to sign up!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <Label>Phone</Label>
                    <PhoneInput
                      defaultCountry="US"
                      value={phone}
                      onChange={(phoneNumber) => setPhone(phoneNumber || "")}
                      className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                    />
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <div className="w-full">
                      <DatePicker
                        selected={dateOfBirth ? new Date(dateOfBirth) : null}
                        onChange={handleDateChange}
                        wrapperClassName="w-full"
                        className="w-full h-11 rounded-lg border border-gray-300 p-2 dark:bg-gray-900 dark:text-white/90"
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select your date of birth"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        yearDropdownItemNumber={100}
                        scrollableYearDropdown
                        customInput={
                          <Input
                            type="text"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            className="w-full"
                          />
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <Label>Gender</Label>
                    <select
                      id="gender"
                      name="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full h-11 rounded-lg border border-gray-300 p-2 dark:bg-gray-900 dark:text-white/90"
                    >
                      <option value="">Select your gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <Label>
                      Country<span className="text-error-500">*</span>
                    </Label>
                    <select
                      id="country"
                      name="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full h-11 rounded-lg border border-gray-300 p-2 dark:bg-gray-900 dark:text-white/90"
                      required
                    >
                      <option value="">Select your country</option>
                      {countries.map((country) => (
                        <option key={country.code} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-8">
                  <Checkbox
                    className="w-5 h-5"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                    By creating an account you agree to our{" "}
                    <span className="text-gray-800 dark:text-white/90">
                      Terms and Conditions,
                    </span>{" "}
                    and our{" "}
                    <span className="text-gray-800 dark:text-white">
                      Privacy Policy
                    </span>
                  </p>
                </div>
                <div className="flex items-center justify-center ">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center justify-center w-75 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:bg-gray-300"
                  >
                    {isLoading ? "Creating Account..." : "Sign Up"}
                  </button>
                </div>
              </div>
            </form>
            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account?{" "}
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
