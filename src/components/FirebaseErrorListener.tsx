'use client';

import { useState, useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from "@/hooks/use-toast";

/**
 * An invisible component that listens for globally emitted error events.
 * It handles permission errors by throwing them (to be caught by Next.js overlay)
 * and authentication errors by displaying a toast notification.
 */
export function FirebaseErrorListener() {
  const [permissionError, setPermissionError] = useState<FirestorePermissionError | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      setPermissionError(error);
    };

    const handleAuthError = (error: { message: string; code?: string }) => {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message || "An unexpected error occurred during authentication.",
      });
    };

    errorEmitter.on('permission-error', handlePermissionError);
    errorEmitter.on('auth-error', handleAuthError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
      errorEmitter.off('auth-error', handleAuthError);
    };
  }, [toast]);

  // For Firestore permission errors, we throw to trigger the agentive error loop.
  if (permissionError) {
    throw permissionError;
  }

  return null;
}
