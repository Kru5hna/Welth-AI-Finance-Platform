"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { endOfDay, startOfDay, subDays, format } from "date-fns";
import React, { useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
} from "recharts";

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
};

export function AccountChart({ transactions }) {
  const [dateRange, setDateRange] = useState("1M");

  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));

    const filtered = transactions.filter(
      (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );

    const grouped = filtered.reduce((acc, transaction) => {
      const date = format(new Date(transaction.date), "MMM dd");
      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0 };
      }
      if (transaction.type === "INCOME") {
        acc[date].income += transaction.amount;
      } else {
        acc[date].expense += transaction.amount;
      }
      return acc;
    }, {});

    return Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [transactions, dateRange]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
      }),
      { income: 0, expense: 0 }
    );
  }, [filteredData]);

  return (
    <div className="w-full max-w-5xl mx-auto p-0">
      {" "}
      <Card className="bg-zinc-900 border border-zinc-800 shadow-xl rounded-xl text-white">
        <CardHeader className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-zinc-800 pb-4">
          <CardTitle className="text-2xl font-semibold text-white">
            📊 Transaction Summary
          </CardTitle>
          <Select onValueChange={setDateRange} value={dateRange}>
            {/* Select Trigger: Dark styling */}
            <SelectTrigger className="w-[200px] bg-zinc-800 border border-zinc-700 text-white shadow-sm rounded-md hover:bg-zinc-700">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            {/* Select Content: Dark styling (Assumes shadcn/ui is configured for dark mode) */}
            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
              {Object.entries(DATE_RANGES).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
            {/* Income Card: Darker green background */}
            <div className="bg-green-950/30 border border-green-700/50 p-4 rounded-lg shadow-sm">
              <p className="text-sm text-zinc-400">Total Income</p>
              <p className="text-xl font-bold text-green-400">
                ${totals.income.toFixed(2)}
              </p>
            </div>
            {/* Expense Card: Darker red background */}
            <div className="bg-red-950/30 border border-red-700/50 p-4 rounded-lg shadow-sm">
              <p className="text-sm text-zinc-400">Total Expenses</p>
              <p className="text-xl font-bold text-red-400">
                ${totals.expense.toFixed(2)}
              </p>
            </div>
            {/* Net Card: Darker blue background */}
            <div className="bg-blue-950/30 border border-blue-700/50 p-4 rounded-lg shadow-sm">
              <p className="text-sm text-zinc-400">Net</p>
              <p
                className={`text-xl font-bold ${
                  totals.income - totals.expense >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                ${(totals.income - totals.expense).toFixed(2)}
              </p>
            </div>
          </div>

          {/* 2. Chart Area: Dark Background */}
          <div className="h-[350px] bg-zinc-800 border border-zinc-700 rounded-lg shadow-inner p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredData}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  stroke="#3f3f46"
                  strokeDasharray="3 3"
                  vertical={false}
                />{" "}
                <XAxis dataKey="date" fontSize={12} stroke="#a1a1aa" />{" "}
                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                  stroke="#a1a1aa" // zinc-400
                />
                <Tooltip
                  formatter={(value, name) => {
                    return [
                      <span style={{ color: "#ffffff" }}>${value}</span>,
                      name
                    ];
                  }}
                  contentStyle={{
                    backgroundColor: "#27272a",
                    border: "1px solid #3f3f46",
                    borderRadius: "6px",
                    padding: "8px 12px",
                  }}
                  labelStyle={{ color: "#e4e4e7", marginBottom: "4px" }}
                  itemStyle={{ padding: "2px 0" }}
                />
                <Legend wrapperStyle={{ color: "#fff" }} />{" "}
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#4ade80" // green-400
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="expense"
                  name="Expense"
                  fill="#f87171" // red-400
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
