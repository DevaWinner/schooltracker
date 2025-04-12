import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "../../layout/AuthLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
	return (
		<>
			<PageMeta
				title="Sign Up | School Tracker"
				description="Create a new account on School Tracker. Join us and start tracking your school applications."
			/>
			<AuthLayout size="large">
				<SignUpForm />
			</AuthLayout>
		</>
	);
}
