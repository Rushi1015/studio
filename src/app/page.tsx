"use client"

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SipCalculator from "@/components/calculator/SipCalculator";
import SwpCalculator from "@/components/calculator/SwpCalculator";
import CompoundCalculator from "@/components/calculator/CompoundCalculator";
import { LineChart, BarChart2, Calculator, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen pb-12 overflow-x-hidden">
      {/* Header */}
      <header className="bg-card border-b border-border py-6 px-4 mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-primary p-2 rounded-lg transition-transform duration-500 group-hover:rotate-12">
              <Calculator className="text-primary-foreground w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-headline tracking-tight text-primary">FinSim</h1>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Financial Simulation Studio</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-secondary animate-pulse" />
              <span>Precise Calculations</span>
            </div>
            <nav className="flex items-center gap-4">
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors relative group">
                Documentation
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors relative group">
                Resources
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        {/* Intro Section */}
        <section className="mb-12 text-center md:text-left animate-in fade-in slide-in-from-left-8 duration-1000">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">
            Master Your <span className="text-primary relative inline-block">
              Financial Future
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0,5 Q50,0 100,5" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" className="animate-in slide-in-from-left duration-1000 delay-500" />
              </svg>
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl text-lg animate-in fade-in duration-1000 delay-300">
            Experience professional-grade financial modeling. Simulate SIPs, plan withdrawals, and explore the exponential magic of compound interest with real-time interactive charts.
          </p>
        </section>

        {/* Tabbed Calculators */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
          <Tabs defaultValue="sip" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="sip" className="flex items-center gap-2 px-6 py-3 transition-all duration-300">
                <LineChart className="w-4 h-4" />
                <span className="hidden sm:inline">SIP Calculator</span>
                <span className="sm:hidden">SIP</span>
              </TabsTrigger>
              <TabsTrigger value="swp" className="flex items-center gap-2 px-6 py-3 transition-all duration-300">
                <BarChart2 className="w-4 h-4" />
                <span className="hidden sm:inline">SWP Calculator</span>
                <span className="sm:hidden">SWP</span>
              </TabsTrigger>
              <TabsTrigger value="compound" className="flex items-center gap-2 px-6 py-3 transition-all duration-300">
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
        </div>

        {/* Features / Information Section */}
        <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-card rounded-2xl border border-border transition-all duration-500 hover:shadow-xl hover:-translate-y-2 animate-stagger-1">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 float-animation">
              <LineChart className="text-primary w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">SIP Visualization</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Plan your regular investments with clarity. See how small contributions grow exponentially over time with systematic investing.
            </p>
          </div>
          <div className="p-8 bg-card rounded-2xl border border-border transition-all duration-500 hover:shadow-xl hover:-translate-y-2 animate-stagger-2">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-6 float-animation" style={{ animationDelay: '1s' }}>
              <BarChart2 className="text-secondary w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Withdrawal Planning</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Plan your retirement or periodic expenses. SWP helps you understand how long your capital will last with regular withdrawals.
            </p>
          </div>
          <div className="p-8 bg-card rounded-2xl border border-border transition-all duration-500 hover:shadow-xl hover:-translate-y-2 animate-stagger-3">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 float-animation" style={{ animationDelay: '2s' }}>
              <Calculator className="text-primary w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Compound Magic</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Analyze the impact of compounding frequencies. Compare how monthly, quarterly, and annual compounding affects your maturity value.
            </p>
          </div>
        </section>
      </main>

      <footer className="mt-20 border-t border-border pt-12 pb-8 animate-in fade-in duration-1000">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} FinSim Studio. All calculations are illustrative and based on constant parameters.
          </p>
          <div className="flex justify-center gap-6 mt-6">
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}