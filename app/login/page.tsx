'use client';

import { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      // Sign in the user
      await signInWithEmailAndPassword(auth, email, password);
      setError(null);

      const db = getFirestore();
      const userUid = auth.currentUser?.uid;

      if (!userUid) {
        setError("User authentication failed. Please try again.");
        return;
      }

      // Fetch the tag document for the user
      const userDocRef = doc(db, "tags", userUid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        router.push('/dashboard');
      } else {
        setError("No tag data found for the user.");
      }
    } catch (error: any) {
      // Handle authentication errors
      const errorMessage =
        error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found'
          ? "Username or password is incorrect."
          : "Error logging in. Please try again later.";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-8">
      <div className="w-full max-w-md">
        <div className="font-bold text-3xl text-center mb-8">Login</div>
        <div className="space-y-3">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-8 mt-8">
          <Button variant="red" className="w-full sm:w-auto" onClick={handleLogin}>
            Login
          </Button>
        </div>
        <div className="mt-4 text-center">
          <Link href="/register" className="text-red-500">
            Don't have an account? Sign up
          </Link>
        </div>
        <div className="mt-4 text-center">
          <button
            className="text-red-500"
            onClick={async () => {
              const email = prompt("Please enter your email for password reset:");
              if (email) {
                try {
                  await sendPasswordResetEmail(auth, email);
                  alert("Password reset email sent!");
                } catch (error) {
                  alert("Error sending password reset email. Please try again.");
                }
              }
            }}
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
