"use client"

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import BlurIn from "@/components/ui/blur-in";
import { HealthArticle } from "@/components/health-article";
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
  Backpack,
  AlertTriangle,
  Clock,
  Users,
  Cloud,
  Database
} from "lucide-react";

export default function Home() {
  const testimonials = [
    {
      quote: "OpenTag saved my life when I had a cycling accident. The paramedics immediately accessed my medical information and knew about my severe allergy to certain medications.",
      name: "Michael R.",
      role: "Cycling Enthusiast"
    },
    {
      quote: "As a parent of a child with diabetes, OpenTag gives me peace of mind knowing that if anything happens, emergency responders will have immediate access to her medical needs.",
      name: "Sarah J.",
      role: "Parent"
    },
    {
      quote: "I travel frequently for work, and having OpenTag on my luggage and personal items makes me feel secure even when I'm in countries where I don't speak the language.",
      name: "David L.",
      role: "Business Traveler"
    }
  ];

  const emergencyStats = [
    { 
      number: "94%", 
      description: "Of emergency medical personnel report significant challenges accessing patients' critical health information during emergency situations", 
      source: "https://www.jems.com/ems-management/on-scene-ems-access-to-past-medical-history/" 
    },
    { 
      number: "70%", 
      description: "Of preventable medical errors occur due to communication failures or lack of readily available medical information", 
      source: "https://timesofindia.indiatimes.com/life-style/health-fitness/health-news/medical-negligence-70-of-deaths-are-a-result-of-miscommunication/articleshow/51235466.cms" 
    },
    { 
      number: "53 min", 
      description: "Average reduction in emergency department stay when patient health information is accessed electronically versus traditional methods", 
      source: "https://ihpi.umich.edu/news/faster-access-patient-information-results-improved-emergency-care" 
    }
  ];

  const [showTagModal, setShowTagModal] = useState(false);
  
  const handleGetTag = (e: any) => {
    e.preventDefault();
    setShowTagModal(true);
  };
  
  const handleTagSelection = (type: any) => {
    setShowTagModal(false);
    if (type === 'online') {
      window.location.href = '/register';
    } else if (type === 'serverless') {
      window.location.href = '/serverless';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
        )}
      />
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-red-600 dark:text-red-500">
                OpenTag
              </h1>
              <p className="text-2xl sm:text-3xl text-muted-foreground mt-4 font-semibold">
                When Every Second Counts
              </p>
              <p className="mt-6 text-lg text-muted-foreground">
                Life-saving medical information at the scan of a QR code. Simple, secure, and potentially the difference between life and death in an emergency.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button size="lg" variant="red" className="font-bold px-8" onClick={handleGetTag}>
                  Get Your Tag
                </Button>
                <Button asChild size="lg" variant="outline" className="font-bold">
                  <Link href="/lookup">Found a Tag?</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center relative">
              <div className="relative w-64 h-64 sm:w-96 sm:h-96">
                <div className="absolute inset-0 bg-red-100 dark:bg-red-900/20 rounded-full animate-pulse" style={{ animationDuration: '3s' }}></div>
                <Image
                  src="/opentag.png"
                  alt="OpenTag Medical ID"
                  className="rounded-full relative z-10"
                  fill
                  sizes="100vw"
                  style={{
                    objectFit: "cover"
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Stats Section */}
      <section className="py-16 bg-red-50 dark:bg-red-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">The Reality of Medical Emergencies</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              These statistics highlight why immediate access to medical information is critical
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {emergencyStats.map((stat, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center p-8 bg-white dark:bg-stone-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-5xl font-bold text-red-600 dark:text-red-500 mb-4">{stat.number}</h3>
                <p className="text-muted-foreground mb-4">{stat.description}</p>
                <a 
                  href={stat.source} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-red-600 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400 mt-2 flex items-center"
                >
                  View Source <span className="ml-1">→</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How OpenTag Works</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              A simple solution to a critical problem. OpenTag bridges the gap between you and emergency responders when you need it most.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-stone-900 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Your Profile</h3>
              <p className="text-muted-foreground">
                Input your essential medical information, emergency contacts, and any critical health conditions or allergies.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-stone-900 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                <Smartphone className="h-8 w-8 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Your QR Code</h3>
              <p className="text-muted-foreground">
                Receive a unique QR code linked to your secure profile. Attach it to personal items, vehicles, or carry it with you.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-stone-900 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Access</h3>
              <p className="text-muted-foreground">
                In an emergency, responders scan your code to instantly access vital information that could save your life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tag Example Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative w-full h-72 sm:h-96">
              <Image
                src="/sampletag-s.png"
                alt="OpenTag Example"
                className="rounded-lg object-contain"
                fill
                sizes="100vw"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">What is OpenTag?</h2>
              <p className="text-lg text-muted-foreground mb-4">
                OpenTag is a life-saving QR code system that provides critical medical information when you can't speak for yourself.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Attach it to your personal items like helmets, bikes, backpacks, or even your phone case. In an emergency, first responders can instantly access your:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center">
                  <ShieldCheck className="h-5 w-5 text-red-600 dark:text-red-500 mr-2" />
                  <span>Medical conditions and allergies</span>
                </li>
                <li className="flex items-center">
                  <ShieldCheck className="h-5 w-5 text-red-600 dark:text-red-500 mr-2" />
                  <span>Current medications</span>
                </li>
                <li className="flex items-center">
                  <ShieldCheck className="h-5 w-5 text-red-600 dark:text-red-500 mr-2" />
                  <span>Emergency contact information</span>
                </li>
                <li className="flex items-center">
                  <ShieldCheck className="h-5 w-5 text-red-600 dark:text-red-500 mr-2" />
                  <span>Blood type and donor status</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose OpenTag?</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              We've created the most accessible, secure, and reliable medical ID system available today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <Heart className="h-12 w-12 text-red-600 dark:text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Open Source</h3>
              <p className="text-muted-foreground">
                Built with transparent, community-reviewed technologies for absolute trust and security.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <DollarSign className="h-12 w-12 text-red-600 dark:text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Free Forever</h3>
              <p className="text-muted-foreground">
                No subscriptions, no hidden fees. Your health and safety shouldn't come with a price tag.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <ShieldCheck className="h-12 w-12 text-red-600 dark:text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Bank-Level Security</h3>
              <p className="text-muted-foreground">
                End-to-end encryption and strict privacy controls protect your sensitive medical information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-red-50 dark:bg-red-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Where to Use OpenTag</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground mb-8">
              Attach your OpenTag to anything you regularly use or wear for maximum protection wherever you go.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {[
              { icon: HardHat, title: "Helmets", description: "For cyclists, motorcyclists, and construction workers" },
              { icon: Bike, title: "Bicycles", description: "Attach to your bike frame for quick identification" },
              { icon: Backpack, title: "Backpacks", description: "Perfect for hikers, students, and commuters" },
              { icon: Briefcase, title: "Work Bags", description: "Stay protected during your daily commute" },
              { icon: Plane, title: "Travel Gear", description: "Essential for international travelers" },
              { icon: Car, title: "Vehicles", description: "Quick access in case of car accidents" },
              { icon: Baby, title: "Children's Items", description: "Add to your child's belongings for extra safety" },
              { icon: Smartphone, title: "Phone Cases", description: "Always have your information on hand" },
            ].map(({ icon: Icon, title, description }, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 bg-white dark:bg-stone-900 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <Icon className="h-10 w-10 text-red-600 dark:text-red-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section (abbreviated) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-6">
            <div className="bg-white dark:bg-stone-900 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Is my medical information secure?</h3>
              <p className="text-muted-foreground">
                Absolutely. We use end-to-end encryption and follow healthcare industry standards (HIPAA-compliant) to ensure your data is protected at all times.
              </p>
            </div>
            <div className="bg-white dark:bg-stone-900 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">How do emergency responders know to look for my OpenTag?</h3>
              <p className="text-muted-foreground">
                OpenTag is becoming widely recognized among emergency services. Each tag is clearly marked with instructions, and we conduct ongoing education programs for first responders.
              </p>
            </div>
            <div className="bg-white dark:bg-stone-900 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Can I update my information?</h3>
              <p className="text-muted-foreground">
                Yes, you can update your medical information anytime through your secure account. Changes are reflected immediately when your QR code is scanned.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-background to-red-50 dark:to-red-950/20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Protect what matters most.</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of individuals who have chosen OpenTag as their silent guardian. It only takes 5 minutes to set up, but could give you a lifetime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="red" className="text-lg px-10 py-6 font-bold" onClick={handleGetTag}>
              Get Your Free Tag
            </Button>
          </div>
        </div>
      </section>
      
      {/* Tag Selection Modal */}
      {showTagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Choose Your Tag Type</h2>
            <div className="space-y-4">
              <button
                onClick={() => handleTagSelection('online')}
                className="w-full flex items-center p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Cloud className="mr-4 text-blue-500" size={24} />
                <div className="text-left">
                  <h3 className="font-semibold">Online Tag</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Store your medical records in the cloud with unlimited capacity. Access and update your health profile any number of times.</p>
                </div>
              </button>
              
              <button
                onClick={() => handleTagSelection('serverless')}
                className="w-full flex items-center p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Database className="mr-4 text-green-500" size={24} />
                <div className="text-left">
                  <h3 className="font-semibold">Serverless Tag</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Data stored in QR code. If you dont have a big medical history, and just want to store essential information, this is for you.</p>
                </div>
              </button>
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setShowTagModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}