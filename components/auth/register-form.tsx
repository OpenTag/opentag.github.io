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
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      mobileNumber: "",
      dateOfBirth: "",
      gender: "",
      height: "",
      weight: "",
      bloodGroup: "O+",
      emergencyContact: [""],
      medications: "",
      allergies: "",
      medicalNotes: "",
      insurancePolicy: "",
      asthma: false,
      highBP: false,
      diabetes: false,
      pregnancyStatus: false,
      organDonor: false,
    },
  });

  const { fields: emergencyContacts, append, remove } = useFieldArray({
    control: form.control,
    name: "emergencyContact",
  });

  const canAddMoreContacts = emergencyContacts.length < 5; // Allow a maximum of 5 contacts

  async function onSubmit(data: any) {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      // Create a user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);

      // Send email verification
      await sendEmailVerification(userCredential.user);

      // Generate a unique random numeric ID for the user
      const randomUserId = await generateUniqueUserId();

      // Save additional user data in Firestore with the unique random ID
      await setDoc(doc(firestore, "users", randomUserId), {
        uid: userCredential.user.uid, // Store the user UID
        email: data.email,
        fullName: data.fullName,
        mobileNumber: data.mobileNumber,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        height: data.height,
        weight: data.weight,
        bloodGroup: data.bloodGroup,
        emergencyContact: data.emergencyContact,
        medications: data.medications || null,
        allergies: data.allergies || null,
        medicalNotes: data.medicalNotes || null,
        insurancePolicy: data.insurancePolicy || null,
        asthma: data.asthma || false,
        highBP: data.highBP || false,
        diabetes: data.diabetes || false,
        pregnancyStatus: data.pregnancyStatus || false,
        organDonor: data.organDonor || false,
        createdAt: new Date().toISOString(),
      });
      await setDoc(doc(firestore, "tags", userCredential.user.uid), {
        tagID: randomUserId,
        createdAt: new Date().toISOString(),
      });

      setErrorMessage("Registration successful! Please check your email to verify your account.");
      window.location.href = "/";
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
            setErrorMessage("Weak password.");
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
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                  {...form.register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                />
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
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your full name"
                  {...field}
                  {...form.register("fullName", { required: "Full name is required" })}
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
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your mobile number"
                  {...field}
                  {...form.register("mobileNumber", { required: "Mobile number is required" })}
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
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  placeholder="Enter your date of birth"
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
              <FormLabel>Gender</FormLabel>
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

        {/* Height */}
        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height (cm)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter your height in cm"
                  {...field}
                  {...form.register("height", { required: "Height is required" })}
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
            <FormItem>
              <FormLabel>Weight (kg)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter your weight in kg"
                  {...field}
                  {...form.register("weight", { required: "Weight is required" })}
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
            <FormItem>
              <FormLabel>Blood Group</FormLabel>
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

        {/* Emergency Contacts */}
        <div>
          <h3 className="text-lg font-semibold">Emergency Contacts</h3>
          {emergencyContacts.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder={`Contact ${index + 1}`}
                {...form.register(`emergencyContact.${index}`, { required: "Emergency contact is required" })}
                className="w-full border rounded px-3 py-2 my-2"
              />
              <Button
                type="button"
                variant="outline"
                disabled={emergencyContacts.length === 1}
                onClick={() => remove(index)}
                className="px-2"
              >
                Remove
              </Button>
            </div>
          ))}
          {canAddMoreContacts && (
            <Button
              type="button"
              variant="outline"
              onClick={() => append("")}
              className="mt-2"
            >
              Add Contact
            </Button>
          )}
        </div>

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
                  {...form.register("insurancePolicy")}
                />
                </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Health Conditions */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...form.register("asthma")}
              id="asthma"
              className="h-5 w-5"
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
            />
            <label htmlFor="organDonor" className="text-sm">
              Organ Donor
            </label>
          </div>
        </div>

        {errorMessage && (
          <div
            className={`w-full ${errorMessage.includes("successful") ? "text-green-500" : "text-red-500"}`}
          >
            {errorMessage}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </form>
    </Form>
  );
}