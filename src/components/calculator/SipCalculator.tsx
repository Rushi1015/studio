
"use client"

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { calculateSIP, formatCurrency } from "@/lib/calculator-utils";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp, Wallet, Save, History, Trash2, Calendar } from "lucide-react";
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export default function SipCalculator() {
  const [amount, setAmount] = useState<number | string>(5000);
  const [years, setYears] = useState<number | string>(10);
  const [returns, setReturns] = useState<number | string>(12);
  const [saveName, setSaveName] = useState("");
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const numericAmount = Number(amount) || 0;
  const numericYears = Number(years) || 0;
  const numericReturns = Number(returns) || 0;

  const result = useMemo(() => calculateSIP(numericAmount, numericYears, numericReturns), [numericAmount, numericYears, numericReturns]);

  const savedCalculationsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, 'users', user.uid, 'sipCalculations');
  }, [db, user]);

  const { data: savedCalculations } = useCollection(savedCalculationsQuery);

  const handleSave = () => {
    if (!user || !db) return;
    
    const name = saveName || `Plan for ${numericYears}y at ${numericReturns}%`;
    const payload = {
      userId: user.uid,
      name,
      monthlyInvestment: numericAmount,
      investmentDurationYears: numericYears,
      expectedReturnRate: numericReturns / 100,
      totalInvestedAmount: result.totalInvestment,
      totalInterestEarned: result.estimatedReturns,
      finalValue: result.totalValue,
      createdAt: new Date().toISOString(),
    };

    const colRef = collection(db, 'users', user.uid, 'sipCalculations');
    addDocumentNonBlocking(colRef, payload);
    
    setSaveName("");
    toast({
      title: "Calculation Saved",
      description: `"${name}" has been saved to your profile.`,
    });
  };

  const handleDelete = (id: string) => {
    if (!user || !db) return;
    const docRef = doc(db, 'users', user.uid, 'sipCalculations', id);
    deleteDocumentNonBlocking(docRef);
  };

  const loadSaved = (calc: any) => {
    setAmount(calc.monthlyInvestment);
    setYears(calc.investmentDurationYears);
    setReturns(calc.expectedReturnRate * 100);
  };

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
                <span className="font-bold text-primary tabular-nums">{formatCurrency(numericAmount)}</span>
              </div>
              <Slider
                value={[numericAmount]}
                min={500}
                max={100000}
                step={500}
                onValueChange={(v) => setAmount(v[0])}
                className="py-4"
              />
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                onBlur={() => {
                  if (amount === "" || Number(amount) < 500) setAmount(500);
                  if (Number(amount) > 1000000) setAmount(1000000);
                }}
                className="mt-2 transition-all focus:ring-2 focus:ring-primary/20"
                placeholder="Enter amount"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground">Investment Period (Years)</Label>
                <span className="font-bold text-primary tabular-nums">{numericYears} yr</span>
              </div>
              <Slider
                value={[numericYears]}
                min={1}
                max={30}
                step={1}
                onValueChange={(v) => setYears(v[0])}
                className="py-4"
              />
              <Input
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value === "" ? "" : Number(e.target.value))}
                onBlur={() => {
                  if (years === "" || Number(years) < 1) setYears(1);
                  if (Number(years) > 50) setYears(50);
                }}
                className="mt-2 transition-all focus:ring-2 focus:ring-primary/20"
                placeholder="Enter years"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground">Expected Return Rate (% p.a)</Label>
                <span className="font-bold text-primary tabular-nums">{numericReturns}%</span>
              </div>
              <Slider
                value={[numericReturns]}
                min={1}
                max={30}
                step={0.5}
                onValueChange={(v) => setReturns(v[0])}
                className="py-4"
              />
              <Input
                type="number"
                value={returns}
                onChange={(e) => setReturns(e.target.value === "" ? "" : Number(e.target.value))}
                onBlur={() => {
                  if (returns === "" || Number(returns) < 1) setReturns(1);
                  if (Number(returns) > 50) setReturns(50);
                }}
                className="mt-2 transition-all focus:ring-2 focus:ring-primary/20"
                placeholder="Enter returns"
              />
            </div>

            {user && (
              <div className="pt-4 border-t border-border space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="save-name" className="text-xs uppercase tracking-wider text-muted-foreground">Plan Name (Optional)</Label>
                  <Input 
                    id="save-name"
                    placeholder="E.g. Retirement Goal" 
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <Button onClick={handleSave} className="w-full gap-2" size="sm">
                  <Save className="w-4 h-4" />
                  Save Projection
                </Button>
              </div>
            )}
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
        <Card className="calculator-card animate-stagger-3">
          <CardHeader>
            <CardTitle className="text-xl font-headline flex items-center gap-2">
              <TrendingUp className="text-secondary w-5 h-5" />
              Wealth Projection
            </CardTitle>
            <CardDescription>Visualizing your wealth growth over {numericYears} years</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
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

        {user && savedCalculations && savedCalculations.length > 0 && (
          <Card className="calculator-card animate-stagger-4">
            <CardHeader>
              <CardTitle className="text-lg font-headline flex items-center gap-2">
                <History className="text-primary w-5 h-5" />
                Saved Projections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedCalculations.map((calc: any) => (
                  <div key={calc.id} className="group p-4 rounded-xl border border-border bg-muted/20 hover:bg-card transition-all cursor-pointer flex justify-between items-center" onClick={() => loadSaved(calc)}>
                    <div className="space-y-1">
                      <p className="font-bold text-sm truncate max-w-[150px]">{calc.name}</p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-tight">
                        <Calendar className="w-3 h-3" />
                        {new Date(calc.createdAt).toLocaleDateString()}
                      </div>
                      <p className="text-xs font-medium text-primary">{formatCurrency(calc.finalValue)}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(calc.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
