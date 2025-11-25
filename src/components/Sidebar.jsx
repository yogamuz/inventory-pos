import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Home,
  ShoppingBag,
  Users,
  Package,
  Warehouse,
  Boxes,
  ClipboardList,
  ClipboardCheck,
  Clipboard,
  Archive,
  Settings,
  BarChart3,
  FileText,
  X,
  LogOut,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";
function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      id: "dashboard",
      icon: Home,
      label: "Dashboard",
      path: "/",
      group: "Main",
    },
    {
      id: "stocks",
      icon: ClipboardCheck,
      label: "Stocks",
      path: "/stocks",
      group: "Main",
    },
    {
      id: "products",
      icon: Package,
      label: "Products",
      path: "/products",
      group: "Main",
    },
    {
      id: "analytics",
      icon: BarChart3,
      label: "Analytics",
      path: "/analytics",
      group: "Reports",
    },
    {
      id: "reports",
      icon: ClipboardList,
      label: "History",
      path: "/history",
      group: "Reports",
    },

  ];

  const groupedMenus = menuItems.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  const handleMenuClick = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };
const handleLogout = async () => {
  try {
    await logout();
    navigate("/login", { state: { logoutSuccess: true } });
  } catch (error) {
    console.error("Logout failed:", error);
    toast.error("Gagal logout. Silakan coba lagi.");
  }
};

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0  z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-red-500">
              MENU
            </h1>
            <button onClick={toggleSidebar} className="lg:hidden">
              <X size={24} />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto py-4">
            {Object.entries(groupedMenus).map(([group, items]) => (
              <div key={group} className="mb-6">
                <h3 className="px-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {group}
                </h3>
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item.path)}
                      className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
                        isActive
                          ? "bg-red-50 text-red-500 border-red-400 border-red-500"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-semibold">
                {user?.username?.substring(0, 2).toUpperCase() || "MC"}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">ADMIN</p>
                <p className="text-xs text-gray-500">
                  {"baksoacileak@gmail.com"}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
