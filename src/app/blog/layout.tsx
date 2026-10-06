import { SiteNav } from '@/components/home/sections/Navigation/SiteNav'

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <><SiteNav />{children}</>
}
