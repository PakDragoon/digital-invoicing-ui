import NotificationPopup from "@/features/notifications/components/NotificationPopup";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { NotificationIcon, ProfilePic, SalesIcon } from "@/assets";
import { useAuthStore } from "../../auth/stores/authStore";
import { useNotificationStore } from "@/features/notifications/store/notificationStore";
import { useViewingEmployeeStore } from "@/features/dashboard/store/userStore";
import GlobalSearch from "@/features/sidebar/components/GlobalSearch";
import { CgProfile } from "react-icons/cg";
import { TbLogout2 } from "react-icons/tb";
import { FiUploadCloud } from "react-icons/fi";

const Navbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const notificationRef = useRef<HTMLDivElement | null>(null);

  const { unreadNotifications } = useNotificationStore();
  const { viewingEmployee, isViewingOtherDashboard } =
    useViewingEmployeeStore();
  const logout = useAuthStore((state) => state.logout);
  const { user } = useAuthStore.getState();

  const handleLogout = async () => {
    await logout(queryClient);
    navigate({ to: "/" });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfile = () => {
    navigate({ to: "/profile" });
    setShowProfileMenu(false);
  };

  const handleUploadCSV = () => {
    navigate({ to: "/upload-CSV" });
    setShowProfileMenu(false);
  };

  const menuItems = [
    {
      icon: CgProfile,
      label: "Profile",
      onClick: handleProfile,
      hoverColor: "group-hover:text-blue-600",
    },
    ...(user?.role === "Admin"
      ? [
          {
            icon: FiUploadCloud,
            label: "Upload CSV",
            onClick: handleUploadCSV,
            hoverColor: "group-hover:text-green-600",
          },
        ]
      : []),
    {
      icon: TbLogout2,
      label: "Logout",
      onClick: handleLogout,
      hoverColor: "group-hover:text-red-600",
    },
  ];

  return (
    <header className="flex h-[62px] w-full items-center border-b border-gray-200 bg-white">
      <div className="flex h-[60px] w-full items-center justify-between px-6">
        <div className="ml-20 flex items-center gap-2.5">
          <img
            src={`${SalesIcon}`}
            alt="Sales"
            style={{
              stroke: "#575b63",
              strokeWidth: 1.5,
              fill: "none",
            }}
          />
          <span className="whitespace-nowrap font-sans text-lg font-normal leading-7 text-[#212225]">
            {user?.role &&
              user.role
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .replace(/^./, (str) => str.toUpperCase())}{" "}
          </span>
          {isViewingOtherDashboard && viewingEmployee && (
            <span className="h-[24px] rounded-full bg-screamin-100 px-2 py-[2px] text-sm font-medium text-screamin-800">
              {viewingEmployee.name} -{" "}
              {viewingEmployee.role
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .replace(/^./, (str) => str.toUpperCase())}
            </span>
          )}
        </div>

        <div className="flex items-center gap-6">
          <div className="mt-[0.25rem]">
            {user?.role !== "Admin" && <GlobalSearch />}
          </div>

          <div ref={notificationRef}>
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative flex items-center rounded-full hover:bg-gray-100"
            >
              <img
                src={`${NotificationIcon}`}
                alt="Notifications"
                className="h-auto w-6"
              />

              {unreadNotifications.length > 0 && (
                <div
                  className="regular-text-xs absolute -right-3 -top-3 flex h-6 w-6 items-center justify-center rounded-full bg-cinnabar-400 text-white"
                  aria-label={`${unreadNotifications.length} unread notifications`}
                >
                  {unreadNotifications.length}
                </div>
              )}
            </button>
            {showNotifications && (
              <NotificationPopup onClose={() => setShowNotifications(false)} />
            )}
          </div>

          <div className="relative" ref={profileMenuRef}>
            <div
              className="flex cursor-pointer items-center rounded-lg hover:bg-gray-100"
              onClick={() => setShowProfileMenu((prev) => !prev)}
            >
              <img
                src={`${ProfilePic}`}
                className="rounded-full pr-4"
                alt="Profile"
              />
              <span className="whitespace-nowrap font-sans text-[0.875rem] font-medium text-[#212225]">
                {user?.fullName && user.fullName.trim() !== ""
                  ? user.fullName
                  : `${user?.firstName?.charAt(0).toUpperCase()}${user?.firstName?.slice(1).toLowerCase() || ""} ${user?.lastName?.charAt(0).toUpperCase()}${user?.lastName?.slice(1).toLowerCase() || ""}`}
              </span>
            </div>

            {showProfileMenu && (
              <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
                {menuItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={index}
                      className="group flex items-center px-3 py-1 hover:bg-gray-100"
                    >
                      <IconComponent
                        className={`h-5 w-5 transition-colors duration-200 ${item.hoverColor}`}
                      />
                      <button
                        type="button"
                        onClick={item.onClick}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700"
                      >
                        {item.label}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
