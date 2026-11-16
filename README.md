# Tyler Samuel Lim — portfolio

A minimal dark portfolio built with HTML, CSS, and JavaScript. No dependencies or build step.

## Preview

Open this folder in Cursor or VS Code. In its terminal, run:

```sh
npm run dev
```

Visit http://localhost:4173. Refresh after saving edits. You can also open `index.html` directly.

## Edit

- **content.js**: biography, social links, education, debate experiences, achievements, tech experiences, and projects.
- **styles.css**: colors, spacing, typography, responsive layouts.
- **index.html**: hero headline, section introductions, and contact link.
- **app.js**: tabs, current/former filters, and card rendering.

Each experience has `status: "current"` or `status: "former"`. Each card accepts a `description` array and optional `links: [{ label: "View source", url: "https://…" }]`. Add an optional `date` string to experience and education entries. Copy an existing entry to add another card. Text is escaped before rendering.

## Content status

Content is based on `Tyler Lim - Resume (11).pdf` and `Tyler Lim - Debate CV (2).pdf`, received November 16, 2026. LinkedIn could not be read; its supplied URL is included as a link. Current coaching/adjudication and the Socratic tutor also draw on recently shared work. Education preserves “Computer Science Admission Stream.” Competition proposals are labeled as concepts. Where the CVs differ on WSDC ranking and ASDC field size, the detailed debate CV is preferred or the disputed statistic is omitted. Source CVs, street address, and phone number are not included in the repository.

## GitHub

The folder is a local Git repository on the `main` branch. A remote repository must still be created and connected with authenticated GitHub access.

With GitHub CLI installed and signed in, create and push a **private** repository:

```sh
gh repo create tyler-portfolio --private --source=. --remote=origin --push
```

Alternatively create an empty repository at https://github.com/new, then use the exact URL GitHub returns:

```sh
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

Do not add an unrelated remote or force-push an existing repository. Keep source CVs in `private-sources/` if needed; that directory is ignored. Nothing has been published publicly.

## Hosting later

This is a static site. Upload `index.html`, `styles.css`, `content.js`, `app.js`, and `favicon.svg` to a static host, or use GitHub Pages from the repository root once the content is ready. Relative asset paths work under a repository subdirectory. Hosting has not been enabled.

## Accessibility

Native expandable cards support Enter/Space. Track tabs support Left/Right and Home/End. Filter buttons expose their pressed state. The site includes visible focus states, a skip link, reduced-motion support, and layouts for narrow screens.
