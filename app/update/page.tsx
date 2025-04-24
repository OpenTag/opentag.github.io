import { UpdateProfileForm } from "@/components/auth/update-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function UpdatePage() {
  return (
    <div className="py-10 flex justify-center min-h-screen">
      <div className="w-full max-w-4xl px-4">
        <Tabs defaultValue="profile" className="w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Profile Management</h1>
              <p className="text-muted-foreground mt-2">
                Update your personal and medical information stored on your OpenTag
              </p>
            </div>
            <TabsList className="mt-4 md:mt-0">
              <TabsTrigger value="profile">Update Profile</TabsTrigger>
              <TabsTrigger value="security">Security Tips</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Update Your Profile</CardTitle>
                <CardDescription>
                  Keep your health and emergency information up to date to ensure accuracy in emergencies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UpdateProfileForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Recommendations</CardTitle>
                <CardDescription>
                  Best practices to keep your medical information secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium">Keep your PIN secure</h3>
                    <p className="text-sm text-muted-foreground">Your 4-digit PIN protects your encrypted health data. Never share it with anyone you don't trust.</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium">Regular updates</h3>
                    <p className="text-sm text-muted-foreground">Ensure your medical information is current, especially after doctor visits or changes to your medications.</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium">Emergency contacts</h3>
                    <p className="text-sm text-muted-foreground">Maintain at least two emergency contacts with current phone numbers.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}