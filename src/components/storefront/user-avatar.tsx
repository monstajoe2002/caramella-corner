import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { authClient } from '@/lib/auth-client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut } from 'lucide-react'
import { Button } from '../ui/button'
import { Link } from '@tanstack/react-router'

export default function UserAvatar() {
  const { useSession, signOut } = authClient
  const { data: session, isPending } = useSession()
  if (isPending || session == null)
    return (
      <Button asChild>
        <Link to="/login">Login</Link>
      </Button>
    )
  const email = session?.user.email
  const username = session?.user.name
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarFallback className="bg-primary/50 text-primary-foreground">
            {username?.[0] ?? email[0]}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{username ? username : email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={async () => await signOut()}>
          <LogOut />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
