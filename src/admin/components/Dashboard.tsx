import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Bell,
  DollarSign,
  TrendingUp,
  Users,
  Dumbbell,
  UserPlus,
  CalendarPlus,
  ClipboardCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  getAdminNotifications,
  markAllAdminNotificationsAsRead,
  type AdminNotification,
} from "../../lib/storage";

function formatRelativeTime(timestamp: string) {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) return `${diffMinutes} phút trước`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} ngày trước`;
}

function getNotificationIcon(type: AdminNotification["type"]) {
  switch (type) {
    case "account":
      return UserPlus;
    case "booking":
      return CalendarPlus;
    case "registration":
      return ClipboardCheck;
    default:
      return Bell;
  }
}

function getNotificationColor(type: AdminNotification["type"]) {
  switch (type) {
    case "account":
      return "bg-blue-500";
    case "booking":
      return "bg-orange-500";
    case "registration":
      return "bg-green-500";
    default:
      return "bg-purple-500";
  }
}

export default function Dashboard() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);

  useEffect(() => {
    const loadNotifications = () => {
      setNotifications(getAdminNotifications());
    };

    loadNotifications();

    const intervalId = window.setInterval(loadNotifications, 3000);
    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === "elite_fitness_notifications") {
        loadNotifications();
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications],
  );

  const stats = [
    {
      title: "Tổng Khách Hàng",
      value: "342",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Thiết Bị",
      value: "89",
      change: "+3",
      icon: Dumbbell,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Doanh Thu Tháng",
      value: "456M",
      change: "+18%",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Thông Báo Mới",
      value: String(unreadCount),
      change: `${notifications.length} tổng`,
      icon: Bell,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const revenueData = [
    { month: "T1", revenue: 320 },
    { month: "T2", revenue: 380 },
    { month: "T3", revenue: 420 },
    { month: "T4", revenue: 390 },
    { month: "T5", revenue: 450 },
    { month: "T6", revenue: 456 },
  ];

  const attendanceData = [
    { day: "T2", count: 95 },
    { day: "T3", count: 112 },
    { day: "T4", count: 98 },
    { day: "T5", count: 125 },
    { day: "T6", count: 140 },
    { day: "T7", count: 156 },
    { day: "CN", count: 128 },
  ];

  const handleMarkAllRead = () => {
    setNotifications(markAllAdminNotificationsAsRead());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Tổng Quan</h1>
        <p className="text-gray-600">Elite Fitness Xuân Diệu - Dashboard Quản Lý</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                    <h3 className="text-3xl mb-1">{stat.value}</h3>
                    <p className="text-green-600 text-sm flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Doanh Thu 6 Tháng Gần Nhất</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lượt Tập Trong Tuần</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>Thông Báo Từ Trang Người Dùng</CardTitle>
            <button
              onClick={handleMarkAllRead}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Đánh dấu đã xem tất cả
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
                Chưa có thông báo nào từ trang người dùng.
              </div>
            ) : (
              notifications.slice(0, 12).map((notification) => {
                const Icon = getNotificationIcon(notification.type);

                return (
                  <div
                    key={notification.id}
                    className={`flex items-center gap-4 rounded-lg border p-4 ${
                      notification.read ? "bg-gray-50 border-gray-100" : "bg-blue-50 border-blue-100"
                    }`}
                  >
                    <div className={`w-2 h-12 rounded-full ${getNotificationColor(notification.type)}`} />
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                      <Icon className="w-5 h-5 text-gray-700" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                    </div>
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {formatRelativeTime(notification.createdAt)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
