"use client"

import Link from "next/link"
import { useData, SDG_LIST } from "@/context/data-context"
import { ArrowRight, ChevronRight } from "lucide-react"

export function EnterprisesSection() {
  const { getLatestActiveEnterprises } = useData()
  const enterprises = getLatestActiveEnterprises(3)

  return (
    <section className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#F5A800] font-semibold text-sm uppercase tracking-wider">
            Our Impact
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Featured Enterprises
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our innovative social enterprises creating lasting impact through entrepreneurial action and sustainable solutions.
          </p>
        </div>

        {/* Enterprises Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {enterprises.map((enterprise) => (
            <Link key={enterprise.id} href="/enterprises" className="group">
              <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100 hover:border-[#F5A800]/30">
                {/* Enterprise Image */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-[#F5A800]/10 to-[#F5A800]/5 overflow-hidden">
                  {enterprise.coverImageUrl ? (
                    <img
                      src={enterprise.coverImageUrl}
                      alt={enterprise.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-20 h-20 rounded-2xl bg-[#F5A800] flex items-center justify-center shadow-lg">
                        <span className="text-3xl font-bold text-white">{enterprise.name.charAt(0)}</span>
                      </div>
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1.5 text-xs font-semibold rounded-full backdrop-blur-sm ${
                      enterprise.status === "Active" 
                        ? "bg-green-500/90 text-white" 
                        : enterprise.status === "Completed"
                        ? "bg-gray-600/90 text-white"
                        : "bg-[#F5A800]/90 text-white"
                    }`}>
                      {enterprise.status}
                    </span>
                  </div>
                  {/* Enterprise Type */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-white/90 backdrop-blur-sm text-gray-700">
                      {enterprise.enterpriseType}
                    </span>
                  </div>
                </div>

                {/* Enterprise Info */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="mb-3">
                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-[#F5A800] transition-colors">
                      {enterprise.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-[#F5A800] font-medium">{enterprise.industry}</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-500">Est. {enterprise.year}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 italic mb-3">&quot;{enterprise.slogan}&quot;</p>
                  
                  <p className="text-sm text-gray-600 mb-5 line-clamp-2 flex-1">
                    {enterprise.description}
                  </p>

                  {/* SDG Tags */}
                  <div className="mb-5">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">
                      SDGs Addressed
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {enterprise.sdgs.slice(0, 4).map((sdgId) => {
                        const sdg = SDG_LIST.find(s => s.id === sdgId)
                        return sdg ? (
                          <span
                            key={sdgId}
                            className="px-2 py-0.5 text-[10px] font-medium rounded-full text-white"
                            style={{ backgroundColor: sdg.color }}
                            title={sdg.name}
                          >
                            SDG {sdgId}
                          </span>
                        ) : null
                      })}
                      {enterprise.sdgs.length > 4 && (
                        <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 text-gray-600">
                          +{enterprise.sdgs.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* View Details Link */}
                  <div className="flex items-center text-[#F5A800] text-sm font-semibold pt-4 border-t border-gray-100 group-hover:gap-2 transition-all">
                    <span>Learn More</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-14">
          <Link
            href="/enterprises"
            className="inline-flex items-center gap-2 bg-[#F5A800] hover:bg-[#E09800] text-white font-semibold px-8 py-4 rounded-xl transition-colors shadow-lg shadow-[#F5A800]/25"
          >
            VIEW ALL PROJECTS
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
