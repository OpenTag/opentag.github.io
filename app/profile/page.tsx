import { ProfileCard } from "@/components/profile/profile-card"

// This would normally fetch from Supabase
const mockUser = {
  fullName: "John Doe",
  bloodGroup: "O+",
  emergencyContact: "+1 234-567-8900",
  address: "123 Main St, City, Country",
  vehicleNumber: "ABC 1234",
  avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-10">
      <ProfileCard user={mockUser} />
    </div>
  )
}