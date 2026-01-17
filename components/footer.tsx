import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react"

const WHATSAPP_NUMBER = "916376476075"
const PHONE_NUMBER = "+91 63764 76075"
const EMAIL = "devanshu2089@gmail.com"

export function Footer() {
  return (
    <footer className="border-t border-border bg-sidebar">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <Image src="/images/image.png" alt="Team Chetak" width={56} height={56} className="rounded-lg" />
              <div>
                <h3 className="text-lg font-bold text-primary">TEAM CHETAK ATOMY</h3>
                <p className="text-sm text-muted-foreground">Never Give Up</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              India&apos;s premier ATOMY network marketing team with 50,000+ members dedicated to creating financial
              freedom and reducing unemployment. Join us to transform your life through quality products and a
              supportive community.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp: {PHONE_NUMBER}
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-sidebar-foreground">Quick Links</h4>
            <ul className="mt-4 space-y-2">
              {[
                { name: "About", href: "/about" },
                { name: "Income Sources", href: "/income" },
                { name: "Training", href: "/training" },
                { name: "Success Stories", href: "/success-stories" },
                { name: "Downloads", href: "/downloads" },
                { name: "Events Calendar", href: "/events" },
                { name: "Member Directory", href: "/directory" },
                { name: "Join Team", href: "/join" },
                { name: "Feedback", href: "/feedback" },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-sidebar-foreground">Contact Us</h4>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                {EMAIL}
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                {PHONE_NUMBER}
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <span>India</span>
              </li>
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-green-500 hover:text-green-400"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Team Chetak ATOMY. All rights reserved. | Never Give Up | Empowering India
          </p>
        </div>
      </div>
    </footer>
  )
}
