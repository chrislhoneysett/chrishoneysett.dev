export type ResumeTag =
  | 'web'
  | 'mobile'
  | 'ui'
  | 'design-system'
  | 'bluetooth'
  | 'cms'
  | 'leadership'

export interface ProjectScreenshot {
  src: string
  alt: string
  caption: string
}

export interface ProjectScreenshotPair {
  caption: string
  desktop: Pick<ProjectScreenshot, 'src' | 'alt'>
  mobile: Pick<ProjectScreenshot, 'src' | 'alt'>
}

export interface ResumeProject {
  id: string
  name: string
  /** Omit from the website's selected work while retaining the project record. */
  hidden?: boolean
  /** When omitted, render the label "Client Work". */
  client?: string
  type:
    | 'Web Application'
    | 'Mobile Application'
    | 'Component Library'
    | 'Website'
  platforms?: ('iOS' | 'Android')[]
  /** Marks greenfield projects with a corner tag on the project card. */
  projectOrigin?: 'Greenfield'
  /** Optional image used as the project's card hero image. */
  heroImage?: {
    src: string
    alt: string
    kind?: 'illustration'
  }
  /** Product-focused prose for website project cards. */
  description: string
  /** Quiet disclosure shown after the project details in the modal. */
  confidentialityNote?: string
  /** Expanded project story for the website's project detail modal. */
  modal?: {
    overview: string
    contribution: string
    highlights: string[]
    screenshots: (ProjectScreenshot | ProjectScreenshotPair)[]
    liveUrl?: string
  }
  /** Concise contribution statement for PDF resume bullets. */
  resumeHighlight: string
  technologies: string[]
  /** Supports selecting projects for frontend- or mobile-focused resumes. */
  tags: ResumeTag[]
}

/** Projects are kept separately from career roles so both views use the same records. */
export const projectsByRole: Record<string, ResumeProject[]> = {
  twisthink: [
    {
      id: 'auris',
      projectOrigin: 'Greenfield',
      heroImage: {
        src: '/projects/auris/auris-button.png',
        alt: 'Auris Storybook page showing the Button component',
        kind: 'illustration',
      },
      name: 'Auris Internal Component Library',
      client: 'Twisthink',
      type: 'Component Library',
      description:
        'A Material Design-based component library that helps teams start custom client applications quickly and gives designers and developers a shared vocabulary.',
      modal: {
        overview:
          'Auris is an internal component library built as a starter for custom client applications. It draws on Material Design and gives designers and developers a shared vocabulary for interface decisions.',
        contribution:
          'I defined the React component structure using Atomic Design, set up Storybook for discovery, and packaged the library for private npm distribution.',
        highlights: [
          'Built small atomic components that combine into larger, reusable interface components.',
          'Wrapped selected third-party components so developers could fully customize them through Auris’s design language without needing to work with the underlying components directly.',
          'Used Auris to scaffold a new project within an hour, including user authentication, a full theme, and the component library.',
          'Used a common component language to keep design and development aligned.',
        ],
        screenshots: [
          {
            src: '/projects/auris/auris-button.png',
            alt: 'Auris Storybook Button documentation with a live preview, code, and controls',
            caption: 'Button documentation and interactive preview in Auris Storybook.',
          },
          {
            src: '/projects/auris/auris-input.png',
            alt: 'Auris Storybook Input documentation with a required text field, code, and controls',
            caption: 'Input field documentation and preview in Auris Storybook.',
          },
          {
            src: '/projects/auris/auris-charts.png',
            alt: 'Auris Storybook Pie chart example with five colored segments and a legend',
            caption: 'Pie chart example in the Auris component library.',
          },
        ],
      },
      resumeHighlight:
        'Built a Material Design-based React starter with Atomic Design, Storybook, and private npm distribution. Used it to scaffold a new project within an hour, including user authentication, a full theme, and the component library.',
      technologies: ['React', 'Storybook', 'npm'],
      tags: ['web', 'ui', 'design-system'],
    },
    {
      id: 'charity-water',
      heroImage: {
        src: '/projects/charity-water/charitywater-map-data-view.png',
        alt: 'Charity Water well-monitoring dashboard with sensor readings and a map',
      },
      name: 'Charity Water Dashboard',
      client: 'Charity Water',
      type: 'Web Application',
      description:
        'A well-monitoring dashboard that brings sensor readings and reported failures together so technicians can identify problems affecting water access in remote African communities.',
      modal: {
        overview:
          'A well-monitoring dashboard that brings sensor readings and reported failures together so technicians can identify problems affecting water access in remote African communities.',
        contribution:
          'This was the first project I inherited at Twisthink. I first finalized the existing dashboard and got it running. The codebase was fragile enough that changes and additions carried substantial risk, so I made the case for rebuilding it from Vue in React with the Auris Component Library I had created. The rebuild established a more maintainable architecture that made ongoing changes easier.',
        highlights: [
          'Prioritized getting the inherited dashboard finalized and operational before undertaking the rebuild.',
          'Rebuilt the interface in React using Auris components and a more maintainable architecture, making changes and additions easier and less risky.',
          'Completed a redesign of part of the dashboard within one week; I estimate the same work would have taken roughly a month in the previous codebase.',
          'Broke up oversized files that handled too many responsibilities into smaller, focused components and modules, making the project easier to navigate.',
          'Connected AWS sensor data to the technician-facing interface.',
        ],
        screenshots: [
          {
            src: '/projects/charity-water/charitywater-map-data-view.png',
            alt: 'Charity Water dashboard with a sensor list, status filters, and a selected well on a map',
            caption: 'Map and sensor list with a selected well marked for a sharp drop in flow.',
          },
          {
            src: '/projects/charity-water/charitywater-details.png',
            alt: 'Charity Water sensor detail page with water-flow chart, activity data, and location map',
            caption: 'Sensor details combining water-flow history, activity data, and location.',
          },
          {
            src: '/projects/charity-water/charitywater-edit-sensor.png',
            alt: 'Edit Sensor form open over the Charity Water map and sensor list',
            caption: 'Sensor editing form alongside the map and sensor list.',
          },
          {
            src: '/projects/charity-water/charitywater-table.png',
            alt: 'Charity Water sensor list with provider, connection, water activity, and check-in columns',
            caption: 'Filterable sensor list with connection, water activity, and check-in status.',
          },
        ],
      },
      resumeHighlight:
        'Rebuilt a fragile Vue dashboard in React with Auris components and a maintainable architecture. Completed a dashboard section redesign within one week, versus an estimated month in the previous codebase.',
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
        src: '/projects/secure-physical-access-card.webp',
        alt: 'Illustration of a secure door access system',
        kind: 'illustration',
      },
      name: 'Wireless Secure Physical Access',
      type: 'Mobile Application',
      platforms: ['iOS', 'Android'],
      description:
        'A released iOS and Android app for limited commercial use in secure physical access. Authorized users can operate and program connected locks through Bluetooth, with authentication, PIN entry, and permission checks. Device audit logs record lock operations so activity is traceable. An NFC-based hardware version is in development.',
      modal: {
        overview:
          'A released iOS and Android app for limited commercial use in secure physical access. Authorized users can operate and program connected locks over Bluetooth, with authentication, PIN entry, permission checks, and device audit logs. An NFC-based hardware version is in development.',
        contribution:
          'I own the app’s product behavior and nearly all application engineering, working with backend, BLE firmware, and NFC engineers. I built a portable BLE abstraction for discovery, connection, session handling, and communication, and am developing a reusable NFC library with the same architecture.',
        highlights: [
          'Replaced an in-memory JSON object with SQLite after testing showed poor performance with data for more than 10,000 locks. Populating the database in stages kept the larger data set manageable.',
          'Drove backend documentation efforts and authored consistently structured BLE firmware documentation, consolidating scattered information into a reference for application integration.',
          'Anchored the app’s clock to a server timestamp received during bootstrap, then advanced it using the device’s monotonic uptime clock. This keeps access decisions independent of changes to the phone’s wall clock.',
          'Verified a user-entered PIN by using it to seed decryption of an encrypted wrapper supplied by the backend. Successful decryption confirms the PIN without the app needing to know or store the expected value.',
          'Chunked larger data transfers, including firmware images, to work within the bandwidth limits of BLE and NFC.',
          'Developed a UI that helps users find the NFC reader on the back of their phone during NFC interactions.',
          'Designed charging feedback on the charging target itself, where users are already focused. Segments fill as charging progresses, with a split marking when the command begins.',
        ],
        screenshots: [],
      },
      confidentialityNote:
        'Project name and imagery are generalized, and identifying client and product details are omitted, to respect client confidentiality.',
      resumeHighlight:
        'Own product behavior and nearly all application engineering, collaborating across backend and firmware teams. Built a portable BLE library and am developing a reusable NFC library. Replaced in-memory lock-code storage with SQLite after testing exposed performance issues with data for more than 10,000 locks. Drove backend documentation efforts and authored consistently structured BLE firmware documentation.',
      technologies: [
        'React Native',
        'TypeScript',
        'Bluetooth',
        'NFC',
        'SQLite',
      ],
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
      modal: {
        overview:
          'A released iOS and Android app for upcoming consumer portable battery packs, from charging phones to powering a campsite. Users can manage a pack locally over Bluetooth or remotely when it connects over Wi-Fi, with AWS supporting user and device authentication.',
        contribution:
          'I own nearly all application engineering for the React Native app. I architected a shared TypeScript control API with the cloud-controls engineer, routing requests through the BLE library I created for Secure Physical Access or the cloud implementation. The common API let me advance the app’s BLE functionality while another developer built the cloud implementation in parallel.',
        highlights: [
          'Designed the app interface to mirror the product’s physical display, giving users a familiar way to understand and control the battery pack.',
          'With limited budget for dedicated UI/UX design, used familiar iOS and Android interface conventions and native components wherever possible to give users recognizable controls and interactions.',
          'Reused the BLE library I had created for Secure Physical Access, saving an estimated 1–2 weeks of development and carrying forward solutions to scanning and connection issues from earlier projects.',
          'Used a common TypeScript control API so BLE app development and cloud implementation could proceed in parallel without requiring separate UI integrations.',
        ],
        screenshots: [],
      },
      confidentialityNote:
        'Project name and imagery are generalized, and identifying client and product details are omitted, to respect client confidentiality.',
      resumeHighlight:
        'Own nearly all application engineering for a released iOS and Android React Native battery app. Reused a BLE library, saving an estimated 1-2 weeks of development. Architected a shared TypeScript control API enabling BLE app work and cloud development to proceed in parallel. Used familiar OS interface conventions to deliver the UI within a limited design budget.',
      technologies: ['React Native', 'TypeScript', 'Bluetooth', 'Wi-Fi', 'AWS'],
      tags: ['mobile', 'bluetooth', 'ui'],
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
  'gravity-works': [
    {
      id: 'uci-medicine',
      projectOrigin: 'Greenfield',
      heroImage: {
        src: '/projects/ucisom/ucisom.png',
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
          'At Gravity Works, I led frontend development for the Drupal and React platform. I architected the site’s data structure while keeping the implementation aligned with the existing component library wherever possible. Shared themes and modules supported a consistent foundation across the School of Medicine and its department sites.',
        highlights: [
          'Structured the site’s data to support content and navigation across the School of Medicine and its departments.',
          'Worked within the existing component library wherever possible to preserve a consistent experience.',
          'Organized key pathways around the needs of distinct school audiences.',
          'Connected education, research, healthcare, community, news, and events in one institutional experience.',
          'Built on shared Drupal themes and modules to support consistent department sites.',
          'Several years after my involvement, the live site still closely resembles what I built.',
        ],
        screenshots: [
          {
            caption: 'Homepage hero and the “Discover. Teach. Heal.” message.',
            desktop: {
              src: '/projects/ucisom/ucisom.png',
              alt: 'Desktop UC Irvine School of Medicine homepage hero',
            },
            mobile: {
              src: '/projects/ucisom/ucisom_mobile.png',
              alt: 'Mobile UC Irvine School of Medicine homepage with compact navigation and stacked hero',
            },
          },
          {
            caption: 'Office of Research page with a research-focused hero and supporting content.',
            desktop: {
              src: '/projects/ucisom/ucisom-department.png',
              alt: 'Desktop UC Irvine School of Medicine Office of Research page',
            },
            mobile: {
              src: '/projects/ucisom/ucisom-department_mobile.png',
              alt: 'Mobile UC Irvine School of Medicine Office of Research page with stacked hero text',
            },
          },
          {
            caption: 'Footer and contact information.',
            desktop: {
              src: '/projects/ucisom/ucisom-footer.png',
              alt: 'Desktop UC Irvine School of Medicine footer with contact information in columns',
            },
            mobile: {
              src: '/projects/ucisom/ucisom-footer_mobile.png',
              alt: 'Mobile UC Irvine School of Medicine footer with contact information stacked vertically',
            },
          },
          {
            caption: 'Education navigation with admissions and program pathways.',
            desktop: {
              src: '/projects/ucisom/ucisom-mega-nav.png',
              alt: 'Desktop UC Irvine School of Medicine Education mega menu with program links',
            },
            mobile: {
              src: '/projects/ucisom/ucisom-mega-nav_mobile.png',
              alt: 'Mobile UC Irvine School of Medicine Education accordion with program links',
            },
          },
          {
            caption: 'Newsroom press releases and media contacts.',
            desktop: {
              src: '/projects/ucisom/ucisom-news-room.png',
              alt: 'Desktop UC Irvine School of Medicine Newsroom with press releases and media contacts',
            },
            mobile: {
              src: '/projects/ucisom/ucisom-news-room_mobile.png',
              alt: 'Mobile UC Irvine School of Medicine Newsroom with press releases in one column',
            },
          },
        ],
        liveUrl: 'https://medschool.uci.edu/',
      },
      resumeHighlight:
        'Led frontend development and data structure design for UC Irvine’s School of Medicine website, aligning the Drupal and React implementation with an existing component library.',
      technologies: ['Drupal', 'React'],
      tags: ['web', 'cms', 'leadership'],
    },
    {
      id: 'ihsaa',
      projectOrigin: 'Greenfield',
      heroImage: {
        src: '/projects/ihsaa/ihsaa.png',
        alt: 'Indiana High School Athletic Association homepage',
      },
      name: 'Indiana High School Athletic Association',
      client: 'Indiana High School Athletic Association',
      type: 'Website',
      description:
        'I led the Drupal website and embedded React tournament app, integrating MaxPreps data. Drupal Views and query-string routing let visitors switch tournament content without a full-page reload and share links to specific tournaments.',
      modal: {
        overview:
          'The IHSAA site brings together tournament coverage and year-round resources for Indiana high school athletics. Visitors can browse sports and schools, follow tournament schedules and results, and share a link to a specific tournament.',
        contribution:
          'I led development of the Drupal website and embedded React tournament application. Integrating MaxPreps schedules, results, and statistics involved challenges around tournament data entry, routing, and consistency. I used Drupal Views with query-string routing to filter tournament content without reloading the full page.',
        highlights: [
          'Integrated MaxPreps tournament schedules, results, and statistics into the React experience.',
          'Used Drupal Views filters and query-string routing so visitors could change tournament content without a full-page reload.',
          'Made tournament-specific URLs shareable while keeping the displayed content consistent with the selected route.',
        ],
        screenshots: [
          {
            caption:
              'Homepage with featured athletics news and pathways to association resources.',
            desktop: {
              src: '/projects/ihsaa/ihsaa.png',
              alt: 'Desktop IHSAA homepage with featured athletics news',
            },
            mobile: {
              src: '/projects/ihsaa/ihsaa_mobile.png',
              alt: 'Mobile IHSAA homepage with compact navigation and stacked featured content',
            },
          },
          {
            caption:
              'Boys tennis tournament page with Individual and Team tabs and a year selector.',
            desktop: {
              src: '/projects/ihsaa/ihsaa-tournament.png',
              alt: 'Desktop IHSAA boys tennis tournament page with Individual and Team tabs and a year selector',
            },
            mobile: {
              src: '/projects/ihsaa/ihsaa-tournament_mobile.png',
              alt: 'Mobile IHSAA boys tennis tournament page with Individual and Team tabs above a year selector',
            },
          },
          {
            caption:
              'News page with category and sport filters above article cards.',
            desktop: {
              src: '/projects/ihsaa/ihsaa-news.png',
              alt: 'Desktop IHSAA news page with filters and a row of article cards',
            },
            mobile: {
              src: '/projects/ihsaa/ihsaa-news_mobile.png',
              alt: 'Mobile IHSAA news page with vertically stacked filters above an article card',
            },
          },
        ],
        liveUrl: 'https://www.ihsaa.org/',
      },
      resumeHighlight:
        'Led a Drupal website and embedded React tournament app, integrating MaxPreps data and using Drupal Views with query-string routing for seamless filtering and shareable tournament URLs.',
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
          {
            caption: 'Homepage promotion for the 2026–27 Zhang Broadway season.',
            desktop: {
              src: '/projects/miller/miller.png',
              alt: 'Desktop Miller Auditorium homepage promoting Zhang Broadway Your Way',
            },
            mobile: {
              src: '/projects/miller/miller_mobile.png',
              alt: 'Mobile Miller Auditorium homepage with menu button and Zhang Broadway promotion',
            },
          },
          {
            caption: 'Featured performances with event dates and ticket links.',
            desktop: {
              src: '/projects/miller/miller-featured.png',
              alt: 'Desktop Miller Auditorium Featured section with three performance cards',
            },
            mobile: {
              src: '/projects/miller/miller-featured_mobile.png',
              alt: 'Mobile Miller Auditorium Featured section with a performance card and ticket link',
            },
          },
          {
            caption: 'Show page for INVINCIBLE: A Glorious Tribute to Michael Jackson.',
            desktop: {
              src: '/projects/miller/miller-show.png',
              alt: 'Desktop Miller Auditorium show page with INVINCIBLE artwork, title, and event details',
            },
            mobile: {
              src: '/projects/miller/miller-show_mobile.png',
              alt: 'Mobile Miller Auditorium show page with INVINCIBLE artwork and title',
            },
          },
          {
            caption: 'About page and auditorium mission.',
            desktop: {
              src: '/projects/miller/miller-about.png',
              alt: 'Desktop Miller Auditorium About page and mission',
            },
            mobile: {
              src: '/projects/miller/miller-about_mobile.png',
              alt: 'Mobile Miller Auditorium About page with mission text in a single column',
            },
          },
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
            alt: 'Fly Lansing homepage with flight search and navigation for flights, parking, and airport information',
            caption:
              'Fly Lansing homepage with flight search and traveler navigation.',
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
            alt: 'Williamston Theatre homepage featuring The One Good Thing with Learn More and Buy Tickets links',
            caption:
              'Williamston Theatre homepage featuring a current production and ticket links.',
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
            alt: 'Michigan Potatoes public homepage featuring a grilled potato recipe',
            caption:
              'Michigan Potatoes’ public recipe site. This image does not show the conference registration experience.',
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
            alt: 'MSU Office of Financial Aid page showing Billing and Payments guidance and cost-of-attendance links',
            caption:
              'Graduate Manage Your Aid page with billing guidance and cost-of-attendance resources.',
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
  vmlyr: [
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
        'I inherited and maintained a Black Friday crowd-planning tool used across 2,500+ Walmart stores. Managers dragged icons onto SVG store maps, then saved, revised, and submitted plans for compliance approval.',
      modal: {
        overview:
          'Managers used the tool to prepare store-specific crowd plans for Black Friday sales events. They could place icons on a store map, save the plan, return to edit it, and pass it through an approval process for compliance.',
        contribution:
          'I inherited the existing Drupal and Vue application for maintenance and subsequent feature enhancements. The tool used an SVG-based drag-and-drop interface and stored icon coordinates in JSON so plans could be recalled and edited.',
        highlights: [
          'Used SVG graphics for interactive store maps and draggable planning icons.',
          'Saved icon positions as JSON coordinates so managers could reopen and revise a plan.',
          'Supported an approval process to check plans for compliance before use.',
        ],
        screenshots: [],
      },
      resumeHighlight:
        'Maintained and enhanced an inherited Drupal and Vue crowd-planning tool used across 2,500+ Walmart stores, with SVG drag-and-drop maps, JSON-based plan editing, and compliance approval.',
      technologies: ['Drupal', 'Vue', 'SVG'],
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
        'I built Quick Lane’s store locator as a React app embedded in Adobe AEM, connecting address searches to nearby service centers on Google Maps with custom pins. It was my first React project.',
      resumeHighlight:
        'Built Quick Lane’s React store locator within Adobe AEM, integrating address search and Google Maps with custom pins for nearby service centers.',
      technologies: ['React', 'Google Maps', 'Adobe AEM'],
      tags: ['web', 'cms'],
    },
  ],
  'north-american-color': [],
  'honeysett-design': [
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
}
