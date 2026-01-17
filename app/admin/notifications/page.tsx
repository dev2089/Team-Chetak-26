import { Suspense } from "react"
import { NotificationsAdminContent } from "./notifications-content"

export const metadata = {
  title: "Send Notifications | Admin - Team Chetak",
}

export default function NotificationsAdminPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20">Loading...</div>}>
      <NotificationsAdminContent />
    </Suspense>
  )
}
