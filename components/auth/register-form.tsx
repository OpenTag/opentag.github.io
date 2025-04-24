// @ts-nocheck
"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, firestore } from "@/lib/firebaseClient";
import { FirebaseError } from "firebase/app";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { encryptData } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, CheckCircle2 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

async function generateUniqueUserId() {
  let uniqueId = Math.floor(Math.random() * 1000000); // Initial random ID
  let userDoc = await getDoc(doc(firestore, "users", uniqueId.toString()));
  while (userDoc.exists()) {
    uniqueId = Math.floor(Math.random() * 1000000); // Regenerate ID
    userDoc = await getDoc(doc(firestore, "users", uniqueId.toString()));
  }

  return uniqueId.toString(); // Return unique ID as a string
}

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      pin: "",
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
  });

  const { fields: emergencyContactFields, append: appendContact, remove: removeContact } = useFieldArray({
    control: form.control,
    name: "emergencyContacts",
  });

  const canAddMoreContacts = emergencyContactFields.length < 5; // Allow a maximum of 5 contacts

  async function onSubmit(data: any) {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Validate PIN
      if (!/^\d{4}$/.test(data.pin)) {
        setErrorMessage("PIN must be exactly 4 digits");
        setIsLoading(false);
        return;
      }

      // Create a user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);

      // Send email verification
      await sendEmailVerification(userCredential.user);

      // Generate a unique random numeric ID for the user
      const randomUserId = await generateUniqueUserId();

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
      const encryptedData = await encryptData(JSON.stringify(sensitiveData), data.pin);

      // Extract emergency contact numbers for quick access
      const emergencyContactNumbers = data.emergencyContacts
        .filter((contact) => contact.number.trim() !== "")
        .map((contact) => contact.number);

      // Save user data in Firestore with the unique random ID
      await setDoc(doc(firestore, "users", randomUserId), {
        uid: userCredential.user.uid, // Store the user UID
        email: data.email,
        // Store encrypted data
        encryptedData,
        // Also store some non-sensitive data unencrypted for quick access
        fullName: data.fullName, // Name is visible for identification
        bloodGroup: data.bloodGroup, // Important in emergencies
        emergencyContact: emergencyContactNumbers, // Contact numbers only (without names) for emergencies
        createdAt: new Date().toISOString(),
        isEncrypted: true,
        encryptionMethod: "AES-GCM", // Mark which encryption is used
      });

      // Store reference to tag ID in the user's document
      // We'll encrypt the PIN too, but use a different method since we don't need to decrypt it,
      // we just need to verify it matches
      const pinHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data.pin));
      const pinHashBase64 = btoa(String.fromCharCode(...new Uint8Array(pinHash)));

      await setDoc(doc(firestore, "tags", userCredential.user.uid), {
        tagID: randomUserId,
        pinHash: pinHashBase64, // Store hashed PIN instead of encrypted PIN
        createdAt: new Date().toISOString(),
      });

      setSuccessMessage("Registration successful! redirecting to dashboard...");

      // Redirect after a short delay to show success message
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 100);
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error("Firebase Error Code:", error.code, error.message);
        switch (error.code) {
          case "auth/email-already-in-use":
            setErrorMessage("Email already in use.");
            break;
          case "auth/invalid-email":
            setErrorMessage("Invalid email address.");
            break;
          case "auth/weak-password":
            setErrorMessage("Password should be at least 6 characters.");
            break;
          default:
            setErrorMessage("An error occurred. Please try again.");
        }
      } else {
        console.error("Unexpected Error:", error);
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-stone-100 dark:bg-stone-900 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-2">Account Setup</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Create your OpenTag account to manage your medical information.
          </p>

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="email@example.com"
                    {...field}
                    {...form.register("email", { required: "Email is required" })}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                    {...form.register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Password must be at least 6 characters" },
                    })}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* PIN - New field */}
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>PIN (4 digits)</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Enter a 4-digit PIN"
                    maxLength={4}
                    {...field}
                    {...form.register("pin", {
                      required: "PIN is required",
                      pattern: {
                        value: /^\d{4}$/,
                        message: "PIN must be exactly 4 digits",
                      },
                    })}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
                <p className="text-sm text-muted-foreground mt-1">
                  This PIN will be used to encrypt your medical data and will be required when a QR code is scanned. Keep it secure.
                </p>
              </FormItem>
            )}
          />
        </div>

        <div className="bg-stone-100 dark:bg-stone-900 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-2">Personal Information</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Basic details that help identify you in case of emergency.
          </p>

          {/* Full Name */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    {...field}
                    {...form.register("fullName", { required: "Full name is required" })}
                    disabled={isLoading}
                  />
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
              <FormItem className="mt-4">
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your mobile number"
                    {...field}
                    {...form.register("mobileNumber", { required: "Mobile number is required" })}
                    disabled={isLoading}
                  />
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
              <FormItem className="mt-4">
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    placeholder="Enter your date of birth"
                    {...field}
                    {...form.register("dateOfBirth", { required: "Date of birth is required" })}
                    disabled={isLoading}
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
              <FormItem className="mt-4">
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
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

          {/* Height */}
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Height (cm)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter your height in cm"
                    {...field}
                    {...form.register("height", { required: "Height is required" })}
                    disabled={isLoading}
                  />
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
              <FormItem className="mt-4">
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter your weight in kg"
                    {...field}
                    {...form.register("weight", { required: "Weight is required" })}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Blood Group */}
          <FormField
            control={form.control}
            name="bloodGroup"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Blood Group</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
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

        <div className="bg-stone-100 dark:bg-stone-900 p-4 rounded-lg mb-6">
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
                          disabled={isLoading}
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
                          disabled={isLoading}
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
              disabled={isLoading}
            >
              Add Contact
            </Button>
          )}
        </div>

        <Accordion type="single" collapsible className="bg-stone-100 dark:bg-stone-900 p-4 rounded-lg mb-6">
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
                        disabled={isLoading}
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
                        disabled={isLoading}
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
                        disabled={isLoading}
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
                        {...form.register("insurancePolicy")}
                        disabled={isLoading}
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
                    <input
                      type="checkbox"
                      {...form.register("asthma")}
                      id="asthma"
                      className="h-5 w-5"
                      disabled={isLoading}
                    />
                    <label htmlFor="asthma" className="text-sm">
                      Asthma
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...form.register("highBP")}
                      id="highBP"
                      className="h-5 w-5"
                      disabled={isLoading}
                    />
                    <label htmlFor="highBP" className="text-sm">
                      High Blood Pressure
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...form.register("diabetes")}
                      id="diabetes"
                      className="h-5 w-5"
                      disabled={isLoading}
                    />
                    <label htmlFor="diabetes" className="text-sm">
                      Diabetes
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...form.register("pregnancyStatus")}
                      id="pregnancyStatus"
                      className="h-5 w-5"
                      disabled={isLoading}
                    />
                    <label htmlFor="pregnancyStatus" className="text-sm">
                      Pregnancy Status
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...form.register("organDonor")}
                      id="organDonor"
                      className="h-5 w-5"
                      disabled={isLoading}
                    />
                    <label htmlFor="organDonor" className="text-sm">
                      Organ Donor
                    </label>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible className="bg-stone-100 dark:bg-stone-900 p-4 rounded-lg mb-6">
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
                        disabled={isLoading}
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
                        disabled={isLoading}
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
                        disabled={isLoading}
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

        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900 dark:text-green-200 dark:border-green-800">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center justify-center">
              <LoadingSpinner size="sm" className="mr-2 h-4 w-4" />
              Registering...
            </span>
          ) : (
            "Register"
          )}
        </Button>
      </form>
    </Form>
  );
}