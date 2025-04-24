'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ProfileCard } from '@/components/profile/profile-card';
import { decryptData } from '@/lib/utils';
import { PageWrapper } from '@/components/ui/page-wrapper';
import { PinInputDialog } from '@/components/ui/pin-input-dialog';
import { Skeleton } from '@/components/ui/skeleton';

interface EmergencyContact {
  name: string;
  number: string;
}

interface UserData {
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
  height: string;
  weight: string;
  emailVerified?: boolean;
  insurancePolicy?: string;
  encryptedData?: string;
  isEncrypted?: boolean;
  encryptionMethod?: string;
  medicalRecordsUrl?: string;
  prescriptionUrl?: string;
  scanReportsUrl?: string;
}

// Interface for placeholder data when encryption is enabled
interface PlaceholderUserData extends UserData {
  isPlaceholder: boolean;
}

const UserDetail: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [rawData, setRawData] = useState<any>(null);
  const [userData, setUserData] = useState<UserData | PlaceholderUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [decryptLoading, setDecryptLoading] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [showPinDialog, setShowPinDialog] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchUserData = async () => {
        try {
          const docRef = doc(firestore, 'users', id as string);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setRawData(data);
            
            // Check if the data is encrypted
            if (data.isEncrypted && data.encryptedData) {
              setShowPinDialog(true);
              // Only set basic unencrypted data and mark as placeholder
              setUserData({
                fullName: data.fullName,
                bloodGroup: data.bloodGroup,
                dateOfBirth: '', // Empty strings instead of asterisks
                weight: '',
                height: '',
                gender: '',
                mobileNumber: '',
                emergencyContact: [''],
                medications: '',
                allergies: '',
                medicalNotes: '',
                asthma: false,
                highBP: false,
                diabetes: false,
                pregnancyStatus: false,
                organDonor: false,
                insurancePolicy: '',
                isPlaceholder: true // Flag to indicate placeholder data
              });
            } else {
              // Legacy unencrypted data, use as-is
              setUserData(data as UserData);
            }
          }
        } catch (error) {
          console.log('Error fetching document:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleDecrypt = async (pin: string) => {
    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setPinError('Please enter a valid 4-digit PIN');
      return;
    }

    setDecryptLoading(true);
    setPinError(null);

    try {
      // Check which encryption method was used
      const encryptionMethod = rawData.encryptionMethod || "XOR";
      
      // Decrypt the data using the provided PIN
      const decryptedDataStr = await decryptData(rawData.encryptedData, pin);
      let decryptedData;
      
      try {
        decryptedData = JSON.parse(decryptedDataStr);
      } catch (e) {
        setPinError('Incorrect PIN. Please try again.');
        setDecryptLoading(false);
        return;
      }
      
      // Merge the decrypted data with minimal unencrypted data
      setUserData({
        ...decryptedData,
        fullName: rawData.fullName, // Use the unencrypted name
        bloodGroup: rawData.bloodGroup, // Use the unencrypted blood group
      });
      
      setShowPinDialog(false);
    } catch (error) {
      console.error('Decryption error:', error);
      setPinError('Incorrect PIN. Please try again.');
    } finally {
      setDecryptLoading(false);
    }
  };

  if (!id) {
    return (
      <PageWrapper>
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Invalid Request</CardTitle>
              <CardDescription>No tag ID was provided</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Please scan a valid OpenTag QR code or enter a valid tag ID.</p>
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper isLoading={loading}>
      {loading ? (
        <ProfileCard 
          user={{
            fullName: "Loading...",
            bloodGroup: "...",
            gender: "",
            dateOfBirth: "",
            height: "",
            weight: ""
          }}
          isPlaceholder={true}
        />
      ) : userData ? (
        <>
          <ProfileCard 
            user={userData} 
            isPlaceholder={'isPlaceholder' in userData ? userData.isPlaceholder : false} 
          />
          
          <PinInputDialog
            isOpen={showPinDialog}
            onClose={() => setShowPinDialog(false)}
            onVerify={handleDecrypt}
            title="Protected Medical Information"
            description="This medical information is encrypted for security. Please enter the 4-digit PIN to view complete data."
            isVerifying={decryptLoading}
            error={pinError}
            basicInfo={
              <div className="space-y-2">
                <p><strong>Name:</strong> {userData.fullName}</p>
                <p><strong>Blood Group:</strong> {userData.bloodGroup}</p>
                <p className="text-sm italic mt-2">Enter PIN to view complete medical details</p>
              </div>
            }
          />
        </>
      ) : (
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>No Data Found</CardTitle>
              <CardDescription>Invalid or deleted tag</CardDescription>
            </CardHeader>
            <CardContent>
              <p>No data was found for the provided tag ID. The tag may have been deleted or doesn't exist.</p>
            </CardContent>
          </Card>
        </div>
      )}
    </PageWrapper>
  );
};

export default UserDetail;