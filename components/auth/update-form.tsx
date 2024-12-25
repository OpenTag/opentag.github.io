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


export function UpdateProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [user, setUser] = useState<firebase.User | null>(null);
  const [tagId, setTagId] = useState<string>("");
  const [isTagVerified, setIsTagVerified] = useState(false);

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
    mode: "onBlur",
  });

  const { fields: emergencyContacts, append, remove } = useFieldArray({
    control: form.control,
    name: "emergencyContact",
  });

  const canAddMoreContacts = emergencyContacts.length < 5;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  async function verifyTagId() {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const tagDoc = await getDoc(doc(firestore, "users", tagId));

      if (tagDoc.exists()) {
        const data = tagDoc.data();
        const userIdFromTag = data.uid;

        if (user && user.uid === userIdFromTag) {
          setIsTagVerified(true);
          fetchUserData(userIdFromTag);
        } else {
          setErrorMessage("Tag ID does not match the current user.");
        }
      } else {
        setErrorMessage("Tag ID not found.");
      }
    } catch (error) {
      console.error("Error verifying tag ID:", error);
      setErrorMessage("Failed to verify tag ID. Please try again.");
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
          form.reset(data); // Populate form with current data
        } else {
          setErrorMessage("User ID does not match the tag ID.");
        }
      } else {
        setErrorMessage("User data not found.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setErrorMessage("Failed to fetch user data. Please try again.");
    }

    setIsLoading(false);
  }

  async function handleProfileUpdate(data: any) {
    if (!user) {
      setErrorMessage("You must be logged in to update your profile.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await updateDoc(doc(firestore, "users", tagId), {
        ...data,
        updatedAt: new Date().toISOString(),
      });

      setErrorMessage("Profile updated successfully!");
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Failed to update profile. Please try again.");
    }

    setIsLoading(false);
  }

  return (
    <div>
      {!isTagVerified ? (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Verify Tag ID</h2>
          <Input
            placeholder="Enter Tag ID"
            value={tagId}
            onChange={(e) => setTagId(e.target.value)}
          />
          <Button onClick={verifyTagId} disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify Tag ID"}
          </Button>
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleProfileUpdate)} className="space-y-6">
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
                  <FormLabel>Full Name</FormLabel>
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
                  <FormLabel>Mobile Number</FormLabel>
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
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} {...form.register("dateOfBirth", { required: "Date of birth is required" })} />
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
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} {...form.register("weight", { required: "Weight is required" })} />
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
                    className="w-full border rounded px-3 py-2"
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
                <Button type="button" variant="outline" onClick={() => append("")} className="mt-2">
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
                    <Textarea {...field} />
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
                    <Textarea {...field} />
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
                    <Textarea {...field} />
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
                    <Textarea {...field} {...form.register("insurancePolicy")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Health Conditions */}
            <div className="space-y-4">
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

            {errorMessage && (
              <div className={errorMessage.includes("successfully") ? "text-green-500" : "text-red-500"}>{errorMessage}</div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
