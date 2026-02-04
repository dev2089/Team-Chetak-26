import { HelpCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { FaqItem } from "@/lib/types"

export const metadata = {
  title: "FAQ | Team Chetak",
  description: "Frequently asked questions about Team Chetak",
}

export default async function FaqPage() {
  const supabase = await getSupabaseServerClient()

  const { data } = await supabase.from("faq_items").select("*").eq("is_active", true).order("display_order")

  const faqs = (data as FaqItem[]) || []

  // Group FAQs by category
  const groupedFaqs = faqs.reduce(
    (acc, faq) => {
      const category = faq.category || "General"
      if (!acc[category]) acc[category] = []
      acc[category].push(faq)
      return acc
    },
    {} as Record<string, FaqItem[]>,
  )

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-sidebar px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold text-sidebar-foreground">Frequently Asked Questions</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Find answers to common questions about Team Chetak ATOMY
            </p>
          </div>
        </section>

        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {faqs.length > 0 ? (
              <div className="space-y-8">
                {Object.entries(groupedFaqs).map(([category, items]) => (
                  <div key={category}>
                    {Object.keys(groupedFaqs).length > 1 && (
                      <h2 className="text-xl font-semibold text-foreground mb-4">{category}</h2>
                    )}
                    <Accordion type="single" collapsible className="w-full">
                      {items.map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id}>
                          <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-muted/30 rounded-lg">
                <HelpCircle className="mx-auto h-16 w-16 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium text-foreground">No FAQs yet</h3>
                <p className="mt-2 text-muted-foreground">Check back soon or contact us with your questions!</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
