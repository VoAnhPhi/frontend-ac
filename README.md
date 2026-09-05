# FE Phi Vo — Appscyclone

A Figma-to-code exercise for the FE Internship program. The project uses vanilla HTML, CSS, and JavaScript, with no React, Tailwind, or UI library.

## Run the project

Node.js 18 or later is required. From the `fe-phi-vo` directory, run:

```sh
npm install
npm start
```

Open [http://127.0.0.1:4173](http://127.0.0.1:4173). `npm install` only installs Prettier for code formatting; the website has no runtime dependencies. VS Code Live Server can also be used instead of `npm start`.

`scripts/serve.mjs` is a local static server. It only serves project files and does not include an API, database, or real registration processing.

## Pages

| Page                | File                       | Figma                                                                                      |
| ------------------- | -------------------------- | ------------------------------------------------------------------------------------------ |
| Home                | `index.html`               | [1:1882](https://www.figma.com/design/NubL9UeLuIJqrqJeBf0Lgd/FE-Internship?node-id=1-1882) |
| Courses             | `courses.html`             | [1:1447](https://www.figma.com/design/NubL9UeLuIJqrqJeBf0Lgd/FE-Internship?node-id=1-1447) |
| Course Details      | `courses-details.html`     | [1:1045](https://www.figma.com/design/NubL9UeLuIJqrqJeBf0Lgd/FE-Internship?node-id=1-1045) |
| Registered Students | `registered-students.html` | [1:913](https://www.figma.com/design/NubL9UeLuIJqrqJeBf0Lgd/FE-Internship?node-id=1-913)   |

The source frames are available on [Page 1:500](https://www.figma.com/design/NubL9UeLuIJqrqJeBf0Lgd/FE-Internship?node-id=1-500). Colours and typography are available in [Style 0:1](https://www.figma.com/design/NubL9UeLuIJqrqJeBf0Lgd/FE-Internship?node-id=0-1).

## Main structure

```text
fe-phi-vo/
├── *.html                 # Four website pages
├── assets/
│   ├── css/               # Tokens, shared styles, and page styles
│   ├── fonts/             # Plus Jakarta Sans
│   ├── images/            # Figma images, logos, and icons
│   └── js/main.js         # Filter, carousel, and demo form behavior
└── scripts/serve.mjs      # Local static server
```

CSS loads in this order: `tokens.css` → `shared.css` → `components/header.css` → the matching file in `css/pages/`.

## Responsive behavior and interactions

The `.container` is always centered, has a maximum width of `1360px`, and uses the viewport width minus the side gutters. The Figma reference uses a 1680px desktop frame. Tablet and mobile layouts are responsive additions because the Figma file does not provide tablet or mobile frames.

| Viewport width   | Side gutter | Content area      | Main adjustments                                                                                                                                        |
| ---------------- | ----------: | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1440px and above |        40px | Up to 1360px      | Keeps the desktop layout; the content area is 1360px at 1680px.                                                                                         |
| 1024–1439px      |        40px | `viewport - 80px` | Reduces section and card spacing for smaller desktop screens.                                                                                           |
| 768–1023px       |        24px | `viewport - 48px` | Uses smaller headings and spacing, a two-column course grid, and horizontally scrollable team and lecturer lists.                                       |
| 360–767px        |        20px | `viewport - 40px` | Uses single-column content and course grids, a single-column form, horizontally scrollable tabs, a two-column footer, and a compact header and buttons. |
| Below 360px      |        20px | `viewport - 40px` | Further compacts the header; card metadata can wrap to prevent horizontal overflow.                                                                     |

- Courses can be filtered by category. Design shows an empty state because the Figma frame does not contain a Design course card.
- FAQs and course content use `<details>` / `<summary>` and support keyboard interaction.
- The form validates input in the browser and shows a demo result only; it does not send or store real data.
- Visible focus states, a skip link, and `prefers-reduced-motion` are supported.

## Production considerations

- A backend is needed for form submission, success/error handling, and data policies.
- Videos, pagination data, carousel data, and course details for courses other than ReactJS are not available yet.
- Figma uses Centra No2, but no licensed font files are available. The project uses locally hosted Plus Jakarta Sans as a replacement.
- Do not commit tokens, Figma account details, or private asset URLs.

## Weekly checklist

### Week 01

- [x] Build Home, Courses, Course Details, and Registered Students pages.
- [x] Add reusable CSS, design tokens, local fonts, and Figma assets.
- [x] Add responsive layouts for desktop, tablet, and mobile.
- [x] Add course filtering, carousel, accordion, and form validation.
- [x] Check layouts at 1680px, 768px, and 375px.
- [x] Prepare the merge request description.

### Week 02

- [ ] Add this week's scope and acceptance criteria.
- [ ] Test the completed work and create a merge request.

## Future project checklist

Use this checklist to track the next project stages. Items are intentionally kept unchecked until they are completed.

### GitLab collaboration

- [ ] Set up project integrations when needed.
- [ ] Invite collaborators when the project needs shared access.
- [ ] Create and review merge requests for each weekly branch.
- [ ] Configure merge request approvals if the team requires them.
- [ ] Enable auto-merge when a pipeline and approval rules are in place.

### Quality and security

- [ ] Set up a GitLab CI/CD pipeline.
- [ ] Add automated linting and test checks to the pipeline.
- [ ] Enable Static Application Security Testing (SAST) when applicable.

### Deployment

- [ ] Configure a staging environment.
- [ ] Choose and configure the deployment target.
- [ ] Deploy the website.
- [ ] Verify the deployed website on desktop, tablet, and mobile.
- [ ] Configure protected environments if the project requires them.

### Documentation and maintenance

- [ ] Add screenshots or a demo link when the project is deployed.
- [ ] Record future features and remaining work.
- [ ] Document contribution guidelines if collaborators join the project.

## Git conventions

Create branches by learning week: `week-01`, `week-02`, `week-03`, and so on. Always use a two-digit week number; for example, week 1 is `week-01`.

Before committing, run:

```sh
node --check assets/js/main.js
node --check scripts/serve.mjs
npm run format:check
```
