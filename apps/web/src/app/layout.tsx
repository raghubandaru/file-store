import type { Metadata } from "next";
import Link from "next/link";
import { Button, Main, Navbar } from "@file-store/design-system";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "EA File Store", template: "%s | EA File Store" },
  description: "Ability to upload and store files",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
            <Button as={Link} href="/login">
              Login
            </Button>
            <Button as={Link} href="/register">
              Register
            </Button>
            <Button as={Link} href="/upload">
              Upload
            </Button>
            <Button as={Link} href="/files">
              Files
            </Button>
          </div>
        </Navbar>
        <Main title="EA File Store" subtitle="Ability to upload and store files">
          {children}
        </Main>
      </body>
    </html>
  );
}
