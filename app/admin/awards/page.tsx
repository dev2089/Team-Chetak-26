import { Suspense } from "react"
import { AwardsContent } from "./awards-content"

export const metadata = {
  title: "Manage Monthly Awards | Admin",
}

export default function AdminAwardsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-muted-foreground">Loading...</div>}>
      <AwardsContent />
    </Suspense>
  )
}
