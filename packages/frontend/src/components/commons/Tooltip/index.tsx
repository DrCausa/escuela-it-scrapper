import { flattenClasses } from "@/utils/classNames";
import { type ReactNode } from "react";

type TooltipProps = {
  children: ReactNode;
  message?: string;
  className?: string;
};

const Tooltip = ({ children, message, className = "" }: TooltipProps) => {
  return (
    <>
      <div
        className={flattenClasses(`
          flex relative hover:cursor-pointer
          ${className}
        `)}
      >
        <div className="peer">{children}</div>
        <div className="z-1000 hidden absolute text-[10px] w-[8rem] left-[50%] -translate-x-[50%] bottom-7 bg-bg-surface-dark dark:bg-bg-surface-light dark:text-text-secondary-light text-text-secondary-dark px-2 py-1 rounded-lg text-center peer-hover:block after:absolute after:left-[50%] after:-translate-x-[50%] after:bottom-0 after:translate-y-3.5 after:text-bg-surface-dark dark:after:text-bg-surface-light after:text-[15px] after:content-['▼'] after:pointer-events-none">
          {message}
        </div>
      </div>
    </>
  );
};

export default Tooltip;
