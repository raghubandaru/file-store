import type { Metadata } from "next";
import AuthForm from "@/features/auth/AuthForm/AuthForm";

export const metadata: Metadata = { title: "Login" };
import { loginAction } from "@/actions/auth";
import Link from "next/link";
import { Button } from "@file-store/design-system";

export default function Login() {
  return (
    <AuthForm
      title="Sign in to File Store"
      submitLabel="Sign in"
      action={loginAction}
      schemaKey="login"
      fields={[
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
          autoComplete: "current-password",
        },
      ]}
      footer={
        <nav aria-label="Account navigation">
          <Button as={Link} href="/auth/signup">
            No account? Sign up
          </Button>
        </nav>
      }
    />
  );
}
