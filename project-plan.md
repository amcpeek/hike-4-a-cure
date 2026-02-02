# Hike 4 a Cure - Frontend Refactor Plan

## Overview

Major frontend refactor to create a 4-page application with admin capabilities, authentication, and eventually S3 photo uploads.

## Project Goals (In Priority Order)

1. **Learning experience** - Stay fresh on modern React patterns, try new technologies, prepare for job interviews
2. **Portfolio piece** - Showcase clean, well-structured code that demonstrates ability to use AI tools effectively
3. **Functional product** - Simple website for dad's non-profit where he (sole admin) can manage content

## Key Constraint

- **Public pages are read-only** - No user accounts, no public auth
- **Single admin** - Only one person (dad) needs to log in and edit content
- **Simple over clever** - Prioritize readable, maintainable code over complex abstractions

---

## Progress Tracker

### Phase 1: Foundation ✅ Complete

- [x] Create CLAUDE.md with project guidelines
- [x] Install dependencies (react-router-dom, MUI, React Query, etc.)
- [x] Create `types/index.ts`
- [x] Create `api/client.ts`
- [x] Create `api/sections.ts`
- [x] Create `api/fundraisers.ts`
- [x] Create `theme.ts`
- [x] Create `components/Layout/Layout.tsx`
- [x] Create `components/Layout/Navigation.tsx`
- [x] Update `main.tsx` with providers
- [x] Rewrite `App.tsx` with router setup
- [x] Create `.env.example`
- [x] Verify app loads without errors

### Phase 2: Admin Sections ✅ Complete

### Phase 3: Admin Fundraisers ✅ Complete

### Phase 4: Home Page ✅ Complete

### Phase 5: Fundraisers Page ✅ Complete

### Phase 6: Auth (Clerk) ✅ Complete

### Phase 7: WYSIWYG (TipTap) ✅ Complete

### Phase 8: S3 Uploads ✅ Complete

### Phase 9: Production (Render) ⏳ Next Up

### Phase 10: Testing ⬚ Lower Priority

---

## Code Quality Standards (Portfolio Focus)

Since this is a portfolio piece, we'll follow these standards:

### TypeScript

- Strict mode enabled (already is)
- No `any` types - explicit interfaces for everything
- Zod schemas double as runtime validation AND type inference

### Folder Structure

```
client/src/
├── api/              # API calls - one file per resource
├── components/       # Reusable UI components
│   └── ui/           # Atomic components (buttons, inputs)
├── hooks/            # Custom React hooks
├── pages/            # Route components (smart components)
├── types/            # Shared TypeScript interfaces
├── lib/              # Utilities, helpers
└── App.tsx           # Router only
```

### Naming Conventions

- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utils: `camelCase.ts`
- Types: `PascalCase` for interfaces, `camelCase` for type aliases

### Component Patterns

- **Container/Presentational** - Pages fetch data, components display it
- **Custom hooks** - Extract logic from components (e.g., `useSections`, `useScrollSpy`)
- **Composition over props** - Use children and slots, not prop drilling

### What Makes This "Portfolio Quality"

- Clean git history with meaningful commits
- Consistent patterns across the codebase
- TypeScript used properly (not just `any` everywhere)
- Modern React (hooks, React Query, no class components)
- Proper error and loading states
- Responsive design
- Accessibility basics (semantic HTML, keyboard nav)

## Final Route Structure

| Route                | Purpose                       | Priority |
| -------------------- | ----------------------------- | -------- |
| `/admin/sections`    | CRUD for homepage sections    | Phase 2  |
| `/admin/fundraisers` | CRUD for archive entries      | Phase 3  |
| `/`                  | Home page (sections with nav) | Phase 4  |
| `/fundraisers`       | Archive (fundraisers by year) | Phase 5  |

**Note:** Admin pages first so you can add content, then build public views to display it.

---

## Tech Stack Additions

| Category            | Choice                                | Why (Learning Context)                                                                                                              |
| ------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Routing             | `react-router-dom` v6                 | Industry standard. Every React job uses it. Learn nested routes, loaders.                                                           |
| UI Library          | MUI (Material UI)                     | Most popular React component library. Great for portfolios - shows you can work with design systems.                                |
| Server State        | React Query (`@tanstack/react-query`) | **Hot technology**. Replaces manual useEffect fetching. Interviewers love seeing this. Handles caching, refetching, loading states. |
| Forms               | React Hook Form + Zod                 | RHF is performant (no re-renders). Zod provides runtime validation + TypeScript inference from one schema. Modern pattern.          |
| Toasts              | Sonner                                | Minimal, beautiful. One-liner to use.                                                                                               |
| Auth (Phase 6)      | Clerk                                 | For your dad (single admin). Clerk is easier than building auth, and shows you know when NOT to reinvent the wheel.                 |
| Rich Text (Phase 7) | TipTap                                | Modern WYSIWYG built on ProseMirror. Headless (you control the UI). Impressive in portfolios.                                       |

**Why these matter for interviews:**

- React Query → "Tell me about data fetching" - you can explain stale-while-revalidate, cache invalidation
- Zod → "How do you handle validation?" - you can explain schema-first, type inference
- MUI → "Have you worked with component libraries?" - yes, and I understand theming, sx prop, composition

---

## Implementation Phases

### Phase 1: Foundation

**Goal:** Set up routing, API layer, MUI, and base components

**Tasks:** 0. Create `CLAUDE.md` in project root (see bottom of this doc for contents)

1. Install dependencies:
   - `react-router-dom`
   - `@mui/material` `@mui/icons-material` `@emotion/react` `@emotion/styled`
   - `@tanstack/react-query`
   - `react-hook-form` `@hookform/resolvers` `zod`
   - `sonner`

2. Create folder structure:

   ```
   client/src/
   ├── api/                 # API service layer
   │   ├── client.ts        # Base fetch wrapper
   │   ├── sections.ts      # Section API calls
   │   └── fundraisers.ts   # Fundraiser API calls
   ├── components/          # Reusable components
   │   ├── Layout/          # App shell, nav
   │   ├── PhotoManager/    # Photo URL input/display
   │   └── ui/              # Buttons, inputs, cards
   ├── pages/               # Route components
   │   ├── Home/
   │   ├── Fundraisers/
   │   └── Admin/
   ├── hooks/               # Custom hooks
   ├── types/               # TypeScript interfaces
   ├── lib/                 # Utilities
   └── App.tsx              # Router setup
   ```

3. Set up MUI theme provider with custom theme

4. Create API client with environment-aware base URL:

   ```typescript
   const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
   ```

5. Set up React Query provider

6. Set up React Router with placeholder routes

7. Create base Layout component with:
   - Header/AppBar
   - Responsive navigation (horizontal tabs → hamburger on mobile)
   - Main content area
   - Toast container (Sonner)

**Files to modify:**

- `client/src/App.tsx` - Complete rewrite (router setup)
- `client/src/main.tsx` - Add providers
- `client/package.json` - Add dependencies
- `client/.env.example` - Create with VITE_API_URL

**Files to create:**

- `CLAUDE.md` (project root - code quality guidelines)
- `client/src/api/client.ts`
- `client/src/api/sections.ts`
- `client/src/api/fundraisers.ts`
- `client/src/types/index.ts`
- `client/src/components/Layout/Layout.tsx`
- `client/src/components/Layout/Navigation.tsx`
- `client/src/theme.ts`

**Verification:**

- App loads without errors
- Navigation shows placeholder routes
- React Query devtools visible in dev mode

---

### Phase 2: Admin Sections Page

**Goal:** Full CRUD for sections so you can add homepage content

**Tasks:**

1. Create `/admin/sections` page with:
   - List view of all sections (cards showing title, order, photo count)
   - "Add Section" button → opens form
   - Edit button per section → opens form with data
   - Delete button with confirmation dialog
   - Drag-to-reorder functionality (uses existing `/api/sections/reorder`)

2. Create SectionForm component with React Hook Form + Zod:
   - Title (required)
   - Description (textarea for now, WYSIWYG later)
   - Order (number)
   - Photo URLs (add/remove list)

3. Implement validation:

   ```typescript
   const sectionSchema = z.object({
     title: z.string().min(1, "Title is required"),
     description: z.string().optional(),
     order: z.number().min(0),
     photos: z.array(
       z.object({
         url: z.string().url("Must be a valid URL"),
         tag: z.string().optional(),
       }),
     ),
   });
   ```

4. Add toast notifications for success/error states

5. Create PhotoManager component:
   - List of current photos with delete button
   - Input to add new photo URL + optional tag
   - Preview thumbnails

**Files to create:**

- `client/src/pages/Admin/Sections/SectionsAdmin.tsx`
- `client/src/pages/Admin/Sections/SectionForm.tsx`
- `client/src/components/PhotoManager/PhotoManager.tsx`
- `client/src/components/ConfirmDialog/ConfirmDialog.tsx`

**Verification:**

- Can create a new section
- Can edit existing section
- Can delete section with confirmation
- Can add/remove photos
- Can reorder sections (drag or move up/down buttons)
- Form validation shows errors
- Toast notifications appear

---

### Phase 3: Admin Fundraisers Page

**Goal:** Full CRUD for fundraisers (archive entries)

**Tasks:**

1. Create `/admin/fundraisers` page with:
   - List view sorted by year (descending)
   - Shows: year, title, amount raised, photo count
   - Add/Edit/Delete functionality

2. Create FundraiserForm component:
   - Year (required, unique)
   - Title
   - Description
   - Amount Raised (currency input)
   - Photos with tags

3. Validation schema:

   ```typescript
   const fundraiserSchema = z.object({
     year: z.number().min(2000).max(2100),
     title: z.string().optional(),
     description: z.string().optional(),
     amountRaised: z.number().min(0),
     photos: z.array(
       z.object({
         url: z.string().url(),
         tag: z.string().optional(),
       }),
     ),
   });
   ```

4. Reuse PhotoManager component from Phase 2

**Files to create:**

- `client/src/pages/Admin/Fundraisers/FundraisersAdmin.tsx`
- `client/src/pages/Admin/Fundraisers/FundraiserForm.tsx`

**Verification:**

- Can create fundraiser with year
- Can edit existing fundraiser
- Can delete with confirmation
- Photos work correctly
- Amount displays as currency

---

### Phase 4: Home Page (Public Sections View)

**Goal:** Display sections with sticky left navigation

**Tasks:**

1. Create Home page with two-column layout:
   - Left: Sticky navigation (list of section titles)
   - Right: Scrollable sections content

2. Implement scroll behavior:
   - Clicking nav item scrolls to that section
   - URL updates to `/#section-slug` on scroll
   - Direct URL navigation (`/#about-us`) scrolls to section
   - Active nav item highlights based on scroll position (Intersection Observer)

3. Section display:
   - Title (h2)
   - Description (rendered HTML for future WYSIWYG)
   - Photo gallery (grid of images)

4. Mobile responsive:
   - Below 768px: horizontal tab bar at top (scrollable)
   - Or hamburger menu with slide-out drawer

**Files to create:**

- `client/src/pages/Home/Home.tsx`
- `client/src/pages/Home/SectionNav.tsx`
- `client/src/pages/Home/SectionContent.tsx`
- `client/src/components/PhotoGallery/PhotoGallery.tsx`

**Verification:**

- Sections load and display
- Nav clicks scroll smoothly
- URL hash updates on scroll
- Direct hash URL navigates correctly
- Mobile nav works (hamburger or horizontal tabs)

---

### Phase 5: Fundraisers Page (Public Archive View)

**Goal:** Display fundraisers by year with similar nav pattern

**Tasks:**

1. Create Fundraisers page:
   - Left: Sticky nav showing years
   - Right: Fundraiser cards by year

2. Fundraiser card shows:
   - Year (prominent)
   - Title
   - Description
   - Amount raised (formatted currency)
   - Photo gallery (uniform sizing)

3. Same scroll/nav behavior as Home page

4. Mobile responsive: Same pattern as Home

**Files to create:**

- `client/src/pages/Fundraisers/Fundraisers.tsx`
- `client/src/pages/Fundraisers/FundraiserNav.tsx`
- `client/src/pages/Fundraisers/FundraiserCard.tsx`

**Verification:**

- Fundraisers display by year
- Nav scrolls to correct year
- Photos display uniformly
- Currency formatted correctly
- Mobile works

---

### Phase 6: Authentication with Clerk

**Goal:** Protect admin routes so only your dad can edit content

**Context:** This is single-user auth. Your dad is the only admin. Public users just view content (read-only). We use Clerk because:

- It's faster than building auth yourself
- It's secure (you don't want to mess up password hashing)
- Shows good judgment in interviews ("I used Clerk because auth is a solved problem")

**Tasks:**

1. Set up Clerk:
   - Create Clerk account (free tier is fine)
   - Create one user account for your dad
   - Install `@clerk/clerk-react`
   - Add `VITE_CLERK_PUBLISHABLE_KEY` to env

2. Wrap app with ClerkProvider

3. Create protected route wrapper:

   ```typescript
   const ProtectedRoute = ({ children }) => {
     const { isSignedIn, isLoaded } = useAuth();
     if (!isLoaded) return <Loading />;
     if (!isSignedIn) return <RedirectToSignIn />;
     return children;
   };
   ```

4. Protect `/admin/*` routes only (public routes stay open)

5. Add sign-in/sign-out to admin header only (public pages don't show auth UI)

6. Backend: Add Clerk middleware to verify tokens on mutation routes (POST, PUT, DELETE)
   - GET routes stay public (anyone can view)
   - Only mutations require auth

**Files to modify:**

- `client/src/main.tsx` - Add ClerkProvider
- `client/src/App.tsx` - Wrap admin routes
- `client/src/components/Layout/Layout.tsx` - Conditional auth button
- `server/index.js` - Add Clerk middleware
- `server/routes/sections.js` - Protect POST/PUT/DELETE
- `server/routes/fundraisers.js` - Protect POST/PUT/DELETE

**Files to create:**

- `client/src/components/ProtectedRoute.tsx`

**Verification:**

- Public pages (`/`, `/fundraisers`) work without login
- `/admin/*` redirects to sign-in if not logged in
- Your dad can sign in and access admin
- API GET requests work without auth
- API mutations fail without valid token

---

### Phase 7: WYSIWYG Editor (TipTap)

**Goal:** Rich text editing for descriptions

**Tasks:**

1. Install TipTap:
   - `@tiptap/react`
   - `@tiptap/starter-kit`
   - `@tiptap/extension-image`
   - `@tiptap/extension-link`

2. Create RichTextEditor component:
   - Toolbar: bold, italic, headings, lists, links
   - Content area
   - Outputs HTML string

3. Replace textarea in SectionForm and FundraiserForm

4. Update display components to render HTML safely:
   - Use `dangerouslySetInnerHTML` with sanitization
   - Or use TipTap's read-only mode

**Files to create:**

- `client/src/components/RichTextEditor/RichTextEditor.tsx`
- `client/src/components/RichTextEditor/Toolbar.tsx`

**Files to modify:**

- `client/src/pages/Admin/Sections/SectionForm.tsx`
- `client/src/pages/Admin/Fundraisers/FundraiserForm.tsx`
- `client/src/pages/Home/SectionContent.tsx`
- `client/src/pages/Fundraisers/FundraiserCard.tsx`

**Verification:**

- Can format text (bold, italic, etc.)
- Can add links
- HTML saves to database
- HTML renders correctly on public pages

---

### Phase 8: S3 Photo Uploads + WYSIWYG Images

**Goal:** Upload photos directly instead of pasting URLs, and insert images into rich text editor

**Tasks:**

1. Backend: Set up AWS S3 bucket and IAM

2. Backend: Create presigned URL endpoint:

   ```javascript
   // POST /api/upload/presign
   // Returns: { uploadUrl, fileUrl }
   ```

3. Frontend: Create FileUpload component:
   - Drag-and-drop zone
   - Click to browse
   - Shows upload progress
   - Returns final S3 URL

4. Update PhotoManager to support both:
   - URL input (existing)
   - File upload (new)

5. Add image support to RichTextEditor:
   - Install `@tiptap/extension-image`
   - Add image button to toolbar
   - Upload image to S3, insert into editor
   - Position controls (float left/right, align center)
   - Size controls (drag handles or presets: small/medium/large/full-width)

**Files to create:**

- `server/routes/upload.js`
- `client/src/components/FileUpload/FileUpload.tsx`
- `client/src/api/upload.ts`

**Files to modify:**

- `server/index.js` - Add upload routes
- `client/src/components/PhotoManager/PhotoManager.tsx`
- `client/src/components/RichTextEditor/RichTextEditor.tsx` - Add Image extension
- `client/src/components/RichTextEditor/Toolbar.tsx` - Add image button with position/size controls

**Verification:**

- Can drag-and-drop image
- Upload progress shows
- Image appears in S3
- URL saved to database
- Image displays on page
- Can insert image into WYSIWYG editor
- Can position image (left/center/right/float)
- Can resize image in editor

---

### Phase 9: Production Deployment (Render)

**Goal:** Deploy the app to Render with working frontend, backend, and all integrations

**Architecture:**

- **Backend**: Render Web Service (Express API)
- **Frontend**: Render Static Site (React/Vite)
- **Database**: MongoDB Atlas (already cloud-hosted)
- **Storage**: AWS S3 (already configured)
- **Auth**: Clerk (already configured)

---

#### Step 1: Prepare the Codebase

1. **Create server package.json** (Render needs this for backend):

   ```bash
   # In /server folder, create package.json:
   {
     "name": "hike-4-a-cure-server",
     "version": "1.0.0",
     "main": "index.js",
     "scripts": {
       "start": "node index.js"
     },
     "dependencies": {
       "@aws-sdk/client-s3": "^3.x.x",
       "@aws-sdk/s3-request-presigner": "^3.x.x",
       "cors": "^2.x.x",
       "dotenv": "^16.x.x",
       "express": "^4.x.x",
       "mongoose": "^8.x.x"
     }
   }
   ```

   Run `npm install` in server folder to generate package-lock.json.

2. **Update CORS for production** in `server/index.js`:

   ```javascript
   const allowedOrigins = [
     "http://localhost:5173",
     process.env.FRONTEND_URL, // Add this env var in Render
   ].filter(Boolean);

   app.use(
     cors({
       origin: allowedOrigins,
       credentials: true,
     }),
   );
   ```

3. **Create `.env.example`** (document all required vars):

   ```
   # Server (.env in root)
   PORT=5001
   MONGO_URI=mongodb+srv://...
   AWS_REGION=us-west-1
   AWS_ACCESS_KEY_ID=...
   AWS_SECRET_ACCESS_KEY=...
   AWS_S3_BUCKET=...
   FRONTEND_URL=https://your-frontend.onrender.com

   # Client (client/.env.local)
   VITE_API_URL=http://localhost:5001/api
   VITE_CLERK_PUBLISHABLE_KEY=pk_...
   ```

4. **Verify builds work locally**:
   ```bash
   cd client && npm run build  # Should create client/dist/
   ```

---

#### Step 2: MongoDB Atlas - Allow Render IPs

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Select your cluster → **Network Access** → **Add IP Address**
3. Add `0.0.0.0/0` (allow from anywhere) or add Render's static IPs
4. This is required because Render uses dynamic IPs

---

#### Step 3: Deploy Backend (Render Web Service)

1. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Web Service**

2. Connect your GitHub repo: `amcpeek/hike-4-a-cure`

3. Configure the service:
   - **Name**: `hike-4-a-cure-api`
   - **Region**: Oregon (US West) - close to your S3 bucket
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Instance Type**: Free (or Starter for always-on)

4. Add **Environment Variables**:
   | Key | Value |
   |-----|-------|
   | `MONGO_URI` | Your MongoDB Atlas connection string |
   | `AWS_REGION` | `us-west-1` |
   | `AWS_ACCESS_KEY_ID` | Your AWS key |
   | `AWS_SECRET_ACCESS_KEY` | Your AWS secret |
   | `AWS_S3_BUCKET` | `hike-4-a-cure-photos` |
   | `FRONTEND_URL` | (Add after frontend deploy) |

5. Click **Create Web Service**

6. Note your backend URL: `https://hike-for-a-cure-api.onrender.com`

---

#### Step 4: Deploy Frontend (Render Static Site)

1. In Render Dashboard → **New** → **Static Site**

2. Connect the same GitHub repo

3. Configure the site:
   - **Name**: `hike-for-a-cure`
   - **Branch**: `main`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. Add **Environment Variables**:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://hike-for-a-cure-api.onrender.com/api` |
   | `VITE_CLERK_PUBLISHABLE_KEY` | Your Clerk publishable key |

5. Click **Create Static Site**

6. Note your frontend URL: `https://hike-for-a-cure.onrender.com`

---

#### Step 5: Connect Frontend to Backend

1. Go back to your **Web Service** (backend) in Render
2. Add/update environment variable:
   - `FRONTEND_URL` = `https://hike-for-a-cure.onrender.com`
3. This allows CORS from your frontend

---

#### Step 6: Configure Clerk for Production

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your app → **Domains**
3. Add your production domain: `hike-for-a-cure.onrender.com`
4. If using a custom domain later, add that too

---

#### Step 7: Configure S3 CORS (if needed)

If images don't load, update your S3 bucket CORS:

1. AWS Console → S3 → Your bucket → **Permissions** → **CORS**
2. Add:
   ```json
   [
     {
       "AllowedOrigins": [
         "http://localhost:5173",
         "https://hike-for-a-cure.onrender.com"
       ],
       "AllowedMethods": ["GET", "PUT"],
       "AllowedHeaders": ["*"],
       "MaxAgeSeconds": 3000
     }
   ]
   ```

---

#### Step 8: Test Everything

1. **Frontend loads**: Visit `https://hike-for-a-cure.onrender.com`
2. **API works**: Visit `https://hike-for-a-cure-api.onrender.com`
3. **Auth works**: Try signing in with Clerk
4. **Data loads**: Sections and fundraisers appear
5. **Images load**: Photos from S3 display correctly
6. **Admin works**: Can create/edit/delete (when signed in)

---

#### Optional: Custom Domain

1. In Render, go to your Static Site → **Settings** → **Custom Domains**
2. Add your domain (e.g., `hike4acure.org`)
3. Update DNS records as instructed
4. Update Clerk with the new domain
5. Update `FRONTEND_URL` env var in backend

---

**Files to modify:**

- `server/index.js` - Add dynamic CORS
- `server/package.json` - Create if doesn't exist
- `.env.example` - Document all environment variables

**Verification:**

- [ ] Backend deploys and shows "API is running" at root URL
- [ ] Frontend deploys and loads without errors
- [ ] API calls work (sections/fundraisers load)
- [ ] Clerk auth works in production
- [ ] Image uploads work
- [ ] No console errors in production

---

### Phase 10: Testing (Lower Priority)

**Goal:** Add test coverage for confidence in refactoring and portfolio quality

**Frontend Testing (Vitest + React Testing Library):**

1. Install:
   - `vitest` `@testing-library/react` `@testing-library/jest-dom` `@testing-library/user-event`
   - `msw` (Mock Service Worker for API mocking)

2. Test priorities:
   - Custom hooks (`useSections`, `useScrollSpy`) - unit tests
   - Form validation schemas - unit tests
   - API layer - integration tests with MSW
   - Key user flows - integration tests (create section, edit fundraiser)

3. Test file convention: `ComponentName.test.tsx` next to component

**Backend Testing (Jest + Supertest):**

1. Install: `jest` `supertest`

2. Test priorities:
   - API endpoints - integration tests
   - Validation logic - unit tests
   - Auth middleware - unit tests

**Files to create:**

- `client/src/setupTests.ts`
- `client/vitest.config.ts`
- `client/src/api/__tests__/sections.test.ts`
- `client/src/hooks/__tests__/useSections.test.ts`
- `server/__tests__/sections.test.js`
- `server/__tests__/fundraisers.test.js`

**Verification:**

- `npm test` runs in both client and server
- Tests pass
- Coverage report shows key paths tested

---

## Summary: Implementation Order

1. **Phase 1: Foundation** ✅ - Routing, MUI, API layer, base components
2. **Phase 2: Admin Sections** ✅ - CRUD with forms, validation, photos
3. **Phase 3: Admin Fundraisers** ✅ - CRUD reusing Phase 2 patterns
4. **Phase 4: Home Page** ✅ - Public sections display
5. **Phase 5: Fundraisers Page** ✅ - Public archive display
6. **Phase 6: Auth** ✅ - Clerk integration
7. **Phase 7: WYSIWYG** ✅ - TipTap rich text
8. **Phase 8: S3 Uploads** ✅ - File upload replacing URL input
9. **Phase 9: Production (Render)** ⏳ - Deploy to Render, custom domain later
10. **Phase 10: Testing** ⬚ - FE and BE test coverage (lower priority)

---

## Key Files Reference

**Current files to heavily modify:**

- [App.tsx](client/src/App.tsx) - Complete rewrite for routing
- [main.tsx](client/src/main.tsx) - Add providers

**Backend (mostly unchanged):**

- [server/routes/sections.js](server/routes/sections.js) - Add auth middleware in Phase 6
- [server/routes/fundraisers.js](server/routes/fundraisers.js) - Add auth middleware in Phase 6
- [server/index.js](server/index.js) - Add new routes in Phase 6, 8

---

## Testing Strategy

After each phase:

1. Manual testing of all new functionality
2. Verify no regressions in existing features
3. Test on mobile viewport (Chrome DevTools)
4. Check React Query devtools for proper caching
5. Verify console has no errors/warnings

---

## CLAUDE.md - Project Instructions File

Create `CLAUDE.md` in the project root. This file is automatically read before each task.

```markdown
# Hike 4 a Cure - Development Guidelines

## STRICT BOUNDARIES (READ FIRST)

- **NEVER run git commands** - no commits, no pushes, no branch operations. Tell me what to run instead.
- **NEVER modify files outside this repo** - stay within /hike-4-a-cure only
- **NEVER run commands that affect system-level config** - no global installs, no env modifications outside this project
- If unsure whether something is in-scope, ASK first.

## Project Context

- Portfolio project demonstrating modern React patterns
- Single admin (dad) manages content, public users are read-only
- Priority: clean, readable code over clever abstractions

## Code Quality Rules

### DO

- Write code a human would write - natural variable names, logical flow
- Keep functions small and single-purpose
- Use TypeScript strictly - no `any`, explicit return types on exports
- Follow existing patterns in the codebase
- Name things clearly: `fetchSections` not `getData`, `isLoading` not `loading`
- Destructure props and use named exports
- Handle loading and error states explicitly
- Use early returns to reduce nesting

### DON'T (Avoid AI Slop)

- Don't add comments that restate the code ("// increment counter" above counter++)
- Don't over-abstract - no factory functions for one-time operations
- Don't add unused parameters "for future use"
- Don't create helper files with one function
- Don't add excessive error handling for impossible states
- Don't use overly generic names (data, info, item, handler)
- Don't add console.logs that will be left in
- Don't create interfaces for objects used once

### File Organization

- Components: `src/components/ComponentName/ComponentName.tsx`
- Pages: `src/pages/PageName/PageName.tsx`
- Hooks: `src/hooks/useHookName.ts`
- API: `src/api/resourceName.ts`
- Types: `src/types/index.ts` (shared) or colocated with component

### Patterns to Follow

- React Query for all server state
- React Hook Form + Zod for forms
- MUI components with sx prop for styling
- Custom hooks to extract component logic
- Colocate related code (component + styles + tests)

### Before Committing

- Remove console.logs
- Remove commented-out code
- Check for unused imports
- Verify TypeScript has no errors
- Test the feature manually

### Git Commits (User runs these, not Claude)

- Use conventional commits: feat:, fix:, refactor:, docs:
- Keep commits focused on one change
- Example: `git commit -m "feat: add sections admin page with CRUD"`
```

**Where this file goes:** Root of the project (`/CLAUDE.md`)

**Why this matters:** I read this file before every task. It keeps my output consistent with your standards and reminds me what "quality" means for this specific project.
