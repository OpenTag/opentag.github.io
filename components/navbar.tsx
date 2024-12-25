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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
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
            <div className="hidden sm:flex items-center gap-4">
              {user ? (
                <>
                  <Button variant="primary" asChild>
                    <Link href="/about">About</Link>
                  </Button>
                  <Button variant="primary" asChild>
                    <Link href="/dashboard">Dashboard</Link>
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

            <div className="sm:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {menuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user ? (
              <>
                <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-700 hover:text-white">
                  About
                </Link>
                <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-700 hover:text-white">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-700 hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-700 hover:text-white">
                  Login
                </Link>
                <Link href="/register" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-700 hover:text-white">
                  Get Tag
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
