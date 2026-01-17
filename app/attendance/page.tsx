import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AttendanceContent } from "./attendance-content"

export const metadata = {
  title: "Mark Attendance | Team Chetak ATOMY",
  description: "Mark your attendance for workshops and training sessions.",
}

export default function AttendancePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="flex items-center justify-center py-20">Loading...</div>}>
          <AttendanceContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
