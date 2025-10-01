import { flattenClasses } from "@utils/classNames";
import { type ReactNode } from "react";

type CardProps = {
  children?: ReactNode;
  className?: string;
};

const Card = ({ children, className }: CardProps) => {
  const baseClassName = flattenClasses(`
      border p-4 rounded-lg shadow-md
      border-border-strong-light bg-bg-surface-light
      dark:border-border-strong-dark dark:bg-bg-surface-dark
    `);

  return (
    <div className={`${baseClassName} ${className}`.trim()}>{children}</div>
  );
};

export default Card;
