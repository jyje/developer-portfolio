/**
 * Profile and social link configuration for the left sidebar.
 * Used by ProfileIconBar. Add entries to show icon links; icon id picks the icon.
 */

export type ProfileIconId =
  | "linkedin"
  | "github"
  | "rss"
  | "email"
  | "mastodon"
  | "bluesky"
  | "link"

export interface ProfileIconLink {
  id: ProfileIconId
  href: string
  label: string
}

export interface ProfileConfig {
  name: string
  title: string
  /** Icon-first links shown in the profile icon bar (left sidebar). */
  iconLinks: ProfileIconLink[]
}

export const profileConfig: ProfileConfig = {
  name: "Jeayoung Jeon",
  title: "AI Platform Engineer",
  iconLinks: [
    { id: "linkedin", href: "https://www.linkedin.com/in/jeayoungjeon/", label: "LinkedIn" },
    { id: "github", href: "https://github.com/jyje", label: "GitHub" },
    { id: "rss", href: "/index.xml", label: "RSS" },
    // Placeholder entries – replace href/label or add more ids in ProfileIconBar
    // { id: "email", href: "mailto:you@example.com", label: "Email" },
    // { id: "link", href: "https://me.jyje.online", label: "Blog" },
  ],
}
