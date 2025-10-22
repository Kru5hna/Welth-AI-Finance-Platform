"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const COLORS = [
  "#f87171", 
  "#4ade80", 
  "#60a5fa", 
  "#a78bfa",
  "#fbbf24", 
  "#fb923c", 
  "#22d3ee", 
  "#f472b6", 
];

export function DashboardOverview({ accounts, transactions }) {
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
  );

  const accountTransactions = transactions.filter(
    (t) => t.accountId === selectedAccountId
  );

  const recentTransactions = accountTransactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const currentDate = new Date();
  const currentMonthExpenses = accountTransactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      t.type === "EXPENSE" &&
      transactionDate.getMonth() === currentDate.getMonth() &&
      transactionDate.getFullYear() === currentDate.getFullYear()
    );
  });

  const expensesByCategory = currentMonthExpenses.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {});

  const pieChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 p-5">
      {/* Recent Transactions Card */}
      <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-zinc-800">
          <CardTitle className="text-xl font-semibold text-white">
             Recent Transactions
          </CardTitle>
          <Select
            value={selectedAccountId}
            onValueChange={setSelectedAccountId}
          >
            <SelectTrigger className="w-[140px] bg-zinc-800 border-zinc-700 text-white transition-colors duration-200 hover:bg-zinc-700">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <p className="text-center text-zinc-500 py-4">
                No recent transactions
              </p>
            ) : (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-800 hover:bg-zinc-800 transition-colors duration-200"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-white">
                      {transaction.description || "Untitled Transaction"}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {format(new Date(transaction.date), "PP")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex items-center font-semibold",
                        transaction.type === "EXPENSE"
                          ? "text-red-400"
                          : "text-green-400"
                      )}
                    >
                      {transaction.type === "EXPENSE" ? (
                        <ArrowDownRight className="mr-1 h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="mr-1 h-4 w-4" />
                      )}
                      ₹{transaction.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* PieChart  */}
      <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
        <CardHeader className="border-b border-zinc-800">
          <CardTitle className="text-xl font-semibold text-white">
            📊 Monthly Expense Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {pieChartData.length === 0 ? (
            <p className="text-center text-zinc-500 py-4">
              No expenses this month
            </p>
          ) : (
            <div className="h-[300px] ">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ₹${value.toFixed(2)}`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      <span style={{ color: "#ffffff" }}>₹{value.toFixed(2)}</span>,
                      undefined
                    ]}
                    contentStyle={{
                      backgroundColor: "#27272a",
                      border: "1px solid #3f3f46",
                      borderRadius: "6px",
                      padding: "8px 12px",
                    }}
                    labelStyle={{ color: "#e4e4e7", marginBottom: "4px" }}
                  />
                  <Legend wrapperStyle={{ color: "#fff" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}