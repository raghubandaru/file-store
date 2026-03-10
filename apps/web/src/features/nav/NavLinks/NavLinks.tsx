"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@file-store/design-system";
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
  const router = useRouter();

  async function handleLogout() {
    await logoutAction();
    router.refresh();
  }

  if (userId) {
    return (
      <div>
        <NavLink href="/file/upload">Upload</NavLink>
        <NavLink href="/file/list">Files</NavLink>
        <NavLink href="/user/profile">Profile</NavLink>
        <Button onClick={handleLogout}>Logout</Button>
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
