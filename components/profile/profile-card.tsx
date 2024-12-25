import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, MapPin, Car } from "lucide-react";
import { CheckCircle } from "lucide-react";

interface ProfileCardProps {
  user: {
    fullName: string;
    bloodGroup: string;
    emergencyContact: string[];
    address: string;
    vehicleNumber: string;
    medications?: string;
    allergies?: string;
    medicalNotes?: string;
    asthma?: boolean;
    highBP?: boolean;
    diabetes?: boolean;
    pregnancyStatus?: boolean;
    organDonor?: boolean;
    avatarUrl?: string;
    dateOfBirth: string;
    height?: string;
    weight?: string;
    emailVerified: boolean;
    insurancePolicy?: string; // Added insurancePolicy field
  };
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

export function ProfileCard({ user }: ProfileCardProps) {
  const age = calculateAge(user.dateOfBirth);

  return (
    <Card className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
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
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
            {user.emergencyContact[0] && (
            <span className="text-xl font-semibold">Emergency Contacts</span>
            )}
            <ul className="list-disc list-inside">
            {user.emergencyContact.filter(contact => contact !== "").map((contact, index) => (
              <li key={index} className="flex items-center gap-2 my-2">
              <span>{contact}</span>
              <button
                className="bg-red-500 text-white px-3 py-2 rounded ml-2 flex items-center gap-1"
                onClick={() => window.location.href = `tel:${contact}`}
              >
                <Phone className="h-5 w-5" />
              </button>
              </li>
            ))}
            </ul>
        </div>
        {user.medications && (
          <div className="flex items-center gap-2">
            <span>Medications -  {user.medications}</span>
          </div>
        )}
        {user.allergies && (
          <div className="flex items-center gap-2">
            <span>Allergies -  {user.allergies}</span>
          </div>
        )}
        {user.medicalNotes && (
          <div className="flex items-center gap-2">
            <span>Medical Notes - {user.medicalNotes}</span>
          </div>
        )}
        {user.insurancePolicy && (
          <div className="flex items-center gap-2">
            <span>Insurance Policy - {user.insurancePolicy}</span>
          </div>
        )}
        {user.asthma && (
          <Badge variant="secondary" className="inline-flex items-center gap-2 mx-2 p-2">
            Asthma
          </Badge>
        )}
        {user.highBP && (
          <Badge variant="secondary" className="inline-flex items-center gap-2 mx-2 p-2">
            High Blood Pressure
          </Badge>
        )}
        {user.diabetes && (
          <Badge variant="secondary" className="inline-flex items-center gap-2 mx-2 p-2">
            Diabetes
          </Badge>
        )}
        {user.pregnancyStatus && (
          <Badge variant="secondary" className="inline-flex items-center gap-2 mx-2 p-2">
            Pregnancy Status
          </Badge>
        )}
        {user.organDonor && (
          <Badge variant="secondary" className="inline-flex items-center gap-2 mx-2 p-2">
            Organ Donor
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}