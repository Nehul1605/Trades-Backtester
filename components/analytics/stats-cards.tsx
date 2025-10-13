"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Target, DollarSign } from "lucide-react"

interface Trade {
  id: string
  pnl: number | null
  status: string
}

interface StatsCardsProps {
  trades: Trade[]
}

export function StatsCards({ trades }: StatsCardsProps) {
  const closedTrades = trades.filter((t) => t.status === "closed" && t.pnl !== null)

  const totalPnL = closedTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0)
  const winningTrades = closedTrades.filter((t) => (t.pnl || 0) > 0)
  const losingTrades = closedTrades.filter((t) => (t.pnl || 0) < 0)
  const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0

  const avgWin =
    winningTrades.length > 0 ? winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / winningTrades.length : 0
  const avgLoss =
    losingTrades.length > 0 ? Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / losingTrades.length) : 0

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${totalPnL >= 0 ? "text-primary" : "text-destructive"}`}>
            {formatCurrency(totalPnL)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{closedTrades.length} closed trades</p>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{winRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            {winningTrades.length}W / {losingTrades.length}L
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Win</CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{formatCurrency(avgWin)}</div>
          <p className="text-xs text-muted-foreground mt-1">{winningTrades.length} winning trades</p>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Loss</CardTitle>
          <TrendingDown className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{formatCurrency(avgLoss)}</div>
          <p className="text-xs text-muted-foreground mt-1">{losingTrades.length} losing trades</p>
        </CardContent>
      </Card>
    </div>
  )
}
