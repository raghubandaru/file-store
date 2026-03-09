import type { Metadata } from "next";
import Link from "next/link";
import { Button, Main, Navbar } from "@file-store/design-system";
import { getSessionUserId } from "@/services/auth/server";
import { NavLinks } from "@/features/components/NavLinks/NavLinks";
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
          <NavLinks userId={userId} />
        </Navbar>
        <Main title="EA File Store" subtitle="Ability to upload and store files">
          {children}
        </Main>
      </body>
    </html>
  );
}
