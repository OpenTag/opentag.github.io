'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebaseClient';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [tagID, setTagID] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Firestore setup
        const db = getFirestore();

        // Fetch tagID from the tags collection
        const tagDocRef = doc(db, 'tags', currentUser.uid);
        const tagDoc = await getDoc(tagDocRef);

        if (tagDoc.exists()) {
          const tagData = tagDoc.data();
          const tagIDValue = tagData.tagID;
          setTagID(tagIDValue); // Set Tag ID
          localStorage.setItem('tagId', tagIDValue); // Store Tag ID

          // Fetch user details from the users collection
          const userDocRef = doc(db, 'users', tagIDValue);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.fullName); // Set User Name
          } else {
            console.error('User document not found for the given tagID.');
          }
        } else {
          console.error('Tag document does not exist.');
        }
      } else {
        router.push('/login'); // Redirect to login if not authenticated
      }
      setLoading(false); // Set loading to false after data is fetched
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '2em', color: 'black' }}>
        Welcome, <span style={{ fontWeight: 'bold', color: 'red' }}>{userName || 'User'}</span>
      </h1>
      <div className="mt-4">
          <p className="text-gray-700"><strong>Tag ID:</strong> {tagID}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tagID && (
          <Link href={`/id?id=${tagID}`} passHref>
        <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition duration-300 flex items-center justify-center">
          <span className="material-icons mr-2">print</span> Print Tag
        </button>
          </Link>
        )}
        <Link href={`/id?id=${tagID}`} passHref>
          <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition duration-300 flex items-center justify-center">
        <span className="material-icons mr-2">person</span> View Profile
          </button>
        </Link>
        <Link href="/update" passHref>
          <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition duration-300 flex items-center justify-center">
        <span className="material-icons mr-2">edit</span> Modify Data
          </button>
        </Link>
        <button
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition duration-300 flex items-center justify-center"
          onClick={async () => {
        await auth.signOut();
        router.push('/login');
          }}
        >
          <span className="material-icons mr-2">logout</span> Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
