import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="flex h-screen relative overflow-hidden">
      <Sidebar
        isExpanded={isSidebarExpanded}
        setSidebarExpanded={setSidebarExpanded}
      />

      <div className="flex-grow overflow-y-auto transition-all duration-300 w-full pt-20 px-5 pb-5 bg-gray-900">
        <button
          className="lg:hidden fixed top-4 left-4 z-50 text-white bg-gray-800 p-2 rounded"
          onClick={() => setSidebarExpanded(true)}
        >
          ☰
        </button>

        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
