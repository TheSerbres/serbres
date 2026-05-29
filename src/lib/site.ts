// Single source of truth for editable site content + asset paths.
// Edit the strings below to update the site — no component changes needed.

export const BASE_PATH = process.env.NODE_ENV === "production" ? "/serbres" : "";

/** Prefix a public asset with the deploy base path (works in dev and on GitHub Pages). */
export const asset = (path: string) => `${BASE_PATH}${path}`;

export const site = {
  name: "Sammie Robinson",
  brand: "SERBRES",
  // Short, scannable roles shown under the hero greeting.
  roles: ["Builder", "Designer", "Worldbuilder"],
  greeting: "Hey, I'm Sammie",
  // One punchy line. Keep it human.
  tagline: "SERBRES is where everything I build comes together.",
  about: [
    "The name comes from Cerberus, the three-headed guardian — reshaped into a palindrome (S-E-R-B-R-E-S) to mark three generations of Sammies and a pull toward symmetry and structure. The mark sits over every creative property I make.",
    "What ties them together is one way of working: build systems whose real value is defended truth, compose them deliberately, and make sure every piece can scale into something larger. One creator, many properties, one mark.",
  ],
  // The properties the SERBRES mark sits over. Add an href to make a card link out.
  properties: [
    {
      name: "Cannon Genie",
      desc: "Digital-products brand selling Blender assets and SVG designs.",
      href: "",
    },
    {
      name: "Green Apologetics",
      desc: "A faith brand built on three pillars — Truth, Practice, Defense.",
      href: "",
    },
    {
      name: "Arbitrary Life",
      desc: "An original science-fiction universe, years in the worldbuilding.",
      href: "",
    },
  ],
  // The accent-highlighted primary action in the hero.
  cta: { label: "Get in touch", href: "mailto:srobinson3rd@gmail.com" },
  links: {
    email: "srobinson3rd@gmail.com",
    github: "https://github.com/TheSerbres",
    // Add or remove as you like — empty strings are hidden.
    twitter: "",
    linkedin: "",
    youtube: "",
  },
} as const;
