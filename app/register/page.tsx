import { RegisterForm } from "@/components/auth/register-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterPage() {
  return (
    <div className="py-10 flex justify-center items-center min-h-screen">
      <Card>
      <CardHeader>
        <CardTitle>Register for OpenTag</CardTitle>
        <CardDescription>
        Create your account to get your digital vehicle tag
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
      </Card>
    </div>
  )
}