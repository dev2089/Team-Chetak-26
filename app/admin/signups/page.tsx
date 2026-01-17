import { Suspense } from "react"
import { SignupsContent } from "./signups-content"

export default function SignupsPage() {
  return (
    <Suspense fallback={<SignupsLoading />}>
      <SignupsContent />
    </Suspense>
  )
}

function SignupsLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-muted-foreground">Loading signups...</div>
    </div>
  )
}
