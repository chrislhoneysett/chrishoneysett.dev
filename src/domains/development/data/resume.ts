import type { Resume } from '@/domains/development/types/resume'

/**
 * Canonical resume content for the Next.js site and future print/PDF output.
 * Based on SeniorSoftwareEngineer_2026.pdf, the resume-system discussion,
 * and https://www.linkedin.com/in/chris-honeysett/details/projects/ (2026-09-20).
 * Keep presentation in components/styles and update content here once.
 * Project technologies reflect the source, not inferred stacks or metrics.
 */
export const resume: Resume = {
  name: 'Chris Honeysett',
  headline: 'Senior Frontend Engineer | React & Connected Mobile Apps',
  location: 'Kalamazoo, MI',
  email: 'chrislhoneysett@gmail.com',
  links: [
    { label: 'chrishoneysett.dev', url: 'https://chrishoneysett.dev' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/chris-honeysett/' },
  ],
  summary:
    'My path into software began in theatre and graphic design. As a theatrical technical director, I coordinated crews, schedules, and production needs; as a freelance designer and developer, I worked directly with clients to shape and deliver their projects. That experience taught me to lead a project by understanding its needs, aligning collaborators, and choosing a practical solution. Print and interactive media led to frontend engineering, and more recently to React Native applications for connected devices. My design background helps me work with designers, while my engineering experience helps me leave code another developer can build on.',
  skills: [
    {
      id: 'core',
      label: 'Core Technologies',
      items: [
        'React',
        'React Native',
        'TypeScript',
        'JavaScript',
        'HTML5',
        'CSS / SCSS',
        'Vue',
      ],
    },
    {
      id: 'mobile',
      label: 'Mobile',
      items: [
        'Expo / EAS',
        'Cross-Platform application builds',
        'Bluetooth',
        'NFC',
        'TypeScript APIs for device communication',
      ],
    },
    {
      id: 'ui-engineering',
      label: 'UI Engineering',
      items: [
        'Component libraries',
        'Atomic Design',
        'Storybook',
        'Accessibility',
        'Responsive UI',
        'Figma-to-code implementation',
        'Responsive prototyping',
      ],
    },
    {
      id: 'platforms-tools',
      label: 'Platforms & Tools',
      items: [
        'AWS',
        'GitHub Actions',
        'CI/CD pipelines',
        'npm',
        'ESLint',
        'Prettier',
        'Drupal',
        'Adobe AEM',
      ],
    },
    {
      id: 'collaboration',
      label: 'Delivery & Collaboration',
      items: [
        'Client communication',
        'Project leadership',
        'Project planning',
        'Designer collaboration',
        'Agile',
        'Scrum',
        'Jira',
        'Miro',
      ],
    },
  ],
  experience: [
    {
      id: 'twisthink',
      company: 'Twisthink',
      title: 'Senior Software Engineer',
      location: 'Grand Rapids, MI',
      startDate: '2023',
      endDate: 'Present',
      summary:
        'As the sole frontend engineer, I own web interfaces and nearly all application engineering for two released React Native apps. I continue to iterate on both, contribute to their design, and collaborate with teammates responsible for specialized BLE and NFC security layers. I also build TypeScript APIs that let app developers work with connected devices without handling device-specific message formats directly.',
      projects: [
        {
          id: 'auris',
          projectOrigin: 'Greenfield',
          heroImage: {
            src: '/projects/auris-component-library.png',
            alt: 'Illustration of interface components and design system elements',
            kind: 'illustration',
          },
          name: 'Auris Internal Component Library',
          client: 'Twisthink',
          type: 'Component Library',
          description:
            'An internal collection of interface building blocks that gives designers and developers a consistent starting point for custom client applications.',
          resumeHighlight:
            'Defined the React component structure using Atomic Design, set up Storybook for discovery, and packaged the library for private npm distribution.',
          technologies: ['React', 'Storybook', 'npm'],
          tags: ['web', 'ui', 'design-system'],
        },
        {
          id: 'charity-water',
          heroImage: {
            src: '/projects/charitywater.png',
            alt: 'Charity Water well-monitoring dashboard with sensor readings and a map',
          },
          name: 'Charity Water Dashboard',
          client: 'Charity Water',
          type: 'Web Application',
          description:
            'A well-monitoring dashboard that brings sensor readings and reported failures together so technicians can identify problems affecting water access in remote African communities.',
          resumeHighlight:
            'Rebuilt the existing Vue dashboard in React and connected AWS sensor data to the technician-facing interface.',
          technologies: ['React', 'Vue', 'AWS'],
          tags: ['web', 'ui'],
        },
        {
          id: 'industrial-motor-control',
          projectOrigin: 'Greenfield',
          heroImage: {
            src: '/projects/industrial-motor-control.png',
            alt: 'Illustration of an industrial motor and controls',
            kind: 'illustration',
          },
          name: 'Industrial Motor Control',
          hidden: true,
          type: 'Mobile Application',
          platforms: ['iOS', 'Android'],
          description:
            'A React Native application for iOS and Android that controls industrial motors through NFC and Bluetooth connectivity.',
          resumeHighlight:
            'Integrated NFC and Bluetooth into an iOS and Android React Native application for industrial motor control.',
          technologies: ['React Native', 'NFC', 'Bluetooth'],
          tags: ['mobile', 'bluetooth'],
        },
        {
          id: 'secure-physical-access',
          projectOrigin: 'Greenfield',
          heroImage: {
            src: '/projects/secure-physical-access.png',
            alt: 'Illustration of a secure door access system',
            kind: 'illustration',
          },
          name: 'Secure Physical Access',
          type: 'Mobile Application',
          platforms: ['iOS', 'Android'],
          description:
            'A released iOS and Android app for limited commercial use in secure physical access. Authorized users can operate and program connected locks through Bluetooth, with authentication, PIN entry, and permission checks. Device audit logs record lock operations so activity is traceable. An NFC-based hardware version is in development.',
          confidentialityNote:
            'Project name and imagery are generalized, and identifying client and product details are omitted, to respect client confidentiality.',
          resumeHighlight:
            'Own the app’s product behavior and nearly all application engineering, coordinating with backend, BLE firmware, and NFC engineers. Built a portable BLE abstraction for session handling, discovery, connection, and communication; now developing a reusable NFC library with the same architecture.',
          technologies: ['React Native', 'TypeScript', 'Bluetooth', 'NFC'],
          tags: ['mobile', 'bluetooth'],
        },
        {
          id: 'connected-battery-management',
          projectOrigin: 'Greenfield',
          heroImage: {
            src: '/projects/connected-battery.png',
            alt: 'Illustration of a connected battery with sensor indicators',
            kind: 'illustration',
          },
          name: 'Connected Battery Management',
          type: 'Mobile Application',
          platforms: ['iOS', 'Android'],
          description:
            'A released iOS and Android app for upcoming consumer portable battery packs, from charging phones to powering a campsite. It is designed to let users manage a pack locally over Bluetooth or remotely when it connects over Wi-Fi, with AWS supporting user and device authentication.',
          confidentialityNote:
            'Project name and imagery are generalized, and identifying client and product details are omitted, to respect client confidentiality.',
          resumeHighlight:
            'Own nearly all application engineering for a React Native battery app. Architected a shared TypeScript control API with the cloud-controls engineer, routing requests through my BLE implementation or the cloud implementation.',
          technologies: ['React Native', 'TypeScript', 'Bluetooth', 'Wi-Fi', 'AWS'],
          tags: ['mobile', 'bluetooth'],
        },
        {
          id: 'nordic-thingy-demo',
          projectOrigin: 'Greenfield',
          heroImage: {
            src: '/projects/nordic-thingy-demo.png',
            alt: 'Illustration of a connected sensor device with temperature and motion readings',
            kind: 'illustration',
          },
          name: 'Nordic Thingy Demo',
          hidden: true,
          client: 'Twisthink',
          type: 'Mobile Application',
          platforms: ['iOS', 'Android'],
          description:
            'An evolving iOS and Android mobile demo that uses NFC to identify a Nordic Thingy device before connecting over Bluetooth. Onboard sensor readings feed g-force and temperature charts, alongside controls for generating tones. Further development is planned for connected-device and sensor-visualization demonstrations.',
          resumeHighlight:
            'Created an iOS and Android Nordic Thingy demo with NFC identification, Bluetooth connectivity, sensor charts, and tone controls.',
          technologies: ['React Native', 'Bluetooth', 'NFC', 'Nordic Thingy'],
          tags: ['mobile', 'ui'],
        },
      ],
    },
    {
      id: 'gravity-works',
      company: 'Gravity Works',
      title: 'Senior Frontend Developer',
      location: 'Lansing, MI',
      startDate: '2020',
      endDate: '2023',
      summary:
        'Led development of Drupal websites and embedded React applications for education, athletics, arts, and public-sector organizations. Built shared site structures and integrated external data, ticketing, registration, and permission-controlled financial workflows.',
      projects: [
        {
          id: 'uci-medicine',
          projectOrigin: 'Greenfield',
          heroImage: {
            src: '/projects/ucisom.jpeg',
            alt: 'UC Irvine School of Medicine homepage',
          },
          name: 'University of California Irvine School of Medicine',
          client: 'University of California Irvine School of Medicine',
          type: 'Website',
          description:
            'A welcoming digital home for UC Irvine’s School of Medicine, bringing education, research, healthcare, and community resources together in a clear, audience-focused experience.',
          modal: {
            overview:
              'The UC Irvine School of Medicine website serves a broad community of prospective and current students, residents, researchers, faculty, alumni, and the public. The experience pairs the school’s “Discover. Teach. Heal.” identity with direct pathways into its programs, clinical resources, research, news, events, and community information.',
            contribution:
              'At Gravity Works, I led frontend development for the Drupal and React platform. Shared themes and modules supported a consistent foundation across the School of Medicine and its department sites.',
            highlights: [
              'Organized key pathways around the needs of distinct school audiences.',
              'Connected education, research, healthcare, community, news, and events in one institutional experience.',
              'Built on shared Drupal themes and modules to support consistent department sites.',
            ],
            screenshots: [
              {
                src: '/projects/ucisom.jpeg',
                alt: 'Screenshot of the UC Irvine School of Medicine homepage',
                caption:
                  'Homepage hero and the “Discover. Teach. Heal.” message. Screenshot preview of the live site.',
              },
              {
                src: '/projects/ucisom.jpeg',
                alt: 'Screenshot preview of the UC Irvine School of Medicine homepage content',
                caption:
                  'A second live-site preview for the project gallery. The page brings news, events, and school resources together.',
              },
            ],
            liveUrl: 'https://medschool.uci.edu/',
          },
          resumeHighlight:
            'Led frontend development of UC Irvine’s School of Medicine website, creating clear pathways across education, research, healthcare, and community resources on a shared Drupal and React platform.',
          technologies: ['Drupal', 'React'],
          tags: ['web', 'cms', 'leadership'],
        },
        {
          id: 'ihsaa',
          projectOrigin: 'Greenfield',
          heroImage: {
            src: '/projects/ihsaa.png',
            alt: 'Indiana High School Athletic Association homepage',
          },
          name: 'Indiana High School Athletic Association',
          client: 'Indiana High School Athletic Association',
          type: 'Website',
          description:
            'A central resource for Indiana high school athletics, connecting students, families, schools, and officials with sport information, state tournaments, schedules, media, and association resources.',
          modal: {
            overview:
              'The IHSAA site brings together tournament coverage and the association’s year-round resources. Visitors can browse boys’ and girls’ sports, find schools and classifications, follow tournament updates, and reach schedules, tickets, broadcasts, news, and student-athlete resources.',
            contribution:
              'I led development of the Drupal website and embedded React tournament application, integrating MaxPreps data for tournament schedules, results, and statistics.',
            highlights: [
              'Created clear routes into sports, school directories, classifications, and association resources.',
              'Connected tournament schedules, results, and statistics to MaxPreps data through an embedded React experience.',
              'Supported timely tournament announcements and news alongside evergreen resources for students and member schools.',
            ],
            screenshots: [
              {
                src: '/projects/ihsaa.jpeg',
                alt: 'Screenshot preview of the Indiana High School Athletic Association homepage',
                caption:
                  'IHSAA homepage with current tournament information and pathways to sports and association resources.',
              },
            ],
            liveUrl: 'https://www.ihsaa.org/',
          },
          resumeHighlight:
            'Led a Drupal website project and integrated MaxPreps tournament data into an embedded React application.',
          technologies: ['Drupal', 'React', 'MaxPreps API'],
          tags: ['web', 'cms', 'leadership'],
        },
        {
          id: 'wmu-miller-auditorium',
          projectOrigin: 'Greenfield',
          heroImage: {
            src: '/projects/millerauditorium.jpeg',
            alt: 'Miller Auditorium homepage',
          },
          name: 'WMU Miller Auditorium',
          client: 'WMU Miller Auditorium',
          type: 'Website',
          description:
            'A performing arts destination for discovering Broadway tours, concerts, family shows, and community events at Western Michigan University’s Miller Auditorium.',
          modal: {
            overview:
              'Miller Auditorium’s site helps audiences discover upcoming performances and plan a visit. Featured shows and a broader event calendar sit alongside ticketing, box office, accessibility, parking, dining, group sales, and support information.',
            contribution:
              'I led development of the Drupal website and React components that present performance information integrated with the Tessitura ticketing system.',
            highlights: [
              'Brought featured productions and a broad event calendar into the same discovery experience.',
              'Connected performance listings with Tessitura data and ticket-purchase pathways.',
              'Made practical visit information easy to find, including accessibility, directions, and parking.',
            ],
            screenshots: [
              // {
              //   src: '/projects/millerauditorium.jpeg',
              //   alt: 'Screenshot preview of the Miller Auditorium homepage',
              //   caption:
              //     'Featured shows and upcoming performances on the Miller Auditorium homepage.',
              // },
            ],
            liveUrl: 'https://www.millerauditorium.com/',
          },
          resumeHighlight:
            'Led development of a Drupal website with React components integrating performance data from the Tessitura ticketing system.',
          technologies: ['Drupal', 'React', 'Tessitura'],
          tags: ['web', 'cms', 'leadership'],
        },
        {
          id: 'lansing-airport',
          projectOrigin: 'Greenfield',
          heroImage: {
            src: '/projects/flylansing.jpeg',
            alt: 'Fly Lansing airport homepage',
          },
          name: 'Lansing Airport',
          hidden: true,
          client: 'Lansing Airport',
          type: 'Website',
          description:
            'A traveler-focused guide to Capital Region International Airport, bringing flights, parking, security, terminal services, and regional connections into one place.',
          modal: {
            overview:
              'Fly Lansing frames the airport experience around helping regional travelers get on their way quickly and safely. The site connects flight information with parking and transportation, security, terminal amenities, airport services, business resources, and destination information.',
            contribution:
              'I led development of the Drupal airport website and integrated a React application that retrieves and displays flight information.',
            highlights: [
              'Organized travel essentials such as flights, parking, transportation, security, and terminal services.',
              'Connected airport operations and business resources with traveler-facing information.',
              'Integrated flight information in a React application within the Drupal site.',
            ],
            screenshots: [
              {
                src: '/projects/flylansing.jpeg',
                alt: 'Screenshot preview of the Capital Region International Airport website',
                caption:
                  'Fly Lansing homepage and its traveler information pathways.',
              },
            ],
            liveUrl: 'https://www.flylansing.com/',
          },
          resumeHighlight:
            'Delivered a Drupal airport website as lead developer, integrating a React application for flight information.',
          technologies: ['Drupal', 'React', 'KAYAK API'],
          tags: ['web', 'cms', 'leadership'],
        },
        {
          id: 'williamston-theatre',
          projectOrigin: 'Greenfield',
          heroImage: {
            src: '/projects/https___www.williamstontheatre.jpeg',
            alt: 'Williamston Theatre homepage',
          },
          name: 'Williamston Theatre',
          hidden: true,
          client: 'Williamston Theatre',
          type: 'Website',
          description:
            'A welcoming regional-theatre website that brings productions, season information, ticketing, and ways to connect with Williamston Theatre together.',
          modal: {
            overview:
              'Williamston Theatre presents professional, intimate storytelling in a community setting. Its site introduces the theatre and current season, then guides visitors to show details, ticket purchases, donations, ticket information, and the WT Backstage Chat podcast.',
            contribution:
              'I served as lead developer for the Drupal site, implementing an early version of Gravity Works’ Trailhead theme.',
            highlights: [
              'Built an early implementation of Gravity Works’ Trailhead theme.',
              'Connected season and show information with ticket-purchase paths.',
              'Made theatre information, support options, and artist stories easy to explore.',
            ],
            screenshots: [
              {
                src: '/projects/https___www.williamstontheatre.jpeg',
                alt: 'Screenshot preview of the Williamston Theatre homepage',
                caption:
                  'Season highlights and ticket links on the Williamston Theatre homepage.',
              },
            ],
            liveUrl: 'https://www.williamstontheatre.org/',
          },
          resumeHighlight:
            'Implemented an early version of Gravity Works’ Trailhead theme as lead developer for a Drupal theatre website.',
          technologies: ['Drupal', 'CSS'],
          tags: ['web', 'cms', 'ui', 'leadership'],
        },
        {
          id: 'michigan-potato-growers',
          heroImage: {
            src: '/projects/https___www.mipotato.jpeg',
            alt: 'Michigan Potatoes public website',
          },
          name: 'Michigan Potato Growers Conference Registration',
          hidden: true,
          client: 'Michigan Potato Growers',
          type: 'Web Application',
          description:
            'A registration experience for the Michigan Potato Growers Conference, supporting attendee and speaker sign-up, discount codes, and online payment.',
          modal: {
            overview:
              'The Michigan Potato Growers Conference registration project served a client whose public site also provides consumer-facing Michigan potato recipes, nutrition and performance information, and practical guidance for selecting, storing, and handling potatoes. The registration application supported conference attendees and speakers.',
            contribution:
              'I connected a React registration experience with Drupal attendee records and a third-party checkout workflow, including discount-code support and payment updates when registrants returned from checkout.',
            highlights: [
              'Supported registration for both attendees and speakers.',
              'Included discount-code handling and an external payment workflow.',
              'Used Drupal to retain registration records and process returned payment status.',
            ],
            screenshots: [
              {
                src: '/projects/https___www.mipotato.jpeg',
                alt: 'Screenshot preview of the Michigan Potatoes public website',
                caption:
                  'Michigan Potatoes’ consumer site, with recipes and potato education resources. This is the client website, not a screenshot of the conference registration flow.',
              },
            ],
            liveUrl: 'https://www.mipotato.com/',
          },
          resumeHighlight:
            'Connected React conference registration with Drupal attendee records and third-party checkout, including discount codes and automated payment updates.',
          technologies: ['React', 'Drupal'],
          tags: ['web', 'cms'],
        },
        {
          id: 'michigan-senate',
          heroImage: {
            src: '/projects/senate-financial-portal.png',
            alt: 'Illustration of a neutral financial dashboard',
            kind: 'illustration',
          },
          name: 'Michigan Senate Financial Portal',
          client: 'Michigan Senate',
          type: 'Web Application',
          description:
            'An internal financial portal that lets authorized staff review office budgets. Access rules determine which offices each person can see.',
          resumeHighlight:
            'Implemented authenticated React views within Drupal and applied office-level permissions to the budget data each user could access.',
          technologies: ['React', 'Drupal'],
          tags: ['web', 'cms'],
        },
        {
          id: 'msu-graduate-aid',
          heroImage: {
            src: '/projects/msu.jpeg',
            alt: 'MSU Graduate Manage Your Aid page',
          },
          name: 'MSU Graduate Financial Aid',
          hidden: true,
          client: 'Michigan State University',
          type: 'Website',
          description:
            'A guide for graduate and professional students to understand their aid, estimate attendance costs, and manage next steps through the MSU student portal.',
          modal: {
            overview:
              'The Office of Financial Aid’s graduate Manage Your Aid experience brings cost-of-attendance information together with practical guidance for using the student portal. Students can learn how to review an award, accept, reduce, or decline loans, submit requested documents, monitor their aid package, and manage guest access.',
            contribution:
              'I contributed to the graduate financial-aid website experience for Michigan State University. The public guide connects students to the student information system for account-specific actions.',
            highlights: [
              'Explained the steps for reviewing and responding to a graduate aid offer.',
              'Connected cost estimates and financial-aid guidance with the MSU student portal.',
              'Covered follow-up tasks such as document submission, monitoring awards, and guest access.',
            ],
            screenshots: [
              {
                src: '/projects/msu.jpeg',
                alt: 'Screenshot preview of Michigan State University graduate aid guidance',
                caption:
                  'Graduate Manage Your Aid page from the MSU Office of Financial Aid.',
              },
            ],
            liveUrl: 'https://finaid.msu.edu/grad/manage-aid',
          },
          resumeHighlight:
            'Contributed to Michigan State University’s graduate financial-aid guidance, connecting cost information and aid-management steps with the student portal.',
          technologies: [],
          tags: ['web', 'cms'],
        },
      ],
    },
    {
      id: 'vmlyr',
      company: 'VMLY&R / Biggs | Gilmore',
      title: 'Lead Technologist',
      location: 'Kalamazoo, MI',
      startDate: '2009',
      endDate: '2020',
      summary:
        'Led frontend development for major consumer brands, including Ford, Kellogg’s, Cottonelle, and Walmart, as well as pro bono projects for nonprofit organizations. Delivered responsive websites and application features using React, Vue, Adobe AEM, and Drupal.',
      projects: [
        {
          id: 'northern-trust',
          heroImage: {
            src: '/projects/NorthernTrust.png',
            alt: 'Northern Trust website homepage featuring an asset management study',
          },
          name: 'Northern Trust',
          hidden: true,
          client: 'Northern Trust',
          type: 'Website',
          description:
            'A website implementation that composes pages from reusable React components written in TypeScript, with content supplied by a headless CMS.',
          resumeHighlight:
            'Created reusable React and TypeScript components for pages driven by a headless CMS.',
          technologies: ['React', 'TypeScript', 'Headless CMS'],
          tags: ['web', 'cms', 'ui'],
        },
        {
          id: 'forever-strong-foundation',
          heroImage: {
            src: '/projects/foreverstrong.png',
            alt: 'Forever Strong Foundation website homepage featuring the foundation’s mission',
          },
          projectOrigin: 'Greenfield',
          name: 'Forever Strong Foundation',
          hidden: true,
          client: 'Forever Strong Foundation',
          type: 'Website',
          description:
            'A Drupal 8 website delivered from initial setup through implementation, with sole responsibility for development.',
          resumeHighlight:
            'Delivered a Drupal 8 foundation website from the ground up as the sole developer.',
          technologies: ['Drupal 8'],
          tags: ['web', 'cms'],
        },
        {
          id: 'kelloggs-family-rewards',
          heroImage: {
            src: '/projects/family-rewards.png',
            alt: 'Illustration of generic reward tokens, stars, and a gift',
            kind: 'illustration',
          },
          name: "Kellogg's Family Rewards",
          client: "Kellogg's",
          type: 'Website',
          description:
            'A consumer rewards website and connected microsites that needed a consistent experience across a long-running program.',
          resumeHighlight:
            'Directed frontend development for more than six years, including an Adobe AEM/Vue responsive redesign and a shared codebase across rewards microsites.',
          technologies: ['Adobe AEM', 'Vue'],
          tags: ['web', 'cms', 'ui', 'leadership'],
        },
        {
          id: 'walmart-crowd-planning',
          heroImage: {
            src: '/projects/walmart-crowd-planning.png',
            alt: 'Illustration of a retail floor plan with planning markers and routes',
            kind: 'illustration',
          },
          name: 'Walmart Crowd Planning Tool',
          client: 'Walmart',
          type: 'Web Application',
          description:
            'A planning tool used by managers across 2,500+ Walmart locations to prepare crowd-planning maps for Black Friday sales events.',
          resumeHighlight:
            'Led frontend implementation and subsequent feature enhancements in Drupal and Vue.',
          technologies: ['Drupal', 'Vue'],
          tags: ['web', 'cms', 'leadership'],
        },
        {
          id: 'ford-quicklane',
          heroImage: {
            src: '/projects/quicklane.png',
            alt: 'Ford Quick Lane service center image',
          },
          name: 'Ford QuickLane',
          client: 'Ford',
          type: 'Web Application',
          description:
            'A store locator that helps drivers find Ford QuickLane service centers near an address they enter.',
          resumeHighlight:
            'Built the locator as a React experience embedded in Adobe AEM, connecting address searches to nearby service-center results.',
          technologies: ['React', 'Adobe AEM'],
          tags: ['web', 'cms'],
        },
      ],
    },
  ],
  additionalExperience: [
    {
      id: 'north-american-color',
      company: 'North American Color, Inc.',
      title:
        'Prepress Systems Operator / Graphic Designer / Digital Press Operator',
      location: 'Portage, MI',
      startDate: '2002',
      endDate: '2009',
      summary:
        'Managed graphic design, image manipulation, print preparation, and digital press operations.',
      projects: [],
    },
    {
      id: 'honeysett-design',
      company: 'Honeysett Design',
      title: 'Freelance Designer / Developer',
      location: 'Kalamazoo, MI',
      startDate: '1998',
      endDate: '2020',
      summary:
        'Worked directly with clients to design and develop responsive websites, marketing, and branding for educational and arts organizations, including the U.S. Department of Education and DePaul University.',
      projects: [
        {
          id: 'midwest-rad-fest',
          projectOrigin: 'Greenfield',
          heroImage: {
            src: '/projects/radfest.png',
            alt: 'Midwest RAD Fest logo, designed by Chris Honeysett',
          },
          name: 'Wellspring Cori Terry & Dancers',
          hidden: true,
          client: 'Wellspring Cori Terry & Dancers',
          type: 'Website',
          description:
            'Designed the Midwest RAD Fest logo and website, then built and maintained the Drupal site for the annual dance festival.',
          resumeHighlight:
            'Designed the Midwest RAD Fest logo and website, then built and maintained the Drupal site for the annual dance festival.',
          technologies: ['Drupal'],
          tags: ['web', 'cms', 'ui'],
        },
        {
          id: 'farmers-alley-theatre',
          projectOrigin: 'Greenfield',
          heroImage: {
            src: '/projects/farmersAlley.png',
            alt: 'Farmers Alley Theatre website',
          },
          name: 'Farmers Alley Theatre',
          client: 'Farmers Alley Theatre',
          type: 'Website',
          description:
            'A regional theatre website where audiences can explore productions and follow a path to online ticket purchases.',
          resumeHighlight:
            'Designed and built the Drupal site, integrated Ludus ticketing, and maintained the experience over time.',
          technologies: ['Drupal', 'Ludus'],
          tags: ['web', 'cms', 'ui'],
        },
      ],
    },
  ],
  education: [
    {
      id: 'depaul',
      institution: 'DePaul University',
      school: 'The Theatre School',
      location: 'Chicago, IL',
      degree: 'B.F.A. Theatre Technology',
      minor: 'Graphic Design',
      honors: [
        'Graduated with High Honors',
        "Dean's Theatre Design & Technology Scholarship",
      ],
    },
  ],
}
