'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebaseClient';
import { onAuthStateChanged, User, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { doc, getDoc, getFirestore, deleteDoc } from 'firebase/firestore';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import QRCode from 'qrcode';
import { decryptData } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PageWrapper } from '@/components/ui/page-wrapper';
import { PinInputDialog } from '@/components/ui/pin-input-dialog';
import { DeleteAccountDialog } from '@/components/ui/delete-account-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [bloodGroup, setBloodGroup] = useState<string>('');
  const [tagID, setTagID] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [verifyingPin, setVerifyingPin] = useState(false);
  const [rawData, setRawData] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
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
            setRawData(userData);
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

  const handleInitiateTagDownload = () => {
    if (!tagID || !rawData) return;
    
    // If data is encrypted, ask for PIN before generating the tag
    if (rawData.isEncrypted && rawData.encryptedData) {
      setPinDialogOpen(true);
      setPinError(null);
    } else {
      // Legacy unencrypted data, generate tag directly
      handlePrintTag(null);
    }
  };

  const handleVerifyPin = async (pin: string) => {
    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setPinError('Please enter a valid 4-digit PIN');
      return;
    }

    setVerifyingPin(true);
    setPinError(null);

    try {
      // Try to decrypt the data with the provided PIN
      const decryptedDataStr = await decryptData(rawData.encryptedData, pin);
      
      try {
        // If we can parse the JSON, the PIN is correct
        JSON.parse(decryptedDataStr);
        
        // PIN verified, proceed with tag generation
        handlePrintTag(pin);
        setPinDialogOpen(false);
      } catch (e) {
        setPinError('Incorrect PIN. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying PIN:', error);
      setPinError('Incorrect PIN. Please try again.');
    } finally {
      setVerifyingPin(false);
    }
  };

  const handlePrintTag = async (verifiedPin: string | null) => {
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

    // Add PIN to the PDF tag if verified
    if (verifiedPin) {
      firstPage.drawText(`PIN: ${verifiedPin}`, {
        x: 150,
        y: 87,
        size: 14,
        font: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
        color: rgb(1, 1, 1),
      });
    }

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
      throw error; // Re-throw to be caught by the dialog
    }
  };

  return (
    <PageWrapper isLoading={loading}>
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between">
              <span>
                Welcome, <span className="text-red-500">{userName || 'User'}</span>
              </span>
              {tagID && (
                <span className="text-sm font-normal mt-2 sm:mt-0">
                  Tag ID: <span className="font-mono">{tagID}</span>
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tagID && (
                <>
                  <Button
                    onClick={handleInitiateTagDownload}
                    className="w-full"
                  >
                    Download / Print QR Tag
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="w-full"
                  >
                    <Link href={`/id?id=${tagID}`}>View Profile</Link>
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                asChild
                className="w-full"
              >
                <Link href="/update">Modify Data</Link>
              </Button>
              <Button
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
                className="w-full"
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Safety Tips & QR Code Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>Place your QR code tag on your helmet, vehicle, or ID card for easy access.</li>
              <li>Ensure the QR code is not obstructed by scratches or dirt for proper scanning.</li>
              <li>Share your tag ID with trusted contacts for emergencies.</li>
              <li>Do not share sensitive personal details through the QR code.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Where to Use OpenTag</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>Stick the QR code tag on your backpack, helmet, car, or any personal item.</li>
              <li>Print six tags on a sheet, cut them out, and stick them using tape.</li>
              <li>Ensure the tags are placed in visible and easily accessible locations.</li>
              <li>Replace the tags if they get damaged or worn out.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Get Creative with Your QR Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Feel free to customize your QR codes to match your style! You can use different colors, add logos, or even create unique designs. Just make sure the QR code remains scannable.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Use high-contrast colors for the QR code and background.</li>
              <li>Experiment with different shapes and patterns, but keep the core structure intact.</li>
              <li>Test your custom QR codes with multiple devices to ensure they work properly.</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* PIN Verification Dialog */}
      <PinInputDialog
        isOpen={pinDialogOpen}
        onClose={() => setPinDialogOpen(false)}
        onVerify={handleVerifyPin}
        title="Enter your PIN to download tag"
        description="Your medical data is protected with a PIN. Please enter your 4-digit PIN to include it in your tag."
        isVerifying={verifyingPin}
        error={pinError}
        basicInfo={
          <div className="space-y-2">
            <p><strong>Name:</strong> {userName}</p>
            <p><strong>Blood Group:</strong> {bloodGroup}</p>
          </div>
        }
      />

      {/* Delete Account Dialog */}
      <DeleteAccountDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteAccount}
      />
    </PageWrapper>
  );
};

export default Dashboard;