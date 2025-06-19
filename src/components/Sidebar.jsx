import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaList,
  FaCalendarAlt,
  FaSignOutAlt,
  FaTimes,
  FaHistory,
  FaAngrycreative,
  FaUser,
} from "react-icons/fa";
import { useUser, SignOutButton } from "@clerk/clerk-react";

const Sidebar = ({ isExpanded, setSidebarExpanded }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
 
  

  const menuItems = [
    { icon: <FaHome />, label: "Dashboard", path: "/admin/dashboard" },
    { icon: <FaCalendarAlt />, label: "Event", path: "/admin/event-list" },
    { icon: <FaAngrycreative />, label: "Event Planner", path: "/admin/event" },
    {
      icon: <FaHistory />,
      label: "Transactions",
      path: "/admin/transaction",
    },
    { path: "/admin/category", label: "Categories", icon: <FaList /> },
    { path: "/admin/profile", label: "Profile", icon: <FaUser /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarExpanded(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white z-50 transition-all duration-300
        ${isExpanded ? "w-64" : "w-0"} 
        lg:relative lg:w-64 overflow-hidden`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Event Master
            </h2>
            <button
              className="lg:hidden text-white text-2xl"
              onClick={() => setSidebarExpanded(false)}
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="p-4 flex items-center gap-4 border-b border-gray-800">
          <img
            src={user?.imageUrl || "https://via.placeholder.com/150"}
            alt="User Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="text-white font-medium">{user?.username || "User"}</p>
            {/* <p className="text-gray-400 text-sm">{user?.emailAddresses || ""}</p> */}
          </div>
        </div>

        <nav className="px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => {
                    navigate(item.path);
                    setSidebarExpanded(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span
                    className={`${isExpanded ? "inline" : "hidden"} lg:inline`}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <SignOutButton signOutCallback={() => navigate("/login")}>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-800 transition-all duration-200">
              <span className="text-xl">
                <FaSignOutAlt />
              </span>
              <span className={`${isExpanded ? "inline" : "hidden"} lg:inline`}>
                Logout
              </span>
            </button>
          </SignOutButton>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
