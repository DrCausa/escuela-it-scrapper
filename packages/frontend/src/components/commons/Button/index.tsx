import { flattenClasses } from "@utils/classNames";
import { type ButtonHTMLAttributes, type ReactNode } from "react";
import Icon from "../Icon";

export type BUTTON_TYPE =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info";

type ButtonProps = {
  label?: string;
  children?: ReactNode;
  className?: string;
  buttonType?: BUTTON_TYPE;
  isOutline?: boolean;
  isLoading?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

const solidVariants: Record<BUTTON_TYPE, string> = {
  primary: `
    border border-btn-primary-bg bg-btn-primary-bg 
    hover:bg-btn-primary-bg-hover 
    text-btn-primary-text
  `,
  secondary: `
    border border-btn-secondary-bg bg-btn-secondary-bg 
    hover:bg-btn-secondary-bg-hover 
    text-btn-secondary-text
  `,
  success: `
    border border-btn-success-bg bg-btn-success-bg 
    hover:bg-btn-success-bg-hover 
    text-btn-success-text
  `,
  warning: `
    border border-btn-warning-bg bg-btn-warning-bg 
    hover:bg-btn-warning-bg-hover 
    text-btn-warning-text
  `,
  danger: `
    border border-btn-danger-bg bg-btn-danger-bg 
    hover:bg-btn-danger-bg-hover 
    text-btn-danger-text
  `,
  info: `
    border border-btn-info-bg bg-btn-info-bg 
    hover:bg-btn-info-bg-hover 
    text-btn-info-text
  `,
};

const outlineVariants: Record<BUTTON_TYPE, string> = {
  primary: `
    border border-btn-primary-outline-border 
    text-btn-primary-outline-text 
    hover:bg-btn-primary-outline-hover-bg 
    hover:text-btn-primary-outline-hover-text
  `,
  secondary: `
    border border-btn-secondary-outline-border 
    text-btn-secondary-outline-text 
    hover:bg-btn-secondary-outline-hover-bg 
    hover:text-btn-secondary-outline-hover-text
  `,
  success: `
    border border-btn-success-outline-border 
    text-btn-success-outline-text 
    hover:bg-btn-success-outline-hover-bg 
    hover:text-btn-success-outline-hover-text
  `,
  warning: `
    border border-btn-warning-outline-border 
    text-btn-warning-outline-text 
    hover:bg-btn-warning-outline-hover-bg 
    hover:text-btn-warning-outline-hover-text
  `,
  danger: `
    border border-btn-danger-outline-border 
    text-btn-danger-outline-text 
    hover:bg-btn-danger-outline-hover-bg 
    hover:text-btn-danger-outline-hover-text
  `,
  info: `
    border border-btn-info-outline-border 
    text-btn-info-outline-text 
    hover:bg-btn-info-outline-hover-bg 
    hover:text-btn-info-outline-hover-text
  `,
};

const Button = ({
  label,
  children = label,
  type = "button",
  onClick,
  className,
  disabled,
  isLoading,
  buttonType = "primary",
  isOutline = false,
  ...rest
}: ButtonProps) => {
  const typeClassName = isOutline
    ? outlineVariants[buttonType]
    : solidVariants[buttonType];

  const baseClassName = `
    ${typeClassName} px-3 py-2 rounded-xl font-medium transition-all duration-200
  `;
  const enabledClassName = `
    hover:cursor-pointer
  `;
  const disabledClassName = `
    cursor-not-allowed
    text-disabled-text-light bg-disabled-bg-light border-disabled-border-light hover:bg-disabled-bg-light
    dark:text-disabled-text-dark dark:bg-disabled-bg-dark dark:border-disabled-border-dark dark:hover:bg-disabled-bg-dark
  `;

  const content = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center gap-1 animate-pulse">
          Loading...
          <Icon iconName="progress_activity" className="animate-spin" />
        </div>
      );
    }
    return children;
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={flattenClasses(`
        ${disabled ? disabledClassName : enabledClassName} 
        ${baseClassName} 
        ${className}
      `)}
      {...rest}
    >
      {content()}
    </button>
  );
};

export default Button;
