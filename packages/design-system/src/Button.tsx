import type { ComponentPropsWithoutRef, ElementType, JSX } from 'react';

type ButtonProps<T extends ElementType = 'button'> = ComponentPropsWithoutRef<T>;

export function Button<T extends ElementType = 'button'>(props: ButtonProps<T>): JSX.Element {
  return <button {...props}>{props.children}</button>;
}
