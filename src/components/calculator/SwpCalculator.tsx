"use client"

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { calculateSWP, formatCurrency } from "@/lib/calculator-utils";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { HandCoins, ChartBarIncreasing, Info } from "lucide-react";

export default function SwpCalculator() {
  const [initial, setInitial] = useState(500000);
  const [withdrawal, setWithdrawal] = useState(5000);
  const [years, setYears] = useState(10);
  const [returns, setReturns] = useState(12);

  const result = useMemo(() => calculateSWP(initial, withdrawal, years, returns), [initial, withdrawal, years, returns]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
      <div className="lg:col-span-4 space-y-6">
        <Card className="calculator-card animate-stagger-1">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-xl font-headline flex items-center gap-2 text-primary">
              <HandCoins className="w-5 h-5" />
              SWP Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground">Total Investment</Label>
                <span className="font-bold text-primary tabular-nums">{formatCurrency(initial)}</span>
              </div>
              <Slider
                value={[initial]}
                min={100000}
                max={10000000}
                step={50000}
                onValueChange={(v) => setInitial(v[0])}
                className="py-4"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground">Monthly Withdrawal</Label>
                <span className="font-bold text-primary tabular-nums">{formatCurrency(withdrawal)}</span>
              </div>
              <Slider
                value={[withdrawal]}
                min={500}
                max={100000}
                step={500}
                onValueChange={(v) => setWithdrawal(v[0])}
                className="py-4"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground">Time Period (Years)</Label>
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
                <Label className="text-muted-foreground">Expected Return Rate (%)</Label>
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

        <Card className="calculator-card bg-secondary text-secondary-foreground animate-stagger-2 overflow-hidden relative">
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>
          <CardContent className="pt-6 space-y-4 relative z-10">
            <div className="flex justify-between items-center border-b border-secondary-foreground/20 pb-2">
              <span className="text-sm opacity-80">Total Withdrawal</span>
              <span className="font-semibold tabular-nums">{formatCurrency(result.totalWithdrawn)}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-bold">Final Balance</span>
              <span className="text-2xl font-bold tabular-nums">{formatCurrency(result.finalBalance)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-8 space-y-6">
        <Card className="calculator-card h-full animate-stagger-3">
          <CardHeader>
            <CardTitle className="text-xl font-headline flex items-center gap-2">
              <ChartBarIncreasing className="text-primary w-5 h-5" />
              Capital Over Time
            </CardTitle>
            <CardDescription>Monitoring your investment balance while withdrawing</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ChartContainer config={{
              balance: { label: "Remaining Balance", color: "hsl(var(--primary))" },
              withdrawn: { label: "Total Withdrawn", color: "hsl(var(--secondary))" }
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))'}} tickFormatter={(v) => `₹${v/100000}L`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={4} 
                    fillOpacity={0.2} 
                    fill="hsl(var(--primary))" 
                    isAnimationActive={true}
                    animationDuration={1500}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="withdrawn" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={4} 
                    fillOpacity={0.1} 
                    fill="hsl(var(--secondary))" 
                    isAnimationActive={true}
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg animate-in fade-in duration-1000 delay-700">
              <Info className="w-4 h-4 text-primary" />
              <span>Note: This is an estimated projection based on constant returns. Actual returns may vary in equity markets.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}