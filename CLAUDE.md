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
