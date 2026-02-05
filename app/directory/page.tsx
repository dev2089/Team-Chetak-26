import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Users, Search, MapPin, MessageCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const WHATSAPP_NUMBER = "916376476075"

// Sample member directory data - in production this would come from database
const sampleMembers = [
]

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
                  <Input placeholder="Search by name or ATOMY ID..." className="pl-10 bg-card border-border" />
                </div>
              </div>
              <select className="px-4 py-2 rounded-lg bg-card border border-border text-foreground">
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <select className="px-4 py-2 rounded-lg bg-card border border-border text-foreground">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sampleMembers.map((member) => (
                <Card key={member.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{member.name}</h3>
                        <p className="text-sm text-primary">{member.rank}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {member.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Member since {member.joinDate}
                      </div>
                    </div>
                    {member.isLeader && (
                      <span className="inline-block mt-3 px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                        Team Leader
                      </span>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-8 text-center">
              <Button variant="outline" className="bg-transparent border-border">
                Load More Members
              </Button>
            </div>
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
