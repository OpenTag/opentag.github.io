'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebaseClient';
import { onAuthStateChanged, User, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { doc, getDoc, getFirestore, deleteDoc } from 'firebase/firestore';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import QRCode from 'qrcode';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [bloodGroup, setBloodGroup] = useState<string>('');
  const [tagID, setTagID] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const db = getFirestore();
        const tagDocRef = doc(db, 'tags', currentUser.uid);
        const tagDoc = await getDoc(tagDocRef);

        if (tagDoc.exists()) {
          const tagData = tagDoc.data();
          const tagIDValue = tagData.tagID;
          setTagID(tagIDValue);
          localStorage.setItem('tagId', tagIDValue);

          const userDocRef = doc(db, 'users', tagIDValue);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.fullName);
            setBloodGroup(userData.bloodGroup);
          } else {
            console.error('User document not found for the given tagID.');
          }
        } else {
          console.error('Tag document does not exist.');
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handlePrintTag = async () => {
    if (!tagID) return;

    const existingPdfBytes = await fetch('/template.pdf').then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const link = `https://opentag.github.io/id?id=${tagID}`;

    const qrCodeOptions = {
      margin: 0,
      color: {
      dark: '#FFFFFF', // Red color
      light: '#ff3131', // White background
      },
    };

    const qrCodeDataUrl = await QRCode.toDataURL(link, qrCodeOptions);
    const qrImage = await pdfDoc.embedPng(qrCodeDataUrl);

    firstPage.drawImage(qrImage, {
      x: 40,
      y: 100,
      width: 100,
      height: 100,
    });

    firstPage.drawText(`${tagID}`, {
      x: 150,
      y: 105,
      size: 35,
      font: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
      color: rgb(1, 1, 1),
    });

    firstPage.drawText(`${bloodGroup}`, {
      x: 310,
      y: 100,
      size: 50,
      font: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
      color: rgb(1, 1, 1),
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `${tagID}.pdf`;
    downloadLink.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = async (password: string) => {
    if (!user || !tagID) return;

    const db = getFirestore();
    const userDocRef = doc(db, 'users', tagID);
    const tagDocRef = doc(db, 'tags', user.uid);

    try {
      const credential = EmailAuthProvider.credential(user.email!, password);
      await reauthenticateWithCredential(auth.currentUser!, credential);
      await deleteDoc(userDocRef);
      await deleteDoc(tagDocRef);
      await user.delete();
      await auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-stone-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-black py-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-stone-800 shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-200">
      Welcome, <span className="text-red-500">{userName || 'User'}</span>
      </h1>
      <p className="mt-2 text-stone-600 dark:text-stone-400">
      <strong>Tag ID:</strong> {tagID || 'N/A'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
      {tagID && (
      <>
        <button
        onClick={handlePrintTag}
        className="bg-black text-white py-2 px-4 rounded shadow hover:bg-stone-800 dark:hover:bg-stone-700 transition w-full"
        >
        Download / Print QR Tag <span className="text-sm text-[#bbbbbb]">PDF</span>
        </button>
        <Link href={`/id?id=${tagID}`} passHref>
        <button className="bg-black text-white py-2 px-4 rounded shadow hover:bg-stone-800 dark:hover:bg-stone-700 transition w-full">
        View Profile
        </button>
        </Link>
      </>
      )}
      <Link href="/update" passHref>
      <button className="bg-black text-white py-2 px-4 rounded shadow hover:bg-stone-800 dark:hover:bg-stone-700 transition w-full">
        Modify Data
      </button>
      </Link>
      <button
      onClick={() => {
        const password = prompt('Please enter your password to confirm account deletion:');
        if (password) {
        handleDeleteAccount(password);
        }
      }}
      className="bg-black text-white py-2 px-4 rounded shadow hover:bg-stone-800 dark:hover:bg-stone-700 transition w-full"
      >
      Delete Account
      </button>
      </div>

      <div className="mt-10">
      <h2 className="text-xl font-semibold text-stone-800 dark:text-stone-200">Safety Tips & QR Code Usage</h2>
      <ul className="list-disc list-inside mt-4 text-stone-600 dark:text-stone-400">
      <li>Place your QR code tag on your helmet, vehicle, or ID card for easy access.</li>
      <li>Ensure the QR code is not obstructed by scratches or dirt for proper scanning.</li>
      <li>Share your tag ID with trusted contacts for emergencies.</li>
      <li>Do not share sensitive personal details through the QR code.</li>
      </ul>
      </div>

      <div className="mt-10">
      <h2 className="text-xl font-semibold text-stone-800 dark:text-stone-200">Where to Use OpenTag</h2>
      <ul className="list-disc list-inside mt-4 text-stone-600 dark:text-stone-400">
      <li>Stick the QR code tag on your backpack, helmet, car, or any personal item.</li>
      <li>Print six tags on a sheet, cut them out, and stick them using tape.</li>
      <li>Ensure the tags are placed in visible and easily accessible locations.</li>
      <li>Replace the tags if they get damaged or worn out.</li>
      </ul>
      </div>
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-stone-800 dark:text-stone-200">Get Creative with Your QR Codes</h2>
        <p className="mt-4 text-stone-600 dark:text-stone-400">
          Feel free to customize your QR codes to match your style! You can use different colors, add logos, or even create unique designs. Just make sure the QR code remains scannable. Here are some tips:
        </p>
        <ul className="list-disc list-inside mt-4 text-stone-600 dark:text-stone-400">
          <li>Use high-contrast colors for the QR code and background.</li>
          <li>Experiment with different shapes and patterns, but keep the core structure intact.</li>
          <li>Test your custom QR codes with multiple devices to ensure they work properly.</li>
        </ul>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;