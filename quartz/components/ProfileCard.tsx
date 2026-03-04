import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface ProfileCardOptions {
  name?: string
  title?: string
  image?: string
  links?: Record<string, string>
}

const defaultOptions: ProfileCardOptions = {
  name: "Jeayoung Jeon",
  title: "AI Platform Engineer",
  links: {
    LinkedIn: "https://www.linkedin.com/in/jeayoungjeon/",
    GitHub: "https://github.com/jyje",
  },
}

export default ((opts?: ProfileCardOptions) => {
  const merged = { ...defaultOptions, ...opts }
  const ProfileCard: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    return (
      <div class={`profile-card ${displayClass ?? ""}`.trim()}>
        {merged.image && (
          <div class="profile-card-image">
            <img src={merged.image} alt={merged.name} width="96" height="96" />
          </div>
        )}
        <div class="profile-card-body">
          <p class="profile-card-name">{merged.name}</p>
          <p class="profile-card-title">{merged.title}</p>
          {merged.links && Object.keys(merged.links).length > 0 && (
            <ul class="profile-card-links">
              {Object.entries(merged.links).map(([text, href]) => (
                <li>
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    )
  }
  ProfileCard.css = `
.profile-card {
  padding: 1rem 0;
  margin-bottom: 1rem;
}
.profile-card-image {
  margin-bottom: 0.75rem;
}
.profile-card-image img {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
}
.profile-card-name {
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
}
.profile-card-title {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  color: var(--darkgray);
}
.profile-card-links {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.875rem;
}
.profile-card-links li + li {
  margin-top: 0.35rem;
}
.profile-card-links a {
  color: var(--secondary);
  text-decoration: none;
}
.profile-card-links a:hover {
  text-decoration: underline;
}
`
  return ProfileCard
}) satisfies QuartzComponentConstructor<ProfileCardOptions>
