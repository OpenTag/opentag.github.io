'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ProfileCard } from '@/components/profile/profile-card';

interface UserData {
  fullName: string;
  bloodGroup: string;
  emergencyContact: string[];
  address: string;
  vehicleNumber: string;
  medications?: string;
  highBP?: boolean;
  organDonor?: boolean;
  avatarUrl?: string;
  height?: string;
  weight?: string;
}

const UserDetail: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchUserData = async () => {
        try {
          const docRef = doc(firestore, 'users', id as string);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserData);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">No data or invalid tag</h2>
          <p className="text-gray-500">Please check the tag ID and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 px-2 flex justify-center items-center min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
          <CardDescription>Details of the user with ID: {id}</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileCard user={userData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetail;