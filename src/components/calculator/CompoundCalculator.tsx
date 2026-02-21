"use client"

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateCompoundInterest, formatCurrency } from "@/lib/calculator-utils";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Calculator, BarChart3, Banknote } from "lucide-react";

export default function CompoundCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(10);
  const [frequency, setFrequency] = useState(1);

  const result = useMemo(() => calculateCompoundInterest(principal, rate, years, frequency), [principal, rate, years, frequency]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="lg:col-span-4 space-y-6">
        <Card className="calculator-card">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-xl font-headline flex items-center gap-2 text-primary">
              <Calculator className="w-5 h-5" />
              CI Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground">Initial Principal</Label>
                <span className="font-bold text-primary">{formatCurrency(principal)}</span>
              </div>
              <Slider
                value={[principal]}
                min={1000}
                max={5000000}
                step={1000}
                onValueChange={(v) => setPrincipal(v[0])}
                className="py-4"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground">Interest Rate (% p.a)</Label>
                <span className="font-bold text-primary">{rate}%</span>
              </div>
              <Slider
                value={[rate]}
                min={0.5}
                max={50}
                step={0.5}
                onValueChange={(v) => setRate(v[0])}
                className="py-4"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground">Duration (Years)</Label>
                <span className="font-bold text-primary">{years} yr</span>
              </div>
              <Slider
                value={[years]}
                min={1}
                max={50}
                step={1}
                onValueChange={(v) => setYears(v[0])}
                className="py-4"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Compounding Frequency</Label>
              <Select value={frequency.toString()} onValueChange={(v) => setFrequency(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Annually</SelectItem>
                  <SelectItem value="2">Semi-Annually</SelectItem>
                  <SelectItem value="4">Quarterly</SelectItem>
                  <SelectItem value="12">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="calculator-card bg-primary text-primary-foreground">
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between items-center border-b border-primary-foreground/20 pb-2">
              <span className="text-sm opacity-80">Total Interest</span>
              <span className="font-semibold">{formatCurrency(result.totalInterest)}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-bold">Maturity Value</span>
              <span className="text-xl font-bold">{formatCurrency(result.totalValue)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-8 space-y-6">
        <Card className="calculator-card h-full">
          <CardHeader>
            <CardTitle className="text-xl font-headline flex items-center gap-2">
              <BarChart3 className="text-secondary w-5 h-5" />
              Growth Chart
            </CardTitle>
            <CardDescription>Wealth accumulation through the power of compounding</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ChartContainer config={{
              wealth: { label: "Total Wealth", color: "hsl(var(--primary))" },
              investment: { label: "Principal", color: "hsl(var(--secondary))" }
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))'}} tickFormatter={(v) => `₹${v/100000}L`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="investment" stackId="a" fill="hsl(var(--secondary))" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="wealth" stackId="b" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Legend verticalAlign="top" height={36}/>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}