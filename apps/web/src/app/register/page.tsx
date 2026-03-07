"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Field, Input, Label } from "@file-store/design-system";

export default function RegisterPage() {
  const [details, setDetails] = useState({ name: "", email: "", password: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <>
      <form aria-label="Register" onSubmit={handleSubmit}>
        <Field>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            name="name"
            id="name"
            value={details.name}
            onChange={handleChange}
            autoComplete="name"
            required
          />
        </Field>
        <Field>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            value={details.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </Field>
        <Field>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            id="password"
            value={details.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
        </Field>
        <Button type="submit" variant="primary">
          Register
        </Button>
      </form>
      <nav aria-label="Account navigation" style={{ marginTop: "1.5rem" }}>
        <Button as={Link} href="/login">
          Already Registered? Login here
        </Button>
      </nav>
    </>
  );
}
