"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { supabase } from "@/lib/supabase"

// SDG definitions based on UN Sustainable Development Goals
export const SDG_LIST = [
  { id: 1, name: "No Poverty", color: "#E5243B" },
  { id: 2, name: "Zero Hunger", color: "#DDA63A" },
  { id: 3, name: "Good Health", color: "#4C9F38" },
  { id: 4, name: "Quality Education", color: "#C5192D" },
  { id: 5, name: "Gender Equality", color: "#FF3A21" },
  { id: 6, name: "Clean Water", color: "#26BDE2" },
  { id: 7, name: "Clean Energy", color: "#FCC30B" },
  { id: 8, name: "Decent Work", color: "#A21942" },
  { id: 9, name: "Industry & Innovation", color: "#FD6925" },
  { id: 10, name: "Reduced Inequalities", color: "#DD1367" },
  { id: 11, name: "Sustainable Cities", color: "#FD9D24" },
  { id: 12, name: "Responsible Consumption", color: "#BF8B2E" },
  { id: 13, name: "Climate Action", color: "#3F7E44" },
  { id: 14, name: "Life Below Water", color: "#0A97D9" },
  { id: 15, name: "Life on Land", color: "#56C02B" },
  { id: 16, name: "Peace & Justice", color: "#00689D" },
  { id: 17, name: "Partnerships", color: "#19486A" },
] as const

export interface Article {
  id: string
  title: string
  slug: string
  category: string
  coverImageUrl: string
  body: string
  excerpt: string
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Enterprise {
  id: string
  name: string
  industry: string
  slogan: string
  year: string
  description: string
  fullDescription: string
  coverImageUrl: string
  logoUrl: string
  sdgs: number[]
  enterpriseType: "Social Enterprise" | "Community Enterprise" | "Strategic Enterprise"
  status: "Active" | "Completed" | "Planning"
  impactMetrics: string[]
  contactEmail: string
  contactPhone: string
  website: string
  socialLinks: {
    facebook?: string
    instagram?: string
    linkedin?: string
    twitter?: string
  }
  teamLead: string
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Sponsor {
  id: string
  name: string
  logoUrl: string
  tier: "Platinum" | "Gold" | "Silver"
  description: string
  website: string
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Position {
  id: string
  title: string
  department: string
  type: "Volunteer" | "Executive" | "Enterprise Member"
  description: string
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Application {
  id: string
  name: string
  email: string
  studentNumber: string
  faculty: string
  yearOfStudy: string
  positionId: string // "general-member" for general membership applications
  motivation: string
  skills: string
  reviewed: boolean
  createdAt: Date
}

function mapEnterprise(row: any): Enterprise {
  return {
    id: row.id,
    name: row.name,
    industry: row.industry,
    slogan: row.slogan,
    year: row.year,
    description: row.description,
    fullDescription: row.full_description,
    coverImageUrl: row.cover_image_url ?? row.logo_url,
    logoUrl: row.logo_url,
    sdgs: row.sdgs ?? [],
    enterpriseType: row.enterprise_type,
    status: row.status,
    impactMetrics: row.impact_metrics ?? [],
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    website: row.website,
    socialLinks: row.social_links ?? {},
    teamLead: row.team_lead,
    active: row.active,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapArticle(row: any): Article {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    coverImageUrl: row.cover_image_url,
    body: row.body,
    excerpt: row.excerpt,
    published: row.published,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

interface DataContextType {
  // Articles
  articles: Article[]
  addArticle: (article: Omit<Article, "id" | "slug" | "createdAt" | "updatedAt">) => void
  updateArticle: (id: string, article: Partial<Article>) => void
  deleteArticle: (id: string) => void
  getPublishedArticles: () => Article[]
  getLatestPublishedArticles: (count: number) => Article[]
  getArticleBySlug: (slug: string) => Article | undefined
  // Enterprises
  enterprises: Enterprise[]
  addEnterprise: (enterprise: Omit<Enterprise, "id" | "createdAt" | "updatedAt">) => void
  updateEnterprise: (id: string, enterprise: Partial<Enterprise>) => void
  deleteEnterprise: (id: string) => void
  getActiveEnterprises: () => Enterprise[]
  getLatestActiveEnterprises: (count: number) => Enterprise[]
  getEnterpriseById: (id: string) => Enterprise | undefined
  // Sponsors
  sponsors: Sponsor[]
  addSponsor: (sponsor: Omit<Sponsor, "id" | "createdAt" | "updatedAt">) => void
  updateSponsor: (id: string, sponsor: Partial<Sponsor>) => void
  deleteSponsor: (id: string) => void
  getActiveSponsors: () => Sponsor[]
  // Positions
  positions: Position[]
  addPosition: (position: Omit<Position, "id" | "createdAt" | "updatedAt">) => void
  updatePosition: (id: string, position: Partial<Position>) => void
  deletePosition: (id: string) => void
  getActivePositions: () => Position[]
  // Applications
  applications: Application[]
  addApplication: (application: Omit<Application, "id" | "reviewed" | "createdAt">) => void
  markApplicationReviewed: (id: string) => void
  getApplications: () => Application[]
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

const initialSponsors: Sponsor[] = [
  {
    id: "1",
    name: "Harmony Gold Mining",
    logoUrl: "",
    tier: "Platinum",
    description: "Supporting sustainable community development initiatives across South Africa.",
    website: "https://www.harmony.co.za",
    active: true,
    createdAt: new Date("2020-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "MTN",
    logoUrl: "",
    tier: "Gold",
    description: "Empowering digital connectivity and innovation for youth development.",
    website: "https://www.mtn.co.za",
    active: true,
    createdAt: new Date("2020-06-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    name: "Ford Motor Company Fund",
    logoUrl: "",
    tier: "Gold",
    description: "Driving positive change through education and entrepreneurship programs.",
    website: "https://www.ford.co.za",
    active: true,
    createdAt: new Date("2021-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    name: "AVI",
    logoUrl: "",
    tier: "Silver",
    description: "Growing great brands and supporting community development.",
    website: "https://www.avi.co.za",
    active: true,
    createdAt: new Date("2022-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
]

const initialPositions: Position[] = [
  {
    id: "1",
    title: "Enterprise Manager",
    department: "Operations",
    type: "Volunteer",
    description: "Lead and coordinate enterprise teams, manage timelines, and ensure successful enterprise delivery. Requires strong organizational and communication skills.",
    active: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Marketing Coordinator",
    department: "Marketing",
    type: "Volunteer",
    description: "Develop and execute marketing strategies to promote Enactus UFSQ and its enterprises across social media and traditional channels.",
    active: true,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "3",
    title: "Finance Officer",
    department: "Finance",
    type: "Volunteer",
    description: "Manage team finances, prepare budgets, track expenses, and assist with fundraising initiatives.",
    active: true,
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15"),
  },
]

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>([])
  const [enterprises, setEnterprises] = useState<Enterprise[]>([])
  const [sponsors, setSponsors] = useState<Sponsor[]>(initialSponsors)
  const [positions, setPositions] = useState<Position[]>(initialPositions)
  const [applications, setApplications] = useState<Application[]>([])

    // ---- Initial load ----
  useEffect(() => {
    async function loadAll() {
      setLoading(true)
      const [a, p, sp, po, ap] = await Promise.all([
        supabase.from("articles").select("*").order("created_at", { ascending: false }),
        supabase.from("projects").select("*").order("created_at", { ascending: false }),
      ])
      if (a.data) setArticles(a.data.map(mapArticle))
      if (p.data) setProjects(p.data.map(mapProject))
      setLoading(false)
    }
    loadAll()
}, [])

  // Article functions
  const addArticle = (articleData: Omit<Article, "id" | "slug" | "createdAt" | "updatedAt">) => {
    const newArticle: Article = {
      ...articleData,
      id: Date.now().toString(),
      slug: generateSlug(articleData.title),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setArticles((prev) => [newArticle, ...prev])
  }

  const updateArticle = (id: string, articleData: Partial<Article>) => {
    setArticles((prev) =>
      prev.map((article) =>
        article.id === id
          ? {
              ...article,
              ...articleData,
              slug: articleData.title ? generateSlug(articleData.title) : article.slug,
              updatedAt: new Date(),
            }
          : article
      )
    )
  }

  const deleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((article) => article.id !== id))
  }

  const getPublishedArticles = () => {
    return articles.filter((article) => article.published).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  const getLatestPublishedArticles = (count: number) => {
    return getPublishedArticles().slice(0, count)
  }

  const getArticleBySlug = (slug: string) => {
    return articles.find((article) => article.slug === slug && article.published)
  }

  // Enterprise functions
  const addEnterprise = (enterpriseData: Omit<Enterprise, "id" | "createdAt" | "updatedAt">) => {
    const newEnterprise: Enterprise = {
      ...enterpriseData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setEnterprises((prev) => [newEnterprise, ...prev])
  }

  const updateEnterprise = (id: string, enterpriseData: Partial<Enterprise>) => {
    setEnterprises((prev) =>
      prev.map((enterprise) =>
        enterprise.id === id ? { ...enterprise, ...enterpriseData, updatedAt: new Date() } : enterprise
      )
    )
  }

  const deleteEnterprise = (id: string) => {
    setEnterprises((prev) => prev.filter((enterprise) => enterprise.id !== id))
  }

  const getActiveEnterprises = () => {
    return enterprises.filter((enterprise) => enterprise.active).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  const getLatestActiveEnterprises = (count: number) => {
    return getActiveEnterprises().slice(0, count)
  }

  const getEnterpriseById = (id: string) => {
    return enterprises.find((enterprise) => enterprise.id === id && enterprise.active)
  }

  // Sponsor functions
  const addSponsor = (sponsorData: Omit<Sponsor, "id" | "createdAt" | "updatedAt">) => {
    const newSponsor: Sponsor = {
      ...sponsorData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setSponsors((prev) => [newSponsor, ...prev])
  }

  const updateSponsor = (id: string, sponsorData: Partial<Sponsor>) => {
    setSponsors((prev) =>
      prev.map((sponsor) =>
        sponsor.id === id ? { ...sponsor, ...sponsorData, updatedAt: new Date() } : sponsor
      )
    )
  }

  const deleteSponsor = (id: string) => {
    setSponsors((prev) => prev.filter((sponsor) => sponsor.id !== id))
  }

  const getActiveSponsors = () => {
    return sponsors.filter((sponsor) => sponsor.active)
  }

  // Position functions
  const addPosition = (positionData: Omit<Position, "id" | "createdAt" | "updatedAt">) => {
    const newPosition: Position = {
      ...positionData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setPositions((prev) => [newPosition, ...prev])
  }

  const updatePosition = (id: string, positionData: Partial<Position>) => {
    setPositions((prev) =>
      prev.map((position) =>
        position.id === id ? { ...position, ...positionData, updatedAt: new Date() } : position
      )
    )
  }

  const deletePosition = (id: string) => {
    setPositions((prev) => prev.filter((position) => position.id !== id))
  }

  const getActivePositions = () => {
    return positions.filter((position) => position.active)
  }

  // Application functions
  const addApplication = (applicationData: Omit<Application, "id" | "reviewed" | "createdAt">) => {
    const newApplication: Application = {
      ...applicationData,
      id: Date.now().toString(),
      reviewed: false,
      createdAt: new Date(),
    }
    setApplications((prev) => [newApplication, ...prev])
  }

  const markApplicationReviewed = (id: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, reviewed: true } : app))
    )
  }

  const getApplications = () => {
    return applications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  return (
    <DataContext.Provider
      value={{
        articles,
        addArticle,
        updateArticle,
        deleteArticle,
        getPublishedArticles,
        getLatestPublishedArticles,
        getArticleBySlug,
        enterprises,
        addEnterprise,
        updateEnterprise,
        deleteEnterprise,
        getActiveEnterprises,
        getLatestActiveEnterprises,
        getEnterpriseById,
        sponsors,
        addSponsor,
        updateSponsor,
        deleteSponsor,
        getActiveSponsors,
        positions,
        addPosition,
        updatePosition,
        deletePosition,
        getActivePositions,
        applications,
        addApplication,
        markApplicationReviewed,
        getApplications,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
