# Project Guide: User Management API (Made Super Simple)

## 1. Big Picture (What is this project?)
This project is a small web server that can manage users.

It can:
- create a user
- show all users
- show one user by id
- update a user
- delete a user

Think of it like a smart notebook:
- the notebook stores user cards
- the API is the person you talk to
- the database is where cards are kept safely

## 2. What problem does it solve?
When an app needs user data, it needs a reliable backend.
This backend gives clean rules for creating and reading user data.

## 3. Tech Stack (in simple words)
- `Node.js`: runs JavaScript on the server
- `Express`: helps build API routes quickly
- `PostgreSQL`: database where users are stored
- `pg`: talks from Node.js to PostgreSQL
- `Knex`: runs database migrations (database setup scripts)
- `Jest`: test runner
- `Supertest`: sends fake HTTP requests to test API endpoints
- `Testcontainers`: starts a real temporary PostgreSQL container for integration tests
- `Swagger`: API docs page at `/docs`
- `Husky + lint-staged`: quality checks before commit

## 4. Project Structure (what each folder does)
- `backend/src/server.js`: starts the real app server
- `backend/src/app.js`: builds the Express app (routes + middleware)
- `backend/src/routes/user.routes.js`: route map (`POST`, `GET`, `PUT`, `DELETE`)
- `backend/src/controllers/user.controller.js`: handles request/response
- `backend/src/services/user.service.js`: business rules and validations
- `backend/src/repositories/user.repository.js`: SQL queries to database
- `backend/src/middlewares/error.middleware.js`: converts errors to HTTP status codes
- `backend/src/config/db.js`: creates DB connection pool
- `backend/migrations/001_create_users.js`: creates `users` table
- `backend/tests/unit`: fast unit tests (service logic)
- `backend/tests/integration`: full API + DB flow tests
- `backend/tests/integration/helpers/test-db.js`: integration DB setup/cleanup
- `backend/tests/external`: external API mock example test
- `backend/.husky/pre-commit`: runs checks before commit

## 5. How data flows (full request journey)
Example: create user (`POST /api/users`)

1. Client sends JSON: `{ "email": "a@b.com", "name": "A" }`
2. Route (`user.routes.js`) sends request to controller `create`
3. Controller calls service `createUser(req.body)`
4. Service validates required fields (`email`, `name`)
5. Service calls repository `create(data)`
6. Repository executes SQL insert
7. Database stores row and returns created user
8. Controller returns `201` + created user JSON

If something fails:
- controller catches error and calls `next(err)`
- `error.middleware.js` maps:
  - `User not found` -> `404`
  - `Invalid input` -> `400`
  - anything else -> `500`

## 6. Process flow (how app starts)
When you run `npm start` or `npm run dev`:
1. `src/server.js` loads environment variables (`dotenv`)
2. Creates PostgreSQL pool (`createPool`)
3. Builds repository -> service
4. Creates Express app with `createApp({ userService })`
5. Starts listening on `PORT`

## 7. API endpoints
- `POST /api/users` -> create user
- `GET /api/users` -> list users
- `GET /api/users/:id` -> get one user
- `PUT /api/users/:id` -> update user name
- `DELETE /api/users/:id` -> delete user
- `GET /docs` -> Swagger documentation

## 8. Database workflow
Migration file `001_create_users.js` creates:
- `id` (UUID primary key)
- `email` (unique, required)
- `name` (required)
- timestamps (`created_at`, `updated_at`)

Run migrations with:
```bash
npm run migrate
```

## 9. Testing workflow
### Unit tests
- test small logic in isolation (`tests/unit/user.service.test.js`)
- very fast

### Integration tests
- test full stack (route -> controller -> service -> repository -> DB)
- use real PostgreSQL container from `tests/integration/helpers/test-db.js`
- run migrations before tests
- clean table after each test for isolation

### External tests
- `nock` mocks outbound HTTP calls (`tests/external/gemini.test.js`

Run tests:
```bash
npm test
```

## 10. Commit quality gates (important)
Before each commit, `.husky/pre-commit` runs:
1. `npm test`
2. `npx lint-staged`

And `lint-staged` runs for staged `src/**/*.js`:
- `eslint --fix`
- `jest --findRelatedTests --bail`

Meaning: broken tests or bad lint should stop bad commits.

## 11. Standards already followed in this project
- Clear layering:
  - controller = HTTP logic
  - service = business logic
  - repository = DB logic
- Central error middleware for consistent API errors
- Parameterized SQL queries (`$1`, `$2`) to avoid SQL injection risks
- Test isolation in integration tests (table cleanup)
- API docs exposed with Swagger
- Pre-commit automated quality checks

## 12. Best practices to keep following
- Keep layers separate. Do not put SQL in controllers.
- Put validation and business rules in service layer.
- Throw meaningful errors in service/repository and map them in middleware.
- Add tests for every behavior change.
- Keep tests independent (no shared state assumptions).
- Use migrations for schema changes; never manually change prod schema.
- Keep secrets in env vars, never hardcode credentials.
- Keep commits small and focused.
- Update docs when endpoint behavior changes.

## 13. Safe workflow for contributors
1. Pull latest changes
2. Create a branch
3. Make small focused change
4. Run `npm test`
5. Fix failures
6. Commit (pre-commit hook runs)
7. Push and open PR

## 14. If a beginner asks "why so many files?"
Because each file has one job.

One big file is hard to read and easy to break.
Small focused files make bugs easier to find and fixes safer.

## 15. Glossary
- API: a waiter taking your order
- Route: the door where request enters
- Controller: the helper who reads request and returns response
- Service: the rule book
- Repository: the librarian who reads/writes DB
- Database: storage box of records
- Middleware: checkpoint in the request path
- Migration: upgrade script for database structure
- Test: practice run to catch mistakes early

## 16. Final core purpose in one line
Build a reliable, testable, maintainable user CRUD backend where every layer has one clear responsibility and every change is protected by automated checks.

---

# Frontend: User Management UI

## 1. Big Picture (What is this project?)
This project is a web front-end for the User Management API. It allows users to see, create, update, and delete users through a graphical interface in their browser.

It provides a user-friendly way to interact with the backend API without needing to use command-line tools.

## 2. Tech Stack (in simple words)
- `Next.js`: A React framework for building user interfaces. It handles routing and server-side rendering.
- `React`: A library for building user interface components.
- `zod`: for data validation.
- `jest`: The test runner for running automated tests.
- `React Testing Library`: A library for testing React components in a way that resembles how a user interacts with them.
- `@testing-library/user-event`: Simulates user actions like clicking and typing in tests.
- `msw` (Mock Service Worker): Intercepts network requests during tests to provide mock API responses. This allows the frontend to be tested independently of the backend.
- `jest-html-reporters`: Generates an HTML report of test results.

## 3. Project Structure (what each folder does)
- `frontend/src/app/page.tsx`: The main entry point of the application UI.
- `frontend/src/features/users/users-page.tsx`: The main component that renders the user list and form.
- `frontend/src/lib/api/users.ts`: Functions for making API calls to the backend.
- `frontend/src/test/msw/`: Contains the MSW server setup for mocking API calls in tests.
- `frontend/src/features/users/__tests__/`: Contains integration tests for the user feature.
- `frontend/jest.config.js`: Configuration for the Jest test runner.
- `frontend/eslint.config.mjs`: Configuration for the ESLint linter.

## 4. Testing Workflow
The frontend has a robust testing setup to ensure reliability.

### Component Integration Tests
- Tests are written in `*.test.tsx` files inside `__tests__` directories.
- They use `React Testing Library` to render components and simulate user interactions.
- The goal is to test the component from the user's perspective.

### API Mocking
- `msw` is used to mock the backend API. This means tests run without needing the backend server to be running.
- The mock server is defined in `frontend/src/test/msw/` and is automatically started for all tests via `frontend/jest.setup.ts`.

### Test Reports
- After running the tests, a detailed HTML report is generated in `frontend/test-reports/`.
- This was added to provide a clear view of test results, similar to the backend.

Run tests:
```bash
npm test
```

## 5. Linting
- `ESLint` is used to enforce code quality and consistency.
- The configuration in `eslint.config.mjs` has been updated to ignore the `.next/` build directory, fixing errors related to generated code.

Run linter:
```bash
npm run lint
```

