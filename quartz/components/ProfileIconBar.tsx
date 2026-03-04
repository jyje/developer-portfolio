import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import type { ProfileIconId, ProfileIconLink } from "../config/profile"
import { profileConfig } from "../config/profile"

/** Placeholder inline icons (24x24). Replace with icomoon or another library later. */
const IconSvg: Record<ProfileIconId, (title: string) => JSX.Element> = {
  linkedin: (title) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <title>{title}</title>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  github: (title) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <title>{title}</title>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  ),
  rss: (title) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <title>{title}</title>
      <path d="M4 11a9 9 0 0 1 9 9" />
      <path d="M4 4a16 16 0 0 1 16 16" />
      <circle cx="5" cy="19" r="1" />
    </svg>
  ),
  email: (title) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <title>{title}</title>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  mastodon: (title) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <title>{title}</title>
      <path d="M21.327 8.566c0-4.339-2.843-5.61-2.843-5.61-1.433-.658-3.894-.935-6.437-.935h-.063c-2.543 0-5.004.277-6.437.935 0 0-2.843 1.272-2.843 5.61 0 .553-.048 1.829.032 2.642.218 1.216 1.063 2.38 2.325 2.653 1.227.262 2.283.468 3.736.58 2.059.2 2.471 1.217 2.471 1.217l.006.002s.327 1.01 2.596 1.01c2.269 0 2.596-1.01 2.596-1.01l.006-.002s.412-1.017 2.471-1.217c1.453-.112 2.509-.318 3.736-.58 1.262-.273 2.107-1.437 2.325-2.653.08-.813.032-2.089.032-2.642zM17.615 15.62h-2.085V9.057c0-1.074-.45-1.614-1.352-1.614-.984 0-1.484.646-1.484 1.927v3.378h-2.087V9.364c0-1.281-.5-1.927-1.485-1.927-.902 0-1.352.54-1.352 1.614v6.563H6.506V8.903c0-1.074.273-1.927.823-2.558.566-.631 1.307-.947 2.228-.947.984 0 1.735.327 2.228.947.55.631.822 1.484.822 2.558v6.717h2.085v-3.378c0-.995.032-1.756.161-2.261.18-.631.506-.947.985-1.075.479-.129 1.084-.193 1.807-.193.756 0 1.366.161 1.822.484.457.323.756.807.893 1.446.161.505.194 1.266.194 2.261v3.378z" />
    </svg>
  ),
  bluesky: (title) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <title>{title}</title>
      <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 1.352 1.286 1.864 6.312 3.436 8.054 5.063 8.714 5.063.66 0 2.402-1.627 8.714-5.063.908-.512 1.286-1.174 1.286-1.864 0-.688-.139-1.86-.902-2.203-.659-.299-1.664-.621-4.3 1.24-2.752 1.942-5.711 5.881-6.798 7.995z" />
    </svg>
  ),
  link: (title) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <title>{title}</title>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
}

interface ProfileIconBarOptions {
  /** Override config (e.g. from layout). If not set, uses profileConfig from config/profile. */
  name?: string
  title?: string
  iconLinks?: ProfileIconLink[]
}

export default ((opts?: ProfileIconBarOptions) => {
  const name = opts?.name ?? profileConfig.name
  const title = opts?.title ?? profileConfig.title
  const iconLinks = opts?.iconLinks ?? profileConfig.iconLinks

  const ProfileIconBar: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    if (!iconLinks.length) return null

    return (
      <div class={`profile-icon-bar ${displayClass ?? ""}`.trim()}>
        <div class="profile-icon-bar-heading">
          <span class="profile-icon-bar-name">{name}</span>
          <span class="profile-icon-bar-title">{title}</span>
        </div>
        <nav class="profile-icon-bar-nav" aria-label="Profile and social links">
          <ul class="profile-icon-bar-list">
            {iconLinks.map((item) => {
              const Icon = IconSvg[item.id] ?? IconSvg.link
              const isInternal = item.href.startsWith("/") && !item.href.startsWith("//")
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    target={isInternal ? undefined : "_blank"}
                    rel={isInternal ? undefined : "noopener noreferrer"}
                    class="profile-icon-bar-link"
                    title={item.label}
                    aria-label={item.label}
                  >
                    {Icon(item.label)}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    )
  }

  ProfileIconBar.css = `
.profile-icon-bar {
  padding: 1rem 0;
  margin-bottom: 1rem;
}
.profile-icon-bar-heading {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  margin-bottom: 0.75rem;
}
.profile-icon-bar-name {
  font-weight: 600;
  font-size: 1rem;
}
.profile-icon-bar-title {
  font-size: 0.8125rem;
  color: var(--gray);
}
.profile-icon-bar-nav {
  margin-top: 0.5rem;
}
.profile-icon-bar-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.profile-icon-bar-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 6px;
  color: var(--secondary);
  background: var(--lightgray);
  transition: color 0.15s ease, background 0.15s ease;
}
.profile-icon-bar-link:hover {
  color: var(--dark);
  background: var(--gray);
}
.profile-icon-bar-link svg {
  width: 1.25rem;
  height: 1.25rem;
}
`

  return ProfileIconBar
}) satisfies QuartzComponentConstructor<ProfileIconBarOptions>
