'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, UserCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import BlurIn from "@/components/ui/blur-in";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tagId, setTagId] = useState("");
  const [pin, setPin] = useState("");

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSubmit = () => {
    console.log("Tag ID:", tagId);
    console.log("PIN:", pin);
    handleCloseDialog();
  };

  return (
    (<div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center flex flex-col items-center">
          <div className="relative w-32 h-32 sm:w-48 sm:h-48">
          <Image
            src="/opentag.png"
            alt="Medical Logo"
            className="rounded-full"
            fill
            sizes="100vw"
            style={{
            objectFit: "cover"
            }} 
          />
          </div>
        <BlurIn
          word="OpenTag"
          className="text-5xl sm:text-6xl font-bold tracking-tight text-red-600 dark:text-red-500 pt-10"
        />
        <BlurIn
          word="Fun Fact - A QR Code can save your life."
          className="max-w-2xl mx-auto text-xl sm:text-2xl text-muted-foreground"
        />
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          {/* <Button asChild size="lg">
            <Link href="/register">Get Your MedTag</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/about">Learn More</Link>
          </Button> */}
        </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-muted/50 dark:bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <Heart className="h-12 w-12 text-red-600 dark:text-red-500 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Digital Health Records</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                Secure, unique digital records for your health that can be easily verified
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <UserCircle className="h-12 w-12 text-red-600 dark:text-red-500 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Personal Profile</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                Manage your health information and share what you want with healthcare providers
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <ShieldCheck className="h-12 w-12 text-red-600 dark:text-red-500 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Verified Information</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                Email verification and secure data storage for peace of mind
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground text-sm sm:text-base mb-8">
            Join the future of medical identification with MedTag
          </p>
          <Button asChild size="lg">
            <Link href="/register">Register Now</Link>
          </Button>
        </div>
      </section>
      {/* Find a Tag Dialog */}
      <Button
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:text-white"
        onClick={handleOpenDialog}
      >
        Find a Tag
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Find a Tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Tag ID"
              value={tagId}
              onChange={(e) => setTagId(e.target.value)}
            />
            <Input
              placeholder="PIN"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit}>Submit</Button>
            <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>)
  );
}
