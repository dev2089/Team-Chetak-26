import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  TrendingUp,
  Users,
  IndianRupee,
  Target,
  Award,
  Calendar,
  ArrowUpRight,
  Trophy,
  Star,
  Zap,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Sample performance data
const monthlyStats = {
  totalMembers: 5000+,
  newMembersThisMonth: 150,
  memberGrowth: 2.5,
  monthlyTarget: 1000000, // 10 Lakhs
  achieved: 850000, // 8.5 Lakhs
  achievementPercent: 85,
  activeMembers: 3000,
  topPerformers: 150,
}

const recentAchievements = [
  { name: "Priya Patel", achievement: "Achieved Sharon Rose Master", date: "Jan 15, 2026" },
  { name: "Rahul Kumar", achievement: "Monthly Sales Leader", date: "Jan 14, 2026" },
  { name: "Anita Singh", achievement: "500+ Team Members", date: "Jan 12, 2026" },
  { name: "Vikram Yadav", achievement: "Diamond Master Promotion", date: "Jan 10, 2026" },
]

const monthlyTrends = [
  { month: "Aug", members: 42000, sales: 65 },
  { month: "Sep", members: 44000, sales: 72 },
  { month: "Oct", members: 46000, sales: 78 },
  { month: "Nov", members: 48000, sales: 82 },
  { month: "Dec", members: 49000, sales: 88 },
  { month: "Jan", members: 50000, sales: 85 },
]

const topLeaders = [
  { rank: 1, name: "Devanshu Sharma", title: "Star Master", points: 125000 },
  { rank: 2, name: "Priya Patel", title: "Sharon Rose Master", points: 98000 },
  { rank: 3, name: "Amit Joshi", title: "Star Master", points: 87000 },
  { rank: 4, name: "Kavita Sharma", title: "Diamond Master", points: 76000 },
  { rank: 5, name: "Rahul Kumar", title: "Diamond Master", points: 65000 },
]

export default function PerformanceDashboard() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-sidebar py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                  <BarChart3 className="h-8 w-8 text-primary" />
                  Team Performance Dashboard
                </h1>
                <p className="text-muted-foreground mt-2">
                  Real-time insights into Team Chetak&apos;s growth and achievements
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Last updated: January 17, 2026
              </div>
            </div>
          </div>
        </section>

        {/* Key Metrics */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Members</p>
                      <p className="text-3xl font-bold text-foreground mt-1">
                        {monthlyStats.totalMembers.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
                        <ArrowUpRight className="h-4 w-4" />+{monthlyStats.newMembersThisMonth.toLocaleString()} this
                        month
                      </div>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Target</p>
                      <p className="text-3xl font-bold text-foreground mt-1">₹1 Cr</p>
                      <div className="flex items-center gap-1 mt-2 text-primary text-sm">
                        <Target className="h-4 w-4" />
                        {monthlyStats.achievementPercent}% achieved
                      </div>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-full">
                      <IndianRupee className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Member Growth</p>
                      <p className="text-3xl font-bold text-foreground mt-1">+{monthlyStats.memberGrowth}%</p>
                      <div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
                        <TrendingUp className="h-4 w-4" />
                        vs last month
                      </div>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-full">
                      <TrendingUp className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Top Performers</p>
                      <p className="text-3xl font-bold text-foreground mt-1">{monthlyStats.topPerformers}</p>
                      <div className="flex items-center gap-1 mt-2 text-amber-500 text-sm">
                        <Award className="h-4 w-4" />
                        This month
                      </div>
                    </div>
                    <div className="p-3 bg-amber-500/10 rounded-full">
                      <Trophy className="h-6 w-6 text-amber-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Progress to Target */}
        <section className="py-8 bg-sidebar">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Monthly Target Progress
                </CardTitle>
                <CardDescription>Team Chetak - January 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Achieved: ₹85 Lakhs</span>
                    <span className="text-foreground font-medium">Target: ₹1 Crore</span>
                  </div>
                  <div className="h-4 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${monthlyStats.achievementPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary">{monthlyStats.achievementPercent}%</span>
                    <span className="text-sm text-muted-foreground">₹15 Lakhs remaining</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Growth Chart & Leaderboard */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Growth Trend */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    6-Month Growth Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyTrends.map((item, index) => (
                      <div key={item.month} className="flex items-center gap-4">
                        <span className="w-10 text-sm text-muted-foreground">{item.month}</span>
                        <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden relative">
                          <div
                            className="h-full bg-primary/80 rounded-lg flex items-center justify-end pr-2"
                            style={{ width: `${(item.members / 50000) * 100}%` }}
                          >
                            <span className="text-xs text-white font-medium">{(item.members / 1000).toFixed(0)}K</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Leaders */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Top 5 Leaders This Month
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topLeaders.map((leader) => (
                      <div key={leader.rank} className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            leader.rank === 1
                              ? "bg-amber-500 text-white"
                              : leader.rank === 2
                                ? "bg-slate-400 text-white"
                                : leader.rank === 3
                                  ? "bg-amber-700 text-white"
                                  : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {leader.rank}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{leader.name}</p>
                          <p className="text-sm text-primary">{leader.title}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">{leader.points.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">PV</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Recent Achievements */}
        <section className="py-8 bg-sidebar">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  Recent Achievements
                </CardTitle>
                <CardDescription>Celebrating our team members&apos; success</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recentAchievements.map((item, index) => (
                    <div key={index} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="text-xs text-muted-foreground">{item.date}</span>
                      </div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-primary">{item.achievement}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Want to See Your Name on the Leaderboard?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Join Team Chetak today and start your journey towards financial freedom. With dedication and our support,
              you can achieve great things!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/join">
                <Button className="gap-2 bg-primary hover:bg-primary/90">
                  <Users className="h-4 w-4" />
                  Join Team Chetak
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button variant="outline" className="gap-2 bg-transparent border-border">
                  <Trophy className="h-4 w-4" />
                  View Full Leaderboard
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
