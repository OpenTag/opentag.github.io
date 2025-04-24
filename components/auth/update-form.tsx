// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "@/lib/firebaseClient";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { encryptData, decryptData } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, InfoIcon, Key, Lock, ShieldAlert, UserCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function UpdateProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const [user, setUser] = useState<firebase.User | null>(null);
  const [tagId, setTagId] = useState<string>("");
  const [isTagVerified, setIsTagVerified] = useState(false);
  const [pin, setPin] = useState<string>("");
  const [showPinInput, setShowPinInput] = useState(false);
  const [rawData, setRawData] = useState(null);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [encryptionMethod, setEncryptionMethod] = useState<string | null>(null);
  const [verificationStep, setVerificationStep] = useState<"tag" | "pin" | "form">("tag");

  const form = useForm({
    defaultValues: {
      email: "",
      fullName: "",
      mobileNumber: "",
      dateOfBirth: "",
      gender: "",
      height: "",
      weight: "",
      bloodGroup: "O+",
      emergencyContacts: [{ name: "", number: "" }],
      medications: "",
      allergies: "",
      medicalNotes: "",
      insurancePolicy: "",
      medicalRecordsUrl: "",
      prescriptionUrl: "",
      scanReportsUrl: "",
      asthma: false,
      highBP: false,
      diabetes: false,
      pregnancyStatus: false,
      organDonor: false,
    },
    mode: "onBlur",
  });

  const { fields: emergencyContactFields, append: appendContact, remove: removeContact } = useFieldArray({
    control: form.control,
    name: "emergencyContacts",
  });

  const canAddMoreContacts = emergencyContactFields.length < 5;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  async function verifyTagId() {
    setIsLoading(true);
    setMessage(null);

    try {
      const tagDoc = await getDoc(doc(firestore, "users", tagId));

      if (tagDoc.exists()) {
        const data = tagDoc.data();
        const userIdFromTag = data.uid;
        setRawData(data);
        setIsEncrypted(data.isEncrypted || false);
        setEncryptionMethod(data.encryptionMethod || null);

        if (user && user.uid === userIdFromTag) {
          setIsTagVerified(true);

          // Check if data is encrypted and needs PIN
          if (data.isEncrypted && data.encryptedData) {
            setVerificationStep("pin");
            setShowPinInput(true);
            setMessage({
              text: "Tag verified! Please enter your 4-digit PIN to access your data.",
              type: "success"
            });
          } else {
            // Legacy unencrypted data
            fetchUserData(userIdFromTag);
            setVerificationStep("form");
            setMessage({
              text: "Tag verified! Your profile data has been loaded.",
              type: "success"
            });
          }
        } else {
          setMessage({
            text: "Tag ID does not match the current user.",
            type: "error"
          });
        }
      } else {
        setMessage({
          text: "Tag ID not found. Please check and try again.",
          type: "error"
        });
      }
    } catch (error) {
      console.error("Error verifying tag ID:", error);
      setMessage({
        text: "Failed to verify tag ID. Please try again.",
        type: "error"
      });
    }

    setIsLoading(false);
  }

  async function verifyPinAndFetchData() {
    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setMessage({
        text: "PIN must be exactly 4 digits",
        type: "error"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Try to decrypt the data with the provided PIN
      const decryptedDataStr = await decryptData(rawData.encryptedData, pin);
      let decryptedData;

      try {
        decryptedData = JSON.parse(decryptedDataStr);
      } catch (e) {
        setMessage({
          text: "Incorrect PIN. Please try again.",
          type: "error"
        });
        setIsLoading(false);
        return;
      }

      // If we got here, decryption was successful
      // Convert old format to new format if needed
      let formData = {
        ...decryptedData,
        email: rawData.email,
      };
      
      // Check if we need to convert old emergencyContact array to new emergencyContacts format
      if (Array.isArray(decryptedData.emergencyContact) && !decryptedData.emergencyContacts) {
        formData.emergencyContacts = decryptedData.emergencyContact.map(contact => {
          // Try to split if it contains a name and number format
          if (typeof contact === 'string' && contact.includes(':')) {
            const [name, number] = contact.split(':');
            return { name: name.trim(), number: number.trim() };
          }
          return { name: '', number: contact || '' };
        });
      }

      form.reset(formData);
      setVerificationStep("form");
      setShowPinInput(false);
      setMessage({
        text: "PIN verified! Your profile data has been loaded.",
        type: "success"
      });
    } catch (error) {
      console.error("Error verifying PIN:", error);
      setMessage({
        text: "Incorrect PIN. Please try again.",
        type: "error"
      });
    }

    setIsLoading(false);
  }

  async function fetchUserData(userId: string) {
    setIsLoading(true);

    try {
      const userDoc = await getDoc(doc(firestore, "users", tagId));

      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.uid === userId) {
          // Check if we need to convert old format to new format
          let formData = { ...data };
          
          // Convert emergencyContact array to emergencyContacts object format if needed
          if (Array.isArray(data.emergencyContact) && !data.emergencyContacts) {
            formData.emergencyContacts = data.emergencyContact.map(contact => {
              return { name: '', number: contact || '' };
            });
          }
          
          form.reset(formData);
        } else {
          setMessage({
            text: "User ID does not match the tag ID.",
            type: "error"
          });
        }
      } else {
        setMessage({
          text: "User data not found.",
          type: "error"
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setMessage({
        text: "Failed to fetch user data. Please try again.",
        type: "error"
      });
    }

    setIsLoading(false);
  }

  async function handleProfileUpdate(data: any) {
    if (!user) {
      setMessage({
        text: "You must be logged in to update your profile.",
        type: "error"
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // If the data was encrypted, re-encrypt it before saving
      if (isEncrypted) {
        if (!pin || pin.length !== 4) {
          setMessage({
            text: "You need to provide the correct PIN to update encrypted data.",
            type: "error"
          });
          setIsLoading(false);
          return;
        }

        // Extract emergency contact numbers for quick access
        const emergencyContactNumbers = data.emergencyContacts
          .filter((contact) => contact.number.trim() !== "")
          .map((contact) => contact.number);

        // Prepare sensitive data for encryption
        const sensitiveData = {
          fullName: data.fullName,
          mobileNumber: data.mobileNumber,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          height: data.height,
          weight: data.weight,
          bloodGroup: data.bloodGroup,
          emergencyContacts: data.emergencyContacts,
          medications: data.medications || null,
          allergies: data.allergies || null,
          medicalNotes: data.medicalNotes || null,
          insurancePolicy: data.insurancePolicy || null,
          medicalRecordsUrl: data.medicalRecordsUrl || null,
          prescriptionUrl: data.prescriptionUrl || null,
          scanReportsUrl: data.scanReportsUrl || null,
          asthma: data.asthma || false,
          highBP: data.highBP || false,
          diabetes: data.diabetes || false,
          pregnancyStatus: data.pregnancyStatus || false,
          organDonor: data.organDonor || false,
        };

        // Encrypt the sensitive data with AES-GCM
        const encryptedData = await encryptData(JSON.stringify(sensitiveData), pin);

        // Update with encrypted data and some non-sensitive fields
        await updateDoc(doc(firestore, "users", tagId), {
          email: data.email,
          encryptedData,
          // Keep unencrypted versions of these fields for quick access
          fullName: data.fullName,
          bloodGroup: data.bloodGroup,
          emergencyContact: emergencyContactNumbers,
          updatedAt: new Date().toISOString(),
          isEncrypted: true,
          encryptionMethod: "AES-GCM", // Always use the new method
        });
      } else {
        // Legacy unencrypted update
        await updateDoc(doc(firestore, "users", tagId), {
          ...data,
          updatedAt: new Date().toISOString(),
        });
      }

      setMessage({
        text: "Profile updated successfully! Redirecting to dashboard...",
        type: "success"
      });
      
      // Set timeout for redirect
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        text: "Failed to update profile. Please try again.",
        type: "error"
      });
    }

    setIsLoading(false);
  }

  // Render different steps based on verification state
  const renderVerificationSteps = () => {
    switch (verificationStep) {
      case "tag":
        return (
          <Card className="border-2 border-dashed">
            <CardContent className="py-6">
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <ShieldAlert className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Verify Your Tag</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enter your OpenTag ID to access and update your profile information
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="relative">
                    <Input
                      placeholder="Enter your Tag ID"
                      value={tagId}
                      onChange={(e) => setTagId(e.target.value)}
                      className="pl-10"
                    />
                    <UserCircle className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                  
                  <Button 
                    onClick={verifyTagId} 
                    disabled={isLoading || !tagId.trim()} 
                    className="w-full"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <LoadingSpinner size="sm" className="mr-2 h-4 w-4" />
                        Verifying...
                      </span>
                    ) : "Verify Tag ID"}
                  </Button>
                </div>
                
                {message && (
                  <Alert className={message.type === "error" ? "bg-destructive/10" : message.type === "success" ? "bg-green-50" : "bg-blue-50"}>
                    {message.type === "error" ? (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                    <AlertDescription className={message.type === "error" ? "text-destructive" : message.type === "success" ? "text-green-600" : "text-blue-600"}>
                      {message.text}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        );
        
      case "pin":
        return (
          <Card className="border-2 border-dashed">
            <CardContent className="py-6">
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Lock className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Enter Your PIN</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your data is encrypted. Enter your 4-digit PIN to continue
                    </p>
                    <Badge className="mt-2" variant="outline">
                      <Key className="h-3 w-3 mr-1" />
                      {encryptionMethod || "Encrypted"}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="relative">
                    <Input
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="4-digit PIN"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      maxLength={4}
                      className="pl-10 tracking-widest text-center"
                    />
                    <Key className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                  
                  <Button 
                    onClick={verifyPinAndFetchData} 
                    disabled={isLoading || !pin.trim() || pin.length !== 4}
                    className="w-full"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <LoadingSpinner size="sm" className="mr-2 h-4 w-4" />
                        Verifying...
                      </span>
                    ) : "Access Profile"}
                  </Button>
                </div>
                
                {message && (
                  <Alert className={message.type === "error" ? "bg-destructive/10" : message.type === "success" ? "bg-green-50" : "bg-blue-50"}>
                    {message.type === "error" ? (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                    <AlertDescription className={message.type === "error" ? "text-destructive" : message.type === "success" ? "text-green-600" : "text-blue-600"}>
                      {message.text}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        );
        
      case "form":
        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleProfileUpdate)} className="space-y-6">
              <div className="bg-stone-100 dark:bg-stone-900 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-background">Tag ID: {tagId}</Badge>
                  {isEncrypted && <Badge variant="outline" className="bg-background"><Key className="h-3 w-3 mr-1" />Encrypted</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">
                  Update your information below. Required fields are marked with an asterisk (*).
                </p>
              </div>
              
              <div className="bg-stone-100 dark:bg-stone-900 p-4 rounded-lg">
                <h2 className="text-xl font-bold mb-2">Personal Information</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Basic details that help identify you in case of emergency.
                </p>

                <div className="space-y-4">
                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Full Name */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input {...field} {...form.register("fullName", { required: "Full name is required" })} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Mobile Number */}
                  <FormField
                    control={form.control}
                    name="mobileNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number *</FormLabel>
                        <FormControl>
                          <Input {...field} {...form.register("mobileNumber", { required: "Mobile number is required" })} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date of Birth */}
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth *</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            {...form.register("dateOfBirth", { required: "Date of birth is required" })}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Gender */}
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {["Male", "Female", "Other"].map((gender) => (
                              <SelectItem key={gender} value={gender}>
                                {gender}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    {/* Height */}
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height (cm) *</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} {...form.register("height", { required: "Height is required" })} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Weight */}
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (kg) *</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} {...form.register("weight", { required: "Weight is required" })} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Blood Group */}
                  <FormField
                    control={form.control}
                    name="bloodGroup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blood Group *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select blood group" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                              <SelectItem key={group} value={group}>
                                {group}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="bg-stone-100 dark:bg-stone-900 p-4 rounded-lg">
                <h2 className="text-xl font-bold mb-2">Emergency Contacts</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  People to contact in case of emergency. Include names and phone numbers.
                </p>

                {emergencyContactFields.map((field, index) => (
                  <div key={field.id} className="flex flex-col space-y-2 mb-4 p-3 border border-stone-200 dark:border-stone-700 rounded-md">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Contact {index + 1}</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={emergencyContactFields.length === 1 || isLoading}
                        onClick={() => removeContact(index)}
                        className="h-8 px-2"
                      >
                        Remove
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`emergencyContacts.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Contact name"
                                {...field}
                                {...form.register(`emergencyContacts.${index}.name`, {
                                  required: "Contact name is required",
                                })}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`emergencyContacts.${index}.number`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Contact number"
                                {...field}
                                {...form.register(`emergencyContacts.${index}.number`, {
                                  required: "Contact number is required",
                                })}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}

                {canAddMoreContacts && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendContact({ name: "", number: "" })}
                    className="mt-2"
                  >
                    Add Contact
                  </Button>
                )}
              </div>

              <Accordion type="single" collapsible className="bg-stone-100 dark:bg-stone-900 p-4 rounded-lg">
                <AccordionItem value="medical-info">
                  <AccordionTrigger className="text-xl font-bold">Medical Information</AccordionTrigger>
                  <AccordionContent className="space-y-6 pt-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      These details will be protected with your PIN and only accessible to medical professionals with your consent.
                    </p>

                    {/* Medications */}
                    <FormField
                      control={form.control}
                      name="medications"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medications</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List any medications you are currently taking"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Allergies */}
                    <FormField
                      control={form.control}
                      name="allergies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Allergies</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List any allergies you have"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Medical Notes */}
                    <FormField
                      control={form.control}
                      name="medicalNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medical Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any additional medical notes"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Insurance Policy */}
                    <FormField
                      control={form.control}
                      name="insurancePolicy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Insurance Policy</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter policy details like policy number, provider, etc."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Health Conditions */}
                    <div className="space-y-4">
                      <h3 className="font-semibold">Health Conditions</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" {...form.register("asthma")} id="asthma" className="h-5 w-5" />
                          <label htmlFor="asthma" className="text-sm">Asthma</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" {...form.register("highBP")} id="highBP" className="h-5 w-5" />
                          <label htmlFor="highBP" className="text-sm">High Blood Pressure</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" {...form.register("diabetes")} id="diabetes" className="h-5 w-5" />
                          <label htmlFor="diabetes" className="text-sm">Diabetes</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" {...form.register("pregnancyStatus")} id="pregnancyStatus" className="h-5 w-5" />
                          <label htmlFor="pregnancyStatus" className="text-sm">Pregnancy Status</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" {...form.register("organDonor")} id="organDonor" className="h-5 w-5" />
                          <label htmlFor="organDonor" className="text-sm">Organ Donor</label>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Accordion type="single" collapsible className="bg-stone-100 dark:bg-stone-900 p-4 rounded-lg">
                <AccordionItem value="document-links">
                  <AccordionTrigger className="text-xl font-bold">Document Links</AccordionTrigger>
                  <AccordionContent className="space-y-6 pt-4">
                    <Alert className="mb-4">
                      <InfoIcon className="h-4 w-4 mr-2" />
                      <AlertDescription>
                        Add links to your medical documents stored in cloud services (Google Drive, Dropbox, etc). Make sure your links are set to "Anyone with the link can view".
                      </AlertDescription>
                    </Alert>

                    {/* Medical Records URL */}
                    <FormField
                      control={form.control}
                      name="medicalRecordsUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medical Records Link</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://drive.google.com/file/..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-sm text-muted-foreground mt-1">
                            Link to your medical history/records document
                          </p>
                        </FormItem>
                      )}
                    />

                    {/* Prescription URL */}
                    <FormField
                      control={form.control}
                      name="prescriptionUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Prescriptions Link</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://drive.google.com/file/..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-sm text-muted-foreground mt-1">
                            Link to your current prescriptions document
                          </p>
                        </FormItem>
                      )}
                    />

                    {/* Scan Reports URL */}
                    <FormField
                      control={form.control}
                      name="scanReportsUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Scan/Test Reports Link</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://drive.google.com/file/..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-sm text-muted-foreground mt-1">
                            Link to your recent X-rays, MRI scans, or lab reports
                          </p>
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {message && (
                <Alert className={message.type === "error" ? "bg-destructive/10" : message.type === "success" ? "bg-green-50" : "bg-blue-50"}>
                  {message.type === "error" ? (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  <AlertDescription className={message.type === "error" ? "text-destructive" : message.type === "success" ? "text-green-600" : "text-blue-600"}>
                    {message.text}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => window.location.href = "/dashboard"}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" className="px-8" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <LoadingSpinner size="sm" className="mr-2 h-4 w-4" />
                      Updating...
                    </span>
                  ) : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        );
    }
  };

  return <>{renderVerificationSteps()}</>;
}
