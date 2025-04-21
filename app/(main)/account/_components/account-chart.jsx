"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <div className="w-full max-w-5xl mx-auto p-6">
      <Card className="bg-gradient-to-br from-white to-zinc-100 shadow-md rounded-xl">
        <CardHeader className="flex flex-col md:flex-row justify-between items-center gap-4">
          <CardTitle className="text-2xl font-semibold text-zinc-800">
            📊 Transaction Summary
          </CardTitle>
          <Select onValueChange={setDateRange} value={dateRange}>
            <SelectTrigger className="w-[200px] border border-zinc-300 shadow-sm rounded-md">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DATE_RANGES).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
            <div className="bg-green-50 p-4 rounded-lg shadow-sm">
              <p className="text-sm text-zinc-500">Total Income</p>
              <p className="text-xl font-bold text-green-600">
                ${totals.income.toFixed(2)}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg shadow-sm">
              <p className="text-sm text-zinc-500">Total Expenses</p>
              <p className="text-xl font-bold text-red-500">
                ${totals.expense.toFixed(2)}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
              <p className="text-sm text-zinc-500">Net</p>
              <p
                className={`text-xl font-bold ${
                  totals.income - totals.expense >= 0
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                ${(totals.income - totals.expense).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="h-[350px] bg-white rounded-lg shadow-inner p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredData}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip formatter={(value) => [`$${value}`, undefined]} />
                <Legend />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#4ade80"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="expense"
                  name="Expense"
                  fill="#f87171"
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
