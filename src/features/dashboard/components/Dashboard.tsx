import { FullPageLoader } from "@/common/components/FullPageLoader";
import { Role } from "@/common/utils/roleUtils";
import { JSX, Suspense, lazy } from "react";
import { useAuthStore } from "../../auth/stores/authStore";
import SuperAdminDashboard from "./SuperAdmin/SuperAdmin";
const UserDashboard = lazy(() => import("./User/UserDashboard"));

const Dashboard = () => {
  const { user } = useAuthStore.getState();
  const role = user?.role;
  const roleDashboardMap: Partial<Record<Role, JSX.Element>> = {
    SuperAdmin: <SuperAdminDashboard />,
    Admin: <SuperAdminDashboard />,
    User: <UserDashboard />,
  };

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <FullPageLoader />
        </div>
      }
    >
      {role && roleDashboardMap[role as Role] ? (
        roleDashboardMap[role as Role]
      ) : (
        <div className="flex h-screen items-center justify-center">
          Dashboard not available for your role: {role ?? "Unknown"}
        </div>
      )}
    </Suspense>
  );
};

export default Dashboard;
