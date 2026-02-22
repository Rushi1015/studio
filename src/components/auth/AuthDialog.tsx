
"use client"

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, useUser } from "@/firebase";
import { LogIn, UserPlus, LogOut, User, AlertCircle } from "lucide-react";
import { signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AuthDialog() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShowSignupPrompt(false);
    setIsLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setIsOpen(false);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setIsOpen(false);
      }
    } catch (err: any) {
      // Firebase auth error codes
      if (isLogin && (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential')) {
        setError("We couldn't find an account with these credentials.");
        setShowSignupPrompt(true);
      } else {
        setError(err.message || "An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchToSignup = () => {
    setIsLogin(false);
    setError(null);
    setShowSignupPrompt(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setError(null);
      setShowSignupPrompt(false);
      setIsLogin(true);
      setEmail("");
      setPassword("");
    }
  };

  if (isUserLoading) return <Button variant="ghost" disabled>Loading...</Button>;

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
          <User className="w-4 h-4" />
          <span className="truncate max-w-[150px]">{user.email}</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => signOut(auth)} className="gap-2">
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="gap-2">
          <LogIn className="w-4 h-4" />
          Login to Save
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{isLogin ? "Welcome Back" : "Create Account"}</DialogTitle>
          <DialogDescription>
            {isLogin 
              ? "Sign in to your account to save and access your financial projections." 
              : "Join FinSim to start tracking your long-term wealth building goals."}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Issue</AlertTitle>
            <AlertDescription className="flex flex-col gap-3">
              <span>{error}</span>
              {showSignupPrompt && (
                <div className="pt-2">
                  <p className="text-sm font-semibold mb-2">Don't have an account yet?</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full bg-destructive-foreground text-destructive hover:bg-destructive-foreground/90 border-destructive/20"
                    onClick={switchToSignup}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up Now
                  </Button>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : (isLogin ? "Sign In" : "Sign Up")}
          </Button>
          <div className="text-center">
            <button 
              type="button" 
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setShowSignupPrompt(false);
              }}
              className="text-xs text-muted-foreground hover:text-primary underline underline-offset-4"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
