# YOGYASETU — Phase 5

Role-Based + API-Driven Competency Platform prototype for SIH 2026.

## Stack
- React + Vite
- Tailwind CSS
- React Router
- Lucide React
- Recharts
- Fetch-based API service layer
- Deterministic rule-based Competency Engine

## Phase 5: API Integration & Data Flow
The frontend now has a shared API layer, role-specific services, response normalization, demo-mode persistence, loading/error/empty states, and end-to-end competency data flow.

### Environment
Copy `.env.example` to `.env` if needed.

```env
VITE_DEMO_MODE=true
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT_MS=10000
```

- `VITE_DEMO_MODE=true`: use the realistic local mock data layer. No backend is required.
- `VITE_DEMO_MODE=false`: use the configured API. If the API/base URL is missing or a request fails, the UI shows an error; it does **not** fabricate a successful API response.
- No API keys or secrets are stored in frontend source.

## Run
```bash
npm install
npm run dev
```

## Demo accounts
- Trainee: `trainee@capacityconnect.demo` / `demo-password`
- Trainer: `trainer@capacityconnect.demo` / `demo-password`
- Admin: `admin@capacityconnect.demo` / `demo-password`

These are development-only demo credentials defined in the existing mock authentication layer.

## API service architecture
- `src/services/api.js` — fetch wrapper, timeout, bearer-token support, environment/demo configuration.
- `src/services/authService.js` — login, signup, current user, logout.
- `src/services/traineeService.js` — trainee profile, courses, assessments, certificates, notifications.
- `src/services/trainerService.js` — trainer profile, resources, questionnaires, performance.
- `src/services/courseService.js` — catalog, details, enrollment, module completion, admin course helpers.
- `src/services/assessmentService.js` — assessment list/detail, result submission, history.
- `src/services/resourceService.js` — resource CRUD.
- `src/services/adminService.js` — users, courses, announcements, admin insights.
- `src/services/competencyService.js` — fetches evidence and runs the Phase 4 rule-based engine.
- `src/services/dataAdapters.js` — normalizes alternate API response shapes into the frontend's internal format.
- `src/services/recommendationService.js` and `trainerMatchingService.js` — deterministic recommendations and trainer matching.

## API endpoint contract
The frontend adapters target these conventional REST paths. **No live backend is claimed or bundled with this project; these paths are integration contracts for the future API.**

- `POST /auth/login`
- `POST /auth/signup`
- `GET /auth/me`
- `POST /auth/logout`
- `GET /trainees/:id`
- `PUT /trainees/:id`
- `GET /trainees/:id/courses`
- `GET /trainees/:id/certificates`
- `GET /trainees/:id/notifications`
- `GET /courses`
- `GET /courses/:id`
- `POST /courses/:id/enroll`
- `PATCH /courses/:id/modules/:moduleId`
- `GET /assessments`
- `GET /assessments/:id`
- `GET /assessments/history?traineeId=:id`
- `POST /assessments/results`
- `GET /resources`
- `POST /resources`
- `PATCH /resources/:id`
- `DELETE /resources/:id`
- `GET /trainers`
- `GET /trainers/:id`
- `PUT /trainers/:id`
- `GET /trainers/:id/resources`
- `GET /trainers/:id/questionnaires`
- `POST /trainers/:id/questionnaires`
- `GET /trainers/:id/performance`
- `GET /admin/users`
- `PATCH /admin/users/:id`
- `GET /admin/courses`
- `GET /announcements`
- `POST /announcements`
- `GET /admin/insights`
- `GET /competencies`

## Competency data flow
Profile → assessment results → course completion → certificates → competency requirements → trainers/resources → deterministic weighted scoring → skill gaps → recommendations → trainer matching → Competency Passport.

### Weighted scoring
- Self-declared skills: 30%
- Assessment performance: 40%
- Relevant course completion: 20%
- Relevant certificate: 10%

`Final = Self × .30 + Assessment × .40 + Course × .20 + Certificate × .10`

Missing evidence contributes `0` to that evidence category. The UI displays score, weight, contribution, and evidence counts. The result is explicitly **rule-based, not AI-generated**.

## Testing notes
The project was inspected and updated from the existing Phase 4 workspace. The execution environment currently does not have the project's npm dependencies installed, and network package installation previously timed out, so a real Vite production build/browser smoke test cannot honestly be reported as successful here.

Recommended local acceptance flow:
1. `npm install`
2. `npm run dev`
3. Login as trainee.
4. Check profile, courses, enrollment and module progress.
5. Attempt an assessment and submit it.
6. Open Competency Engine and confirm the assessment evidence changes the weighted result.
7. Check skill gaps, recommendations, trainer matches and Competency Passport.
8. Login as trainer and test resource/questionnaire/performance flows.
9. Login as admin and test users, courses, resources, announcements and competency insights.
10. Set `VITE_DEMO_MODE=false` with an actual API base URL to exercise live API requests and failure states.
11. Resize to mobile width and verify responsive layouts.
12. Run `npm run build` locally for the final production-build check.
