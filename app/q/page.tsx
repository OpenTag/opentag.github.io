"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, HeartPulse, Phone, Shield, KeyRound } from "lucide-react"
import Image from "next/image"
import { PageWrapper } from "@/components/ui/page-wrapper"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { PinInputDialog } from "@/components/ui/pin-input-dialog"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const allergiesList = ["Pollen", "Dust", "Pet Dander", "Peanuts", "Shellfish"]
const medicationsList = ["Aspirin", "Ibuprofen", "Penicillin", "Insulin", "Metformin"]
const medicalConditionsList = ["Asthma", "Diabetes", "Hypertension", "Arthritis", "Migraine"]

const bloodGroupMap: { [key: number]: string } = {
  0: "A+",
  1: "A-",
  2: "B+",
  3: "B-",
  4: "O+",
  5: "O-",
  6: "AB+",
  7: "AB-",
}

const substanceUseMap: { [key: number]: string } = {
  0: "None",
  1: "Alcohol Only",
  2: "Tobacco Only",
  3: "Both Alcohol and Tobacco",
}

function base62ToDecimal(base62Str: string): bigint {
  const base62Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = BigInt(0)
  for (let i = 0; i < base62Str.length; i++) {
    result = result * BigInt(62) + BigInt(base62Chars.indexOf(base62Str[i]))
  }
  return result
}

function base62ToBinary(base62Str: string): string {
  const decimal = base62ToDecimal(base62Str)
  return decimal.toString(2).padStart(17, "0")
}

interface DecodedData {
  name: string
  dob: string
  age: number
  height: string
  weight: string
  bmi: string
  bmiCategory: string
  bloodGroup: string
  emergencyContact: string
  substanceUse: string
  pregnant: boolean
  organDonor: boolean
  allergies: string[]
  medications: string[]
  medicalConditions: string[]
}

const DataDisplayPage = () => {
  const searchParams = useSearchParams()
  const [showModal, setShowModal] = useState(false)
  const [pinDialogOpen, setPinDialogOpen] = useState(true)
  const [decodedData, setDecodedData] = useState<DecodedData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [showPrintVersion, setShowPrintVersion] = useState(false)

  const decryptData = (encryptedData: string, pin: string): string => {
    const base64 = encryptedData
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(encryptedData.length + (4 - (encryptedData.length % 4)) % 4, '=');
    
    const decoded = atob(base64);
    let decrypted = ""
    for (let i = 0; i < decoded.length; i++) {
      decrypted += String.fromCharCode(decoded.charCodeAt(i) ^ pin.charCodeAt(i % pin.length))
    }
    return decrypted
  }

  const decodeData = (data: string): DecodedData => {
    const [numericPart, binaryPart, name, contact] = data.split("-")

    const numericDecimal = base62ToDecimal(numericPart).toString().padStart(16, "0")
    const binaryString = base62ToBinary(binaryPart)

    const dob = numericDecimal.slice(0, 8)
    const height = numericDecimal.slice(8, 11)
    const weight = numericDecimal.slice(11, 14)
    const bloodGroup = bloodGroupMap[Number.parseInt(numericDecimal[14])]
    const substanceUse = substanceUseMap[Number.parseInt(numericDecimal[15])]

    const emergencyContact = base62ToDecimal(contact).toString()

    const pregnant = binaryString[0] === "1"
    const organDonor = binaryString[1] === "1"
    let allergies = allergiesList.filter((_, i) => binaryString[i + 2] === "1")
    let medications = medicationsList.filter((_, i) => binaryString[i + 7] === "1")
    let medicalConditions = medicalConditionsList.filter((_, i) => binaryString[i + 12] === "1")
    if (binaryPart==="0"){
      allergies = []
      medications = []
      medicalConditions = []
    }
    const calculateAge = (dob: string): number => {
      const birthDate = new Date(`${dob.slice(0, 4)}-${dob.slice(4, 6)}-${dob.slice(6, 8)}`)
      const ageDifMs = Date.now() - birthDate.getTime()
      const ageDate = new Date(ageDifMs)
      return Math.abs(ageDate.getUTCFullYear() - 1970)
    }

    // Calculate BMI
    const heightInMeters = parseInt(height) / 100
    const weightInKg = parseInt(weight)
    const bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1)
    
    // BMI categories
    let bmiCategory = ""
    const bmiValue = parseFloat(bmi)
    if (bmiValue < 18.5) bmiCategory = "Underweight"
    else if (bmiValue >= 18.5 && bmiValue < 25) bmiCategory = "Normal"
    else if (bmiValue >= 25 && bmiValue < 30) bmiCategory = "Overweight"
    else bmiCategory = "Obese"

    return {
      name,
      dob: `${dob.slice(0, 4)}-${dob.slice(4, 6)}-${dob.slice(6, 8)}`,
      age: calculateAge(dob),
      height,
      weight,
      bmi,
      bmiCategory,
      bloodGroup,
      emergencyContact,
      substanceUse,
      pregnant,
      organDonor,
      allergies,
      medications,
      medicalConditions,
    }
  }

  const handleDecrypt = async (pin: string) => {
    const encryptedData = searchParams.get("data")
    if (!encryptedData) {
      setError("OpenTag might be damaged")
      return
    }

    setIsVerifying(true)
    setError(null)

    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const decryptedData = decryptData(encryptedData, pin)
      const decoded = decodeData(decryptedData)
      setDecodedData(decoded)
      setPinDialogOpen(false)
      setError(null)
    } catch (err) {
      setError("Incorrect PIN")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleClosePinDialog = () => {
    setPinDialogOpen(false);
  }

  const handleOpenPinDialog = () => {
    setPinDialogOpen(true);
    setError(null);
  }

  return (
    <PageWrapper>
      <div className="w-full max-w-3xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="font-bold text-3xl text-center dark:text-white">
              OpenTag <span className="text-red-500 dark:text-red-600 italic">Serverless</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-center">Emergency medical information at your fingertips</p>
        </div>

        {!decodedData ? (
          <div className="flex flex-col items-center">
            <div className="w-full">
              <div className="flex flex-col items-center justify-center p-6 gap-4">
              <div className="p-6 rounded-lg flex flex-col items-center">
                <KeyRound className="h-16 w-16 text-red-500 mb-3" />
                <p className="text-center text-muted-foreground mb-4">
                This information is PIN-protected for patient privacy
                </p>
                
                {!pinDialogOpen && (
                <Button 
                  onClick={handleOpenPinDialog} 
                  variant="default" 
                  className="mt-2"
                >
                  Enter PIN
                </Button>
                )}
              </div>
              </div>
              <div className="flex justify-center pb-6">
              <Button 
                variant="link"
                className="text-red-500 flex items-center gap-1"
                onClick={() => setShowModal(true)}
              >
                <Shield className="h-4 w-4" />
                Can't find PIN? Click here
              </Button>
              </div>
            </div>
            
            <PinInputDialog
              isOpen={pinDialogOpen}
              onClose={handleClosePinDialog}
              onVerify={handleDecrypt}
              title="Enter PIN"
              description="Enter the 4-digit PIN to access medical information"
              isVerifying={isVerifying}
              error={error}
            />

            <Dialog open={showModal} onOpenChange={setShowModal}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-500" />
                    <span>How to Find PIN</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="flex justify-center p-2">
                  <Image 
                    src="/instructions.png" 
                    alt="OpenTag Instructions" 
                    width={400} 
                    height={400}
                    className="rounded-lg shadow-md"
                  />
                </div>
                <DialogFooter>
                  <Button onClick={() => setShowModal(false)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="space-y-4">
            {!showPrintVersion && (
              <div className="flex justify-end mb-4">
                <Button 
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setShowPrintVersion(true)}
                >
                  Print Version
                </Button>
              </div>
            )}
            
            {showPrintVersion ? (
              <Card className="print-friendly bg-white text-black p-6 shadow-sm">
                <CardContent className="p-0">
                  <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold">{decodedData.name} - {decodedData.bloodGroup}</h1>
                    <p className="text-sm">DOB {new Date(decodedData.dob).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})} • Age {decodedData.age} years</p>
                    <p className="text-sm">Height {parseInt(decodedData.height)} cm • Weight {parseInt(decodedData.weight)} kg</p>
                    <p className="text-sm">BMI {decodedData.bmi} ({decodedData.bmiCategory})</p>
                    <p className="text-sm">Emergency Contact {decodedData.emergencyContact}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="border p-2 text-center">
                      <p className="font-semibold">Substance Use</p>
                      <p>{decodedData.substanceUse}</p>
                    </div>
                    <div className="border p-2 text-center">
                      <p className="font-semibold">Organ Donor</p>
                      <p>{decodedData.organDonor ? "Yes" : "No"}</p>
                    </div>
                    {decodedData.pregnant && (
                      <div className="border p-2 text-center col-span-2">
                        <p className="font-semibold">Pregnant</p>
                        <p>Yes</p>
                      </div>
                    )}
                  </div>
                  
                  {decodedData.allergies.length > 0 && (
                    <div className="mb-4">
                      <p className="font-semibold">Allergies:</p>
                      <p>{decodedData.allergies.join(", ")}</p>
                    </div>
                  )}
                  
                  {decodedData.medications.length > 0 && (
                    <div className="mb-4">
                      <p className="font-semibold">Medications:</p>
                      <p>{decodedData.medications.join(", ")}</p>
                    </div>
                  )}
                  
                  {decodedData.medicalConditions.length > 0 && (
                    <div className="mb-4">
                      <p className="font-semibold">Medical Conditions:</p>
                      <p>{decodedData.medicalConditions.join(", ")}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-center gap-4 pt-6">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      setShowPrintVersion(false);
                      window.print();
                    }}
                  >
                    Print this page
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPrintVersion(false)}
                  >
                    Back to digital view
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="rounded-lg border-2 border-red-100 dark:border-red-900/30 overflow-hidden bg-card shadow-lg">
                <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 py-4">
                  <div className="px-6 pb-2">
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl sm:text-3xl text-center font-semibold">
                          {decodedData.name}
                        </h2>
                        <Badge 
                          variant="destructive" 
                          className="text-lg px-3 py-1 rounded-full border-2 border-red-200 bg-white dark:bg-red-900/10 text-red-600 dark:text-red-400 font-bold"
                        >
                          {decodedData.bloodGroup}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-center mt-2">
                      Medical Information Card • {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="p-4 sm:p-6 space-y-6">
                  {/* Personal Details Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Personal Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium text-muted-foreground">Date of Birth</span>
                        <p className="font-semibold">
                          {new Date(decodedData.dob).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium text-muted-foreground">Age</span>
                        <p className="font-semibold">
                          {decodedData.age < 2 
                          ? `${Math.floor(decodedData.age * 12)} months` 
                          : `${decodedData.age} years`}
                        </p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium text-muted-foreground">Height</span>
                        <p className="font-semibold">
                          {parseInt(decodedData.height)} cm
                          <span className="text-muted-foreground text-sm ml-1">
                            ({(parseInt(decodedData.height) / 2.54).toFixed(1)} in)
                          </span>
                        </p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium text-muted-foreground">Weight</span>
                        <p className="font-semibold">
                          {parseInt(decodedData.weight)} kg
                          <span className="text-muted-foreground text-sm ml-1">
                            ({(parseInt(decodedData.weight) * 2.20462).toFixed(1)} lbs)
                          </span>
                        </p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg col-span-2">
                        <span className="text-sm font-medium text-muted-foreground">BMI</span>
                        <p className="font-semibold">
                          {decodedData.bmi} 
                          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                            decodedData.bmiCategory === "Normal" 
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : decodedData.bmiCategory === "Underweight"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" 
                              : decodedData.bmiCategory === "Overweight"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}>
                            {decodedData.bmiCategory}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Emergency Contact</h3>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="h-10 w-10 flex items-center justify-center bg-red-100 dark:bg-red-900/30 rounded-full">
                        <Phone className="h-5 w-5 text-red-500 dark:text-red-400" />
                      </div>
                      <span className="flex-grow font-semibold">{decodedData.emergencyContact}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() => window.location.href = `tel:${decodedData.emergencyContact}`}
                            >
                              <Phone className="h-4 w-4" />
                              <span>Call</span>
                              <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Call emergency contact</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  {/* Status Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Status</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-3">
                        <p className="text-sm font-medium mb-2">Substance Use</p>
                        <Badge 
                          variant="outline" 
                          className={`w-full justify-center py-1.5 ${
                            decodedData.substanceUse === "None" ? "bg-green-50 dark:bg-green-900/20" : 
                            "bg-amber-50 dark:bg-amber-900/20"
                          }`}
                        >
                          {decodedData.substanceUse}
                        </Badge>
                      </div>
                      
                      {decodedData.pregnant && (
                        <div className="border rounded-lg p-3">
                          <p className="text-sm font-medium mb-2">Pregnant</p>
                          <Badge 
                            variant="success"
                            className="w-full justify-center py-1.5"
                          >
                            Yes
                          </Badge>
                        </div>
                      )}
                      
                      <div className="border rounded-lg p-3">
                        <p className="text-sm font-medium mb-2">Organ Donor</p>
                        <Badge 
                          variant={decodedData.organDonor ? "success" : "destructive"} 
                          className="w-full justify-center py-1.5"
                        >
                          {decodedData.organDonor ? "Yes" : "No"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Medical Information Section */}
                  {(decodedData.allergies.length > 0 || decodedData.medications.length > 0 || decodedData.medicalConditions.length > 0) && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Medical Information</h3>
                      <div className="space-y-4">
                        {decodedData.allergies.length > 0 && (
                          <div className="border rounded-lg p-3">
                            <p className="text-base font-medium text-amber-600 dark:text-amber-400 mb-2">Allergies</p>
                            <div className="flex flex-wrap gap-2">
                              {decodedData.allergies.map((allergy, index) => (
                                <Badge key={index} variant="warning" className="px-3 py-1 rounded-full">
                                  {allergy}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {decodedData.medications.length > 0 && (
                          <div className="border rounded-lg p-3">
                            <p className="text-base font-medium text-blue-600 dark:text-blue-400 mb-2">Medications</p>
                            <div className="flex flex-wrap gap-2">
                              {decodedData.medications.map((medication, index) => (
                                <Badge key={index} variant="secondary" className="px-3 py-1 rounded-full">
                                  {medication}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {decodedData.medicalConditions.length > 0 && (
                          <div className="border rounded-lg p-3">
                            <p className="text-base font-medium text-red-600 dark:text-red-400 mb-2">Medical Conditions</p>
                            <div className="flex flex-wrap gap-2">
                              {decodedData.medicalConditions.map((condition, index) => (
                                <Badge key={index} variant="destructive" className="px-3 py-1 rounded-full">
                                  {condition}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}

export default DataDisplayPage