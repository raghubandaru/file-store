"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, Form } from "@file-store/design-system";
import { logoutAction } from "@/actions/auth";

type NavLinksProps = {
  userId: string | null;
};

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <Button as={Link} href={href} aria-current={pathname === href ? "page" : undefined}>
      {children}
    </Button>
  );
}

export function NavLinks({ userId }: NavLinksProps) {
  if (userId) {
    return (
      <div>
        <NavLink href="/file/upload">Upload</NavLink>
        <NavLink href="/file/list">Files</NavLink>
        <NavLink href="/user/profile">Profile</NavLink>
        <Form action={logoutAction} className="inlineBlock">
          <Button type="submit">Logout</Button>
        </Form>
      </div>
    );
  }

  return (
    <div>
      <NavLink href="/auth/signup">Sign up</NavLink>
      <NavLink href="/auth/login">Login</NavLink>
    </div>
  );
}
