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
    youtube: "", // TODO: SERBRES YouTube channel URL
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
  // Experience timeline — newest first. Edit freely.
  timeline: [
    {
      period: "Present",
      role: "Founder & Creator",
      org: "SERBRES",
      desc: "Building and operating every property under the SERBRES mark.",
    },
    {
      period: "2024 – Present",
      role: "Manager of Software Development",
      org: "CATALIS",
      desc: "Leading and managing a software development team — delivery, team leadership, and mentorship.",
    },
    {
      period: "2016 – 2025",
      role: "Software Engineer",
      org: "AutoMon",
      desc: "Grew over eight years from software support into engineering — support representative to team lead, support manager, then software engineer — building in C# and Angular.",
    },
    {
      period: "2016",
      role: "Inside Sales Assistant",
      org: "The Antigua Group",
      desc: "Supported the sales team — entering sales data and processing returns and credit memos.",
    },
    {
      period: "2016",
      role: "Software Development Intern",
      org: "American Express Global Business Travel",
      desc: "Full-stack engineering intern, building across front-end and back-end alongside interns and senior developers.",
    },
    {
      period: "2013 – 2015",
      role: "Sales Representative",
      org: "State Farm",
      desc: "Property & Casualty–licensed sales in the Customer Care Center — quoting and securing new policies on inbound calls.",
    },
  ],
  // Skills / tools — shown as tags.
  skills: [
    "Blender",
    "SVG / Vector Design",
    "Worldbuilding",
    "Writing",
    "Web Development",
    "Video Editing",
    "Cartography",
  ],
} as const;

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
  youtube: "", // TODO: The Canon Genie YouTube channel
  etsy: {
    // TODO: your Etsy shop URL — the "Shop all" button links here.
    shopUrl: "",
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
