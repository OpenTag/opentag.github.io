'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface PinInputDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (pin: string) => Promise<void>;
  title: string;
  description: string;
  isVerifying?: boolean;
  error?: string | null;
  basicInfo?: React.ReactNode;
}

export function PinInputDialog({
  isOpen,
  onClose,
  onVerify,
  title,
  description,
  isVerifying = false,
  error = null,
  basicInfo
}: PinInputDialogProps) {
  const [pin, setPin] = useState(['', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null]);
  
  // Reset pin when dialog opens
  useEffect(() => {
    if (isOpen) {
      setPin(['', '', '', '']);
      // Focus first input when dialog opens
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 100);
    }
  }, [isOpen]);
  
  const handlePinChange = (value: string, index: number) => {
    if (value.length > 1) {
      // If pasting a number, distribute it across inputs
      const digits = value.replace(/\D/g, '').split('').slice(0, 4);
      const newPin = [...pin];
      
      digits.forEach((digit, i) => {
        if (index + i < 4) {
          newPin[index + i] = digit;
        }
      });
      
      setPin(newPin);
      
      // Focus appropriate input after paste
      const focusIndex = Math.min(index + digits.length, 3);
      const nextInput = inputRefs.current[focusIndex];
      if (nextInput) {
        nextInput.focus();
      }
      
      return;
    }
    
    // For single digit input
    if (/^\d?$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      
      // Auto-advance to next input when a digit is entered
      if (value && index < 3) {
        const nextInput = inputRefs.current[index + 1];
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = inputRefs.current[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    }
    
    // Submit on enter if all digits are filled
    if (e.key === 'Enter' && pin.every(digit => digit)) {
      handleVerify();
    }
  };
  
  const handleVerify = () => {
    const pinString = pin.join('');
    if (pinString.length === 4) {
      onVerify(pinString);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={isVerifying ? undefined : onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex justify-center space-x-3">
            {pin.map((digit, index) => (
              <Input
                key={index}
                type="text"
                inputMode="numeric"
                value={digit}
                onChange={(e) => handlePinChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => inputRefs.current[index] = el}
                className={cn(
                  "w-12 h-12 text-center text-lg",
                  error ? "border-red-500" : ""
                )}
                maxLength={1}
                autoComplete="off"
              />
            ))}
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {basicInfo && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              {basicInfo}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isVerifying}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleVerify} 
            disabled={isVerifying || !pin.every(digit => digit)}
          >
            {isVerifying ? (
              <span className="flex items-center">
                <LoadingSpinner size="sm" className="mr-2 h-4 w-4" /> 
                Verifying...
              </span>
            ) : (
              'Verify PIN'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}