# Frontend Guide (Next.js)

This frontend is designed to mirror your backend quality style: layered architecture, automated tests, and predictable workflows.

## 1. What you get
- Next.js App Router frontend in `backend/frontend`
- Real CRUD UI for users
- Internal Next API proxy to your backend (avoids CORS issues)
- Test setup with unit + integration-style tests
- Validation with Zod

## 2. Packages used and why
### Runtime
- `next`, `react`, `react-dom`: frontend framework/runtime
- `zod`: input and response schema validation

### Testing
- `jest`: test runner
- `@testing-library/react`: component testing
- `@testing-library/user-event`: realistic user interactions
- `@testing-library/jest-dom`: extra DOM assertions
- `msw`: API mocking for integration-style frontend tests
- `whatwg-fetch`: fetch polyfill in test environment

### Code quality
- `eslint` + `eslint-config-next`: linting best practices
- `prettier`: formatting
- `lint-staged`: run checks only on changed files

## 3. Frontend architecture
- `src/app`: app router pages and API route handlers
- `src/features/users`: UI feature module
- `src/lib/api`: frontend API client functions
- `src/lib/schemas`: zod schemas + shared types
- `src/lib/server`: backend proxy utility for route handlers
- `src/test/msw`: test API mocks and in-memory data

## 4. Data flow (browser to database)
1. UI calls `createUser/listUsers/updateUser/deleteUser` in `src/lib/api/users.ts`
2. These call Next route handlers: `/api/users` and `/api/users/:id`
3. Route handlers proxy to backend `BACKEND_API_URL` (default `http://localhost:3000`)
4. Backend performs actual CRUD in PostgreSQL
5. Result comes back to UI

## 5. How to write frontend tests
### Unit test pattern
Use for pure logic/schema checks.

Example file: `src/lib/schemas/__tests__/user.test.ts`
- assert valid payload passes
- assert invalid payload throws

### Integration-style component test pattern
Use for UI + API behavior together.

Example file: `src/features/users/__tests__/users-page.integration.test.tsx`
- render page component
- interact with form/buttons via `userEvent`
- assert UI updates after mocked API response

### API client test pattern
Use for request/response handling behavior.

Example file: `src/lib/api/__tests__/users.test.ts`
- call API helper methods
- override handlers to simulate error cases
- assert thrown backend messages

## 6. Running frontend
From `backend/frontend`:
```bash
npm install
npm run dev
```
Open: `http://localhost:3001`

Make sure backend is running at `http://localhost:3000`.

## 7. Running tests
From `backend/frontend`:
```bash
npm test
```
Coverage:
```bash
npm run test:coverage
```

## 8. Good standards to keep following
- Keep UI code in feature modules (`src/features/...`)
- Keep API calls in `src/lib/api`, not inside components
- Validate request payloads with Zod before sending
- Always test success and failure paths
- Prefer deterministic tests with MSW (no external network)
- Keep route handlers thin and reusable via proxy helper
- Use strict TypeScript (`strict: true`)

## 9. Suggested commit workflow
1. Build feature in small PR-sized chunks
2. Add/adjust tests with each behavior change
3. Run lint + tests before commit
4. Keep commit messages explicit (`feat:`, `fix:`, `test:`)
