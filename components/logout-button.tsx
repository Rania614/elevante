import { LogOut } from "lucide-react"
import { logoutAction } from "@/app/actions/session"
import { Button } from "@/components/ui/button"

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="ghost" size="sm">
        <LogOut size={16} aria-hidden />
        خروج
      </Button>
    </form>
  )
}
