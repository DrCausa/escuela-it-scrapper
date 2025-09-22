import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

type NotifyState = Record<string, boolean>;
type NotifyContextType = {
  notifications: NotifyState;
  setNotify: (path: string, value: boolean) => void;
};

const NotifyContext = createContext<NotifyContextType | undefined>(undefined);

type NotifyProviderProps = {
  children: ReactNode;
};

export const NotifyProvider = ({ children }: NotifyProviderProps) => {
  const [notifications, setNotifications] = useState<NotifyState>({});

  const setNotify = (path: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [path]: value }));
  };

  return (
    <NotifyContext.Provider value={{ notifications, setNotify }}>
      {children}
    </NotifyContext.Provider>
  );
};

export const useNotify = () => {
  const ctx = useContext(NotifyContext);
  if (!ctx) throw new Error("useNotify must be used within NotifyProvider");
  return ctx;
};
