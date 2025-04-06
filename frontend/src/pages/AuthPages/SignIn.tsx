import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "../../layout/AuthLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Sign In | School Tracker"
        description="Sign in to your account on School Tracker. Access your profile and manage your applications."
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
