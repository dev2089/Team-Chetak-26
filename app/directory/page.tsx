"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Users, Search, MapPin, MessageCircle, Loader } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { TeamMember } from "@/lib/types"

const WHATSAPP_NUMBER = "916376476075"

const states = [
  "All States",
  "Rajasthan",
  "Gujarat",
  "Maharashtra",
  "Delhi",
  "Uttar Pradesh",
  "Bihar",
  "Madhya Pradesh",
  "Karnataka",
  "Tamil Nadu",
  "Kerala",
  "West Bengal",
  "Punjab",
  "Haryana",
]

const ranks = [
  "All Ranks",
  "Agent",
  "Sales Master",
  "Diamond Master",
  "Sharon Rose Master",
  "Star Master",
  "Royal Master",
  "Crown Master",
  "Imperial Master",
]

export default function DirectoryPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedState, setSelectedState] = useState("All States")
  const [selectedRank, setSelectedRank] = useState("All Ranks")

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      
      // Force fresh client instance to avoid cache issues
      const freshSupabase = getSupabaseBrowserClient()
      const { data, error } = await freshSupabase
        .from("team_members")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true })

      if (error) {
        throw error
      }
      
      setMembers(data || [])
      setFilteredMembers(data || [])
    } catch (error: any) {
      // Don't block UI on error, just show empty state
      setMembers([])
      setFilteredMembers([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    filterMembers(value, selectedState, selectedRank)
  }

  const handleStateChange = (state: string) => {
    setSelectedState(state)
    filterMembers(searchTerm, state, selectedRank)
  }

  const handleRankChange = (rank: string) => {
    setSelectedRank(rank)
    filterMembers(searchTerm, selectedState, rank)
  }

  const filterMembers = (search: string, state: string, rank: string) => {
    let filtered = members

    if (search) {
      filtered = filtered.filter((m) =>
        m.name?.toLowerCase().includes(search.toLowerCase()) ||
        m.atomy_id?.includes(search)
      )
    }

    if (state !== "All States") {
      filtered = filtered.filter((m) => m.department === state)
    }

    if (rank !== "All Ranks") {
      filtered = filtered.filter((m) => m.rank === rank)
    }

    setFilteredMembers(filtered)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-sidebar py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <Users className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-foreground mb-4">Member Directory</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with 5,000+ Team Chetak members across India. Find leaders, mentors, and team members in your
              region.
            </p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 border-b border-border">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name or ATOMY ID..." 
                    className="pl-10 bg-card border-border"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>
              <select 
                className="px-4 py-2 rounded-lg bg-card border border-border text-foreground"
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
              >
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <select 
                className="px-4 py-2 rounded-lg bg-card border border-border text-foreground"
                value={selectedRank}
                onChange={(e) => handleRankChange(e.target.value)}
              >
                {ranks.map((rank) => (
                  <option key={rank} value={rank}>
                    {rank}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-8 bg-primary/5">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-primary">5,000+</p>
                <p className="text-sm text-muted-foreground">Total Members</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">28</p>
                <p className="text-sm text-muted-foreground">States Covered</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">500+</p>
                <p className="text-sm text-muted-foreground">Leaders</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">1000+</p>
                <p className="text-sm text-muted-foreground">Cities</p>
              </div>
            </div>
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
                <p className="text-muted-foreground text-lg">No members found matching your criteria</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredMembers.map((member) => (
                    <Card key={member.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          {member.image_url ? (
                            <img
                              src={member.image_url}
                              alt={member.name}
                              className="w-14 h-14 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-bold">
                              {member.name?.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-foreground">{member.name}</h3>
                            <p className="text-sm text-primary">{member.rank}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          {member.department && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {member.department}
                            </div>
                          )}
                          {member.title && (
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              {member.title}
                            </div>
                          )}
                        </div>
                        {member.linkedin_url && (
                          <a
                            href={member.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-3 px-2 py-1 bg-primary/20 text-primary text-xs rounded-full hover:bg-primary/30"
                          >
                            LinkedIn
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Connect CTA */}
        <section className="py-12 bg-sidebar">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Want to Connect with Team Members?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Contact us on WhatsApp to get connected with team leaders in your area or to find a mentor for your ATOMY
              journey.
            </p>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
              <Button className="gap-2 bg-green-600 hover:bg-green-700">
                <MessageCircle className="h-4 w-4" />
                Connect via WhatsApp
              </Button>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
