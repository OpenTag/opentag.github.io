"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { TagIcon, Cloud, Database, CheckCircle, AlertCircle, Info, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { auth } from "@/lib/firebaseClient";
import { signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userResponses, setUserResponses] = useState({
    chronicCondition: false,
    frequentUpdates: false,
    emergencyAccess: false,
    detailedHistory: false,
  });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleTagButtonClick = (e: React.MouseEvent) => {
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
    }
    if (type === 'serverless') {
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
    // Calculate score for online tag recommendation
    let onlineScore = 0;
    if (userResponses.chronicCondition) onlineScore += 2;
    if (userResponses.frequentUpdates) onlineScore += 2;
    if (userResponses.emergencyAccess) onlineScore += 1;
    if (userResponses.detailedHistory) onlineScore += 2;

    // If score is 3 or higher, recommend online tag
    return onlineScore >= 3 ? 'online' : 'serverless';
  };

  // Define the steps for the questionnaire
  const steps = [
    {
      title: "Choose Your Tag Type",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-stone-500 dark:text-stone-400">
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
                className="w-4 h-4 border border-stone-300 rounded accent-red-600"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="chronic" className="font-medium text-stone-700 dark:text-stone-300">I have chronic conditions that require ongoing management</label>
              <p className="text-xs text-stone-500 dark:text-stone-400">Like diabetes, heart disease, asthma, etc.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="history"
                type="checkbox"
                checked={userResponses.detailedHistory}
                onChange={() => handleToggleResponse('detailedHistory')}
                className="w-4 h-4 border border-stone-300 rounded accent-red-600"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="history" className="font-medium text-stone-700 dark:text-stone-300">I have a detailed medical history</label>
              <p className="text-xs text-stone-500 dark:text-stone-400">Multiple diagnoses, procedures, or treatments</p>
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
                className="w-4 h-4 border border-stone-300 rounded accent-red-600"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="updates" className="font-medium text-stone-700 dark:text-stone-300">I need to update my medical information frequently</label>
              <p className="text-xs text-stone-500 dark:text-stone-400">Regular doctor visits, changing medications, etc.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="emergency"
                type="checkbox"
                checked={userResponses.emergencyAccess}
                onChange={() => handleToggleResponse('emergencyAccess')}
                className="w-4 h-4 border border-stone-300 rounded accent-red-600"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="emergency" className="font-medium text-stone-700 dark:text-stone-300">I want medical professionals to access my data in emergencies</label>
              <p className="text-xs text-stone-500 dark:text-stone-400">Provides quick access to critical information</p>
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
              <p className="text-sm text-stone-600 dark:text-stone-300">
                Based on your needs, an Online Tag would be best for you. It offers:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-stone-600 dark:text-stone-300">
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
              <p className="text-sm text-stone-600 dark:text-stone-300">
                Based on your needs, a Serverless Tag would work well for you. It offers:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-stone-600 dark:text-stone-300">
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
    <nav className="">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image src="/opentag.png" alt="OpenTag" width={40} height={40} className="mr-2" />
              <span className="font-bold text-xl hidden sm:inline">OpenTag</span>
            </Link>
            <div className="sm:hidden">
              {user ? (
              <Button variant="ghost" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              ) : (
              <Button variant="ghost" onClick={handleTagButtonClick}>
                Get Tag
              </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4">
              {user ? (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <Button variant="red" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="primary" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button variant="default" onClick={handleTagButtonClick}>
                    Get Tag
                  </Button>
                </>
              )}
              <div className="hidden sm:inline">
                <ModeToggle />
              </div>
            </div>

            <div className="sm:hidden flex items-center gap-4">
              <ModeToggle />
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {menuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user ? (
              <>
                <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-black dark:text-white hover:bg-stone-700 hover:text-white">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-black dark:text-white hover:bg-stone-700 hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-black dark:text-white hover:bg-stone-700 hover:text-white">
                  Login
                </Link>
                <button
                  onClick={handleTagButtonClick}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-black dark:text-white hover:bg-stone-700 hover:text-white"
                >
                  Get Tag
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Tag Selection Modal */}
      {showTagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-stone-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{steps[currentStep].title}</h2>
              <div className="text-sm text-stone-500 dark:text-stone-400">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
            {steps[currentStep].content}
          </div>
        </div>
      )}
    </nav>
  );
}