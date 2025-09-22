import Header from "@components/layouts/Header";
import Footer from "@components/layouts/Footer";
import type { ReactNode } from "react";

type AppLayoutProps = {
  children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-[100dvh] flex flex-col font-primary bg-bg-primary-light text-text-primary-light dark:text-text-primary-dark dark:bg-bg-primary-dark">
      <Header />
      <main className="flex-1 scroll-smooth">{children}</main>
      <Footer />
    </div>
  );
};

export default AppLayout;
