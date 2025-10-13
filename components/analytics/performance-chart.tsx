"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface Trade {
  id: string
  entry_date: string
  pnl: number | null
  status: string
}

interface PerformanceChartProps {
  trades: Trade[]
}

export function PerformanceChart({ trades }: PerformanceChartProps) {
  const closedTrades = trades
    .filter((t) => t.status === "closed" && t.pnl !== null)
    .sort((a, b) => new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime())

  let cumulativePnL = 0
  const chartData = closedTrades.map((trade) => {
    cumulativePnL += trade.pnl || 0
    return {
      date: new Date(trade.entry_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      pnl: cumulativePnL, // no rounding; keep exact cumulative value
    }
  })

  if (chartData.length === 0) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Cumulative P&L</CardTitle>
          <CardDescription>Track your profit and loss over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No closed trades to display
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Cumulative P&L</CardTitle>
        <CardDescription>Track your profit and loss over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Area type="monotone" dataKey="pnl" stroke="hsl(var(--primary))" fill="url(#colorPnl)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
