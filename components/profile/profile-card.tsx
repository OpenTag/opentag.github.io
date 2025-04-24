import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, MapPin, Car, FileText, Link as LinkIcon } from "lucide-react";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface EmergencyContact {
  name: string;
  number: string;
}

interface ProfileCardProps {
  user: {
    fullName: string;
    bloodGroup: string;
    phoneNumber?: string;
    mobileNumber?: string;
    emergencyContact?: string[];
    emergencyContacts?: EmergencyContact[];
    gender: string;
    medications?: string;
    allergies?: string;
    medicalNotes?: string;
    asthma?: boolean;
    highBP?: boolean;
    diabetes?: boolean;
    pregnancyStatus?: boolean;
    organDonor?: boolean;
    dateOfBirth: string;
    emailVerified?: boolean;
    insurancePolicy?: string;
    medicalRecordsUrl?: string;
    prescriptionUrl?: string;
    height?: string;
    weight?: string;
    encryptedData?: string;
    scanReportsUrl?: string;
  };
  isPlaceholder?: boolean;
}

function calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function ProfileCard({ user, isPlaceholder }: ProfileCardProps) {
  const age = user.dateOfBirth ? calculateAge(user.dateOfBirth) : 0;
  
  // Handle both legacy emergencyContact array and new emergencyContacts object array
  const hasLegacyContacts = Array.isArray(user.emergencyContact) && user.emergencyContact.length > 0;
  const hasNewContacts = Array.isArray(user.emergencyContacts) && user.emergencyContacts.length > 0;

  if (isPlaceholder) {
    return (
      <Card className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-stone-800">
        <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold">
                {user.fullName} - <span className="text-4xl font-bold text-red-500">{user.bloodGroup}</span>
              </h2>
              <div className="mt-4">
                <h3 className="text-2xl font-semibold">Personal Details</h3>
                <div className="mt-2">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-6 w-64 mb-2" />
                  <Skeleton className="h-6 w-48 mb-2" />
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Emergency Contact Skeleton Section */}
          <div className="bg-stone-50 dark:bg-stone-900 p-4 rounded-lg">
            <span className="text-xl font-semibold block mb-3">Emergency Contacts</span>
            <div className="space-y-3">
              <Skeleton className="h-12 w-full mb-2" />
              <Skeleton className="h-12 w-full mb-2" />
            </div>
          </div>

          {/* Medical Information Skeleton Section */}
          <div className="bg-stone-50 dark:bg-stone-900 p-4 rounded-lg">
            <span className="text-xl font-semibold block mb-3">Medical Information</span>
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            
            <div className="flex flex-wrap gap-2 mt-4">
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-8 w-24 mb-2" />
            </div>
          </div>
          
          <div className="bg-stone-50 dark:bg-stone-900 p-4 rounded-lg">
            <span className="text-xl font-semibold block mb-3">Medical Documents</span>
            <div className="space-y-3">
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-stone-800">
      <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold">
              {user.fullName} - <span className="text-4xl font-bold text-red-500">{user.bloodGroup}</span>
            </h2>
            <div className="mt-4">
              <h3 className="text-2xl font-semibold">Personal Details</h3>
              <div className="mt-2 flex items-center gap-2">
                <span>Gender: {user.gender}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span>Age: {age}</span>
              </div>
              {user.height && (
                <div className="mt-2 flex items-center gap-2">
                  <span>Height: {user.height} cm ({(parseFloat(user.height) / 2.54).toFixed(2)} inches)</span>
                </div>
              )}
              {user.weight && (
                <div className="mt-2 flex items-center gap-2">
                  <span>Weight: {user.weight} kg ({(parseFloat(user.weight) * 2.20462).toFixed(2)} lbs)</span>
                </div>
              )}
              {user.mobileNumber && (
                <div className="mt-2 flex items-center gap-2">
                  <span>Phone: {user.mobileNumber}</span>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded ml-2 flex items-center gap-1 text-sm"
                    onClick={() => window.location.href = `tel:${user.mobileNumber}`}
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Emergency Contacts Section */}
        {(hasLegacyContacts || hasNewContacts) && (
          <div className="bg-stone-50 dark:bg-stone-900 p-4 rounded-lg">
            <span className="text-xl font-semibold block mb-3">Emergency Contacts</span>
            <ul className="space-y-3">
              {/* Handle new format with names */}
              {hasNewContacts && user.emergencyContacts!.filter(contact => contact.number !== "").map((contact, index) => (
                <li key={index} className="flex items-center justify-between border-b pb-2 dark:border-stone-700">
                  <div>
                    <span className="font-medium">{contact.name || 'Contact'}</span>
                    <p className="text-sm text-muted-foreground">{contact.number}</p>
                  </div>
                  <button
                    className="bg-red-500 text-white px-3 py-2 rounded flex items-center gap-1"
                    onClick={() => window.location.href = `tel:${contact.number}`}
                  >
                    <Phone className="h-5 w-5" />
                  </button>
                </li>
              ))}
              
              {/* Handle legacy format (just phone numbers) */}
              {hasLegacyContacts && !hasNewContacts && user.emergencyContact!.filter(contact => contact !== "").map((contact, index) => (
                <li key={index} className="flex items-center justify-between border-b pb-2 dark:border-stone-700">
                  <div>
                    <span className="font-medium">Emergency Contact {index + 1}</span>
                    <p className="text-sm text-muted-foreground">{contact}</p>
                  </div>
                  <button
                    className="bg-red-500 text-white px-3 py-2 rounded flex items-center gap-1"
                    onClick={() => window.location.href = `tel:${contact}`}
                  >
                    <Phone className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Medical Information Section */}
        <div className="bg-stone-50 dark:bg-stone-900 p-4 rounded-lg">
          <span className="text-xl font-semibold block mb-3">Medical Information</span>
          
          {user.medications && (
            <div className="flex items-start gap-2 mb-2">
              <span className="font-medium w-28">Medications:</span>
              <span className="flex-1">{user.medications}</span>
            </div>
          )}
          
          {user.allergies && (
            <div className="flex items-start gap-2 mb-2">
              <span className="font-medium w-28">Allergies:</span>
              <span className="flex-1">{user.allergies}</span>
            </div>
          )}
          
          {user.medicalNotes && (
            <div className="flex items-start gap-2 mb-2">
              <span className="font-medium w-28">Medical Notes:</span>
              <span className="flex-1">{user.medicalNotes}</span>
            </div>
          )}
          
          {user.insurancePolicy && (
            <div className="flex items-start gap-2 mb-2">
              <span className="font-medium w-28">Insurance:</span>
              <span className="flex-1">{user.insurancePolicy}</span>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mt-4">
            {user.asthma && (
              <Badge variant="secondary" className="inline-flex items-center gap-2 p-2">
                Asthma
              </Badge>
            )}
            {user.highBP && (
              <Badge variant="secondary" className="inline-flex items-center gap-2 p-2">
                High Blood Pressure
              </Badge>
            )}
            {user.diabetes && (
              <Badge variant="secondary" className="inline-flex items-center gap-2 p-2">
                Diabetes
              </Badge>
            )}
            {user.pregnancyStatus && (
              <Badge variant="secondary" className="inline-flex items-center gap-2 p-2">
                Pregnancy Status
              </Badge>
            )}
            {user.organDonor && (
              <Badge variant="secondary" className="inline-flex items-center gap-2 p-2">
                Organ Donor
              </Badge>
            )}
          </div>
        </div>
        
        {/* Document Links Section */}
        {(user.medicalRecordsUrl || user.prescriptionUrl || user.scanReportsUrl) && (
          <div className="bg-stone-50 dark:bg-stone-900 p-4 rounded-lg">
            <span className="text-xl font-semibold block mb-3">Medical Documents</span>
            <ul className="space-y-3">
              {user.medicalRecordsUrl && (
                <li className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-red-500" />
                  <Link 
                    href={user.medicalRecordsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center gap-2"
                  >
                    Medical Records
                    <LinkIcon className="h-4 w-4" />
                  </Link>
                </li>
              )}
              
              {user.prescriptionUrl && (
                <li className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-red-500" />
                  <Link 
                    href={user.prescriptionUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center gap-2"
                  >
                    Current Prescriptions
                    <LinkIcon className="h-4 w-4" />
                  </Link>
                </li>
              )}
              
              {user.scanReportsUrl && (
                <li className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-red-500" />
                  <Link 
                    href={user.scanReportsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center gap-2"
                  >
                    Scan/Test Reports
                    <LinkIcon className="h-4 w-4" />
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}