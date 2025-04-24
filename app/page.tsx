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
  Database,
  CheckCircle,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {

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

  const router = useRouter();
  const [showTagModal, setShowTagModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userResponses, setUserResponses] = useState({
    chronicCondition: false,
    frequentUpdates: false,
    emergencyAccess: false,
    detailedHistory: false,
  });
  
  const handleGetTag = (e: any) => {
    e.preventDefault();
    setShowTagModal(true);
    setCurrentStep(0);
    setUserResponses({
      chronicCondition: false,
      frequentUpdates: false,
      emergencyAccess: false,
      detailedHistory: false,
    });
  };
  
  const handleTagSelection = (type: 'online' | 'serverless') => {
    setShowTagModal(false);
    if (type === 'online') {
      router.push('/register');
    } else if (type === 'serverless') {
      router.push('/serverless');
    }
  };

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleToggleResponse = (field: keyof typeof userResponses) => {
    setUserResponses(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const getRecommendedTag = () => {
    let onlineScore = 0;
    if (userResponses.chronicCondition) onlineScore += 2;
    if (userResponses.frequentUpdates) onlineScore += 2;
    if (userResponses.emergencyAccess) onlineScore += 1;
    if (userResponses.detailedHistory) onlineScore += 2;

    return onlineScore >= 3 ? 'online' : 'serverless';
  };

  const steps = [
    {
      title: "Choose Your Tag Type",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Help us suggest the right tag type for your needs by answering a few quick questions.
          </p>
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => setShowTagModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleNextStep}>
              Start <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )
    },
    {
      title: "Medical Conditions",
      content: (
        <div className="space-y-4">
          <div className="flex items-start mb-4">
            <div className="flex items-center h-5">
              <input
                id="chronic"
                type="checkbox"
                checked={userResponses.chronicCondition}
                onChange={() => handleToggleResponse('chronicCondition')}
                className="w-4 h-4 border border-gray-300 rounded accent-red-600"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="chronic" className="font-medium text-gray-700 dark:text-gray-300">I have chronic conditions that require ongoing management</label>
              <p className="text-xs text-gray-500 dark:text-gray-400">Like diabetes, heart disease, asthma, etc.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="history"
                type="checkbox"
                checked={userResponses.detailedHistory}
                onChange={() => handleToggleResponse('detailedHistory')}
                className="w-4 h-4 border border-gray-300 rounded accent-red-600"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="history" className="font-medium text-gray-700 dark:text-gray-300">I have a detailed medical history</label>
              <p className="text-xs text-gray-500 dark:text-gray-400">Multiple diagnoses, procedures, or treatments</p>
            </div>
          </div>
          
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={handlePrevStep}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button onClick={handleNextStep}>
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )
    },
    {
      title: "Medical Access",
      content: (
        <div className="space-y-4">
          <div className="flex items-start mb-4">
            <div className="flex items-center h-5">
              <input
                id="updates"
                type="checkbox"
                checked={userResponses.frequentUpdates}
                onChange={() => handleToggleResponse('frequentUpdates')}
                className="w-4 h-4 border border-gray-300 rounded accent-red-600"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="updates" className="font-medium text-gray-700 dark:text-gray-300">I need to update my medical information frequently</label>
              <p className="text-xs text-gray-500 dark:text-gray-400">Regular doctor visits, changing medications, etc.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="emergency"
                type="checkbox"
                checked={userResponses.emergencyAccess}
                onChange={() => handleToggleResponse('emergencyAccess')}
                className="w-4 h-4 border border-gray-300 rounded accent-red-600"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="emergency" className="font-medium text-gray-700 dark:text-gray-300">I want medical professionals to access my data in emergencies</label>
              <p className="text-xs text-gray-500 dark:text-gray-400">Provides quick access to critical information</p>
            </div>
          </div>
          
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={handlePrevStep}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button onClick={handleNextStep}>
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )
    },
    {
      title: "Recommendation",
      content: (
        <div className="space-y-4">
          {getRecommendedTag() === 'online' ? (
            <div className="border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/30 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Cloud className="mr-2 text-green-500" size={24} />
                <h3 className="font-semibold text-green-700 dark:text-green-400">We Recommend: Online Tag</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Based on your needs, an Online Tag would be best for you. It offers:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <CheckCircle className="mr-1.5 h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Cloud storage with unlimited capacity</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-1.5 h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Frequent updates to your health profile</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-1.5 h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Better for chronic conditions and detailed histories</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-1.5 h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Emergency access for medical professionals</span>
                </li>
              </ul>
            </div>
          ) : (
            <div className="border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/30 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Database className="mr-2 text-green-500" size={24} />
                <h3 className="font-semibold text-green-700 dark:text-green-400">We Recommend: Serverless Tag</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Based on your needs, a Serverless Tag would work well for you. It offers:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <CheckCircle className="mr-1.5 h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Data stored directly in a QR code</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-1.5 h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Great for essential information</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-1.5 h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Simple to manage and use</span>
                </li>
              </ul>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button 
              variant={getRecommendedTag() === 'serverless' ? "default" : "outline"} 
              className="w-full"
              onClick={() => handleTagSelection('serverless')}
            >
              <Database className="mr-2 h-4 w-4" /> Serverless Tag
            </Button>
            <Button 
              variant={getRecommendedTag() === 'online' ? "default" : "outline"} 
              className="w-full"
              onClick={() => handleTagSelection('online')}
            >
              <Cloud className="mr-2 h-4 w-4" /> Online Tag
            </Button>
          </div>
          
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={handlePrevStep}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button variant="outline" onClick={() => setShowTagModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )
    }
  ];

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
              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-red-600">
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
                <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800/20 rounded-full animate-pulse" style={{ animationDuration: '3s' }}></div>
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
      <section className="py-16 bg-gray-50 dark:bg-gray-900/20">
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
                className="flex flex-col items-center text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-5xl font-bold text-red-600 mb-4">{stat.number}</h3>
                <p className="text-muted-foreground mb-4">{stat.description}</p>
                <a 
                  href={stat.source} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-red-600 hover:text-red-800 dark:hover:text-red-400 mt-2 flex items-center"
                >
                  View Source <span className="ml-1">→</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How OpenTag Works</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              A simple solution to a critical problem. OpenTag bridges the gap between you and emergency responders when you need it most.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Your Profile</h3>
              <p className="text-muted-foreground">
                Input your essential medical information, emergency contacts, and any critical health conditions or allergies.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                <Smartphone className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Your QR Code</h3>
              <p className="text-muted-foreground">
                Receive a unique QR code linked to your secure profile. Attach it to personal items, vehicles, or carry it with you.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-red-600" />
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/20">
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
                  <ShieldCheck className="h-5 w-5 text-red-600 mr-2" />
                  <span>Medical conditions and allergies</span>
                </li>
                <li className="flex items-center">
                  <ShieldCheck className="h-5 w-5 text-red-600 mr-2" />
                  <span>Current medications</span>
                </li>
                <li className="flex items-center">
                  <ShieldCheck className="h-5 w-5 text-red-600 mr-2" />
                  <span>Emergency contact information</span>
                </li>
                <li className="flex items-center">
                  <ShieldCheck className="h-5 w-5 text-red-600 mr-2" />
                  <span>Blood type and donor status</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose OpenTag?</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              We've created the most accessible, secure, and reliable medical ID system available today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <Heart className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Open Source</h3>
              <p className="text-muted-foreground">
                Built with transparent, community-reviewed technologies for absolute trust and security.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <DollarSign className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Free Forever</h3>
              <p className="text-muted-foreground">
                No subscriptions, no hidden fees. Your health and safety shouldn't come with a price tag.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <ShieldCheck className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Bank-Level Security</h3>
              <p className="text-muted-foreground">
                End-to-end encryption and strict privacy controls protect your sensitive medical information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900">
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
              <div key={index} className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <Icon className="h-10 w-10 text-red-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section (abbreviated) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Is my medical information secure?</h3>
              <p className="text-muted-foreground">
                Absolutely. We use end-to-end encryption and follow healthcare industry standards (HIPAA-compliant) to ensure your data is protected at all times.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">How do emergency responders know to look for my OpenTag?</h3>
              <p className="text-muted-foreground">
                OpenTag is becoming widely recognized among emergency services. Each tag is clearly marked with instructions, and we conduct ongoing education programs for first responders.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Can I update my information?</h3>
              <p className="text-muted-foreground">
                Yes, you can update your medical information anytime through your secure account. Changes are reflected immediately when your QR code is scanned.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security and Compliance Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Enterprise-Grade Security & Compliance</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Your medical information deserves the highest level of protection. We've built OpenTag with security and compliance at its core.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">GDPR Compliant</h3>
              <p className="text-muted-foreground">
                Fully compliant with the European Union's General Data Protection Regulation, giving you complete control over your personal data.
              </p>
              <ul className="mt-4 text-sm text-left w-full">
                <li className="flex items-start mb-2">
                  <ShieldCheck className="h-4 w-4 text-red-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Right to access and export your data</span>
                </li>
                <li className="flex items-start mb-2">
                  <ShieldCheck className="h-4 w-4 text-red-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Right to be forgotten and data deletion</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheck className="h-4 w-4 text-red-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Transparent data processing</span>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                <Database className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">HIPAA Compliant</h3>
              <p className="text-muted-foreground">
                Adheres to the Health Insurance Portability and Accountability Act standards for protecting sensitive patient health information.
              </p>
              <ul className="mt-4 text-sm text-left w-full">
                <li className="flex items-start mb-2">
                  <ShieldCheck className="h-4 w-4 text-red-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Secure data transfer protocols</span>
                </li>
                <li className="flex items-start mb-2">
                  <ShieldCheck className="h-4 w-4 text-red-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Regular security audits</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheck className="h-4 w-4 text-red-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Strict access controls</span>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">End-to-End Encryption</h3>
              <p className="text-muted-foreground">
                Your data is encrypted both in transit and at rest using AES-GCM encryption, the same standard used by banks and military applications.
              </p>
              <ul className="mt-4 text-sm text-left w-full">
                <li className="flex items-start mb-2">
                  <ShieldCheck className="h-4 w-4 text-red-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Zero-knowledge architecture</span>
                </li>
                <li className="flex items-start mb-2">
                  <ShieldCheck className="h-4 w-4 text-red-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Secure data transmission</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheck className="h-4 w-4 text-red-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Protection against unauthorized access</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 text-center bg-white dark:bg-black">
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{steps[currentStep].title}</h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
            {steps[currentStep].content}
          </div>
        </div>
      )}
    </div>
  );
}