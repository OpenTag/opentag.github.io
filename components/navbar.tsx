"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { TagIcon } from "lucide-react";
import Image from "next/image";
import { auth } from "@/lib/firebaseClient";
import { signOut } from "firebase/auth";

export function Navbar() {
  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      document.cookie = "tagID=; path=/; max-age=0";
      localStorage.removeItem("tagID");
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="border-b">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image src="/opentag.png" alt="OpenTag" width={40} height={40} className="mr-2" />
              <span className="font-bold text-xl hidden sm:inline">OpenTag</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Button variant="primary" asChild>
                  <Link href="/about">About</Link>
                </Button>
                <Button variant="red" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
                <>
                <Button variant="primary" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button variant="default" asChild>
                  <Link href="/register">Get Tag</Link>
                </Button>
                </>
            )}
            <ModeToggle className="hidden sm:inline" />
          </div>
        </div>
      </div>
    </nav>
  );
}