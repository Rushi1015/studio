
"use client"

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateCompoundInterest, formatCurrency } from "@/lib/calculator-utils";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Calculator, BarChart3, Save, History, Trash2, Calendar } from "lucide-react";
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export default function CompoundCalculator() {
  const [principal, setPrincipal] = useState<number | string>(100000);
  const [rate, setRate] = useState<number | string>(8);
  const [years, setYears] = useState<number | string>(10);
  const [frequency, setFrequency] = useState(1);
  const [saveName, setSaveName] = useState("");

  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const numericPrincipal = Number(principal) || 0;
  const numericRate = Number(rate) || 0;
  const numericYears = Number(years) || 0;

  const result = useMemo(() => calculateCompoundInterest(numericPrincipal, numericRate, numericYears, frequency), [numericPrincipal, numericRate, numericYears, frequency]);

  const savedCalculationsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, 'users', user.uid, 'compoundCalculations');
  }, [db, user]);

  const { data: savedCalculations } = useCollection(savedCalculationsQuery);

  const handleSave = () => {
    if (!user || !db) return;
    
    const name = saveName || `CI: ${formatCurrency(numericPrincipal)} for ${numericYears}y`;
    const payload = {
      userId: user.uid,
      name,
      principal: numericPrincipal,
      rate: numericRate,
      years: numericYears,
      frequency,
      totalInterest: result.totalInterest,
      totalValue: result.totalValue,
      createdAt: new Date().toISOString(),
    };

    const colRef = collection(db, 'users', user.uid, 'compoundCalculations');
    addDocumentNonBlocking(colRef, payload);
    
    setSaveName("");
    toast({
      title: "CI Projection Saved",
      description: `"${name}" has been added to your collections.`,
    });
  };

  const handleDelete = (id: string) => {
    if (!user || !db) return;
    const docRef = doc(db, 'users', user.uid, 'compoundCalculations', id);
    deleteDocumentNonBlocking(docRef);
  };

  const loadSaved = (calc: any) => {
    setPrincipal(calc.principal);
    setRate(calc.rate);
    setYears(calc.years);
    setFrequency(calc.frequency);
  };

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
                <span className="font-bold text-primary">{formatCurrency(numericPrincipal)}</span>
              </div>
              <Slider
                value={[numericPrincipal]}
                min={1000}
                max={5000000}
                step={1000}
                onValueChange={(v) => setPrincipal(v[0])}
                className="py-4"
              />
              <Input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value === "" ? "" : Number(e.target.value))}
                onBlur={() => {
                  if (principal === "" || Number(principal) < 1000) setPrincipal(1000);
                  if (Number(principal) > 100000000) setPrincipal(100000000);
                }}
                className="mt-2 text-sm"
                placeholder="Initial amount"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground">Interest Rate (% p.a)</Label>
                <span className="font-bold text-primary">{numericRate}%</span>
              </div>
              <Slider
                value={[numericRate]}
                min={0.5}
                max={50}
                step={0.5}
                onValueChange={(v) => setRate(v[0])}
                className="py-4"
              />
              <Input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value === "" ? "" : Number(e.target.value))}
                onBlur={() => {
                  if (rate === "" || Number(rate) < 0.1) setRate(0.1);
                  if (Number(rate) > 100) setRate(100);
                }}
                className="mt-2 text-sm"
                placeholder="Interest rate"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground">Duration (Years)</Label>
                <span className="font-bold text-primary">{numericYears} yr</span>
              </div>
              <Slider
                value={[numericYears]}
                min={1}
                max={50}
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
                  if (Number(years) > 100) setYears(100);
                }}
                className="mt-2 text-sm"
                placeholder="Years"
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

            {user && (
              <div className="pt-4 border-t border-border space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ci-save-name" className="text-xs uppercase tracking-wider text-muted-foreground">Label</Label>
                  <Input 
                    id="ci-save-name"
                    placeholder="E.g. FD Growth" 
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <Button onClick={handleSave} className="w-full gap-2" size="sm">
                  <Save className="w-4 h-4" />
                  Save CI Goal
                </Button>
              </div>
            )}
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
        <Card className="calculator-card">
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
                  <Bar dataKey="investment" stackId="a" fill="hsl(var(--secondary))" radius={[0, 0, 0, 0]} isAnimationActive={true} />
                  <Bar dataKey="wealth" stackId="b" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} isAnimationActive={true} />
                  <Legend verticalAlign="top" height={36}/>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {user && savedCalculations && savedCalculations.length > 0 && (
          <Card className="calculator-card animate-stagger-4">
            <CardHeader>
              <CardTitle className="text-lg font-headline flex items-center gap-2">
                <History className="text-primary w-5 h-5" />
                Saved CI Projections
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
                      <p className="text-xs font-medium text-primary">Value: {formatCurrency(calc.totalValue)}</p>
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
