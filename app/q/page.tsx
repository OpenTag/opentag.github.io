"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"
import Image from "next/image"

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
  const [pin, setPin] = useState("")
  const [decodedData, setDecodedData] = useState<DecodedData | null>(null)
  const [error, setError] = useState<string | null>(null)

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

  const handleDecrypt = () => {
    const encryptedData = searchParams.get("")
    if (!encryptedData) {
      setError("OpenTag might me damaged")
      return
    }

    try {
      const decryptedData = decryptData(encryptedData, pin)
      const decoded = decodeData(decryptedData)
      setDecodedData(decoded)
      setError(null)
    } catch (err) {
      setError("Incorrect PIN")
    }
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center md:my-auto p-4 sm:p-8 dark:bg-black">
      <div className="w-full max-w-2xl flex-grow"> 
        <h1 className="font-bold text-3xl text-center mb-8 dark:text-white">
          OpenTag <span className="text-red-500 dark:text-red-600 italic">Serverless</span>
        </h1>
        {!decodedData && (
          <>
            {showModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-4 m-4 rounded-lg shadow-lg max-w-md w-full dark:bg-black dark:text-white">
                  <div className="flex justify-end">
                    <button
                      className="text-red-500"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <Image src="/instructions.png" alt="OpenTag Instructions" width={400} height={400} />
                  </div>
                </div>
              </div>
            )}
            <div className="bg-white shadow-md rounded-lg p-6 dark:bg-stone-800">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Enter PIN</h2>
              <div className="space-y-4">
                <Input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Enter 4-digit PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={4}
                />
                <Button onClick={handleDecrypt} className="w-full">
                  Verify PIN
                </Button>
                {error && <p className="text-red-500 dark:text-red-600">{error}</p>}
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <button
                className="text-red-500 underline"
                onClick={() => setShowModal(true)}
              >
                Can't find pin? Click here
              </button>
            </div>
          </>
        )}
        {decodedData && (
          <div className="bg-white shadow-md rounded-lg p-6 dark:bg-stone-800">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 dark:text-white">
              {decodedData.name} - <span className="text-4xl font-bold text-red-500">{decodedData.bloodGroup}</span>
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-semibold dark:text-white">Personal Details</h3>
                <div className="mt-2 dark:text-stone-300">
                  <span>Date of Birth: {decodedData.dob}</span>
                </div>
                <div className="mt-2 dark:text-stone-300">
                  <span>Age: {decodedData.age} years</span>
                </div>
                <div className="mt-2 dark:text-stone-300">
                  <span>Height: {parseInt(decodedData.height)} cm ({(parseFloat(decodedData.height) / 2.54).toFixed(2)} inches)</span>
                </div>
                <div className="mt-2 dark:text-stone-300">
                  <span>Weight: {parseInt(decodedData.weight)} kg ({(parseFloat(decodedData.weight) * 2.20462).toFixed(2)} lbs)</span>
                </div>
              </div>
              <div>
                <span className="text-xl font-semibold dark:text-white">Emergency Contact</span>
                <ul className="list-disc list-inside dark:text-stone-300">
                  <li className="flex items-center gap-2 my-2">
                    <span>{decodedData.emergencyContact}</span>
                    <button
                      className="bg-red-500 text-white px-3 py-2 rounded ml-2 flex items-center gap-1"
                      onClick={() => window.location.href = `tel:${decodedData.emergencyContact}`}
                    >
                      <Phone className="h-5 w-5" />
                    </button>
                  </li>
                </ul>
              </div>
                  <div>
                  <span className="text-xl font-semibold dark:text-white">Substance Use</span>
                  <div className="mt-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">{decodedData.substanceUse}</span>
                  </div>
                  </div>
                <div>
                  <span className="text-xl font-semibold dark:text-white">Pregnant</span>
                  <div className="mt-2">
                  <span className={`px-2 py-1 rounded-full ${decodedData.pregnant ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}`}>
                    {decodedData.pregnant ? "Yes" : "No"}
                  </span>
                  </div>
                </div>
                <div>
                  <span className="text-xl font-semibold dark:text-white">Organ Donor</span>
                  <div className="mt-2">
                  <span className={`px-2 py-1 rounded-full ${decodedData.organDonor ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}`}>
                    {decodedData.organDonor ? "Yes" : "No"}
                  </span>
                  </div>
                </div>
                {decodedData.allergies.length > 0 && (
                  <div>
                  <span className="text-xl font-semibold dark:text-white">Allergies</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {decodedData.allergies.map((allergy, index) => (
                    <span key={index} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full dark:bg-yellow-900 dark:text-yellow-200">{allergy}</span>
                    ))}
                  </div>
                  </div>
                )}
                {decodedData.medications.length > 0 && (
                  <div>
                  <span className="text-xl font-semibold dark:text-white">Medications</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {decodedData.medications.map((medication, index) => (
                    <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full dark:bg-purple-900 dark:text-purple-200">{medication}</span>
                    ))}
                  </div>
                  </div>
                )}
                {decodedData.medicalConditions.length > 0 && (
                  <div>
                  <span className="text-xl font-semibold dark:text-white">Medical Conditions</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {decodedData.medicalConditions.map((condition, index) => (
                    <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded-full dark:bg-red-900 dark:text-red-200">{condition}</span>
                    ))}
                  </div>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DataDisplayPage