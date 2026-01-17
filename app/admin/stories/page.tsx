import { Suspense } from "react"
import StoriesContent from "./stories-content"

export default function StoriesAdminPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }
    >
      <StoriesContent />
    </Suspense>
  )
}
