import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { Classes } from "./components/Classes";
import { Trainers } from "./components/Trainers";
import { Testimonials } from "./components/Testimonials";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { RegistrationModal } from "./components/RegistrationModal";
import { LoginModal } from "./components/LoginModal";
import { VideoModal } from "./components/VideoModal";
import { BookingModal } from "./components/BookingModal";
import { ScheduleModal } from "./components/ScheduleModal";
import { Announcements } from "./components/Announcements";
import AdminApp from "./admin/AdminApp";
import NoticeAdminApp from "./admin/NoticeAdminApp";
import StaffPortal from "./portal/StaffPortal";
import { fetchServices, isVisibleService, type GymService } from "./lib/services";
import { fetchStaff, isVisibleTrainer, type TrainerProfile } from "./lib/staff";
import {
  getSession,
  loginAccount,
  pushAdminNotification,
  saveAccount,
  saveBooking,
  saveInquiry,
  setSession,
  type UserSession,
} from "./lib/storage";

function formatDate(value: Date) {
  return value.toISOString().split("T")[0];
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function UserApp() {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [services, setServices] = useState<GymService[]>([]);
  const [trainers, setTrainers] = useState<TrainerProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => getSession());

  useEffect(() => {
    let isMounted = true;

    const loadPageData = async () => {
      try {
        const [nextServices, nextStaff] = await Promise.all([fetchServices(), fetchStaff()]);

        if (!isMounted) return;

        setServices(nextServices.filter(isVisibleService));
        setTrainers(nextStaff.filter(isVisibleTrainer));
      } catch (error) {
        console.error("Khong the tai du lieu trang nguoi dung:", error);
      }
    };

    void loadPageData();

    const intervalId = window.setInterval(() => {
      void loadPageData();
    }, 10000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const handleBookClass = (classData: any) => {
    setSelectedClass(classData);
    setIsBookingOpen(true);
  };

  const handleRegisterClick = (serviceId?: number) => {
    setSelectedServiceId(serviceId ? String(serviceId) : "");
    setIsRegistrationOpen(true);
  };

  const handleLogin = async (payload: { email: string; password: string }) => {
    const session = loginAccount(payload.email, payload.password);
    setCurrentUser(session);
  };

  const handleSignup = async (payload: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    const session = saveAccount(payload);
    setSession(session);
    setCurrentUser(session);
    pushAdminNotification({
      title: "Tai khoan moi",
      message: `${payload.fullName} vua tao tai khoan voi email ${payload.email}.`,
      type: "account",
    });
  };

  const handleLogout = () => {
    setSession(null);
    setCurrentUser(null);
    toast.success("Da dang xuat");
  };

  const handleRegistration = async (payload: {
    fullName: string;
    email: string;
    phone: string;
    plan: string;
    goal: string;
    paymentMethod: "card" | "qr";
  }) => {
    const selectedPlan = services.find((service) => String(service.id) === payload.plan);
    const startDate = new Date();
    const durationDays = selectedPlan?.durationDays || 30;
    const endDate = addDays(startDate, durationDays);

    const response = await fetch("http://localhost:3001/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: payload.fullName,
        phone: payload.phone,
        email: payload.email,
        address: payload.goal || "Dang ky tu website nguoi dung",
        membershipType: selectedPlan?.name || "Dang ky website",
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        status: "Hoat dong",
        visits: 0,
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.error || "Khong the dang ky goi tap");
    }

    const customersResponse = await fetch("http://localhost:3001/customers");
    const customers = customersResponse.ok ? await customersResponse.json() : [];
    const matchedCustomer = (Array.isArray(customers) ? customers : []).find(
      (customer: any) =>
        String(customer.email || "").trim().toLowerCase() === payload.email.trim().toLowerCase() &&
        String(customer.phone || "").trim() === payload.phone.trim(),
    );

    const paymentMethodLabel = payload.paymentMethod === "card" ? "The" : "Chuyen khoan";
    const transactionResponse = await fetch("http://localhost:3001/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transactionDate: formatDate(startDate),
        type: "Thu",
        category: "Dang ky goi tap",
        description: `Thanh toan ${selectedPlan?.name || "dich vu"} tu website`,
        amount: Number(selectedPlan?.price) || 0,
        paymentMethod: paymentMethodLabel,
        customerId: matchedCustomer?.id || null,
      }),
    });

    const transactionResult = await transactionResponse.json().catch(() => ({}));

    if (!transactionResponse.ok) {
      throw new Error(transactionResult.error || "Khong the tao giao dich thanh toan");
    }

    pushAdminNotification({
      title: "Dang ky goi tap",
      message: `${payload.fullName} vua dang ky ${selectedPlan?.name || "dich vu"} va chon thanh toan bang ${payload.paymentMethod === "card" ? "the" : "ma QR"}.`,
      type: "registration",
    });
  };

  const handleContact = async (payload: {
    name: string;
    email: string;
    phone: string;
    message: string;
  }) => {
    saveInquiry(payload);
  };

  const handleBooking = async (payload: {
    name: string;
    email: string;
    phone: string;
    date: string;
  }) => {
    if (!selectedClass) {
      throw new Error("Chua chon lop hoc");
    }

    saveBooking({
      className: selectedClass.name,
      instructor: selectedClass.instructor,
      time: selectedClass.time,
      date: payload.date,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
    });

    pushAdminNotification({
      title: "Dat lich moi",
      message: `${payload.name} vua dat lop ${selectedClass.name} vao ngay ${payload.date}.`,
      type: "booking",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header
        currentUser={currentUser}
        onRegisterClick={() => handleRegisterClick()}
        onLoginClick={() => setIsLoginOpen(true)}
        onLogoutClick={handleLogout}
      />

      <Hero
        serviceCount={services.length}
        trainerCount={trainers.length}
        onRegisterClick={() => handleRegisterClick()}
        onVideoClick={() => setIsVideoOpen(true)}
      />

      <Announcements />

      <Services
        services={services}
        onSelectService={(service) => handleRegisterClick(service.id)}
      />

      <Classes
        onBookClass={handleBookClass}
        onViewSchedule={() => setIsScheduleOpen(true)}
      />

      <Trainers trainers={trainers} />
      <Testimonials />

      <Contact
        currentUser={currentUser}
        onSubmit={handleContact}
        onContactSuccess={() => toast.success("Gui tin nhan thanh cong!")}
      />

      <Footer />

      <RegistrationModal
        isOpen={isRegistrationOpen}
        services={services}
        currentUser={currentUser}
        selectedServiceId={selectedServiceId}
        onClose={() => setIsRegistrationOpen(false)}
        onSubmit={handleRegistration}
        onSuccess={() => toast.success("Dang ky thanh cong!")}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegistrationOpen(true);
        }}
        onLogin={handleLogin}
        onSignup={handleSignup}
        onLoginSuccess={() => toast.success("Dang nhap thanh cong!")}
        onSignupSuccess={() => toast.success("Tao tai khoan thanh cong!")}
      />

      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />

      <BookingModal
        isOpen={isBookingOpen}
        currentUser={currentUser}
        onClose={() => setIsBookingOpen(false)}
        classData={selectedClass}
        onSubmit={handleBooking}
        onSuccess={() => toast.success("Dat cho thanh cong!")}
      />

      <ScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onBookClass={handleBookClass}
      />

      <Toaster richColors position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserApp />} />
        <Route path="/admin" element={<AdminApp />} />
        <Route path="/notice-admin" element={<NoticeAdminApp />} />
        <Route path="/portal" element={<StaffPortal />} />
      </Routes>
    </Router>
  );
}
