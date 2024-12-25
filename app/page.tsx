import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import BlurIn from "@/components/ui/blur-in";
import {HealthArticle} from "@/components/health-article";
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/ui/dot-pattern";
import { 
  Heart,
  Bike,
  ShieldCheck, 
  DollarSign, 
  Briefcase, 
  Plane, 
  Smartphone, 
  Car, 
  Baby,
  HardHat,
  Backpack
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
        )}
      />
      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center flex flex-col items-center">
        <div className="relative w-32 h-32 sm:w-48 sm:h-48" data-aos="zoom-y-out" data-aos-delay="100">
        <Image
        src="/opentag.png"
        alt="Medical Logo"
        className="rounded-full"
        fill
        sizes="100vw"
        data-aos="zoom-y-out" data-aos-delay="150"
        style={{
        objectFit: "cover"
        }} 
        />
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-red-600 dark:text-red-500 pt-10">
          OpenTag
        </h1>
        <p className="max-w-2xl mx-auto text-xl sm:text-2xl text-muted-foreground mt-4 font-semibold">
          Saving Lives, Using QR Codes
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          {/* Find a Tag Dialog */}
          <div className="flex justify-center flex-1">
            <Link
            className="text-xl font-bold text-red-500"
            href="/lookup"
            >
            Found a Tag? <span className="underline bold">Click here</span> to get its owner's medical information
            </Link>
        </div>
        </div>
          </div>
        </div>
      </section>

      {/* Article */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 flex justify-center">
        <HealthArticle />
      </section>

      {/* Features Section */}
      <section className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center text-center p-6">
          <Heart className="h-12 w-12 text-red-600 dark:text-red-500 mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Open Source</h3>
          <p className="text-muted-foreground text-sm sm:text-base">
            Built with open source technologies, ensuring transparency and security
          </p>
        </div>
        <div className="flex flex-col items-center text-center p-6">
          <DollarSign className="h-12 w-12 text-red-600 dark:text-red-500 mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Free Forever</h3>
          <p className="text-muted-foreground text-sm sm:text-base">
            No hidden costs or star marks, ever. Free and accessible for everyone, forever.
          </p>
        </div>
        <div className="flex flex-col items-center text-center p-6">
          <ShieldCheck className="h-12 w-12 text-red-600 dark:text-red-500 mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Secure</h3>
          <p className="text-muted-foreground text-sm sm:text-base">
            Your data is protected with industry-leading security measures
          </p>
        </div>
          </div>
        </div>
      </section>

        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto items-center">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-3xl font-bold mb-4">What is OpenTag?</h2>
            </div>
            <div className="relative w-full h-48 sm:h-64">
              <Image
                src="/sampletag.png"
                alt="OpenTag Example"
                className="rounded-lg object-contain py-4"
                fill
                sizes="100vw"
              />
            </div>
            <div className="max-w-4xl mx-auto mt-8">
            <p className="text-muted-foreground text-sm sm:text-base mb-4">
            Put it in simple terms, OpenTag is like a sticker that you can attach to your personal items. This sticker contains a QR code that, when scanned, will display your medical information.
          </p>
            <p className="text-muted-foreground text-sm sm:text-base">
            You may ask why you would need this. Well, imagine you are unconscious and unable to communicate with the paramedics. They can scan the QR code on your OpenTag to get all the information they need to save your life and contact your family.
            </p>
          </div>
          </div>
        </section>

<section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    <div className="text-center">
      <h2 className="text-3xl sm:text-4xl font-bold mb-8">Where Can You Use OpenTag?</h2>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {[
        { icon: HardHat, title: "Helmets" },
        { icon: Bike, title: "Cycles" },
        { icon: Backpack, title: "Backpacks" },
        { icon: Briefcase, title: "Work Bags" },
        { icon: Plane, title: "Travel Gear" },
        { icon: Car, title: "Vehicles" },
        { icon: Baby, title: "Baby Gear" },
        { icon: Smartphone, title: "Mobile Phones" },
      ].map(({ icon: Icon, title }, index) => (
        <div key={index} className="flex flex-col items-center text-center p-6 bg-white dark:bg-stone-900 rounded-lg shadow-md">
          <Icon className="h-12 w-12 text-red-600 dark:text-red-500 mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold mb-2">{title}</h3>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground text-sm sm:text-base mb-8">
        Get your OpenTag today and start protecting yourself and your loved ones from medical emergencies
          </p>
          <Button asChild size="lg" variant="red">
        <Link href="/register">Get Tag</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
