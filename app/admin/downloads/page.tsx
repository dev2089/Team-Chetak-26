import { Suspense } from "react"
import DownloadsContent from "./downloads-content"

export default function DownloadsAdminPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }
    >
      <DownloadsContent />
    </Suspense>
  )
}
