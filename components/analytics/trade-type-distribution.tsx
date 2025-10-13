"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface Trade {
  id: string
  trade_type: string
  pnl: number | null
  status: string
}

interface TradeTypeDistributionProps {
  trades: Trade[]
}

export function TradeTypeDistribution({ trades }: TradeTypeDistributionProps) {
  const closedTrades = trades.filter((t) => t.status === "closed" && t.pnl !== null)

  const longTrades = closedTrades.filter((t) => t.trade_type === "long")
  const shortTrades = closedTrades.filter((t) => t.trade_type === "short")

  const longPnL = longTrades.reduce((sum, t) => sum + (t.pnl || 0), 0)
  const shortPnL = shortTrades.reduce((sum, t) => sum + (t.pnl || 0), 0)

  const data = [
    { name: "Long Trades", value: longTrades.length, pnl: longPnL },
    { name: "Short Trades", value: shortTrades.length, pnl: shortPnL },
  ]

  const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))"]

  if (closedTrades.length === 0) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Trade Type Distribution</CardTitle>
          <CardDescription>Long vs Short trade performance</CardDescription>
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
        <CardTitle>Trade Type Distribution</CardTitle>
        <CardDescription>Long vs Short trade performance</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Long P&L</p>
            <p className={`text-lg font-bold ${longPnL >= 0 ? "text-primary" : "text-destructive"}`}>
              ${longPnL.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Short P&L</p>
            <p className={`text-lg font-bold ${shortPnL >= 0 ? "text-primary" : "text-destructive"}`}>
              ${shortPnL.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
