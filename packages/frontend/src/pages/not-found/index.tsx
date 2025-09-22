import Button from "@components/commons/Button";
import Icon from "@components/commons/Icon";
import Footer from "@components/layouts/Footer";
import { useTheme } from "@hooks/useTheme";
import { usePageTitle } from "@hooks/usePageTitle";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  usePageTitle("404 Not Found");
  useTheme();

  return (
    <div className="font-primary bg-bg-primary-light text-text-primary-light dark:text-text-primary-dark dark:bg-bg-primary-dark min-h-[100dvh] flex flex-col">
      <div className="w-[30rem] mx-auto mt-10 flex flex-col flex-1">
        <div className="flex flex-col items-center text-center">
          <span className="text-[32px]">Houston, we have a 404...</span>
          <Icon iconName="rocket_launch" className="!text-[64px]" />
        </div>
        <Link to="/" className="mx-auto mt-8">
          <Button label="Go Home" isOutline={true} buttonType="primary" />
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default NotFoundPage;
