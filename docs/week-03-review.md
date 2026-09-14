# Week 3 source review

Baseline: `develop`, created from `origin/master` at `6e6a6bd`. The remote master contains only the initial README. Local `master` has four additional HTML/CSS commits, so Week 3 was rebuilt without inheriting them. The existing `master`, `week-01`, and `week-02` branches remain unchanged.

| Area | Finding on clean baseline / older local source | Week 3 response |
| --- | --- | --- |
| Folder structure | `origin/master` has only a README. The older local `master` has standalone HTML pages and page-specific CSS. | Added only `src/components/ui`, `src/components/layout`, `src/features/profile`, `src/pages`, `src/app`, and assets required by Week 3. Older pages are not included. |
| Components | No reusable React components existed on the clean baseline. | Added typed Button, Input, Loading, Icon, Header, Footer, Left Menu, and AppShell components. |
| State | No application state existed on the clean baseline. | Added a Redux Toolkit profile slice, with localStorage persistence for editable profile details. |
| Style | The clean baseline has no styles. | New UI uses Tailwind with Figma colors in theme tokens and includes only the font files used by the new UI. |
| Data/API | No API layer or profile endpoint exists. | Profile assets use typed mock data. Profile edits are local-only until an API is available. |
| Code quality | No app code existed on the clean baseline. | New UI uses TypeScript, semantic elements, labeled controls, route-based navigation, and a production build/type check. |

## Branch sequence

The branches are stacked in order: `origin/master` → `develop` → `feat/components` → `feat/layouts` → `feat/connect-ui` → `feat/profile-ui`. The final feature branch is merged back into `develop` with a merge commit. All branches remain local until explicitly pushed.

## Run and verify

```sh
npm install
npm run dev
npm run build
```

Open `/profile/tokens` or `/profile/nfts`. The profile design uses static wallet and asset values from Figma. Profile edits are saved in this browser's localStorage. Authentication, live balances, and full contract addresses require an API integration in a later sprint.

The Figma Starter MCP limit was reached while requesting the Footer node. Its reusable component follows the visible layout pattern and should be checked against that node when access is available. The integrated browser could not reach this machine's localhost server, so visual browser QA remains open; the production build and local HTTP route/asset checks passed.
