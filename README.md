# Tyler Samuel Lim — portfolio

Source repository: [tysalim/tysalim.github.io](https://github.com/tysalim/tysalim.github.io)

A minimal dark portfolio built with HTML, CSS, and JavaScript. No dependencies or build step.

## Preview

Open this folder in Cursor or VS Code. In its terminal, run:

```sh
npm run dev
```

Visit http://localhost:4173. Refresh after saving edits. You can also open `index.html` directly.

## Edit

The hero photo is in `index.html`, inside `.hero-portrait`. It currently uses a Google Drive thumbnail URL because the original image could not be downloaded during editing; the file must be shared with permission for visitors to view it. For dependable hosting, put a copy in `assets/tyler-portrait.jpg` and set the image `src` to `./assets/tyler-portrait.jpg`.

The portrait frame has a 3:4 aspect ratio. In `styles.css`, `--portrait-x` and `--portrait-y` control the crop. The initial horizontal position is 50%; exact face alignment could not be checked without access to the original photo. The frame preserves the photo's proportions using `object-fit: cover`.

- **content.js**: biography, social links, education, debate experiences, achievements, tech experiences, and projects.
- **styles.css**: colors, spacing, typography, responsive layouts.
- **index.html**: hero headline, section introductions, and contact link.
- **app.js**: tabs, current/former filters, and card rendering.

Education logos are configured with `logo` on each school entry in `content.js`. They currently use each school's website icon through Google's favicon service, so loading them requires an internet connection. Replace the URL with an HTTPS-hosted logo to change it. Initials appear as a fallback if an image cannot load.

Each experience has `status: "current"` or `status: "former"`. Each card accepts a `description` array and optional `links: [{ label: "View source", url: "https://…" }]`. Add an optional `date` string to experience and education entries. Copy an existing entry to add another card. Text is escaped before rendering.

### Card images

The WSDC Philippines and Hart House Debating Club cards use the local team photos `assets/wsdc-team.jpg` and `assets/hhdc-team.jpg`. Both are present in the project, displayed in natural color, and cropped at 50% horizontally and 30% vertically. Original copies are retained in `assets/`. Include the entire assets folder when publishing.

Experience and project cards use a two-column Notion-style gallery on desktop and a single column on mobile. Only cards with real photos display a cover; cards using the illustrated placeholder are rendered without an image. Clicking the cover or text expands its description.

To replace a placeholder, add your image to `assets/`, then change the corresponding entry in `content.js`:

```js
image: "./assets/my-project.jpg",
imageAlt: "A screenshot of my project",
coverTheme: "sage",
```

Supported image formats: PNG, JPG, JPEG, WebP, and SVG. HTTPS image URLs also work. The cover themes (`sage`, `lavender`, `sand`, `slate`) vary the placeholder color and crop. Leaving out `image`, using the illustrated placeholder, or an image failing to load produces a text-only card with no blank image area.

## Content status

### Areas of work and résumés

Debate achievements are nested in each experience's `achievements` array and appear when that card expands. Hart House Debating Club begins in September 2026. Independent judging awards are grouped in an Adjudication card rather than attributed to a school or national team. The debate web CV uses the same grouping.

The three tabs are **Debate**, **Tech**, and **Community**. Debate experience follows the organizational affiliations in the debate CV (Xavier School Debate Team and WSDC Philippines). Tech experience contains Delta Institute and TMI Socratic Tutor Developer. Civic Innovator Fellow, FSAT Education Associate, Xigma Mathematics Club, TEDx, and the Xavier tournament are grouped under Community. Community also contains the two case-competition initiatives.

All/Current/Former filters are available in each tab. `status: "unspecified"` keeps roles with unconfirmed dates/status visible under All without assigning them to Current or Former. Delta Institute and FSAT descriptions are intentionally brief until their exact duties and dates are supplied.

Each tab now links to the original uploaded PDF. Debate uses `assets/resumes/debate-cv.pdf`. Tech and Community use the same uploaded `assets/resumes/tyler-resume.pdf`, opening at page 3 and page 1 respectively. The original combined PDF is preserved unchanged. Include `assets/resumes/` in every deployment. The old web résumé pages remain available but are no longer linked from the tabs. Change résumé links in `content.js`.

Content is based on `Tyler Lim - Resume (11).pdf` and `Tyler Lim - Debate CV (2).pdf`, received November 16, 2026. LinkedIn could not be read; its supplied URL is included as a link. Current coaching/adjudication and the Socratic tutor also draw on recently shared work. Education preserves “Computer Science Admission Stream.” Competition proposals are labeled as concepts. Where the CVs differ on WSDC ranking and ASDC field size, the detailed debate CV is preferred or the disputed statistic is omitted. The two original uploaded CV PDFs are included under `assets/resumes/` for the requested résumé links.

## GitHub

This folder is connected to `https://github.com/tysalim/tysalim.github.io.git` on the `main` branch.

For future updates, run from this folder:

```sh
git add .
git commit -m "Update portfolio"
git push
```

Keep source CVs in `private-sources/` if needed; that directory is ignored.

## Hosting later

This is a static site. Upload `index.html`, `styles.css`, `content.js`, `app.js`, `favicon.svg`, and the **entire `assets/` folder** to a static host, or use GitHub Pages from the repository root once the content is ready. Preserve the folder structure so card covers load. Relative asset paths work under a repository subdirectory. Hosting has not been enabled.

## Accessibility

Native expandable cards support Enter/Space. Track tabs support Left/Right and Home/End. Filter buttons expose their pressed state. The site includes visible focus states, a skip link, reduced-motion support, and layouts for narrow screens.

Experience and project cards show the organization and optional date as tags above the title. Left-side icons and bottom topic tags are not rendered. The `icon` and `tags` values remain editable data without appearing in the card layout.

The visual palette uses near-black backgrounds, neutral grey text and borders, and deep-blue tabs, filters, metadata tags, and buttons. Lighter blue link text keeps small text readable on the dark surfaces. Theme variables are at the top of `styles.css`.
