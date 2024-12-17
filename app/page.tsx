import { Button } from "@/components/ui/button";
import { Heart, UserCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import BlurIn from "@/components/ui/blur-in";
import {HealthArticle} from "@/components/health-article";

export default function Home() {
  return (
    (<div className="min-h-screen bg-background text-foreground">
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
        <BlurIn
          word="OpenTag"
          className="text-5xl sm:text-6xl font-bold tracking-tight text-red-600 dark:text-red-500 pt-10"
        />
        <BlurIn
          word="Saving Lives, Using QR Codes"
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

      {/* Article */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 flex justify-center">
        <HealthArticle />
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-muted/50 dark:bg-muted/20">
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
          <UserCircle className="h-12 w-12 text-red-600 dark:text-red-500 mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Community Built</h3>
          <p className="text-muted-foreground text-sm sm:text-base">
        Developed and maintained by a passionate community of contributors
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
      >
        Tag Lookup
      </Button>
    </div>)
  );
}
