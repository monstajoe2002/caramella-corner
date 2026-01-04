import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { authClient } from '@/lib/auth-client'

export default function UserAvatar() {
  const { useSession } = authClient
  const { data: session } = useSession()
  return (
    <Avatar>
      <AvatarFallback className="bg-indigo-500/25 text-indigo-500">
        {session?.user.name[0]}
      </AvatarFallback>
    </Avatar>
  )
}
