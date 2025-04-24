import { RegisterForm } from "@/components/auth/register-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageWrapper } from "@/components/ui/page-wrapper"

export default function RegisterPage() {
  return (
    <PageWrapper>
      <div className="flex justify-center items-center min-h-[80vh]">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Register for OpenTag</CardTitle>
            <CardDescription>
              Create your account to manage and create tags.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  )
}