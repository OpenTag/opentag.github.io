"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { TagIcon } from "lucide-react"
import Image from "next/image"

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image src="/opentag.png" alt="OpenTag" width={40} height={40} className="mr-2" />
              <span className="font-bold text-xl hidden sm:inline">OpenTag</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/about">About</Link>
            </Button>
            <Button variant="default" asChild>
              <Link href="/register">Get Tag</Link>
            </Button>
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}