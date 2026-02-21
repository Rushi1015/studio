"use client"

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SipCalculator from "@/components/calculator/SipCalculator";
import SwpCalculator from "@/components/calculator/SwpCalculator";
import CompoundCalculator from "@/components/calculator/CompoundCalculator";
import { LineChart, BarChart2, Calculator, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-card border-b border-border py-6 px-4 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <Calculator className="text-primary-foreground w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-headline tracking-tight text-primary">FinSim</h1>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Financial Simulation Studio</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-secondary" />
              <span>Precise Calculations</span>
            </div>
            <nav className="flex items-center gap-4">
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Documentation</a>
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Resources</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        {/* Intro Section */}
        <section className="mb-12 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">
            Master Your <span className="text-primary">Financial Future</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Experience professional-grade financial modeling. Simulate SIPs, plan withdrawals, and explore the exponential magic of compound interest with real-time interactive charts.
          </p>
        </section>

        {/* Tabbed Calculators */}
        <Tabs defaultValue="sip" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex bg-muted/50 p-1">
            <TabsTrigger value="sip" className="flex items-center gap-2 px-6 py-3">
              <LineChart className="w-4 h-4" />
              <span className="hidden sm:inline">SIP Calculator</span>
              <span className="sm:hidden">SIP</span>
            </TabsTrigger>
            <TabsTrigger value="swp" className="flex items-center gap-2 px-6 py-3">
              <BarChart2 className="w-4 h-4" />
              <span className="hidden sm:inline">SWP Calculator</span>
              <span className="sm:hidden">SWP</span>
            </TabsTrigger>
            <TabsTrigger value="compound" className="flex items-center gap-2 px-6 py-3">
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Compound Interest</span>
              <span className="sm:hidden">CI</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sip" className="focus-visible:outline-none">
            <SipCalculator />
          </TabsContent>
          <TabsContent value="swp" className="focus-visible:outline-none">
            <SwpCalculator />
          </TabsContent>
          <TabsContent value="compound" className="focus-visible:outline-none">
            <CompoundCalculator />
          </TabsContent>
        </Tabs>

        {/* Features / Information Section */}
        <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-card rounded-xl border border-border">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <LineChart className="text-primary w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold mb-2">SIP Visualization</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Plan your regular investments with clarity. See how small contributions grow exponentially over time with systematic investing.
            </p>
          </div>
          <div className="p-6 bg-card rounded-xl border border-border">
            <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
              <BarChart2 className="text-secondary w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold mb-2">Withdrawal Planning</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Plan your retirement or periodic expenses. SWP helps you understand how long your capital will last with regular withdrawals.
            </p>
          </div>
          <div className="p-6 bg-card rounded-xl border border-border">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Calculator className="text-primary w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold mb-2">Compound Magic</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Analyze the impact of compounding frequencies. Compare how monthly, quarterly, and annual compounding affects your maturity value.
            </p>
          </div>
        </section>
      </main>

      <footer className="mt-20 border-t border-border pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} FinSim Studio. All calculations are illustrative and based on constant parameters.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <a href="#" className="text-xs text-muted-foreground hover:text-primary">Privacy Policy</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary">Terms of Service</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
