"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Search, Users, MapPin, Mail, Phone, Loader, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { MemberDirectory } from "@/lib/types"

export default function MemberDirectoryPage() {
  const [members, setMembers] = useState<MemberDirectory[]>([])
  const [filteredMembers, setFilteredMembers] = useState<MemberDirectory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments")
  const [departments, setDepartments] = useState<string[]>([])

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      console.log("[v0] Fetching members from member_directory...")

      const { data, error } = await supabase
        .from("member_directory")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true })

      if (error) throw error

      console.log("[v0] Successfully fetched members:", data?.length || 0)
      setMembers(data || [])
      setFilteredMembers(data || [])

      // Extract unique departments
      const uniqueDepts = Array.from(
        new Set((data || []).map((m) => m.department).filter(Boolean))
      ) as string[]
      setDepartments(["All Departments", ...uniqueDepts])
    } catch (error: any) {
      console.error("[v0] Error fetching members:", error)
      setMembers([])
      setFilteredMembers([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    filterMembers(value, selectedDepartment)
  }

  const handleDepartmentChange = (dept: string) => {
    setSelectedDepartment(dept)
    filterMembers(searchTerm, dept)
  }

  const filterMembers = (search: string, dept: string) => {
    let filtered = members

    if (search) {
      filtered = filtered.filter(
        (m) =>
          m.full_name?.toLowerCase().includes(search.toLowerCase()) ||
          m.email?.toLowerCase().includes(search.toLowerCase()) ||
          m.atomy_id?.includes(search) ||
          m.rank?.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (dept !== "All Departments") {
      filtered = filtered.filter((m) => m.department === dept)
    }

    setFilteredMembers(filtered)
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        {/* Header Section */}
        <section className="py-12 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Member Directory</h1>
              <p className="text-muted-foreground text-lg">
                Connect with our team members and leadership
              </p>
            </div>

            {/* Search and Filter Section */}
            <section className="py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, ATOMY ID, or rank..."
                      className="pl-10 bg-card border-border"
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                </div>
                <select
                  className="px-4 py-2 rounded-lg bg-card border border-border text-foreground"
                  value={selectedDepartment}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </section>
          </div>
        </section>

        {/* Members Grid */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground text-lg">No members found matching your criteria</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredMembers.map((member) => (
                    <Card
                      key={member.id}
                      className="bg-card border-border hover:border-primary/50 transition-colors h-full flex flex-col"
                    >
                      <CardContent className="p-6 flex-1 flex flex-col">
                        {/* Profile Image */}
                        <div className="mb-4">
                          {member.image_url ? (
                            <img
                              src={member.image_url}
                              alt={member.full_name}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-48 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-4xl font-bold">
                              {member.full_name?.charAt(0)}
                            </div>
                          )}
                        </div>

                        {/* Member Info */}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground">{member.full_name}</h3>
                          {member.rank && <p className="text-sm text-primary font-medium mb-2">{member.rank}</p>}
                          {member.job_title && (
                            <p className="text-sm text-muted-foreground mb-1">{member.job_title}</p>
                          )}
                          {member.department && (
                            <p className="text-xs text-muted-foreground mb-3">Dept: {member.department}</p>
                          )}

                          {member.bio && (
                            <p className="text-xs text-muted-foreground line-clamp-3 mb-4 italic">{member.bio}</p>
                          )}
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2 text-xs border-t border-border pt-4 mt-4">
                          {member.email && (
                            <div className="flex items-start gap-2 text-muted-foreground">
                              <Mail className="h-3 w-3 mt-0.5 flex-shrink-0" />
                              <a href={`mailto:${member.email}`} className="hover:text-primary break-all">
                                {member.email}
                              </a>
                            </div>
                          )}
                          {member.phone && (
                            <div className="flex items-start gap-2 text-muted-foreground">
                              <Phone className="h-3 w-3 mt-0.5 flex-shrink-0" />
                              <a href={`tel:${member.phone}`} className="hover:text-primary">
                                {member.phone}
                              </a>
                            </div>
                          )}
                          {member.atomy_id && (
                            <div className="flex items-start gap-2 text-muted-foreground">
                              <span className="font-medium">ID:</span>
                              <span>{member.atomy_id}</span>
                            </div>
                          )}
                        </div>

                        {/* LinkedIn Link */}
                        {member.linkedin_url && (
                          <a
                            href={member.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 w-full px-3 py-2 bg-primary/10 text-primary text-xs font-medium rounded-lg hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
                          >
                            <ExternalLink className="h-3 w-3" />
                            LinkedIn Profile
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-8 text-center text-muted-foreground">
                  <p>
                    Showing {filteredMembers.length} of {members.length} member
                    {members.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
