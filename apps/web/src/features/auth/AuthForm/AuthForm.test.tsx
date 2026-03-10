import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AuthForm from "./AuthForm";

const mockUseActionState = vi.fn();

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return {
    ...actual,
    useActionState: (...args: unknown[]) => mockUseActionState(...args),
  };
});

const noopAction = vi.fn();

const loginProps = {
  title: "Sign in to File Store",
  submitLabel: "Sign in",
  action: noopAction,
  schemaKey: "login" as const,
  fields: [
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Password", type: "password" },
  ],
};

const signupProps = {
  title: "Create your account",
  submitLabel: "Create account",
  action: noopAction,
  schemaKey: "signup" as const,
  fields: [
    { name: "name", label: "Name" },
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Password", type: "password" },
  ],
};

describe("Login workflow", () => {
  beforeEach(() => {
    mockUseActionState.mockImplementation((_action: unknown, initialState: unknown) => [
      initialState,
      vi.fn(),
      false,
    ]);
  });

  it("renders the login form title", () => {
    render(<AuthForm {...loginProps} />);
    expect(screen.getByRole("heading", { name: /sign in to file store/i })).toBeInTheDocument();
  });

  it("renders email and password fields", () => {
    render(<AuthForm {...loginProps} />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("renders the submit button with correct label", () => {
    render(<AuthForm {...loginProps} />);
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows email validation error after blurring with an invalid email", () => {
    render(<AuthForm {...loginProps} />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "not-an-email" } });
    fireEvent.blur(emailInput, { target: { value: "not-an-email" } });
    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
  });

  it("shows email validation error after blurring an empty email field", () => {
    render(<AuthForm {...loginProps} />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "" } });
    fireEvent.blur(emailInput, { target: { value: "" } });
    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
  });

  it("shows password validation error after blurring an empty password field", () => {
    render(<AuthForm {...loginProps} />);
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: "" } });
    fireEvent.blur(passwordInput, { target: { value: "" } });
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });

  it("disables submit button when a field has a client-side error", () => {
    render(<AuthForm {...loginProps} />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "bad" } });
    fireEvent.blur(emailInput, { target: { value: "bad" } });
    expect(screen.getByRole("button", { name: /sign in/i })).toBeDisabled();
  });

  it("enables submit button when all fields are valid", () => {
    render(<AuthForm {...loginProps} />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.blur(emailInput, { target: { value: "user@example.com" } });

    fireEvent.change(passwordInput, { target: { value: "secret" } });
    fireEvent.blur(passwordInput, { target: { value: "secret" } });

    expect(screen.getByRole("button", { name: /sign in/i })).not.toBeDisabled();
  });

  it("displays a general server error from action state", () => {
    mockUseActionState.mockReturnValue([
      { errors: { general: "Invalid email or password." } },
      vi.fn(),
      false,
    ]);
    render(<AuthForm {...loginProps} />);
    expect(screen.getByText("Invalid email or password.")).toBeInTheDocument();
  });

  it("shows 'Loading…' and disables submit while pending", () => {
    mockUseActionState.mockReturnValue([{ errors: {} }, vi.fn(), true]);
    render(<AuthForm {...loginProps} />);
    const button = screen.getByRole("button", { name: /loading/i });
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Loading…");
  });

  it("renders the footer slot", () => {
    render(<AuthForm {...loginProps} footer={<a href="/auth/signup">No account? Sign up</a>} />);
    expect(screen.getByRole("link", { name: /sign up/i })).toBeInTheDocument();
  });
});

describe("Signup workflow", () => {
  beforeEach(() => {
    mockUseActionState.mockImplementation((_action: unknown, initialState: unknown) => [
      initialState,
      vi.fn(),
      false,
    ]);
  });

  it("renders the signup form title", () => {
    render(<AuthForm {...signupProps} />);
    expect(screen.getByRole("heading", { name: /create your account/i })).toBeInTheDocument();
  });

  it("renders name, email, and password fields", () => {
    render(<AuthForm {...signupProps} />);
    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("renders the submit button with correct label", () => {
    render(<AuthForm {...signupProps} />);
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("shows name validation error after blurring empty name field", () => {
    render(<AuthForm {...signupProps} />);
    const nameInput = screen.getByLabelText(/^name$/i);
    fireEvent.change(nameInput, { target: { value: "" } });
    fireEvent.blur(nameInput, { target: { value: "" } });
    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });

  it("shows email validation error after blurring with an invalid email", () => {
    render(<AuthForm {...signupProps} />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "bad-email" } });
    fireEvent.blur(emailInput, { target: { value: "bad-email" } });
    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
  });

  it("shows password validation error when password is too short", () => {
    render(<AuthForm {...signupProps} />);
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: "short" } });
    fireEvent.blur(passwordInput, { target: { value: "short" } });
    expect(screen.getByText("Password must be at least 8 characters")).toBeInTheDocument();
  });

  it("disables submit button when any field has an error", () => {
    render(<AuthForm {...signupProps} />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "not-an-email" } });
    fireEvent.blur(emailInput, { target: { value: "not-an-email" } });
    expect(screen.getByRole("button", { name: /create account/i })).toBeDisabled();
  });

  it("enables submit button when all fields are valid", () => {
    render(<AuthForm {...signupProps} />);
    const nameInput = screen.getByLabelText(/^name$/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(nameInput, { target: { value: "Alice" } });
    fireEvent.blur(nameInput, { target: { value: "Alice" } });

    fireEvent.change(emailInput, { target: { value: "alice@example.com" } });
    fireEvent.blur(emailInput, { target: { value: "alice@example.com" } });

    fireEvent.change(passwordInput, { target: { value: "strongpass" } });
    fireEvent.blur(passwordInput, { target: { value: "strongpass" } });

    expect(screen.getByRole("button", { name: /create account/i })).not.toBeDisabled();
  });

  it("displays a general server error from action state", () => {
    mockUseActionState.mockReturnValue([
      { errors: { general: "Email already in use." } },
      vi.fn(),
      false,
    ]);
    render(<AuthForm {...signupProps} />);
    expect(screen.getByText("Email already in use.")).toBeInTheDocument();
  });

  it("renders the footer slot", () => {
    render(
      <AuthForm {...signupProps} footer={<a href="/auth/login">Already registered? Login</a>} />
    );
    expect(screen.getByRole("link", { name: /already registered/i })).toBeInTheDocument();
  });
});
