import React, { useMemo, useState } from "react";
import {
  Briefcase,
  DollarSign,
  Dumbbell,
  LayoutDashboard,
  Menu,
  Shield,
  Users,
} from "lucide-react";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import EquipmentManagement from "./components/EquipmentManagement";
import StaffManagement from "./components/StaffManagement";
import ServiceManagement from "./components/ServiceManagement";
import CustomerManagement from "./components/CustomerManagement";
import FinanceManagement from "./components/FinanceManagement";
import AccountManagement from "./components/AccountManagement";
import OperationsCenter from "./components/OperationsCenter";
import {
  loginAdminAccount,
  type UserSession,
} from "../lib/storage";

type TabType =
  | "dashboard"
  | "equipment"
  | "staff"
  | "services"
  | "customers"
  | "finance"
  | "accounts"
  | "operations";

const ROLE_TAB_ACCESS: Record<NonNullable<UserSession["role"]>, TabType[]> = {
  super_admin: [
    "dashboard",
    "equipment",
    "staff",
    "services",
    "customers",
    "finance",
    "accounts",
    "operations",
  ],
  admin: [
    "dashboard",
    "equipment",
    "staff",
    "services",
    "customers",
    "finance",
    "accounts",
    "operations",
  ],
  manager: ["dashboard", "equipment", "staff", "services", "customers", "finance", "operations"],
  trainer: ["dashboard", "customers", "staff", "operations"],
  staff: ["dashboard", "customers", "services", "operations"],
  member: ["dashboard"],
};

export default function App() {
  const { currentAdmin, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const allowedTabs = useMemo(
    () => (currentAdmin ? ROLE_TAB_ACCESS[currentAdmin.role] || ["dashboard"] : ["dashboard"]),
    [currentAdmin],
  );

  if (!currentAdmin) {
    return <Login onLogin={login} />;
  }

  const menuItems = [
    { id: "dashboard" as TabType, label: "Tong Quan", icon: LayoutDashboard },
    { id: "equipment" as TabType, label: "Thiet Bi", icon: Dumbbell },
    { id: "staff" as TabType, label: "Nhan Vien", icon: Users },
    { id: "services" as TabType, label: "Dich Vu", icon: Briefcase },
    { id: "customers" as TabType, label: "Khach Hang", icon: Users },
    { id: "finance" as TabType, label: "Tai Chinh", icon: DollarSign },
    { id: "accounts" as TabType, label: "Tai Khoan", icon: Shield },
    { id: "operations" as TabType, label: "Dieu Phoi", icon: Briefcase },
  ].filter((item) => allowedTabs.includes(item.id));

  const safeActiveTab = allowedTabs.includes(activeTab) ? activeTab : allowedTabs[0];

  const renderContent = () => {
    switch (safeActiveTab) {
      case "dashboard":
        return <Dashboard />;
      case "equipment":
        return <EquipmentManagement />;
      case "staff":
        return <StaffManagement />;
      case "services":
        return <ServiceManagement />;
      case "customers":
        return <CustomerManagement />;
      case "finance":
        return <FinanceManagement />;
      case "accounts":
        return <AccountManagement />;
      case "operations":
        return <OperationsCenter />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-blue-600 to-blue-800 text-white transition-all duration-300 flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <h1 className="font-bold text-xl">Elite Fitness</h1>
              <p className="text-blue-200 text-sm">{currentAdmin.fullName}</p>
              <p className="text-blue-300 text-xs mt-1">{currentAdmin.role}</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-blue-700 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  safeActiveTab === item.id ? "bg-blue-700 shadow-lg" : "hover:bg-blue-700/50"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-blue-700 space-y-3">
          {sidebarOpen && <div className="text-sm text-blue-200">© 2025 Elite Fitness</div>}
          <button
            onClick={logout}
            className="w-full rounded-lg bg-blue-700/60 px-4 py-2 text-left text-sm hover:bg-blue-700"
          >
            Dang xuat
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">{renderContent()}</div>
      </main>
    </div>
  );
}

function useAuth() {
  const [currentAdmin, setCurrentAdmin] = useState<UserSession | null>(null);

  const login = async (username: string, password: string) => {
    try {
      const session = loginAdminAccount(username, password);
      setCurrentAdmin(session);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setCurrentAdmin(null);
  };

  return { currentAdmin, login, logout };
}
