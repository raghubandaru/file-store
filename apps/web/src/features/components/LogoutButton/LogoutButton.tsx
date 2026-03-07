import { logoutAction } from "@/actions/auth";
import { Button, Form } from "@file-store/design-system";

export default function LogoutButton() {
  return (
    <Form action={logoutAction} className="inlineBlock">
      <Button type="submit">Logout</Button>
    </Form>
  );
}
