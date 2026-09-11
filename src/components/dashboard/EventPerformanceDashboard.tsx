import React, { useState } from "react";
import {
  LayoutDashboard,
  CalendarCheck,
  TrendingUp,
  Users,
  Settings,
  Search,
  Download,
  MoreVertical,
  RotateCw,
  AreaChart as AreaChartIcon,
  BarChart3,
  LineChart as LineChartIcon,
  CheckCircle2,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// ── Data Definitions Matching Visual Reference ──

interface RevenueDataPoint {
  month: string;
  revenue: number;
  projected: number;
}

interface BookingsDataPoint {
  month: string;
  bookings: number;
  capacity: number;
}

const INITIAL_REVENUE_DATA: RevenueDataPoint[] = [
  { month: "Jan", revenue: 850, projected: 800 },
  { month: "Feb", revenue: 920, projected: 880 },
  { month: "Mar", revenue: 780, projected: 920 },
  { month: "Apr", revenue: 1150, projected: 1050 },
  { month: "May", revenue: 980, projected: 1100 },
  { month: "Jun", revenue: 1280, projected: 1200 },
  { month: "Jul", revenue: 1120, projected: 1250 },
  { month: "Aug", revenue: 1450, projected: 1300 },
  { month: "Sep", revenue: 1380, projected: 1350 },
  { month: "Oct", revenue: 1240, projected: 1400 },
  { month: "Nov", revenue: 1620, projected: 1500 },
  { month: "Dec", revenue: 1480, projected: 1550 },
];

const INITIAL_BOOKINGS_DATA: BookingsDataPoint[] = [
  { month: "Jan", bookings: 88, capacity: 120 },
  { month: "Feb", bookings: 55, capacity: 100 },
  { month: "Mar", bookings: 65, capacity: 110 },
  { month: "Apr", bookings: 50, capacity: 100 },
  { month: "May", bookings: 80, capacity: 130 },
  { month: "Jun", bookings: 110, capacity: 140 },
  { month: "Jul", bookings: 125, capacity: 150 },
  { month: "Aug", bookings: 95, capacity: 130 },
  { month: "Sep", bookings: 60, capacity: 100 },
  { month: "Oct", bookings: 75, capacity: 110 },
  { month: "Nov", bookings: 90, capacity: 120 },
  { month: "Dec", bookings: 135, capacity: 160 },
];

export interface EventPerformanceDashboardProps {
  className?: string;
}

export const EventPerformanceDashboard: React.FC<EventPerformanceDashboardProps> = ({
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState<string>("Dashboard");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [revenueChartType, setRevenueChartType] = useState<"area" | "line" | "bar">("area");
  const [bookingsChartType, setBookingsChartType] = useState<"bar" | "line" | "area">("bar");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>(INITIAL_REVENUE_DATA);
  const [bookingsData, setBookingsData] = useState<BookingsDataPoint[]>(INITIAL_BOOKINGS_DATA);

  // Trigger telemetry refresh with jitter simulation
  const handleRefresh = (type: "revenue" | "bookings" | "all") => {
    setIsRefreshing(true);
    setTimeout(() => {
      if (type === "revenue" || type === "all") {
        setRevenueData((prev) =>
          prev.map((d) => ({
            ...d,
            revenue: Math.round(d.revenue * (0.96 + Math.random() * 0.08)),
          }))
        );
      }
      if (type === "bookings" || type === "all") {
        setBookingsData((prev) =>
          prev.map((d) => ({
            ...d,
            bookings: Math.max(20, Math.round(d.bookings * (0.95 + Math.random() * 0.1))),
          }))
        );
      }
      setIsRefreshing(false);
    }, 600);
  };

  // Trigger Report Download action
  const handleDownload = () => {
    setDownloadSuccess(true);
    const reportData = {
      title: "Event Performance Report",
      timestamp: new Date().toISOString(),
      kpis: {
        totalRevenue: "$1,240,000",
        revenueDelta: "+12% vs last year",
        totalEvents: 42,
        bookingsDelta: "+8% from last quarter",
        profit: "$845,000",
        loss: "$395,000",
        margin: "+68%",
        avgRating: "4.6/5",
        feedback: "UX",
      },
      monthlyRevenue: revenueData,
      monthlyBookings: bookingsData,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `event-performance-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Events Management", icon: CalendarCheck },
    { label: "Performance", icon: TrendingUp },
    { label: "Clients", icon: Users },
    { label: "Team Workspace", icon: Settings },
  ];

  return (
    <div
      className={`w-full bg-[#0e0e11] text-white rounded-2xl md:rounded-3xl border border-white/[0.08] shadow-2xl overflow-hidden flex flex-col font-sans transition-all duration-300 ${className}`}
      style={{
        boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px rgba(99, 102, 241, 0.06)",
      }}
    >
      {/* ══════════════════════════════════════════════════════════════
          1. TOP NAVIGATION / HEADER BAR (MATCHING REFERENCE IMAGE)
          ══════════════════════════════════════════════════════════════ */}
      <header className="w-full bg-[#131317] border-b border-white/[0.08] px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            {/* 4-square grid icon matching reference logo */}
            <div className="grid grid-cols-2 gap-1 w-3.5 h-3.5">
              <span className="w-1.5 h-1.5 rounded-xs bg-white"></span>
              <span className="w-1.5 h-1.5 rounded-xs bg-white/80"></span>
              <span className="w-1.5 h-1.5 rounded-xs bg-white/80"></span>
              <span className="w-1.5 h-1.5 rounded-xs bg-white"></span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-white font-sans">
              NexEvent
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-white/50 border border-white/[0.08]">
              v2.4
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xs sm:max-w-sm mx-2 sm:mx-4">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-3.5 w-3.5 text-white/40 pointer-events-none" />
            <input
              type="text"
              placeholder="Search event..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1c1c22] border border-white/[0.08] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all font-sans"
            />
          </div>
        </div>

        {/* Right Actions: Download Report & User Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Download Report Button */}
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-white/90 active:scale-95 transition-all shadow-md shadow-white/10 cursor-pointer"
          >
            {downloadSuccess ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Downloaded</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Download Report</span>
              </>
            )}
          </button>

          {/* User Profile Pill (Robbi Darwis) */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-white/[0.08]">
            <div className="relative">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 p-[1.5px] flex items-center justify-center shadow-inner">
                <div className="w-full h-full rounded-full bg-[#1c1c22] flex items-center justify-center overflow-hidden">
                  <span className="text-[10px] font-bold text-white/90">RD</span>
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-[#131317]"></span>
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-white/95 leading-tight">
                Robbi Darwis
              </span>
              <span className="text-[10px] text-white/45 truncate max-w-[110px]">
                robbidarwis22@...
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-white/40 hidden sm:block" />
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════
          2. BODY: LEFT SIDEBAR + MAIN CONTENT WORKSPACE
          ══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-56 bg-[#131317] border-b md:border-b-0 md:border-r border-white/[0.08] p-3 sm:p-4 flex flex-row md:flex-col gap-1 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setActiveTab(item.label)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#1f1f26] text-white font-semibold shadow-inner border border-white/[0.07]"
                    : "text-white/50 hover:text-white/90 hover:bg-white/[0.04]"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    isSelected ? "text-indigo-400" : "text-white/40"
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Quick Telemetry Footnote */}
          <div className="hidden md:block mt-auto pt-6 border-t border-white/[0.06] text-[11px] text-white/40">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
              <div className="flex items-center justify-between text-white/60 font-medium">
                <span>System Sync</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-[10px] text-white/35">
                Real-time node telemetry active across all clusters.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Dashboard Canvas */}
        <main className="flex-1 bg-[#0b0b0e] p-4 sm:p-6 lg:p-7 overflow-y-auto space-y-6">
          
          {/* Main Title & Subtitle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                Event Performance Dashboard
              </h1>
              <p className="text-xs text-white/55 mt-1 max-w-2xl leading-relaxed">
                Monitor revenue, event outcomes, workload, and team efficiency across all ongoing and completed events. Stay optimized and make smarter operational decisions.
              </p>
            </div>

            {/* Quick Refresh Telemetry Button */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                type="button"
                onClick={() => handleRefresh("all")}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#17171d] border border-white/[0.08] hover:border-white/20 text-xs font-mono text-white/70 hover:text-white transition-all cursor-pointer"
              >
                <RotateCw className={`h-3 w-3 ${isRefreshing ? "animate-spin text-indigo-400" : ""}`} />
                <span>Sync Telemetry</span>
              </button>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              3. TOP ROW: 4 CORE KPI METRIC CARDS
              ══════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* KPI 1: Event Revenue Overview */}
            <div className="bg-[#141419] rounded-2xl p-4 sm:p-5 border border-white/[0.07] hover:border-white/15 transition-all shadow-lg relative group">
              <div className="flex items-center justify-between text-xs text-white/50 mb-2.5">
                <span className="font-medium">Event Revenue Overview</span>
                <button className="text-white/30 hover:text-white/70 p-1 rounded-md">
                  <MoreVertical className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="text-2xl sm:text-[26px] font-extrabold text-white tracking-tight tabular">
                $1,240,000
                <span className="text-xs font-normal text-white/45 ml-2">Total Revenue</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  <ArrowUpRight className="h-3 w-3" /> +12% vs last year
                </span>
              </div>
              <div className="mt-2 text-[11px] text-white/45">
                Top Event Type: <span className="text-white/80 font-medium">Conferences</span>
              </div>
            </div>

            {/* KPI 2: Event Bookings Summary */}
            <div className="bg-[#141419] rounded-2xl p-4 sm:p-5 border border-white/[0.07] hover:border-white/15 transition-all shadow-lg relative group">
              <div className="flex items-center justify-between text-xs text-white/50 mb-2.5">
                <span className="font-medium">Event Bookings Summary</span>
                <button className="text-white/30 hover:text-white/70 p-1 rounded-md">
                  <MoreVertical className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="text-2xl sm:text-[26px] font-extrabold text-white tracking-tight tabular">
                42
                <span className="text-xs font-normal text-white/45 ml-2">Total Events</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  <ArrowUpRight className="h-3 w-3" /> +8% from last quarter
                </span>
              </div>
              <div className="mt-2 text-[11px] text-white/45">
                Most Popular: <span className="text-white/80 font-medium">Product Launches</span>
              </div>
            </div>

            {/* KPI 3: Profit & Loss */}
            <div className="bg-[#141419] rounded-2xl p-4 sm:p-5 border border-white/[0.07] hover:border-white/15 transition-all shadow-lg relative group">
              <div className="flex items-center justify-between text-xs text-white/50 mb-2.5">
                <span className="font-medium">Profit & Loss</span>
                <button className="text-white/30 hover:text-white/70 p-1 rounded-md">
                  <MoreVertical className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="text-2xl sm:text-[26px] font-extrabold text-white tracking-tight tabular">
                $845,000
                <span className="text-xs font-normal text-white/45 ml-2">Profit</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px]">
                <span className="text-white/50">Loss: <span className="text-white/80 font-medium">$395,000</span></span>
                <span className="font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  Margin: +68%
                </span>
              </div>
              <div className="mt-2 text-[11px] text-white/45">
                Net EBITDA: <span className="text-white/80 font-medium">+31.2%</span>
              </div>
            </div>

            {/* KPI 4: Client Feedback */}
            <div className="bg-[#141419] rounded-2xl p-4 sm:p-5 border border-white/[0.07] hover:border-white/15 transition-all shadow-lg relative group">
              <div className="flex items-center justify-between text-xs text-white/50 mb-2.5">
                <span className="font-medium">Client Feedback</span>
                <button className="text-white/30 hover:text-white/70 p-1 rounded-md">
                  <MoreVertical className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="text-2xl sm:text-[26px] font-extrabold text-white tracking-tight tabular">
                4.6/5
                <span className="text-xs font-normal text-white/45 ml-2">Avg Rating</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  <ArrowUpRight className="h-3 w-3" /> +4% Improvement
                </span>
              </div>
              <div className="mt-2 text-[11px] text-white/45">
                Top Feedback: <span className="text-white/80 font-medium">UX</span>
              </div>
            </div>

          </div>

          {/* ══════════════════════════════════════════════════════════════
              4. BOTTOM ROW: DUAL ANALYTICS CHARTS (REVENUE & BOOKINGS)
              ══════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            
            {/* Chart 1: Event Revenue Trend */}
            <div className="bg-[#141419] rounded-2xl p-4 sm:p-5 border border-white/[0.07] shadow-xl flex flex-col">
              {/* Card Header & Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                <div>
                  <h3 className="text-sm font-bold text-white font-sans">
                    Event Revenue Trend
                  </h3>
                  <p className="text-[11px] text-white/40">
                    Trailing 12-month gross turnover in thousands ($USD)
                  </p>
                </div>

                {/* View Mode & Refresh Toolbar */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto bg-[#1c1c23] p-1 rounded-xl border border-white/[0.06]">
                  <button
                    type="button"
                    title="Area Chart"
                    onClick={() => setRevenueChartType("area")}
                    className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                      revenueChartType === "area"
                        ? "bg-white text-black shadow"
                        : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    <AreaChartIcon className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Line Chart"
                    onClick={() => setRevenueChartType("line")}
                    className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                      revenueChartType === "line"
                        ? "bg-white text-black shadow"
                        : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    <LineChartIcon className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Bar Chart"
                    onClick={() => setRevenueChartType("bar")}
                    className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                      revenueChartType === "bar"
                        ? "bg-white text-black shadow"
                        : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    <BarChart3 className="h-3.5 w-3.5" />
                  </button>
                  
                  <div className="h-3 w-[1px] bg-white/[0.1] mx-0.5" />

                  <button
                    type="button"
                    title="Refresh Data"
                    onClick={() => handleRefresh("revenue")}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-mono text-white/60 hover:text-white hover:bg-white/[0.05] transition-all cursor-pointer"
                  >
                    <RotateCw className={`h-3 w-3 ${isRefreshing ? "animate-spin text-indigo-400" : ""}`} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* Chart Visualization */}
              <div className="h-64 sm:h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  {revenueChartType === "area" ? (
                    <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#312e81" stopOpacity={0.15} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                      <XAxis
                        dataKey="month"
                        stroke="#6b7280"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                      />
                      <YAxis
                        stroke="#6b7280"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val) => `$${val}`}
                        domain={[0, 2000]}
                        ticks={[0, 500, 1000, 1500, 2000]}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-[#1c1c24] border border-white/10 rounded-xl p-2.5 shadow-xl text-xs">
                                <p className="font-semibold text-white">{label}</p>
                                <p className="text-indigo-400 font-mono font-bold mt-1">
                                  Revenue: ${payload[0].value?.toLocaleString()}k
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#6366f1"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#revenueGradient)"
                      />
                    </AreaChart>
                  ) : revenueChartType === "line" ? (
                    <LineChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                      <XAxis dataKey="month" stroke="#6b7280" fontSize={11} tickLine={false} />
                      <YAxis
                        stroke="#6b7280"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val) => `$${val}`}
                        domain={[0, 2000]}
                      />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} dot={{ r: 3 }} />
                    </LineChart>
                  ) : (
                    <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                      <XAxis dataKey="month" stroke="#6b7280" fontSize={11} tickLine={false} />
                      <YAxis
                        stroke="#6b7280"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val) => `$${val}`}
                        domain={[0, 2000]}
                      />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Event Bookings Trend */}
            <div className="bg-[#141419] rounded-2xl p-4 sm:p-5 border border-white/[0.07] shadow-xl flex flex-col">
              {/* Card Header & Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                <div>
                  <h3 className="text-sm font-bold text-white font-sans">
                    Event Bookings Trend
                  </h3>
                  <p className="text-[11px] text-white/40">
                    Confirmed venue and protocol event allocation count
                  </p>
                </div>

                {/* View Mode & Refresh Toolbar */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto bg-[#1c1c23] p-1 rounded-xl border border-white/[0.06]">
                  <button
                    type="button"
                    title="Bar Chart"
                    onClick={() => setBookingsChartType("bar")}
                    className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                      bookingsChartType === "bar"
                        ? "bg-white text-black shadow"
                        : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    <BarChart3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Line Chart"
                    onClick={() => setBookingsChartType("line")}
                    className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                      bookingsChartType === "line"
                        ? "bg-white text-black shadow"
                        : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    <LineChartIcon className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Area Chart"
                    onClick={() => setBookingsChartType("area")}
                    className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                      bookingsChartType === "area"
                        ? "bg-white text-black shadow"
                        : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    <AreaChartIcon className="h-3.5 w-3.5" />
                  </button>

                  <div className="h-3 w-[1px] bg-white/[0.1] mx-0.5" />

                  <button
                    type="button"
                    title="Refresh Data"
                    onClick={() => handleRefresh("bookings")}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-mono text-white/60 hover:text-white hover:bg-white/[0.05] transition-all cursor-pointer"
                  >
                    <RotateCw className={`h-3 w-3 ${isRefreshing ? "animate-spin text-indigo-400" : ""}`} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* Chart Visualization */}
              <div className="h-64 sm:h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  {bookingsChartType === "bar" ? (
                    <BarChart data={bookingsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                      <XAxis
                        dataKey="month"
                        stroke="#6b7280"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                      />
                      <YAxis
                        stroke="#6b7280"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 200]}
                        ticks={[0, 50, 100, 150, 200]}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-[#1c1c24] border border-white/10 rounded-xl p-2.5 shadow-xl text-xs">
                                <p className="font-semibold text-white">{label}</p>
                                <p className="text-purple-400 font-mono font-bold mt-1">
                                  Bookings: {payload[0].value} events
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="bookings"
                        fill="#4f46e5"
                        radius={[4, 4, 0, 0]}
                        activeBar={{ fill: "#6366f1" }}
                      />
                    </BarChart>
                  ) : bookingsChartType === "line" ? (
                    <LineChart data={bookingsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                      <XAxis dataKey="month" stroke="#6b7280" fontSize={11} tickLine={false} />
                      <YAxis stroke="#6b7280" fontSize={11} tickLine={false} domain={[0, 200]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="bookings" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 3 }} />
                    </LineChart>
                  ) : (
                    <AreaChart data={bookingsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                      <XAxis dataKey="month" stroke="#6b7280" fontSize={11} tickLine={false} />
                      <YAxis stroke="#6b7280" fontSize={11} tickLine={false} domain={[0, 200]} />
                      <Tooltip />
                      <Area type="monotone" dataKey="bookings" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </main>

      </div>
    </div>
  );
};
