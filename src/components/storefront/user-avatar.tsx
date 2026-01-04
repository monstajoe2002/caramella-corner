import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function AvatarFallbackDemo() {
  return (
    <Avatar>
      <AvatarFallback className="bg-indigo-500/25 text-indigo-500">
        C
      </AvatarFallback>
    </Avatar>
  )
}
