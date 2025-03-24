"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { TagIcon, Cloud, Database } from "lucide-react";
import Image from "next/image";
import { auth } from "@/lib/firebaseClient";
import { signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const router = useRouter();

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

  const handleTagButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowTagModal(true);
  };

  const handleTagSelection = (type: 'online' | 'serverless') => {
    setShowTagModal(false);
    
    if (type === 'online') {
      router.push('/register');
    }
    if (type === 'serverless') {
      router.push('/serverless');
    }
    };

  return (
    <nav className="">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image src="/opentag.png" alt="OpenTag" width={40} height={40} className="mr-2" />
              <span className="font-bold text-xl hidden sm:inline">OpenTag</span>
            </Link>
            <div className="sm:hidden">
              {user ? (
              <Button variant="ghost" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              ) : (
              <Button variant="ghost" onClick={handleTagButtonClick}>
                Get Tag
              </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4">
              {user ? (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/about">About</Link>
                  </Button>
                  <Button variant="ghost" asChild>
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
                  <Button variant="default" onClick={handleTagButtonClick}>
                    Get Tag
                  </Button>
                </>
              )}
              <div className="hidden sm:inline">
                <ModeToggle />
              </div>
            </div>

            <div className="sm:hidden flex items-center gap-4">
              <ModeToggle />
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
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
                <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-black dark:text-white hover:bg-stone-700 hover:text-white">
                  About
                </Link>
                <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-black dark:text-white hover:bg-stone-700 hover:text-white">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-black dark:text-white hover:bg-stone-700 hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-black dark:text-white hover:bg-stone-700 hover:text-white">
                  Login
                </Link>
                <button
                  onClick={handleTagButtonClick}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-black dark:text-white hover:bg-stone-700 hover:text-white"
                >
                  Get Tag
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Tag Selection Modal */}
      {showTagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Choose Your Tag Type</h2>
            <div className="space-y-4">
              <button
                onClick={() => handleTagSelection('online')}
                className="w-full flex items-center p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Cloud className="mr-4 text-blue-500" size={24} />
                <div className="text-left">
                  <h3 className="font-semibold">Online Tag</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Store your medical records in the cloud with unlimited capacity. Access and update your health profile any number of times.</p>
                </div>
              </button>
              
              <button
                onClick={() => handleTagSelection('serverless')}
                className="w-full flex items-center p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Database className="mr-4 text-green-500" size={24} />
                <div className="text-left">
                  <h3 className="font-semibold">Serverless Tag</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Data stored in QR code. If you dont have a big medical history, and just want to store essential information, this is for you.</p>
                </div>
              </button>
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setShowTagModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}