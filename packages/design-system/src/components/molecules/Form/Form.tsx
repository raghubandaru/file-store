type FormProps = Omit<React.ComponentProps<"form">, "action"> & {
  action?: string | ((formData: FormData) => void | Promise<void>);
};

export function Form({ action, children, ...rest }: FormProps) {
  return (
    <form action={action} {...rest}>
      {children}
    </form>
  );
}
