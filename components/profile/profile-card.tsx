import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, MapPin, Car } from "lucide-react"

interface ProfileCardProps {
  user: {
    fullName: string
    bloodGroup: string
    emergencyContact: string
    address: string
    vehicleNumber: string
    avatarUrl?: string
  }
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.avatarUrl} />
          <AvatarFallback>{user.fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">{user.fullName}</h2>
          <Badge variant="secondary" className="mt-1">
            Blood Group: {user.bloodGroup}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>Emergency: {user.emergencyContact}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{user.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4 text-muted-foreground" />
          <span>Vehicle: {user.vehicleNumber}</span>
        </div>
      </CardContent>
    </Card>
  )
}