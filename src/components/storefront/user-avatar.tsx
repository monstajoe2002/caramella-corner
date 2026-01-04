import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { authClient } from '@/lib/auth-client'

export default function UserAvatar() {
  const { useSession } = authClient
  const { data: session } = useSession()
  return (
    <Avatar>
      <AvatarFallback className="bg-primary/50 text-primary-foreground">
        {session?.user.name[0]}
      </AvatarFallback>
    </Avatar>
  )
}
