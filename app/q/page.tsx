"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"
import Image from "next/image"
import { PageWrapper } from "@/components/ui/page-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { PinInputDialog } from "@/components/ui/pin-input-dialog"
import { Badge } from "@/components/ui/badge"

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

  const decryptData = (encryptedData: string, pin: string): string => {
    const decoded = atob(encryptedData)
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
    if (dob[0] !== '1' && dob[0] !== '2') {
      throw new Error("Incorrect PIN")
    }
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

    return {
      name,
      dob: `${dob.slice(0, 4)}-${dob.slice(4, 6)}-${dob.slice(6, 8)}`,
      age: calculateAge(dob),
      height,
      weight,
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
    const encryptedData = searchParams.get("")
    if (!encryptedData) {
      setError("OpenTag might be damaged")
      return
    }

    setIsVerifying(true)
    setError(null)

    try {
      // Add a small delay to show loading state
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

  return (
    <PageWrapper>
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <h1 className="font-bold text-3xl text-center dark:text-white">
            OpenTag <span className="text-red-500 dark:text-red-600 italic">Serverless</span>
          </h1>
        </div>

        {!decodedData ? (
          <>
            <PinInputDialog
              isOpen={pinDialogOpen}
              onClose={() => {}}
              onVerify={handleDecrypt}
              title="Enter PIN"
              description="Enter the 4-digit PIN to access medical information"
              isVerifying={isVerifying}
              error={error}
            />

            {/* Help Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>How to Find PIN</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center p-2">
                  <Image 
                    src="/instructions.png" 
                    alt="OpenTag Instructions" 
                    width={400} 
                    height={400}
                    className="rounded-lg"
                  />
                </div>
                <DialogFooter>
                  <Button onClick={() => setShowModal(false)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="flex justify-center mt-4">
              <Button 
                variant="link"
                className="text-red-500"
                onClick={() => setShowModal(true)}
              >
                Can't find PIN? Click here
              </Button>
            </div>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl text-center">
                {decodedData.name} - <span className="text-red-500">{decodedData.bloodGroup}</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Personal Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-2 bg-muted rounded-md">
                    <span className="text-sm font-medium">Date of Birth:</span>
                    <p>{decodedData.dob}</p>
                  </div>
                  <div className="p-2 bg-muted rounded-md">
                    <span className="text-sm font-medium">Age:</span>
                    <p>{decodedData.age} years</p>
                  </div>
                  <div className="p-2 bg-muted rounded-md">
                    <span className="text-sm font-medium">Height:</span>
                    <p>{parseInt(decodedData.height)} cm ({(parseInt(decodedData.height) / 2.54).toFixed(1)} in)</p>
                  </div>
                  <div className="p-2 bg-muted rounded-md">
                    <span className="text-sm font-medium">Weight:</span>
                    <p>{parseInt(decodedData.weight)} kg ({(parseInt(decodedData.weight) * 2.20462).toFixed(1)} lbs)</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Emergency Contact</h3>
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  <span className="flex-grow font-medium">{decodedData.emergencyContact}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => window.location.href = `tel:${decodedData.emergencyContact}`}
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call</span>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Substance Use</h3>
                  <Badge variant="outline" className="w-full justify-center py-1.5">
                    {decodedData.substanceUse}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Pregnant</h3>
                  <Badge variant={decodedData.pregnant ? "success" : "destructive"} className="w-full justify-center py-1.5">
                    {decodedData.pregnant ? "Yes" : "No"}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Organ Donor</h3>
                  <Badge variant={decodedData.organDonor ? "success" : "destructive"} className="w-full justify-center py-1.5">
                    {decodedData.organDonor ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>

              {decodedData.allergies.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Allergies</h3>
                  <div className="flex flex-wrap gap-2">
                    {decodedData.allergies.map((allergy, index) => (
                      <Badge key={index} variant="warning">{allergy}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {decodedData.medications.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Medications</h3>
                  <div className="flex flex-wrap gap-2">
                    {decodedData.medications.map((medication, index) => (
                      <Badge key={index} variant="secondary">{medication}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {decodedData.medicalConditions.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Medical Conditions</h3>
                  <div className="flex flex-wrap gap-2">
                    {decodedData.medicalConditions.map((condition, index) => (
                      <Badge key={index} variant="destructive">{condition}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </PageWrapper>
  )
}

export default DataDisplayPage