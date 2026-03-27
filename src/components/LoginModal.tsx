import { Lock, Mail, Phone, User, X } from "lucide-react";
import { useState } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onLogin: (payload: { email: string; password: string }) => Promise<void>;
  onSignup: (payload: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<void>;
  onLoginSuccess: () => void;
  onSignupSuccess: () => void;
}

export function LoginModal({
  isOpen,
  onClose,
  onSwitchToRegister,
  onLogin,
  onSignup,
  onLoginSuccess,
  onSignupSuccess,
}: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onLogin(loginData);
      onLoginSuccess();
      setLoginData({ email: "", password: "" });
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Khong the dang nhap");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      alert("Mat khau xac nhan khong khop");
      return;
    }

    if (signupData.password.length < 6) {
      alert("Mat khau phai co it nhat 6 ky tu");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSignup({
        fullName: signupData.fullName,
        email: signupData.email,
        phone: signupData.phone,
        password: signupData.password,
      });
      onSignupSuccess();
      setSignupData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Khong the tao tai khoan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-zinc-900 border border-white/10 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-zinc-900 border-b border-white/10 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-white mb-1">
              {isLogin ? "Dang Nhap" : "Tao Tai Khoan"}
            </h2>
            <p className="text-white/60">
              {isLogin
                ? "Dang nhap bang tai khoan da luu tren trinh duyet"
                : "Tai khoan duoc luu de dat lop va tu dong dien form"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex border-b border-white/10">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-4 transition-colors ${
              isLogin
                ? "text-red-600 border-b-2 border-red-600"
                : "text-white/60 hover:text-white"
            }`}
          >
            Đăng Nhập
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-4 transition-colors ${
              !isLogin
                ? "text-red-600 border-b-2 border-red-600"
                : "text-white/60 hover:text-white"
            }`}
          >
            Đăng Ký
          </button>
        </div>

        <div className="p-6">
          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <label htmlFor="login-email" className="block text-white/80 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="email"
                    id="login-email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    required
                    className="w-full bg-black border border-white/10 text-white pl-12 pr-4 py-3 rounded-lg focus:border-red-600 focus:outline-none transition-colors"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="block text-white/80 mb-2">
                  Mat Khau *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="password"
                    id="login-password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                    className="w-full bg-black border border-white/10 text-white pl-12 pr-4 py-3 rounded-lg focus:border-red-600 focus:outline-none transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900/40 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors"
              >
                {isSubmitting ? "Dang Dang Nhap..." : "Dang Nhap"}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-zinc-900 px-4 text-white/40">Hoac</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSwitchToRegister();
                }}
                className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg border border-white/20 transition-colors"
              >
                Đăng Ký Gói Tập Ngay
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-6">
              <div>
                <label htmlFor="signup-name" className="block text-white/80 mb-2">
                  Ho va Ten *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    id="signup-name"
                    name="fullName"
                    value={signupData.fullName}
                    onChange={handleSignupChange}
                    required
                    className="w-full bg-black border border-white/10 text-white pl-12 pr-4 py-3 rounded-lg focus:border-red-600 focus:outline-none transition-colors"
                    placeholder="Nguyen Van A"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-white/80 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="email"
                    id="signup-email"
                    name="email"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    required
                    className="w-full bg-black border border-white/10 text-white pl-12 pr-4 py-3 rounded-lg focus:border-red-600 focus:outline-none transition-colors"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-phone" className="block text-white/80 mb-2">
                  So Dien Thoai *
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="tel"
                    id="signup-phone"
                    name="phone"
                    value={signupData.phone}
                    onChange={handleSignupChange}
                    required
                    className="w-full bg-black border border-white/10 text-white pl-12 pr-4 py-3 rounded-lg focus:border-red-600 focus:outline-none transition-colors"
                    placeholder="0901 234 567"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-white/80 mb-2">
                  Mat Khau *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="password"
                    id="signup-password"
                    name="password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    required
                    className="w-full bg-black border border-white/10 text-white pl-12 pr-4 py-3 rounded-lg focus:border-red-600 focus:outline-none transition-colors"
                    placeholder="Toi thieu 6 ky tu"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-confirm-password" className="block text-white/80 mb-2">
                  Xác Nhận Mật Khẩu *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="password"
                    id="signup-confirm-password"
                    name="confirmPassword"
                    value={signupData.confirmPassword}
                    onChange={handleSignupChange}
                    required
                    className="w-full bg-black border border-white/10 text-white pl-12 pr-4 py-3 rounded-lg focus:border-red-600 focus:outline-none transition-colors"
                    placeholder="Nhap lai mat khau"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2 text-white/60 cursor-pointer">
                <input type="checkbox" required className="w-4 h-4 mt-1 accent-red-600" />
                <span className="text-sm">
                  Tôi đồng ý với điều khoản dịch vụ và chính sách bảo mật.
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900/40 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors"
              >
                {isSubmitting ? "Dang Tao Tai Khoan..." : "Tao Tai Khoan"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
