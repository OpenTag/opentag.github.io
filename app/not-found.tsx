"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function NotFound() {
  const [tagLine, setTagLine] = useState(0);
  
  const funnyTaglines = [
    "Looks like this tag is missing from our database!",
    "This tag seems to have wandered off...",
    "Oops! This tag is playing hide and seek.",
    "Error 404: Tag not found in the wild!",
    "Houston, we have a problem. This tag is lost in space.",
    "This tag has gone on vacation without telling us.",
  ];

  useEffect(() => {
    const tagInterval = setInterval(() => {
      setTagLine(prev => (prev + 1) % funnyTaglines.length);
    }, 4000);

    return () => {
      clearInterval(tagInterval);
    };
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="relative mb-8">
        <h1 className="text-9xl font-bold">
          404
        </h1>
      </div>
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Page Not Found</h2>
      
      <p className="text-xl mb-8 max-w-md min-h-[60px] transition-all duration-500">
        {funnyTaglines[tagLine]}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg">
          <Link href="/">
            Take Me Home
          </Link>
        </Button>
        
        <Button variant="outline" asChild size="lg">
          <Link href="/lookup">
            Look Up a Tag
          </Link>
        </Button>
      </div>
    </div>
  );
}