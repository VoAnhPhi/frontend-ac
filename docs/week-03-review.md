# Week 3 source review

Baseline: `develop`, created from `origin/master` at `6e6a6bd`. The remote master contains only the initial README. Local `master` has four additional HTML/CSS commits, so Week 3 was rebuilt without inheriting them. The existing `master`, `week-01`, and `week-02` branches remain unchanged.

| Area             | Finding on clean baseline / older local source                                                               | Week 3 response                                                                                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Folder structure | `origin/master` has only a README. The older local `master` has standalone HTML pages and page-specific CSS. | Added only `src/components/ui`, `src/components/layout`, `src/features/profile`, `src/pages`, `src/app`, and assets required by Week 3. Older pages are not included. |
| Components       | No reusable React components existed on the clean baseline.                                                  | Added typed Button, Input, Textarea, Loading, Icon, Header, Footer, Left Menu, and AppShell components. Icon wrappers preserve the intrinsic Figma glyph size.        |
| State            | No application state existed on the clean baseline.                                                          | Added a Redux Toolkit profile slice, with localStorage persistence for editable profile details.                                                                      |
| Style            | The clean baseline has no styles.                                                                            | New UI uses Tailwind with Figma colors in theme tokens and includes only the font files used by the new UI.                                                           |
| Data/API         | No API layer or profile endpoint exists.                                                                     | Profile assets use typed mock data. Profile edits are local-only until an API is available.                                                                           |
| Code quality     | No app code existed on the clean baseline.                                                                   | New UI uses TypeScript, semantic elements, labeled controls, route-based navigation, responsive layouts, and a production build/type check.                           |

## Branch sequence

The branches are stacked in order: `origin/master` → `develop` → `feat/components` → `feat/layouts` → `feat/connect-ui` → `feat/profile-ui`. The final feature branch is merged back into `develop` with a merge commit. All branches remain local until explicitly pushed.

## Run and verify

```sh
npm install
npm run dev
npm run build
```

Available routes:

- `/` — Connect Wallet dashboard with Register and Sign-in states
- `/token/create` and `/token/list`
- `/nft/create` and `/nft/list`
- `/profile/tokens` and `/profile/nfts`

The profile design uses static wallet and asset values from Figma. Profile edits are saved in this browser's localStorage. Authentication, live balances, and full contract addresses require an API integration in a later sprint.

Visual QA covered every route at 1440px and 500px widths, plus the Register dialog, Mint dialog, mobile navigation drawer, and account dropdown. The route audit found no horizontal overflow. Each screen was reviewed directly in the authenticated Figma browser at its source frame: Connect Wallet, Token Creator, Token List, NFT Creator, NFT List, Profile/Tokens, Profile/NFTs, and the shared component page.
