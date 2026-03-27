import { useState } from "react";
import Login from "./components/Login";
import AnnouncementManagement from "./components/AnnouncementManagement";
import { loginAdminAccount, type UserSession } from "../lib/storage";

export default function NoticeAdminApp() {
  const [currentAdmin, setCurrentAdmin] = useState<UserSession | null>(null);

  const handleLogin = async (username: string, password: string) => {
    try {
      const session = loginAdminAccount(username, password);
      setCurrentAdmin(session);
      return true;
    } catch {
      return false;
    }
  };

  const handleLogout = () => {
    setCurrentAdmin(null);
  };

  if (!currentAdmin) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold">Thong Bao Admin</h1>
            <p className="text-sm text-gray-500">{currentAdmin.fullName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Dang xuat
          </button>
        </div>
      </div>
      <div className="mx-auto max-w-7xl p-8">
        <AnnouncementManagement />
      </div>
    </div>
  );
}
