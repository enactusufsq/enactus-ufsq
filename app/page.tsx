"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroCarousel } from "@/components/home/hero-carousel"
import { WhoWeAre } from "@/components/home/who-we-are"
import { EnterprisesSection } from "@/components/home/enterprises-section"
import { LatestNews } from "@/components/home/latest-news"
import { SponsorsSection } from "@/components/home/sponsors-section"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-16 md:pt-20">
        <HeroCarousel />
        <WhoWeAre />
        <EnterprisesSection />
        <LatestNews />
        <SponsorsSection />
      </div>
      <Footer />
    </main>
  )
}
