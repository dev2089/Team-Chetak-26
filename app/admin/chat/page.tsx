import { Suspense } from "react"
import { ChatAdminContent } from "./chat-content"

export const metadata = {
  title: "Live Chat | Admin - Team Chetak",
}

export default function ChatAdminPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20">Loading...</div>}>
      <ChatAdminContent />
    </Suspense>
  )
}
