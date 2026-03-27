import React from 'react';
import { Users, Dumbbell, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line
} from 'recharts';

// =========================
// HELPERS
// =========================
const formatNumber = (num: number) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(0) + 'K';
  return num.toString();
};

// =========================
// DATA (sau này thay bằng API)
// =========================
const revenueData = [
  { month: 'T1', revenue: 320 },
  { month: 'T2', revenue: 380 },
  { month: 'T3', revenue: 420 },
  { month: 'T4', revenue: 390 },
  { month: 'T5', revenue: 450 },
  { month: 'T6', revenue: 456 },
];

const attendanceData = [
  { day: 'T2', count: 95 },
  { day: 'T3', count: 112 },
  { day: 'T4', count: 98 },
  { day: 'T5', count: 125 },
  { day: 'T6', count: 140 },
  { day: 'T7', count: 156 },
  { day: 'CN', count: 128 },
];

export default function Dashboard() {

  // =========================
  // CALCULATE REAL DATA
  // =========================
  const currentRevenue = revenueData[revenueData.length - 1].revenue;
  const prevRevenue = revenueData[revenueData.length - 2].revenue;
  const revenueGrowth = Math.round(((currentRevenue - prevRevenue) / prevRevenue) * 100);

  const stats = [
    {
      title: 'Tổng Khách Hàng',
      value: formatNumber(342),
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Thiết Bị',
      value: formatNumber(89),
      change: '+3',
      icon: Dumbbell,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Doanh Thu Tháng',
      value: formatNumber(currentRevenue) + 'M',
      change: `${revenueGrowth > 0 ? '+' : ''}${revenueGrowth}%`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Lượt Tập Hôm Nay',
      value: formatNumber(128),
      change: '+8%',
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Quản lý tổng quan phòng Gym</p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;

          return (
            <Card key={i} className="hover:shadow-md transition">
              <CardContent className="p-6 flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>

                  <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-4 h-4" />
                    {stat.change}
                  </p>
                </div>

                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-xl`}>
                  <Icon className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* CHART */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* BAR */}
        <Card>
          <CardHeader>
            <CardTitle>Doanh Thu 6 Tháng</CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />

                <Bar
                  dataKey="revenue"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* LINE */}
        <Card>
          <CardHeader>
            <CardTitle>Lượt Tập Tuần</CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="count"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>

      {/* ACTIVITY */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt Động Gần Đây</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {[
            { text: 'Khách mới đăng ký', name: 'Nguyễn Văn A', color: 'bg-blue-500' },
            { text: 'Thanh toán gói VIP', name: 'Trần Thị B', color: 'bg-green-500' },
            { text: 'Bảo trì máy chạy bộ', name: '#12', color: 'bg-orange-500' },
            { text: 'Gia hạn thẻ', name: 'Lê Văn C', color: 'bg-purple-500' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${item.color}`} />
              <p className="flex-1 text-sm">
                <span className="text-gray-500">{item.text}:</span> {item.name}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  );
}