import { Suspense } from "react"
import { IncomeContent } from "./income-content"

export const metadata = {
  title: "Manage Income Sources | Admin",
}

export default function AdminIncomePage() {
  return (
    <Suspense fallback={<div className="p-8 text-muted-foreground">Loading...</div>}>
      <IncomeContent />
    </Suspense>
  )
}
