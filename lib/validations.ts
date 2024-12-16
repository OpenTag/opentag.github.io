import * as z from "zod"

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Full name is required"),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  emergencyContact: z.string().min(10, "Valid phone number required"),
  address: z.string().min(10, "Address is required"),
  vehicleNumber: z.string().min(5, "Vehicle number is required"),
})

export type RegisterFormData = z.infer<typeof registerSchema>