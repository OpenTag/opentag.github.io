'use client'
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";

const LookupPage: React.FC = () => {
  const handleSubmit = () => {
    // Handle submit logic
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-8">
      <div className="w-full max-w-md">
      <h1 className="font-bold text-3xl text-center">
        Enter Tag <span className="text-red-500">ID</span>
      </h1>
      <div className="space-y-3">
        <div className="mt-8">
          <InputOTP maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <p className="text-muted-foreground">
        Please enter the 6-digit Tag ID found on OpenTag.
        </p>
        <div className="">
          <InputOTP maxLength={4}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <p className="text-muted-foreground">
        Please enter your 4-digit PIN.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row sm:space-x-8 mt-8">
        <Button variant="red" onClick={handleSubmit} className="w-full sm:w-auto">
        Get Info
        </Button>
      </div>
      </div>
    </div>
  );
};

export default LookupPage;