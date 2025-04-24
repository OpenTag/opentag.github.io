'use client';

import { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Sign in the user
      await signInWithEmailAndPassword(auth, email, password);

      const db = getFirestore();
      const userUid = auth.currentUser?.uid;

      if (!userUid) {
        setError("User authentication failed. Please try again.");
        setIsLoading(false);
        return;
      }

      // Fetch the tag document for the user
      const userDocRef = doc(db, "tags", userUid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        router.push('/dashboard');
      } else {
        setError("No tag data found for the user.");
        setIsLoading(false);
      }
    } catch (error: any) {
      // Handle authentication errors
      const errorMessage =
        error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found'
          ? "Username or password is incorrect."
          : error.code === 'auth/too-many-requests'
          ? "Too many failed login attempts. Try again later or reset your password."
          : "Error logging in. Please try again later.";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail || !/^\S+@\S+\.\S+$/.test(resetEmail)) {
      setResetError("Please enter a valid email address");
      return;
    }
    
    setIsSendingReset(true);
    setResetError(null);
    setResetSuccess(false);
    
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSuccess(true);
      setResetError(null);
      
      // Clear field on success but keep dialog open to show success message
      setResetEmail("");
    } catch (error: any) {
      // Handle reset errors
      const errorMessage = 
        error.code === 'auth/user-not-found'
          ? "No account found with this email address."
          : "Error sending password reset email. Please try again.";
      setResetError(errorMessage);
      setResetSuccess(false);
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <PageWrapper>
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Log in to OpenTag</CardTitle>
            <CardDescription>
              Access your medical information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <LoadingSpinner size="sm" className="mr-2 h-4 w-4" />
                    Logging in...
                  </span>
                ) : (
                  'Log in'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <div className="text-center w-full">
              <Button 
                variant="link" 
                className="text-red-500"
                onClick={() => setResetPasswordOpen(true)}
                disabled={isLoading}
              >
                Forgot password?
              </Button>
            </div>
            <div className="text-center w-full">
              <Button 
                variant="link" 
                className="text-red-500"
                asChild
                disabled={isLoading}
              >
                <Link href="/register">
                  Don't have an account? Sign up
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Password Reset Dialog */}
      <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email address below to receive a password reset link.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Input
              type="email"
              placeholder="Your email address"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              disabled={isSendingReset || resetSuccess}
            />
            
            {resetError && (
              <Alert variant="destructive">
                <AlertDescription>{resetError}</AlertDescription>
              </Alert>
            )}
            
            {resetSuccess && (
              <Alert variant="default" className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900 dark:text-green-200 dark:border-green-800">
                <AlertDescription>Password reset email sent! Please check your inbox.</AlertDescription>
              </Alert>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setResetPasswordOpen(false)}
              disabled={isSendingReset}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleResetPassword}
              disabled={isSendingReset || resetSuccess}
            >
              {isSendingReset ? (
                <span className="flex items-center">
                  <LoadingSpinner size="sm" className="mr-2 h-4 w-4" />
                  Sending...
                </span>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
};

export default Login;
