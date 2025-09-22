export type ICON_TYPE = "OUTLINED" | "ROUNDED" | "SHARP";

type IconProps = {
  iconName: string;
  iconType?: ICON_TYPE;
  isFilled?: boolean;
  className?: string;
};

const Icon = ({
  iconName,
  iconType = "OUTLINED",
  isFilled = false,
  className,
}: IconProps) => {
  const baseClassName = `material-symbols-${iconType.toLocaleLowerCase()} ${
    isFilled ? "filled" : ""
  }`;

  return (
    <span className={`${baseClassName} ${className}`.trim()}>{iconName}</span>
  );
};

export default Icon;
