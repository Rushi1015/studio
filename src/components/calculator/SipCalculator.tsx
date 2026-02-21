"use client"

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { calculateSIP, formatCurrency } from "@/lib/calculator-utils";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp, Wallet } from "lucide-react";

export default function SipCalculator() {
  const [amount, setAmount] = useState(5000);
  const [years, setYears] = useState(10);
  const [returns, setReturns] = useState(12);

  const result = useMemo(() => calculateSIP(amount, years, returns), [amount, years, returns]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
      <div className="lg:col-span-4 space-y-6">
        <Card className="calculator-card animate-stagger-1">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-xl font-headline flex items-center gap-2">
              <Wallet className="text-primary w-5 h-5" />
              SIP Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground">Monthly Investment</Label>
                <span className="font-bold text-primary tabular-nums">{formatCurrency(amount)}</span>
              </div>
              <Slider
                value={[amount]}
                min={500}
                max={100000}
                step={500}
                onValueChange={(v) => setAmount(v[0])}
                className="py-4"
              />
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="mt-2 transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground">Investment Period (Years)</Label>
                <span className="font-bold text-primary tabular-nums">{years} yr</span>
              </div>
              <Slider
                value={[years]}
                min={1}
                max={30}
                step={1}
                onValueChange={(v) => setYears(v[0])}
                className="py-4"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground">Expected Return Rate (% p.a)</Label>
                <span className="font-bold text-primary tabular-nums">{returns}%</span>
              </div>
              <Slider
                value={[returns]}
                min={1}
                max={30}
                step={0.5}
                onValueChange={(v) => setReturns(v[0])}
                className="py-4"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="calculator-card bg-primary text-primary-foreground animate-stagger-2 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <CardContent className="pt-6 space-y-4 relative z-10">
            <div className="flex justify-between items-center border-b border-primary-foreground/20 pb-2">
              <span className="text-sm opacity-80">Invested Amount</span>
              <span className="font-semibold tabular-nums">{formatCurrency(result.totalInvestment)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-primary-foreground/20 pb-2">
              <span className="text-sm opacity-80">Est. Returns</span>
              <span className="font-semibold tabular-nums">{formatCurrency(result.estimatedReturns)}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-bold">Total Value</span>
              <span className="text-2xl font-bold tabular-nums">{formatCurrency(result.totalValue)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-8 space-y-6">
        <Card className="calculator-card h-full animate-stagger-3">
          <CardHeader>
            <CardTitle className="text-xl font-headline flex items-center gap-2">
              <TrendingUp className="text-secondary w-5 h-5 animate-bounce" style={{ animationDuration: '3s' }} />
              Wealth Projection
            </CardTitle>
            <CardDescription>Visualizing your wealth growth over {years} years</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ChartContainer config={{
              wealth: { label: "Total Wealth", color: "hsl(var(--primary))" },
              investment: { label: "Total Investment", color: "hsl(var(--secondary))" }
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.yearlyData}>
                  <defs>
                    <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))'}} tickFormatter={(v) => `₹${v/100000}L`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="wealth" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorWealth)"
                    isAnimationActive={true}
                    animationDuration={1500}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="investment" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorInvestment)"
                    isAnimationActive={true}
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}