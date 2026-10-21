# Campus maintenance API

Express and MongoDB backend for the adjacent `Maintenance-Request-System` frontend. Requires Node 20+ and a running MongoDB service.

```sh
npm install
npm run setup
npm run seed
npm start
```

`setup` adds missing environment settings without replacing configured database values. `seed` adds missing development accounts, departments, locations, and stock. It never clears existing records or resets existing passwords.

The API listens on `http://127.0.0.1:5000` by default. The frontend Vite server proxies `/api` there. After building the adjacent frontend, this server can also serve its `dist` directory. Set `FRONTEND_DIST` if the folders are arranged differently.

## Workflow

1. **STAFF:** submit a request.
2. **HOD:** approve or reject requests from their department.
3. **DEAN:** approve or reject HOD-approved requests within their faculty.
4. **HEAD_OF_MAINTENANCE:** forward a Dean-approved request to an active supervisor.
5. **SUPERVISOR:** assign an active technician to inspect it.
6. **TECHNICIAN:** submit findings, required materials, and estimated work time.
7. **SUPERVISOR:** record arrangements and send the work back to the assigned technician.
8. **TECHNICIAN:** complete the work and submit actual time in minutes, materials used (including zero for unused items), and completion notes.
9. **SUPERVISOR:** check the work, confirm verification, add notes and a 1–5 rating, and close the request.

Roles, record ownership, department/faculty scope, and the order of these transitions are enforced by the API. `ARRANGEMENTS_IN_PROGRESS` assigns the actual work to the technician; `TECHNICIAN_COMPLETED` awaits supervisor verification. Only a verified, rated report transitions to `COMPLETED`. Existing completed records remain readable without a new report. Staff do not close requests. Rejected requests remain rejected. Material usage reporting preserves planned quantities and does not deduct already-issued stock again.

## Development accounts

New seed accounts use `SEED_PASSWORD`, or `Admin@1234` when it is unset. Existing passwords are preserved. Change development passwords before wider use.

| Username | Email | Role |
| --- | --- | --- |
| user | k.sivalingam@vau.ac.lk | Staff |
| deptadmin | hod.cs@vau.ac.lk | HOD |
| dean | dean@vau.ac.lk | Dean |
| head | head.maintenance@vau.ac.lk | Head of Maintenance |
| finance | finance.head@vau.ac.lk | Head of Finance |
| supervisor | supervisor@vau.ac.lk | Supervisor |
| technician | tech.electrical@vau.ac.lk | Technician |
| storekeeper | stores@vau.ac.lk | Store Keeper |
| admin | admin.it@vau.ac.lk | System Administrator |

## API

- `/api/auth/login`, `/api/auth/google`, `/api/auth/me`, `/api/auth/logout`, `/api/auth/change-password`, `/api/auth/users`, `/api/auth/users/create-staff`, `/api/auth/users/:id`, `/api/auth/technicians`
- `/api/workflow/tickets` and `/tickets/:id`
- `/api/workflow/tickets/hod-review`, `/dean-review`, `/forward-head`, `/assign-tech`, `/inspection-report`, `/fulfill-arrangements`, `/completion-report`, `/supervisor-review`
- `/api/workflow/tickets/:id/comments`
- `/api/uploads` and authenticated `/api/files/:id`
- `/api/inventory`, `/api/inventory/requests`, `/api/inventory/requests/:id/issue`, `/api/inventory/requests/:id/reject`, `/api/inventory/transactions`, `/api/inventory/purchase-requests`, `/api/inventory/purchase-requests/:id/approve`, `/api/inventory/purchase-requests/:id/reject`, `/api/inventory/purchase-requests/:id/receive`, `/api/inventory/:id/adjust`
- `/api/notifications`, `/read-all`, `/:id`
- `/api/departments`, `/api/locations`, `/api/settings`, `/api/audit-logs`, `/api/health`

Authentication uses an HTTP-only session cookie. Bearer tokens are also supported for API clients and integration tests. Passwords are hashed; changing a password or suspending an account invalidates its existing sessions. Configure a private `JWT_SECRET` and the allowed `FRONTEND_ORIGIN` values in `.env`.

Google sign-in uses `POST /api/auth/google` with `{ "credential": "<Google ID token>" }`. Configure `GOOGLE_CLIENT_ID` with the Web OAuth client ID from Google Cloud. The verified Google email must already belong to an active project account; Google sign-in does not create accounts or grant roles.

When Stores cannot issue an SR because stock is insufficient, the API creates a linked PR and notifies active Finance Heads. The maintenance request timeline includes the SR/PR status and Finance branch contact. A Finance Head reviews the PR using the approve/reject endpoints; Stores records received goods using `/purchase-requests/:id/receive`, then can issue the SR from inventory. The `finance` seed account is for development only.

`completion-report` requires `ticketId`, `details`, integer `actualTimeMinutes` (1–600000), and optional `materials` rows `{ itemId, quantity }` (integer 0–500) and `materialNotes`. `supervisor-review` requires `ticketId`, integer `rating` (1–5), nonempty `remarks`, and `confirmed: true`. The assigned supervisor cannot verify a report with outstanding parts or purchase requests. The old `fulfill-arrangements` completion flag is rejected; pass `isCompleted: false` to arrange work.

Requests, reports, notifications, accounts, settings, and stock are stored in MongoDB. Uploaded JPG/PNG/PDF files are saved in `uploads/` and served only to authorized users. Keep both MongoDB data and uploads when moving the application. In-app notifications are implemented; email/SMS delivery is not configured.

Run `node scripts/api-integration.mjs` from the frontend repository to verify the full API workflow against an isolated, automatically cleaned test database. Set `BACKEND_DIR` to this backend folder when testing the deployed copy.
