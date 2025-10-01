import { type InputHTMLAttributes } from "react";
import Icon from "@components/commons/Icon";
import { flattenClasses } from "@utils/classNames";

type InputProps = {
  label?: string;
  iconName?: string;
  layoutClassName?: string;
  labelCheckboxClassName?: string;
  checkboxClassName?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "className">;

const Input = ({
  id,
  name = id,
  type = "text",
  label,
  placeholder = label,
  checked = false,
  iconName,
  layoutClassName,
  labelCheckboxClassName,
  checkboxClassName,
  disabled,
  ...rest
}: InputProps) => {
  let layoutBaseClassName,
    disabledLayoutClassName,
    enabledLayoutClassName,
    disabledCheckboxClassName,
    enabledCheckboxClassName,
    labelBaseClassName,
    enabledLabelClassName,
    disabledLabelClassName,
    inputBaseClassName,
    disabledInputClassName,
    innerCheckboxBaseClassName,
    enabledInnerCheckboxClassName,
    disabledInnerCheckboxClassName,
    iconLayoutBaseClassName,
    iconBaseClassName,
    enabledIconClassName,
    disabledIconClassName,
    finalLabel,
    finalInput,
    finalIcon,
    finalReturn;

  switch (type) {
    case "checkbox":
      layoutBaseClassName = `
        flex w-full justify-end
      `;

      enabledLabelClassName = `
        text-text-secondary-light
        dark:text-text-secondary-dark
      `;
      disabledLabelClassName = `
        select-none
        text-text-tertiary-light
        dark:text-text-tertiary-dark
      `;

      disabledCheckboxClassName = `
        border-disabled-border-light
        dark:border-disabled-border-dark
      `;
      enabledCheckboxClassName = `
        border-border-strong-light
        dark:border-border-strong-dark
      `;

      innerCheckboxBaseClassName = `
        absolute w-[14px] h-[14px] rounded-sm transition-scale duration-200 ease-out
      `;
      enabledInnerCheckboxClassName = `
        dark:bg-bg-primary-light/85 bg-bg-primary-dark/85
      `;
      disabledInnerCheckboxClassName = `
        dark:bg-bg-primary-light/65 bg-bg-primary-dark/65
      `;

      finalLabel = placeholder;

      finalInput = (
        <label
          className="flex gap-2 items-center hover:cursor-pointer"
          htmlFor={id}
        >
          <input
            hidden
            type="checkbox"
            name={name}
            id={id}
            checked={checked}
            disabled={disabled}
            {...rest}
          />
          <span
            className={flattenClasses(`
              select-none text-sm
              ${finalLabel ? "" : "hidden"}
              ${labelCheckboxClassName}
              ${disabled ? disabledLabelClassName : enabledLabelClassName}
            `)}
          >
            {finalLabel}
          </span>
          <div className="relative flex items-center justify-center">
            <span
              className={flattenClasses(`
                border w-[22px] h-[22px] rounded-lg
                ${
                  disabled
                    ? disabledCheckboxClassName
                    : enabledCheckboxClassName
                }
                ${checkboxClassName}
              `)}
            />
            <div
              className={flattenClasses(`
                ${innerCheckboxBaseClassName}
                ${checked ? "scale-100" : "scale-0"}
                ${
                  disabled
                    ? disabledInnerCheckboxClassName
                    : enabledInnerCheckboxClassName
                }
              `)}
            />
          </div>
        </label>
      );

      finalReturn = (
        <div
          className={flattenClasses(`
            ${layoutBaseClassName}
            ${layoutClassName}
          `)}
        >
          {finalInput}
        </div>
      );
      break;

    default:
      disabledLayoutClassName = `
        border-disabled-border-light bg-disabled-bg-light
        dark:border-disabled-border-dark dark:bg-disabled-bg-dark
      `;
      enabledLayoutClassName = `
        border-border-strong-light bg-bg-primary-light
        dark:border-border-strong-dark dark:bg-bg-secondary-dark
      `;
      layoutBaseClassName = `
        w-full border rounded-xl relative flex items-center px-4 pt-7 pb-2
      `;

      inputBaseClassName = `
        peer ${iconName ? "w-[90%]" : "w-full"} focus:outline-0
      `;
      disabledInputClassName = `
        text-disabled-text-light focus:none
        dark:text-disabled-text-dark
      `;

      labelBaseClassName = `
        absolute pointer-events-none transition-all duration-200 ease-out -translate-y-6 text-sm
      `;
      enabledLabelClassName = `
        text-text-secondary-light
        dark:text-text-secondary-dark
      `;
      disabledLabelClassName = `
        select-none
        text-text-tertiary-light
        dark:text-text-tertiary-dark
      `;

      iconLayoutBaseClassName = `
        flex absolute right-0 me-2 top-[50%] -translate-y-[50%] rounded-full
      `;

      iconBaseClassName = `
        !text-[32px]
      `;
      enabledIconClassName = `
        text-text-tertiary-light
        dark:text-text-tertiary-dark
      `;
      disabledIconClassName = `
        text-disabled-text-light
        dark:text-disabled-text-dark
      `;

      finalLabel = placeholder;

      finalIcon = iconName && (
        <div
          onClick={() => document.getElementById(`${id}`)?.focus()}
          className={flattenClasses(`
            ${iconLayoutBaseClassName}
          `)}
        >
          <Icon
            className={flattenClasses(`
              ${iconBaseClassName}
              ${disabled ? disabledIconClassName : enabledIconClassName}
            `)}
            iconName={`${iconName}`}
          />
        </div>
      );

      finalInput = (
        <>
          <input
            className={flattenClasses(`
              ${inputBaseClassName}
              ${disabled && disabledInputClassName}
            `)}
            type="text"
            name={name}
            id={id}
            placeholder=""
            disabled={disabled}
            {...rest}
          />
          <label
            className={flattenClasses(`
              ${labelBaseClassName}
              ${disabled ? disabledLabelClassName : enabledLabelClassName}
            `)}
            htmlFor={id}
          >
            {finalLabel}
          </label>
          {finalIcon}
        </>
      );

      finalReturn = (
        <div
          className={flattenClasses(`
            ${layoutBaseClassName}
            ${layoutClassName}
            ${disabled ? disabledLayoutClassName : enabledLayoutClassName}
          `)}
        >
          {finalInput}
        </div>
      );
      break;
  }

  return finalReturn;
};

export default Input;
