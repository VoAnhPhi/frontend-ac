# FE Phi Vo - Appscyclone

This repository contains weekly frontend internship exercises. The `week-02` branch is a complete TODO app built with React, TypeScript, Redux Toolkit, React Hook Form, React Router, i18n, Tailwind CSS, and Shadcn/UI-style components.

## Run the project

Node.js 20 or later is required.

```sh
npm install
npm run dev
```

Open the URL printed by Vite, usually [http://localhost:5173](http://localhost:5173).

## Routes

| Route    | Purpose                                      |
| -------- | -------------------------------------------- |
| `/`      | App introduction and learning topics         |
| `/todos` | Manage tasks on a drag-and-drop Kanban board |
| `*`      | Not found page                               |

## Week 02 features

- Create, edit, and delete tasks.
- Drag tasks between Todo, In progress, and Completed columns.
- Move tasks with accessible arrow controls on keyboard and mobile.
- Search tasks by title or description.
- Clear all completed tasks.
- Validate forms with React Hook Form and Zod.
- Store tasks, theme, and language in Local Storage.
- Switch between Vietnamese and English.
- Switch between light and dark themes using Context API.
- Manage business state with Redux Toolkit and typed hooks.
- Navigate with React Router.
- Render responsive, accessible Shadcn/UI-style components.

## Main structure

```text
src/
├── app/                   # Typed Redux store and hooks
├── components/            # Layout and reusable UI components
├── contexts/              # Theme context
├── features/todos/        # Todo types, slice, storage, tests, UI
├── hooks/                 # Feature hooks
├── i18n/                  # Vietnamese and English resources
├── pages/                 # Route pages
├── App.tsx                # Route definitions
└── main.tsx               # Providers and app entry point
```

The Week 01 static HTML pages and assets remain in the repository for reference. The React application uses the root `index.html` as its Vite entry point.

## Data flow

```text
Local Storage -> Redux preloaded state -> React UI
User action -> Redux reducer -> store subscription -> Local Storage
```

## Quality checks

Run these commands before committing:

```sh
npm run format:check
npm run typecheck
npm run lint
npm test
npm run build
```

## Weekly checklist

### Week 01

- [x] Build the original Figma pages with HTML, CSS, and JavaScript.
- [x] Add responsive layouts and browser interactions.

### Week 02

- [x] Set up Vite, React, TypeScript, Tailwind CSS, and Shadcn/UI conventions.
- [x] Add React Router routes and a responsive layout.
- [x] Add Redux Toolkit state management with typed hooks.
- [x] Add complete TODO CRUD, search, and a three-column Kanban board.
- [x] Add pointer, touch, and keyboard drag-and-drop with fallback controls.
- [x] Persist todos and preferences in Local Storage.
- [x] Add React Hook Form and Zod validation.
- [x] Add Vietnamese and English translations.
- [x] Add a Context API light and dark theme.
- [x] Add reducer tests and production checks.
- [ ] Create a merge request.

## Git conventions

Use two-digit weekly branch names: `week-01`, `week-02`, `week-03`, and so on.
