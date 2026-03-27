import { Dumbbell, LogOut, Menu, UserCircle, Users, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { UserSession } from "../lib/storage";

interface HeaderProps {
  currentUser: UserSession | null;
  onRegisterClick: () => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export function Header({
  currentUser,
  onRegisterClick,
  onLoginClick,
  onLogoutClick,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Trang Chu", target: "home" },
    { name: "Thong Bao", target: "announcements" },
    { name: "Dich Vu", target: "services" },
    { name: "Lich Tap", target: "classes" },
    { name: "Huan Luyen Vien", target: "trainers" },
    { name: "Lien He", target: "contact" },
  ];

  const handleSectionClick = (target: string) => {
    const element = document.getElementById(target);
    if (!element) return;

    const offset = 80;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;

    window.scrollTo({
      top: elementPosition - offset,
      behavior: "smooth",
    });

    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-8 h-8 text-red-600" />
            <span className="text-xl text-white">Elite Fitness Xuan Dieu</span>
          </div>

          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.name}>
                <button
                  type="button"
                  onClick={() => handleSectionClick(item.target)}
                  className="text-white/80 hover:text-red-600 transition-colors"
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/portal"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition-colors hover:border-red-500/40 hover:text-white"
            >
              <Users className="h-4 w-4" />
              Portal
            </Link>
            {currentUser ? (
              <>
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  <UserCircle className="w-5 h-5 text-red-500" />
                  <div className="text-left leading-tight">
                    <div className="text-sm text-white">{currentUser.fullName}</div>
                    <div className="text-xs text-white/50">{currentUser.email}</div>
                  </div>
                </div>
                <button
                  onClick={onLogoutClick}
                  className="whitespace-nowrap px-3 py-2 text-white/80 transition-colors hover:text-white"
                >
                  Dang Xuat
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="whitespace-nowrap px-3 py-2 text-white/80 transition-colors hover:text-white"
                >
                  Dang Nhap
                </button>
                <button
                  onClick={onRegisterClick}
                  className="whitespace-nowrap rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
                >
                  Dang Ky
                </button>
              </>
            )}
          </div>

          <button
            className="text-white md:hidden"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="mt-4 pb-4 md:hidden">
            <ul className="flex flex-col gap-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  <button
                    type="button"
                    onClick={() => handleSectionClick(item.target)}
                    className="block text-white/80 transition-colors hover:text-red-600"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
              <li>
                <Link
                  to="/portal"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 text-white/80 hover:text-white"
                >
                  <Users className="h-4 w-4" />
                  Portal Nhan Su
                </Link>
              </li>
              {currentUser ? (
                <>
                  <li className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white/80">
                    <div className="flex items-center gap-2 text-white">
                      <UserCircle className="w-5 h-5 text-red-500" />
                      <span>{currentUser.fullName}</span>
                    </div>
                    <div className="mt-1 text-sm text-white/50">{currentUser.email}</div>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onLogoutClick();
                        setIsMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-left text-white transition-colors hover:bg-white/20"
                    >
                      <LogOut className="w-4 h-4" />
                      Dang Xuat
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <button
                      onClick={() => {
                        onLoginClick();
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-white/80 transition-colors hover:text-white"
                    >
                      Dang Nhap
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onRegisterClick();
                        setIsMenuOpen(false);
                      }}
                      className="w-full rounded-lg bg-red-600 px-6 py-2 text-white transition-colors hover:bg-red-700"
                    >
                      Dang Ky Ngay
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
