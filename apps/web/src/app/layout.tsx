import type { Metadata } from "next";
import Link from "next/link";
import { Button, Main, Navbar } from "@file-store/design-system";
import { getSessionUserId } from "@/services/auth/server";
import LogoutButton from "@/features/components/LogoutButton/LogoutButton";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "EA File Store", template: "%s | EA File Store" },
  description: "Ability to upload and store files",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userId = await getSessionUserId();

  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Navbar>
          <Button as={Link} href="/" variant="brand">
            EA
          </Button>
          <div>
            {userId ? (
              <>
                <Button as={Link} href="/file/upload">
                  Upload
                </Button>
                <Button as={Link} href="/file/list">
                  Files
                </Button>
                <Button as={Link} href="/user/profile">
                  Profile
                </Button>
                <LogoutButton />
              </>
            ) : (
              <>
                <Button as={Link} href="/auth/signup">
                  Sign up
                </Button>
                <Button as={Link} href="/auth/login">
                  Login
                </Button>
              </>
            )}
          </div>
        </Navbar>
        <Main title="EA File Store" subtitle="Ability to upload and store files">
          {children}
        </Main>
      </body>
    </html>
  );
}
