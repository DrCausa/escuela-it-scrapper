import { useState, type InputHTMLAttributes } from "react";
import Icon, { type ICON_TYPE } from "../Icon";
import { flattenClasses } from "@utils/classNames";

type Props = {
  label?: string;
  layoutClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  placeholderClassName?: string;
  iconName?: string;
  iconType?: ICON_TYPE;
  iconIsFilled?: boolean;
  iconLayoutClassName?: string;
  iconClassName?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "className">;

const Input = ({
  label,
  type = "text",
  id,
  name = id,
  layoutClassName,
  placeholderClassName,
  inputClassName,
  labelClassName,
  iconName,
  iconType,
  iconIsFilled,
  iconLayoutClassName,
  iconClassName,
  disabled,
  placeholder,
  ...rest
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const layoutBaseClassName = `
    relative border rounded-xl px-4 pb-2 ${
      label ? "pt-7" : "pt-2"
    } flex items-center transition-all duration-200
  `;
  const enabledLayoutClassName = `
    border-border-strong-light bg-bg-primary-light
    dark:border-border-strong-dark dark:bg-bg-secondary-dark
  `;
  const disabledLayoutClassName = `
    border-disabled-border-light bg-disabled-bg-light
    dark:border-disabled-border-dark dark:bg-disabled-bg-dark
  `;

  const inputBaseClassName = `
    peer ${iconName ? "w-[90%]" : "w-full"} focus:outline-0
  `;
  const disabledInputClassName = `
    text-disabled-text-light focus:none
    dark:text-disabled-text-dark
  `;

  const labelBaseClassName = `
    absolute pointer-events-none transition-all duration-400 ease-in-out -translate-y-6 text-sm
  `;
  const enabledLabelClassName = `
    text-text-secondary-light
    dark:text-text-secondary-dark
  `;
  const disabledLabelClassName = `
    select-none
    text-text-tertiary-light
    dark:text-text-tertiary-dark
  `;

  const placeholderBaseClassName = `
    absolute pointer-events-none transition-all duration-400 ease-in-out peer-not-placeholder-shown:hidden
  `;
  const enabledPlaceholderClassName = `
    text-text-secondary-light
    dark:text-text-secondary-dark
  `;
  const disabledPlaceholderClassName = `
    select-none
    text-text-tertiary-light
    dark:text-text-tertiary-dark
  `;

  const iconLayoutPasswordClassName = `
    cursor-pointer rounded-full transition-all duration-200 ease-out
    hover:bg-bg-elevated-dark/10
    dark:hover:bg-bg-elevated-dark/90
  `;
  const iconLayoutBaseClassName = `
    flex absolute right-0 top-[50%] -translate-y-[50%] me-2
  `;
  const enabledIconLayoutClassName = `
  `;
  const disabledIconLayoutClassName = `
  `;
  const iconBaseClassName = `
    !text-[32px]
  `;
  const enabledIconClassName = `
    text-text-tertiary-light
    dark:text-text-tertiary-dark
  `;
  const disabledIconClassName = `
    text-disabled-text-light
    dark:text-disabled-text-dark
  `;

  const actualType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  let finalIcon = null;
  if (!iconName && type === "password") {
    finalIcon = (
      <div
        className={flattenClasses(`
          ${iconLayoutBaseClassName}
          ${disabled ? disabledIconLayoutClassName : enabledIconLayoutClassName}
          ${iconLayoutPasswordClassName}
          ${iconLayoutClassName ?? ""}  
        `)}
        onClick={() => setShowPassword((v) => !v)}
      >
        <Icon
          iconName={showPassword ? "visibility_off" : "visibility"}
          iconType={iconType}
          isFilled={iconIsFilled}
          className={flattenClasses(`
            ${iconBaseClassName}
            ${iconClassName ?? ""}
            ${disabled ? disabledIconClassName : enabledIconClassName}
          `)}
        />
      </div>
    );
  } else if (iconName) {
    finalIcon = (
      <div
        className={flattenClasses(`
          ${iconLayoutBaseClassName}
          ${disabled ? disabledIconLayoutClassName : enabledIconLayoutClassName}
          ${iconLayoutClassName ?? ""}
        `)}
      >
        <Icon
          iconName={iconName}
          iconType={iconType}
          isFilled={iconIsFilled}
          className={flattenClasses(`
            ${iconBaseClassName}
            ${iconClassName ?? ""}
            ${disabled ? disabledIconClassName : enabledIconClassName}
          `)}
        />
      </div>
    );
  }

  let finalLabel;
  if (label) {
    finalLabel = (
      <label
        className={flattenClasses(`
          ${labelBaseClassName}
          ${disabled ? disabledLabelClassName : enabledLabelClassName}
          ${labelClassName ?? ""}
        `)}
        htmlFor={id}
      >
        {label}
      </label>
    );
  } else if (placeholder) {
    finalLabel = (
      <label
        className={flattenClasses(`
          ${placeholderBaseClassName}
          ${
            disabled
              ? disabledPlaceholderClassName
              : enabledPlaceholderClassName
          }
          ${placeholderClassName ?? ""}
        `)}
        htmlFor={id}
      >
        {placeholder}
      </label>
    );
  }

  return (
    <div
      className={flattenClasses(`
        ${layoutBaseClassName}
        ${disabled ? disabledLayoutClassName : enabledLayoutClassName}
        ${layoutClassName ?? ""}
      `)}
    >
      <input
        className={flattenClasses(`
          ${inputBaseClassName}
          ${disabled ? disabledInputClassName : ""}
          ${inputClassName ?? ""}
        `)}
        type={actualType}
        id={id}
        name={name}
        placeholder=""
        disabled={disabled}
        {...rest}
      />
      {finalIcon}
      {finalLabel}
    </div>
  );
};

export default Input;
