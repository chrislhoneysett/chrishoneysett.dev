import { SiteNav } from '@/components/home/sections/Navigation/SiteNav'
import { HeroSection } from '@/components/home/sections/Hero/HeroSection'
import { WorkSection } from '@/components/home/sections/Work/WorkSection'
import { CareerPathSection } from '@/components/home/sections/CareerPath/CareerPathSection'
import { ExperienceSection } from '@/components/home/sections/Experience/ExperienceSection'
import { CapabilitiesSection } from '@/components/home/sections/Capabilities/CapabilitiesSection'
import { AboutSection } from '@/components/home/sections/About/AboutSection'
import { ContactFooter } from '@/components/home/sections/Contact/ContactFooter'
import styles from '@/components/home/HomeLayout.module.css'

export default function Home() {
  return (
    <main id='top'>
      <div className={styles.shell}>
        <SiteNav />
        <HeroSection />
      </div>
      <WorkSection />
      <CareerPathSection />
      <ExperienceSection />
      <CapabilitiesSection />
      <AboutSection />
      <ContactFooter />
    </main>
  )
}
