// Single source of truth for editable site content + asset paths.
// Edit the strings below to update the site — no component changes needed.
// Anything marked TODO is a placeholder waiting on a real URL or detail.

// Custom domain (www.serbres.com) serves from the root — no base path needed.
export const BASE_PATH = "";

/** Prefix a public asset with the deploy base path. */
export const asset = (path: string) => `${BASE_PATH}${path}`;

// ---------------------------------------------------------------------------
// Core identity + global links
// ---------------------------------------------------------------------------
export const site = {
  name: "Sammie Robinson",
  brand: "SERBRES",
  roles: ["Builder", "Designer", "Worldbuilder"],
  greeting: "Hey, I'm Sammie",
  tagline: "SERBRES is where everything I build comes together.",
  // One-line framing used on the home hub.
  intro:
    "One creator, many properties, one mark — the umbrella over my fiction, faith, craft, and tools.",
  cta: { label: "Read my story", href: "/about/" },
  links: {
    email: "srobinson3rd@gmail.com",
    github: "https://github.com/TheSerbres",
    youtube: "https://www.youtube.com/@serbres",
    twitter: "",
    linkedin: "https://www.linkedin.com/in/sammie-robinson/",
  },
} as const;

// ---------------------------------------------------------------------------
// /about — personal story (long-form narrative)
// ---------------------------------------------------------------------------
export const story = {
  // The big opening line on the About page.
  lead: "One way of working, behind everything I make.",
  paragraphs: [
    "I'm Sammie Robinson. SERBRES is the name I put over everything I build. It comes from Cerberus — the three-headed guardian — reshaped into a palindrome (S-E-R-B-R-E-S) to mark three generations of Sammies and a pull toward symmetry and structure.",
    "What ties my work together isn't a single medium; it's a method. I build systems whose real value is defended truth, compose them deliberately, and make sure every piece can scale into something larger. Whether it's a sci-fi universe, a digital-products shop, or a ratings app, the discipline is the same.",
    "That guardian idea matters to me. A mark should stand for something — so each property under SERBRES has to earn the name by being built honestly and made to last. One creator, many properties, one mark.",
  ],
} as const;

// ---------------------------------------------------------------------------
// /about — online CV
// TODO: replace the placeholder timeline rows with your real history.
// ---------------------------------------------------------------------------
export const cv = {
  // What I do, at a glance.
  focus: [
    {
      title: "Worldbuilding & Fiction",
      desc: "Original universes, long-form stories, and the lore systems that hold them together.",
    },
    {
      title: "Design & Digital Products",
      desc: "Blender assets, maps, and SVG designs — plus teaching the process behind them.",
    },
    {
      title: "Software & Tools",
      desc: "Web apps built to turn ideas into things people can actually use.",
    },
  ],
  // Skills / tools — shown as tags.
  skills: [
    "Team Leadership",
    "Software Engineering",
    "C#",
    "Angular",
    "SQL",
    "TypeScript",
    "Business Intelligence",
    "Data Visualization",
    "Web Development",
    "Blender",
    "SVG / Vector Design",
    "Cartography",
    "Worldbuilding",
    "Writing",
    "Video Editing",
    "Claude Code",
  ],
} as const;

// ---------------------------------------------------------------------------
// /about — the journey (story-focused, chronological, oldest → newest)
// Each chapter is a beat in the story. `roles` and `education` hold the formal
// résumé details revealed behind an expander. Drop a photo in /public/about and
// point the matching `image.src` at it — until the file exists, a captioned
// placeholder shows in its place.
// ---------------------------------------------------------------------------
export const journey = [
  {
    id: "second-chance",
    era: "2009",
    title: "A label, and a second chance",
    narrative: [
      "As a teenager I got into trouble. The system labeled me an at-risk youth — which, stripped of the stigma, really just meant that with the right intervention I could still get onto a good path.",
      "That intervention came through the Valley of the Sun YMCA. Its Evening Reporting Center — a detention-alternative program run with the behavioral-health provider PSA Art Awakenings — gave me mentors and a room full of people fighting the same fight. I finished the program, and then they hired me back as a paid graduate to help run it.",
    ],
    images: [
      {
        src: "/about/dream-center.jpg",
        alt: "The Dream Center",
        caption: "The Dream Center — where the turnaround started.",
      },
    ],
    roles: [
      {
        title: "Program Assistant",
        org: "Valley of the Sun YMCA",
        type: "Seasonal",
        period: "Jun 2009 – Aug 2009",
        location: "Greater Phoenix Area",
        desc: "As a senior in high school, assisted the Program Coordinator — preparing curriculum materials for weekly lesson plans and tracking, monitoring, and evaluating participant performance while serving as a peer mentor.",
        skills: [
          "Public Relations",
          "Community Outreach",
          "Event Planning",
          "Fundraising",
          "Nonprofits",
          "Microsoft Office",
        ],
      },
    ],
  },
  {
    id: "first-to-graduate",
    era: "2008 – 2009",
    title: "First in my family to graduate",
    narrative: [
      "I moved around to get there — my first two years at Cortez High School, my junior year at Trevor Brown, and then Cactus High School, where I finally walked the stage. I was the first of my siblings to earn a diploma. We graduated in the Cardinals' stadium in Glendale, and crossing that stage felt like proof that the redirect had taken hold.",
    ],
    education: [
      {
        school: "Cactus High School",
        credential: "High School Diploma",
        period: "2008 – 2009",
        detail:
          "After two years at Cortez High School and a junior year at Trevor Brown, transferred to Cactus to finish and graduate.",
      },
    ],
  },
  {
    id: "on-my-own",
    era: "2010",
    title: "Standing on my own",
    narrative: [
      "Independence arrived early, and I learned to put work first. My first real job was at Blockbuster — running the register, taking care of customers, keeping inventory straight, and helping train the new hires.",
      "Through all of it I stayed in school, changing my major more than once because I always wanted more knowledge — Communications one stretch, Political Science the next. Political Science took me the furthest: I joined Model United Nations and traveled to conferences in Chicago and Santa Barbara, learning to research a position, argue it, and find common ground with a room full of strangers.",
    ],
    images: [
      {
        src: "/about/chicago.jpg",
        alt: "At Cloud Gate in Millennium Park, Chicago, for a Model United Nations conference",
        caption: "Chicago for Model United Nations — Cloud Gate in Millennium Park.",
      },
    ],
    banner: {
      src: "/about/mun.jpg",
      alt: "A Model United Nations conference session with international flags at the front of the hall",
      caption: "Inside the hall — a Model United Nations conference in session.",
    },
    roles: [
      {
        title: "Customer Service Representative",
        org: "Blockbuster",
        period: "May 2010 – Dec 2010",
        location: "Greater Phoenix Area",
        desc: "Handled cash-register and customer transactions, resolved customer needs and concerns, kept inventory, and assisted in training and developing new employees.",
        skills: ["Customer Service", "Training"],
      },
    ],
  },
  {
    id: "giving-it-back",
    era: "2011 – 2013",
    title: "Giving it back",
    narrative: [
      "Then I went back — this time to work for Meghan McGilvra, the mentor who had run the very programs that turned me around. Returning to the Valley of the Sun YMCA as a Case Manager and Program Coordinator let me do for other kids what someone once did for me.",
      "I carried a caseload of at-risk youth and worked to clear every barrier between them and their success. I also ran programs end to end — planning fundraising events and community-service projects, recruiting volunteers from schools and community organizations, and managing budgets against contract requirements. I spoke at Strong Kids Campaign and Heritage Club events, telling the story from the inside.",
    ],
    logo: {
      src: "/about/ymca.png",
      alt: "The Y — YMCA logo",
      themed: true,
    },
    banner: {
      src: "/about/camp.jpg",
      alt: "Camp with the Valley of the Sun YMCA",
      caption: "Back at camp with the Valley of the Sun YMCA.",
    },
    link: {
      href: "https://www.facebook.com/sammie.robinson.984",
      label: "View on Facebook",
      icon: "facebook",
    },
    roles: [
      {
        title: "Case Manager / Program Coordinator",
        org: "Valley of the Sun YMCA",
        type: "Full-time",
        period: "Jan 2011 – Dec 2013",
        location: "Greater Phoenix Area",
        desc: "Maintained a caseload of at-risk youth and worked to remove barriers to their success. Coordinated multiple programs — planning fundraising events and community-service projects, recruiting student and adult volunteers, and maintaining budgets in line with contract requirements.",
        skills: [
          "Public Speaking",
          "Program Development",
          "Fundraising",
          "Volunteer Management",
          "Community Outreach",
          "Event Planning",
          "Nonprofits",
          "Training",
        ],
      },
    ],
  },
  {
    id: "learning-to-sell",
    era: "2013 – 2015",
    title: "Learning to sell",
    narrative: [
      "I wanted to understand how business actually works, so I went to learn sales at State Farm. On the Customer Care Center team I earned and kept a Property & Casualty license across several states and spent my days on inbound calls — quoting and securing new policies and helping policyholders with information, advice, and changes.",
      "It taught me how to listen, how to earn trust quickly, and how to be genuinely useful to someone in a five-minute window.",
    ],
    logo: {
      src: "/about/statefarm.png",
      alt: "State Farm logo",
    },
    roles: [
      {
        title: "CCC Sales Representative",
        org: "State Farm",
        period: "Oct 2013 – Nov 2015",
        location: "Greater Phoenix Area",
        desc: "As part of the Customer Care Center sales team, obtained and maintained a Property & Casualty license in multiple states, answered inbound calls to quote and secure new policies, and assisted policyholders with information, advice, and policy changes.",
        skills: ["Sales", "Property & Casualty Insurance", "Customer Service"],
      },
    ],
  },
  {
    id: "all-in-on-tech",
    era: "2015 – 2018",
    title: "All in on a new career",
    narrative: [
      "While I was at State Farm I started Year Up — a tuition-free program that puts young adults through a year of technical training and a real internship. For a while I was Mr. No-Days-Off, stacking school on top of full-time work. Eventually I bet on myself, went all in on the program, and saw it through to the internship.",
      "GateWay Community College came first — a Computer Information Systems certificate, a 3.8 GPA, and my first real grounding in web development, Java, and object-oriented programming. The Year Up internship landed me at American Express Global Business Travel as a full-stack engineering intern, where I learned to build a feature end to end alongside fellow interns and senior developers. I kept going afterward and finished my Associate of Applied Science in CIS at Phoenix College.",
    ],
    banner: {
      src: "/about/keyboard.jpg",
      alt: "A backlit laptop keyboard",
      caption: "All in on the work — learning to build software, one keystroke at a time.",
    },
    roles: [
      {
        title: "Software Development Intern",
        org: "American Express Global Business Travel",
        type: "Internship",
        period: "Jan 2016 – Jul 2016",
        location: "Greater Phoenix Area",
        desc: "A full-stack engineering intern working across front-end and back-end on a team of interns and senior developers — where I learned to build a feature end to end.",
        skills: ["Java", "HTML", "SQL", "JSON", "Apache Tomcat"],
      },
    ],
    education: [
      {
        school: "GateWay Community College",
        credential: "Certificate of Completion, Computer Information Systems",
        period: "2015 – 2016",
        grade: "3.8 GPA",
        detail:
          "Web Development, Java I & II, Object-Oriented Programming, Linux, and Microsoft Office.",
      },
      {
        school: "Phoenix College",
        credential: "Associate in Applied Science, Computer Information Systems",
        period: "2016 – 2018",
        detail:
          "C#, Local Area Networks, Accounting, and Business Communications.",
      },
    ],
  },
  {
    id: "bridge",
    era: "2016",
    title: "A bridge to the field",
    narrative: [
      "New degree in hand, I took a temporary role at The Antigua Group to keep moving while I looked for work in software.",
    ],
    roles: [
      {
        title: "Inside Sales Assistant",
        org: "The Antigua Group, Inc.",
        type: "Temporary",
        period: "Jul 2016 – Dec 2016",
        location: "Greater Phoenix Area",
        desc: "A temporary sales-team assistant — confirming and entering sales information into the company database, processing product returns and credit memos, and providing fast help with customer questions and requests.",
        skills: ["Customer Service", "Microsoft Excel", "Microsoft Office"],
      },
    ],
  },
  {
    id: "automon",
    era: "2016 – 2025",
    title: "Finding a home at AutoMon",
    narrative: [
      "AutoMon is where it all came together — a small company full of good people who genuinely celebrated each other's wins. The kind of place where you build long relationships and grow.",
      "I started on the customer-facing support team, tracking down the root cause of software issues. From there I stepped into leading and training the support team, then started writing code on the development team through paired programming and bug fixes. When my predecessor moved up, leadership took me to dinner at Houston's and asked me to run the support department. A few years later I made the jump I had been working toward and became a full-time Software Engineer — building in C#, Angular, and SQL, with a real focus on business intelligence, dashboards, and visualization.",
    ],
    logo: {
      src: "/about/automon.png",
      alt: "AutoMon logo",
    },
    roles: [
      {
        title: "Software Engineer",
        org: "AutoMon",
        type: "Full-time",
        period: "May 2021 – Feb 2025",
        desc: "Full-time software engineer building in C# and Angular against SQL, with a focus on business intelligence, dashboards, and data visualization.",
        skills: [
          "C#",
          "Angular",
          "SQL",
          "Business Intelligence (BI)",
          "Dashboards",
          "Data Visualization",
        ],
      },
      {
        title: "Software Support Manager",
        org: "AutoMon",
        period: "Mar 2020 – May 2021",
        desc: "Managed and trained a team of support representatives and developers, coordinating with department heads to deliver the best overall experience for customers and staff.",
        skills: [
          "Team Management",
          "Team Leadership",
          "Escalation Resolution",
          "Customer Service",
          "Training",
        ],
      },
      {
        title: "Software Support Developer",
        org: "AutoMon",
        period: "Jul 2019 – May 2021",
        desc: "Joined the development team — learning the codebase, shipping small bug fixes, and pairing with mid-level and senior developers.",
        skills: ["C#", "Angular", "SQL", "JSON"],
      },
      {
        title: "Software Support Team Lead",
        org: "AutoMon",
        period: "Feb 2019 – Mar 2020",
        desc: "Helped manage and train a team of software support representatives.",
        skills: ["Team Leadership", "Customer Service", "Training"],
      },
      {
        title: "Software Support Representative",
        org: "AutoMon",
        period: "Dec 2016 – Feb 2019",
        desc: "On a customer-facing support team, handled software requests by identifying root causes, implementing fixes, and escalating priority issues per client specifications.",
        skills: ["SQL", "Customer Service", "Microsoft Excel"],
      },
    ],
  },
  {
    id: "catalis",
    era: "2024 – Present",
    title: "Leading the build",
    narrative: [
      "CATALIS acquired AutoMon, so this chapter is really a continuation of the last one. When the department's leadership turned over almost entirely, I was brought in as part of a brand-new management team — work I had effectively been doing in the AutoMon world for years. Today I'm Manager of Software Development: I lead delivery, mentor a development team, and keep building the data and visualization work I love.",
    ],
    logo: {
      src: "/about/catalis.png",
      alt: "CATALIS logo",
      maxW: "max-w-[8rem]",
    },
    roles: [
      {
        title: "Manager of Software Development",
        org: "CATALIS",
        type: "Full-time",
        period: "Aug 2024 – Present",
        desc: "Lead and manage a software development team — owning delivery, team leadership, and mentorship — and partner across the organization on business-intelligence and visualization work.",
        skills: [
          "Team Management",
          "Team Leadership",
          "Escalation Resolution",
          "Business Intelligence (BI)",
          "Dashboards",
          "Data Visualization",
        ],
      },
    ],
  },
] as const;

// ---------------------------------------------------------------------------
// Brands — each gets its own page at /<slug>/
// The home grid + nav read name/tagline/blurb; brand pages read the full object.
// ---------------------------------------------------------------------------

export const canonGenie = {
  slug: "canon-genie",
  name: "The Canon Genie",
  logo: "/brands/canon-genie.png",
  tagline: "Finding truth through fiction.",
  blurb:
    "Worldbuilding lore and the craft behind it — a channel in two modes, plus Blender assets, maps, and SVG designs. Home of Green Apologetics.",
  description: [
    "The Canon Genie is my craft brand — finding truth through fiction. The name plays on canon, the lore that holds a world together, and the genie in its lamp.",
    "The channel runs in two modes. In Cannon mode we're shot from location to location across the canon, telling the story of the worlds. In Lamp mode the genie is out teaching the craft — mapmaking, editing, and the process behind it all.",
    "It's also where the things I make to build worlds become things you can use: Blender assets, hand-drawn maps, and SVG designs, sold ready to use.",
  ],
  // The channel's two modes.
  modes: [
    {
      name: "Cannon",
      label: "Canon · Lore",
      icon: "/brands/canon-genie-cannon.png",
      desc: "Shot from location to location across the canon, telling the story of the worlds.",
    },
    {
      name: "Lamp",
      label: "Learning",
      icon: "/brands/canon-genie-lamp.png",
      desc: "Out of the lamp to teach the craft — mapmaking, editing, and the creative process, step by step.",
    },
  ],
  youtube: "https://www.youtube.com/@TheCanonGenie",
  etsy: {
    shopUrl: "https://thecanongenie.etsy.com",
    // TODO: curated featured listings. Add a thumbnail to /public and point `image` at it.
    listings: [
      {
        title: "TODO — listing title",
        price: "",
        image: "", // e.g. "/listings/asset-1.jpg"
        href: "", // the Etsy listing URL
      },
      {
        title: "TODO — listing title",
        price: "",
        image: "",
        href: "",
      },
      {
        title: "TODO — listing title",
        price: "",
        image: "",
        href: "",
      },
    ],
  },
  // Green Apologetics lives under The Canon Genie.
  subBrand: {
    name: "Green Apologetics",
    tagline: "Truth. Practice. Defense.",
    description:
      "A faith brand built on three pillars — making the case for what's true, living it out, and defending it well.",
    pillars: [
      { name: "Truth", desc: "Grounding belief in what is actually true." },
      { name: "Practice", desc: "Living it out, not just arguing it." },
      { name: "Defense", desc: "Making the case clearly and honestly." },
    ],
  },
} as const;

export const arbitraryLife = {
  slug: "arbitrary-life",
  name: "Arbitrary Life",
  logo: "/brands/arbitrary-life.svg",
  tagline: "An original science-fiction space opera.",
  blurb:
    "A sci-fi universe years in the worldbuilding — books first, with room to grow into YouTube graphic novels.",
  description: [
    "Arbitrary Life is an original science-fiction space opera I've been worldbuilding for years. The heart of it is the books — long-form stories set in a universe with its own history, factions, and rules.",
    "It's built to expand. The same world is made to scale into YouTube graphic novels and other visual formats as the story grows.",
  ],
  // `status` is optional — set e.g. "Available" / "Coming soon" to show a badge.
  // `href` makes a title link out (store / preview page).
  books: [
    {
      title: "Arbitrary Life I: Merciless Times",
      desc: "You cannot face the world without first facing yourself.",
      cover: "/books/merciless-times.png",
      status: "",
      href: "",
    },
    {
      title: "Arbitrary Life II: The Gifted",
      desc: "Overcome from within and you will see real change.",
      cover: "/books/the-gifted.png",
      status: "",
      href: "",
    },
    {
      title: "Arbitrary Life III: Edge of Existence",
      desc: "Self-acceptance leads to victory in all things.",
      cover: "/books/edge-of-existence.png",
      status: "",
      href: "",
    },
    {
      title: "Arbitrary Life IV: Reborn",
      desc: "Your past does not define you.",
      cover: "/books/reborn.png",
      status: "",
      href: "",
    },
    {
      title: "Arbitrary Life V: Will of the Crystal",
      desc: "Facing temptation is the true test of character.",
      cover: "/books/will-of-the-crystal.png",
      status: "",
      href: "",
    },
    {
      title: "Arbitrary Life VI: The Covenant",
      desc: "What you live for is what you die for.",
      cover: "/books/the-covenant.png",
      status: "",
      href: "",
    },
  ],
  youtube: "", // TODO: graphic-novel channel/playlist when it exists
} as const;

export const legacyBallot = {
  slug: "legacy-ballot",
  name: "Legacy Ballot",
  logo: "/brands/legacy-ballot.svg",
  tagline: "Greatness, measured — not just argued.",
  blurb:
    "A voting app that rates players by stats and accomplishments, builds objective measures, and even quantifies the narratives fans argue about.",
  description: [
    "Legacy Ballot flips sports debates around. Instead of rating your favorite player, it starts from stats and accomplishments and builds objective measures of greatness.",
    "You create your own ballot, compare it with others, and endorse the ballots you think got it right. It even quantifies the narratives — turning arguments like Skip Bayless's \"6 for 6 for 6\" (Jordan going undefeated in the Finals) or LeBron's run of consecutive Finals appearances into measurable inputs.",
  ],
  features: [
    {
      title: "Build your ballot",
      desc: "Rank players using stats and accomplishments, not vibes.",
    },
    {
      title: "Compare & endorse",
      desc: "See how your ballot stacks up against others, and back the ones you trust.",
    },
    {
      title: "Quantify the narrative",
      desc: "Turn talking points like \"6 for 6 for 6\" into measurable, comparable inputs.",
    },
  ],
  status: "In development",
  href: "", // TODO: app URL or waitlist when live
} as const;

// Order shown in the home grid + nav.
export const brands = [canonGenie, arbitraryLife, legacyBallot] as const;
