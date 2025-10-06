import { type ReactNode } from "react";

type TooltipProps = {
  children: ReactNode;
  message?: string;
};

const Tooltip = ({ children, message }: TooltipProps) => {
  return (
    <>
      <div className="flex relative hover:cursor-pointer">
        {children}
        <div className="absolute opacity-0 text-[10px] w-[8rem] left-[50%] -translate-x-[50%] bottom-7 bg-bg-surface-dark dark:bg-bg-surface-light dark:text-text-secondary-light text-text-secondary-dark px-2 py-1 rounded-lg text-center peer-hover:opacity-100">
          {message}
        </div>
      </div>
    </>
  );
};

export default Tooltip;
