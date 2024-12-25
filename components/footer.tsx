"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t bg-gray-50 py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex flex-col mb-4 sm:mb-0">
            <span className="font-bold text-lg">OpenTag</span>
            <span className="text-gray-600 text-sm">Made with ❤️ by Suvan</span>
            <span className="text-gray-600 text-sm"> Source code on GitHub</span>
            <span className="text-gray-600 text-sm">This project is under the MIT License</span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <Link href="/terms" className="hover:text-gray-800">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
