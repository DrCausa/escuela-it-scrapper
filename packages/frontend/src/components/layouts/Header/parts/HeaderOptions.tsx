import { useNotify } from "@/contexts/NotificationContext";
import Icon from "@components/commons/Icon";
import { useState } from "react";
import { Link } from "react-router-dom";

type optionData = {
  label: string;
  icon: string;
  page: string;
};

const options: optionData[] = [
  {
    label: "Home",
    icon: "home",
    page: "/",
  },
  {
    label: "Results/History",
    icon: "chronic",
    page: "/history",
  },
];

const HeaderOptions = () => {
  const { notifications, setNotify } = useNotify();

  return (
    <ul className="flex items-center">
      {options.map((opt, index) => {
        const [hovered, setHovered] = useState(true);
        return (
          <li key={index} className="relative">
            <Link
              to={opt.page}
              className="px-3 flex items-center gap-1 hover:cursor-pointer"
              onMouseEnter={() => setHovered(false)}
              onMouseLeave={() => setHovered(true)}
              onClick={() => setNotify(opt.page, false)}
            >
              <span className="text-md">{opt.label}</span>
              <Icon
                className="!text-[28px] transition-all duration-500 ease-out"
                iconName={opt.icon}
                isFilled={hovered}
              />
            </Link>
            {notifications[opt.page] && (
              <div>
                <span className="absolute right-0 top-0 w-[10px] aspect-square bg-btn-success-bg rounded-full"></span>
                <span className="absolute right-0 top-0 w-[10px] aspect-square bg-btn-success-bg rounded-full animate-ping"></span>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default HeaderOptions;
