import { UpdateProfileForm } from "@/components/auth/update-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterPage() {
  return (
    <div className="py-10 flex justify-center items-center min-h-screen">
      <Card>
      <CardHeader>
        <CardTitle>Update</CardTitle>
        <CardDescription>
        Update your profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UpdateProfileForm />
      </CardContent>
      </Card>
    </div>
  )
}