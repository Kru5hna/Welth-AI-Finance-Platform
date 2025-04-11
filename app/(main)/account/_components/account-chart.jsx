"use client"

import { endOfDay, startOfDay, subDays } from 'date-fns'
import React, { useMemo } from 'react'
import { Bar, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart } from 'recharts'


const DATE_RANGES ={
  "7D": {label: "Last 7 Days", days:7},
  "1M": {label: "Last Month", days:30},
  "3M": {label: "Last 3 Months", days:90},
  "6M": {label: "Last 6 Months", days:180},
  ALL : {label: "All Time", days:null},
}

const AccountChart = () => {

  const [dateRange, setDateRange] = useState("1M");

  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days ? startOfDay(subDays(now,range.days))
                                 : startOfDay(new Date(0));

    // Filter the transactions within date Range
  const filtered = transactions.filter(
    (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
  );

  const grouped = filtered.reduce((acc,transaction) => {
    const date = format(new Date(transaction.date), "MMM dd");

    if(!acc[date]) {
      acc[date] = { date, income: 0, expense: 0}
    }

    if(transaction.type === "INCOME") {
      acc[date].income += transaction.amount;

    }else {
      acc[date].expense += transaction.amount;
    }
    return acc;

  },{});

  // Convert to array and sort by date
  return Object.values(grouped).sort(
    (a,b) => new Date(a.date) - new Date(b.date)
  )

  }, [transactions, dateRange]);

 console.log(filteredData)


  return (
    <div>
      <h1>sdlkfjaldsfjlasjflkajldfkjakdsfkadsfjadkfjlajkflka</h1>
      
      {/* <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pv" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
          <Bar dataKey="uv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
        </BarChart>
      </ResponsiveContainer> */}

    </div>
  )
}

export default AccountChart