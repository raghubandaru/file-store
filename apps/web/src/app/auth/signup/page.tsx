import type { Metadata } from "next";
import AuthForm from "@/features/auth/AuthForm/AuthForm";

export const metadata: Metadata = { title: "Sign up" };
import { signupAction } from "@/actions/auth";
import Link from "next/link";
import { Button } from "@file-store/design-system";

export default function Signup() {
  return (
    <AuthForm
      title="Create your account"
      submitLabel="Create account"
      action={signupAction}
      schemaKey="signup"
      fields={[
        {
          name: "name",
          label: "Name",
          autoComplete: "name",
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          autoComplete: "email",
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          autoComplete: "new-password",
        },
      ]}
      footer={
        <nav aria-label="Account navigation">
          <Button as={Link} href="/auth/login">
            Already Registered? Login here
          </Button>
        </nav>
      }
    />
  );
}
