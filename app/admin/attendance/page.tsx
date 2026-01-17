import { Suspense } from "react"
import { AttendanceAdminContent } from "./attendance-content"

export const metadata = {
  title: "Manage Attendance | Admin - Team Chetak",
}

export default function AttendanceAdminPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20">Loading...</div>}>
      <AttendanceAdminContent />
    </Suspense>
  )
}
