const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Calculate P&L if trade is closed using precise engine
      let pnl = null
      let pnl_percentage = null

      if (formData.status === "closed" && formData.exit_price) {
        const { pnl: calcPnl, pnlPct } = computePnlUSD({
          symbol: formData.symbol,
          entryPrice: formData.entry_price,
          exitPrice: formData.exit_price,
          quantity: formData.quantity,
          tradeType: formData.trade_type as "long" | "short",
        })
        pnl = calcPnl
        pnl_percentage = pnlPct
      }

      // Upload screenshot if provided
      let screenshot_url = null
      if (screenshot) {
        const fileExt = screenshot.name.split(".").pop()
        const fileName = `${userId}/${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from("trade-screenshots")
          .upload(fileName, screenshot, { upsert: true, contentType: screenshot.type })

        if (uploadError) {
          console.error("Screenshot upload error:", uploadError)
        } else {
          const {
            data: { publicUrl },
          } = supabase.storage.from("trade-screenshots").getPublicUrl(fileName)
          screenshot_url = publicUrl
        }
      }

      const { error: insertError } = await supabase.from("trades").insert({
        user_id: userId,
        symbol: formData.symbol.toUpperCase(),
        entry_price_text: formData.entry_price,
        exit_price_text: formData.exit_price || null,
        entry_price: Number.parseFloat(formData.entry_price),
        exit_price: formData.exit_price ? Number.parseFloat(formData.exit_price) : null,
        quantity: Number.parseFloat(formData.quantity),
        trade_type: formData.trade_type,
        entry_date: formData.entry_date,
        exit_date: formData.exit_date || null,
        status: formData.status,
        strategy_name: formData.strategy_name || null,
        notes: formData.notes || null,
        screenshot_url,
        pnl,
        pnl_percentage,
      })

      if (insertError) throw insertError

      // Reset form
      setFormData({
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
      })
      setScreenshot(null)

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add trade")
    } finally {
      setIsLoading(false)
    }
  }


  <div className="grid gap-2">
              <Label htmlFor="screenshot">Screenshot (Optional)</Label>
              <div className="flex flex-col gap-2">
                <Input
                  id="screenshot"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                  className="bg-secondary/50"
                />
                {screenshot && (
                  <div className="flex items-start gap-3">
                    <div className="rounded-md overflow-hidden border border-border/50">
                      <img
                        src={URL.createObjectURL(screenshot) || "/placeholder.svg"}
                        alt="Screenshot preview"
                        className="h-24 w-36 object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Upload className="w-4 h-4" />
                      {screenshot.name}
                    </div>
                  </div>
                )}
              </div>
            </div>
  
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
  
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Adding Trade..." : "Add Trade"}
            </Button>