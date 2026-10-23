"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

const MONTHLY_EXCHANGES_DATA = [
  { month: "May", completed: 12, requests: 18 },
  { month: "Jun", completed: 19, requests: 24 },
  { month: "Jul", completed: 15, requests: 20 },
  { month: "Aug", completed: 28, requests: 35 },
  { month: "Sep", completed: 42, requests: 56 },
  { month: "Oct", completed: 37, requests: 48 },
];

const CATEGORY_DISTRIBUTION_DATA = [
  { name: "Books & Notes", value: 38, color: "#059669" },
  { name: "Electronics", value: 24, color: "#10B981" },
  { name: "Lab Equipment", value: 16, color: "#113527" },
  { name: "Sports", value: 12, color: "#84CC16" },
  { name: "Stationery", value: 10, color: "#6EE7B7" },
];

export function OverviewCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Exchanges & Activity Trend */}
      <div className="bg-white dark:bg-[#12281e] rounded-2xl border border-forest-900/10 dark:border-forest-800 shadow-subtle p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Exchanges & Request Trends
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monthly completed shares versus incoming requests
          </p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MONTHLY_EXCHANGES_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0c1f17",
                  border: "none",
                  borderRadius: "0.75rem",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Bar dataKey="completed" name="Completed Exchanges" fill="#059669" radius={[4, 4, 0, 0]} />
              <Bar dataKey="requests" name="Total Requests" fill="#84CC16" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white dark:bg-[#12281e] rounded-2xl border border-forest-900/10 dark:border-forest-800 shadow-subtle p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Resource Distribution by Category
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Percentage share of active listings on campus
          </p>
        </div>

        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={CATEGORY_DISTRIBUTION_DATA}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {CATEGORY_DISTRIBUTION_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0c1f17",
                  border: "none",
                  borderRadius: "0.75rem",
                  color: "#fff",
                  fontSize: "12px",
                }}
                formatter={(val) => [`${val}%`, "Share"]}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
