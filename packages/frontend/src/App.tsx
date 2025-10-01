import { Outlet } from "react-router-dom";
import AppLayout from "@components/layouts/AppLayout";
import { useTheme } from "@hooks/useTheme";
import { NotifyProvider } from "@contexts/NotificationContext";

function App() {
  useTheme();

  return (
    <NotifyProvider>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </NotifyProvider>
  );
}

export default App;
