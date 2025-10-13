"use client"

import type React from "react"
import { useMemo, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SymbolCombobox, { type SymbolOption } from "@/components/inputs/symbol-combobox"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

interface TradeFormProps {
  userId: string
}

const SYMBOL_OPTIONS: SymbolOption[] = [
  { value: "ETHUSD", label: "ETHUSD" },
  { value: "BTCUSD", label: "BTCUSD" },
  { value: "APPLE", label: "APPLE" },
  { value: "XAUUSD", label: "XAUUSD (Gold)" },
  { value: "XAGUSD", label: "XAGUSD (Silver)" },
  { value: "DE30", label: "DE30" },
  { value: "USTECH", label: "USTECH" },
  { value: "US30", label: "US30" },
  { value: "EURUSD", label: "EURUSD" },
  { value: "GBPUSD", label: "GBPUSD" },
  { value: "USDJPY", label: "USDJPY" },
  { value: "DXY", label: "DXY" },
  { value: "USOIL", label: "USOIL" },
]

export function TradeForm({ userId }: TradeFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [screenshot, setScreenshot] = useState<File | null>(null)

  const [withSL, setWithSL] = useState(false)
  const [withTP, setWithTP] = useState(false)

  const [formData, setFormData] = useState({
    symbol: "",
    entry_price: "",
    exit_price: "",
    quantity: "",
    trade_type: "long",
    entry_date: "",
    exit_date: "",
    status: "open",
    strategy_name: "",
    notes: "",
    stop_loss: "", // optional
    take_profit: "", // optional
  })

  const today = useMemo(() => new Date().toISOString().split("T")[0], [])

  useEffect(() => {
    if (formData.status === "open") {
      if (formData.exit_price || formData.exit_date) {
        setFormData((prev) => ({ ...prev, exit_price: "", exit_date: "" }))
      }
    }
  }, [formData.status])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (formData.entry_date && formData.entry_date > today) {
      setIsLoading(false)
      return setError("Entry date cannot be in the future.")
    }
    if (formData.exit_date && formData.exit_date > today) {
      setIsLoading(false)
      return setError("Exit date cannot be in the future.")
    }

    // Handle form submission logic here
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade Form</CardTitle>
        <CardDescription>Enter your trade details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Symbol input */}
          <div>
            <Label htmlFor="symbol">Symbol</Label>
            <SymbolCombobox
              value={formData.symbol}
              onChange={(val: string) => setFormData({ ...formData, symbol: val })}
              options={SYMBOL_OPTIONS}
              placeholder="Search symbol..."
              className="mt-2"
            />
          </div>

          {/* Trade type select */}
          <div>
            <Label htmlFor="trade_type">Trade Type</Label>
            <Select
              id="trade_type"
              value={formData.trade_type}
              onValueChange={(value) => setFormData({ ...formData, trade_type: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select trade type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="long">Long</SelectItem>
                <SelectItem value="short">Short</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* {Satus} */}
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quantity input */}
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              inputMode="decimal"
              step="any"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Entry column */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="entry_price">Entry Price</Label>
                <Input
                  id="entry_price"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  value={formData.entry_price}
                  onChange={(e) => setFormData({ ...formData, entry_price: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="withSL"
                    checked={withSL}
                    onCheckedChange={(c) => setWithSL(Boolean(c))}
                    aria-label="Enable Stop Loss"
                  />
                  <Label htmlFor="withSL">Add Stop Loss</Label>
                </div>
                {withSL && (
                  <div>
                    <Label htmlFor="stop_loss" className="sr-only">
                      Stop Loss
                    </Label>
                    <Input
                      id="stop_loss"
                      type="number"
                      inputMode="decimal"
                      step="any"
                      value={formData.stop_loss}
                      onChange={(e) => setFormData({ ...formData, stop_loss: e.target.value })}
                      placeholder="Enter SL price"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Exit column */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="exit_price">Exit Price</Label>
                <Input
                  id="exit_price"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  disabled={formData.status === "open"}
                  value={formData.exit_price}
                  onChange={(e) => setFormData({ ...formData, exit_price: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="withTP"
                    checked={withTP}
                    onCheckedChange={(c) => setWithTP(Boolean(c))}
                    aria-label="Enable Take Profit"
                    // disabled={formData.status === "open"}
                  />
                  <Label htmlFor="withTP" className={formData.status === "open" ? "opacity-50" : ""}>
                    Add Take Profit
                  </Label>
                </div>
                {withTP && (
                  <div>
                    <Label htmlFor="take_profit" className="sr-only">
                      Take Profit
                    </Label>
                    <Input
                      id="take_profit"
                      type="number"
                      inputMode="decimal"
                      step="any"
                      value={formData.take_profit}
                      onChange={(e) => setFormData({ ...formData, take_profit: e.target.value })}
                      placeholder="Enter TP price"
                      disabled={formData.status === "open"}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Entry date input */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="entry_date">Entry Date</Label>
              <Input
                id="entry_date"
                type="date"
                max={today}
                value={formData.entry_date}
                onChange={(e) => setFormData({ ...formData, entry_date: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="exit_date">Exit Date</Label>
              <Input
                id="exit_date"
                type="date"
                max={today}
                disabled={formData.status === "open"}
                value={formData.exit_date}
                onChange={(e) => setFormData({ ...formData, exit_date: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>

          {/* Strategy name input */}
          <div>
            <Label htmlFor="strategy_name">Strategy Name</Label>
            <Input
              id="strategy_name"
              value={formData.strategy_name}
              onChange={(e) => setFormData({ ...formData, strategy_name: e.target.value })}
              className="mt-2"
            />
          </div>

          {/* Notes textarea */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="mt-2"
            />
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Trade"}
            </Button>
          </div>

          {/* Error message */}
          {error ? <p className="text-red-600 text-sm mt-2">{error}</p> : null}
        </form>
      </CardContent>
    </Card>
  )
}
