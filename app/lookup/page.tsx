'use client'
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from 'react';

const LookupPage = () => {
  const [tagId, setTagId] = useState('');

  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-8">
      <div className="w-full max-w-md">
        <h1 className="font-bold text-3xl text-center">
          Enter Tag <span className="text-red-500">ID</span>
        </h1>
        <div className="space-y-3">
          <div className="mt-8">
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="123456"
              value={tagId}
              onChange={(e) => setTagId(e.target.value)}
            />
          </div>
          <p className="text-muted-foreground">
            Please enter the Tag ID found on OpenTag.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-8 mt-8">
          <Link href={`/id?id=${tagId}`} passHref>
            <Button variant="red" className="w-full sm:w-auto">
              Get Info
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LookupPage;
