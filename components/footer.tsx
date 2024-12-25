"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t bg-stone-50 dark:bg-stone-900 py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex flex-col mb-4 sm:mb-0">
            <span className="font-bold text-lg text-stone-900 dark:text-stone-100">OpenTag</span>
            <span className="text-stone-600 dark:text-stone-400 text-sm">Made with ❤️ by Suvan</span>
            <span className="text-stone-600 dark:text-stone-400 text-sm"> Source code on GitHub</span>
            <span className="text-stone-600 dark:text-stone-400 text-sm">This project is under the MIT License</span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-stone-600 dark:text-stone-400">
            <Link href="/terms" className="hover:text-stone-800 dark:hover:text-stone-200">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
