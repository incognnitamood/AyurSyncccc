import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Users,
  Calendar,
  Activity,
  TrendingUp,
  Bell,
  Plus,
  FileText,
  Clock,
  Heart,
  Leaf,
  Shield,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ayurSyncLogoCropped from "figma:asset/4e2a869d426b143d4a2649b4886ef8c263e2ca85.png"; // Updated import for the cropped image

const dashboardStats = [
  {
    title: "Active Patients",
    value: "142",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Diet Plans Created",
    value: "87",
    change: "+8%",
    trend: "up",
    icon: Calendar,
    color: "text-green-600",
  },
  {
    title: "Health Assessments",
    value: "64",
    change: "+15%",
    trend: "up",
    icon: Activity,
    color: "text-purple-600",
  },
  {
    title: "Success Rate",
    value: "94%",
    change: "+2%",
    trend: "up",
    icon: TrendingUp,
    color: "text-amber-600",
  },
];

const weeklyData = [
  { day: "Mon", patients: 12, plans: 8 },
  { day: "Tue", patients: 15, plans: 12 },
  { day: "Wed", patients: 18, plans: 14 },
  { day: "Thu", patients: 22, plans: 16 },
  { day: "Fri", patients: 19, plans: 15 },
  { day: "Sat", patients: 8, plans: 6 },
  { day: "Sun", patients: 5, plans: 3 },
];

const recentActivities = [
  {
    id: 1,
    type: "assessment",
    patient: "Sarah Johnson",
    action: "Completed Ayurvedic assessment",
    time: "2 hours ago",
    status: "completed",
  },
  {
    id: 2,
    type: "plan",
    patient: "Michael Chen",
    action: "Diet plan generated",
    time: "4 hours ago",
    status: "new",
  },
  {
    id: 3,
    type: "report",
    patient: "Emma Davis",
    action: "PDF report generated",
    time: "6 hours ago",
    status: "completed",
  },
  {
    id: 4,
    type: "follow-up",
    patient: "John Smith",
    action: "Follow-up appointment scheduled",
    time: "1 day ago",
    status: "scheduled",
  },
];

const notifications = [
  {
    id: 1,
    message: "5 patients need follow-up assessments",
    type: "warning",
    time: "1 hour ago",
  },
  {
    id: 2,
    message: "Weekly report is ready for download",
    type: "info",
    time: "3 hours ago",
  },
  {
    id: 3,
    message: "New recipe added to database",
    type: "success",
    time: "5 hours ago",
  },
];

export function Dashboard() {
  return (
    <div
      className="space-y-6"
      style={{ backgroundColor: "#E1D1A5" }}
    >
      {" "}
      {/* Main background color */}
      {/* AyurSync Brand Header with Logo */}
      <div
        className="relative overflow-hidden animate-fade-in-up p-8 sm:p-12 md:p-16 rounded-2xl border border-[#9E7E3D]/20 shadow-lg"
        style={{ backgroundColor: "#E0E0E0" }} // Changed this specific background color to #E0E0E0
      >
        <div className="relative z-10 flex flex-col items-center justify-center lg:flex-row lg:justify-center lg:gap-12">
          {/* Logo (cropped image) */}
          <div className="relative transform transition-transform duration-300 hover:scale-105">
            <img
              src={ayurSyncLogoCropped}
              alt="AyurSync Logo"
              className="w-40 h-40 md:w-48 md:h-48 object-contain"
            />
          </div>
        </div>
      </div>
      {/* Dashboard Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-[#9E7E3D]/20 card-rustic">
        <div className="animate-slide-in-left">
          <h2 className="text-2xl text-[#9E7E3D] mb-2 font-semibold">
            Dashboard
          </h2>
          <p className="text-[#4C7A5A]/80">
            Welcome back! Here's your practice overview.
          </p>
        </div>
        <div className="flex gap-3 animate-slide-in-right">
          <Button className="btn-rustic-outline px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4" />
            Generate Report
          </Button>
          <Button className="btn-rustic px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" />
            New Patient
          </Button>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="card-rustic animate-on-scroll"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#4C7A5A]/70 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl text-[#9E7E3D] mb-1 font-semibold">
                      {stat.value}
                    </p>
                    <div className="flex items-center">
                      <TrendingUp className="w-3 h-3 text-[#4C7A5A] mr-1" />
                      <span className="text-sm text-[#4C7A5A]">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#F5C24D]/20 to-[#D39A7A]/20 border border-[#9E7E3D]/10 transform transition-transform duration-300 hover:scale-110">
                    <Icon className="w-6 h-6 text-[#9E7E3D]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {/* Weekly Activity Chart - Full Width */}
      <Card className="card-rustic animate-on-scroll">
        <CardHeader>
          <CardTitle className="text-[#9E7E3D] flex items-center">
            <Activity className="w-5 h-5 mr-2 text-[#F5C24D]" />
            Weekly Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#9E7E3D"
                strokeOpacity={0.2}
              />
              <XAxis dataKey="day" stroke="#9E7E3D" />
              <YAxis stroke="#9E7E3D" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#E1D1A5",
                  border: "1px solid #9E7E3D",
                  borderRadius: "12px",
                  boxShadow:
                    "0 4px 20px rgba(158, 126, 61, 0.15)",
                }}
              />
              <Bar
                dataKey="patients"
                fill="#9E7E3D"
                name="Patients"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="plans"
                fill="#F5C24D"
                name="Diet Plans"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="card-rustic animate-on-scroll">
          <CardHeader>
            <CardTitle className="text-[#9E7E3D] flex items-center">
              <Activity className="w-5 h-5 mr-2 text-[#F5C24D]" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-[#E1D1A5]/50 to-[#F5C24D]/10 border border-[#9E7E3D]/10 transform transition-all duration-300 hover:scale-102 hover:shadow-md"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-2 h-2 rounded-full bg-[#4C7A5A] mt-2 animate-pulse" />
                  <div className="flex-1">
                    <p className="text-sm text-[#9E7E3D] font-medium">
                      {activity.patient}
                    </p>
                    <p className="text-sm text-[#4C7A5A]/80">
                      {activity.action}
                    </p>
                    <div className="flex items-center mt-1">
                      <Clock className="w-3 h-3 text-[#9E7E3D]/50 mr-1" />
                      <span className="text-xs text-[#9E7E3D]/60">
                        {activity.time}
                      </span>
                      <Badge
                        variant="secondary"
                        className="ml-2 text-xs bg-[#F5C24D]/20 text-[#9E7E3D] border-[#9E7E3D]/20"
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="card-rustic animate-on-scroll">
          <CardHeader>
            <CardTitle className="text-[#9E7E3D] flex items-center">
              <Bell className="w-5 h-5 mr-2 text-[#F5C24D]" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className="p-3 rounded-lg border border-[#9E7E3D]/10 bg-gradient-to-r from-white to-[#E1D1A5]/30 transform transition-all duration-300 hover:scale-102"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm flex-1 text-[#9E7E3D]">
                      {notification.message}
                    </p>
                    <Badge
                      variant={
                        notification.type === "warning"
                          ? "destructive"
                          : "secondary"
                      }
                      className="ml-2 text-xs bg-[#F5C24D]/20 text-[#9E7E3D] border-[#9E7E3D]/20"
                    >
                      {notification.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#4C7A5A]/60 mt-1">
                    {notification.time}
                  </p>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 btn-rustic-outline">
              View All Notifications
            </Button>
          </CardContent>
        </Card>
      </div>
      {/* About Us Section */}
      <Card className="card-rustic animate-on-scroll bg-gradient-to-br from-white via-[#E1D1A5]/30 to-[#F5C24D]/20">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#9E7E3D] mb-4">
              About AyurSync
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#9E7E3D] to-[#F5C24D] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#9E7E3D] to-[#F5C24D] rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#9E7E3D]">
                Holistic Wellness
              </h3>
              <p className="text-[#4C7A5A]/80">
                Integrating ancient Ayurvedic wisdom with modern
                nutritional science to create personalized
                wellness solutions for every individual.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#4C7A5A] to-[#D39A7A] rounded-full flex items-center justify-center mx-auto">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#9E7E3D]">
                Natural Balance
              </h3>
              <p className="text-[#4C7A5A]/80">
                Understanding your unique dosha constitution to
                recommend foods and lifestyle practices that
                restore and maintain your natural equilibrium.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#F5C24D] to-[#D39A7A] rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#9E7E3D]">
                Evidence-Based Care
              </h3>
              <p className="text-[#4C7A5A]/80">
                Combining traditional Ayurvedic principles with
                contemporary research to provide healthcare
                practitioners with reliable, effective treatment
                plans.
              </p>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#9E7E3D]/20">
            <p className="text-lg text-[#4C7A5A] text-center leading-relaxed">
              <span className="font-semibold text-[#9E7E3D]">
                AyurSync
              </span>{" "}
              empowers healthcare practitioners to deliver
              personalized Ayurvedic diet management through our
              comprehensive platform. From detailed patient
              assessments and automated meal planning to
              extensive recipe databases and professional
              reporting tools, we make ancient wisdom accessible
              in the modern healthcare setting.
            </p>
            <div className="text-center mt-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#9E7E3D] to-[#F5C24D] text-white px-6 py-2 rounded-full font-medium shadow-lg">
                <Leaf className="w-4 h-4" />
                Transforming Lives Through Balanced Nutrition
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}