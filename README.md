# University maintenance request system

Connected React/Vite frontend and Express/MongoDB backend. The backend is in the adjacent folder: `E:\GROUP PROJECT\backend`.

## Start the complete application

From this frontend folder:

```sh
npm start
```

This builds the frontend and starts the backend, which serves the built application at **http://127.0.0.1:5000**. MongoDB must be running. On Windows PowerShell, use `npm.cmd` if execution policy blocks `npm`.

For frontend development, keep the backend running and use `npm run dev` in a second terminal. Open **http://127.0.0.1:5173**. Vite proxies `/api` to the backend at port 5000; `API_PROXY_TARGET` can override that target. Production uses the same-origin `/api` routes.

## First-time backend setup

Run in `E:\GROUP PROJECT\backend`:

```sh
npm install
npm run setup
npm run seed
```

The setup preserves configured database values. Seeding adds only missing accounts, departments, campus locations, and stock. It never deletes existing data or resets existing passwords. The backend `.env` controls `MONGODB_URI`, `PORT`, `JWT_SECRET`, and allowed `FRONTEND_ORIGIN` values. Backend source files from before integration are preserved in its `.integration-backup-*` directory.

## Workflow

1. **Staff member:** submit a problem, location, and optional attachments.
2. **HOD:** approve or reject requests from their department.
3. **Dean:** approve or reject HOD-approved requests in their faculty.
4. **Head of Maintenance:** forward the approved request to a supervisor.
5. **Supervisor:** assign a technician to inspect it.
6. **Technician:** submit findings, required materials, and estimated work time.
7. **Supervisor:** select materials and quantities, then click **Send materials to technician**. No people or work-arrangement notes are required.
8. **Technician:** complete the work and submit a completion report with actual hours/minutes and the quantity used for each material. Record `0` for unused items.
9. **Supervisor:** check the completed work and actual usage, add verification notes, give a required 1–5 quality rating, and close the request.

The server enforces the role, request ownership, department/faculty scope, and order of every step. After the supervisor sends materials, the technician sees the job under **My tasks**. Returning to an open tab refreshes its status automatically; **Refresh status** is also available in the task workspace. Submitting a completion report changes the request to **Awaiting supervisor verification**; it is counted as completed only after the assigned supervisor checks and rates it. Supervisors cannot skip the technician report. Staff can follow progress and send messages, and do not need to close completed work.

Technicians can select multiple inventory materials and a quantity (1–500) for each inspection. Supervisors receive those selections and can adjust their arrangement quantities; the original inspection report remains unchanged. Completion reports record actual usage separately (0–500 per material) and compare arranged versus used quantities. Additional items or equipment can be described in the notes. Use **Parts requests** to request stock from Central Stores. Usage reporting does not deduct already-issued stock a second time. Outstanding parts requests must be processed before final supervisor verification.

Each role gets a simple dashboard showing requests that need their action. The same request details page shows the current stage, next step, inspection report, maintenance team, messages, and history.

## Seed accounts

New development accounts use **`Admin@1234`**, unless `SEED_PASSWORD` was configured before seeding. Existing account passwords are unchanged. Both username and email login work.

| Username | Role |
| --- | --- |
| `user` | Staff member |
| `deptadmin` | Head of Department |
| `dean` | Dean |
| `head` | Head of Maintenance |
| `supervisor` | Maintenance Supervisor |
| `technician` | Technician |
| `storekeeper` | Store Keeper |
| `admin` | System Administrator |

The former frontend-only `user/user` accounts have been replaced by server authentication. Password changes, account creation, suspension, and password resets now update MongoDB. New accounts can sign in using their assigned email/username and initial password. Account managers can create only their permitted roles; HODs and Deans are also restricted to their department/faculty.

## Persisted features

Requests, approvals, inspection and completion reports, actual work time and material usage, supervisor ratings, arrangements, comments, notifications, users, settings, campus locations, and inventory records are stored in MongoDB. Reloading or restarting the server does not reset them. Sessions use HTTP-only cookies and survive page reloads.

Tabs in the same browser profile share one signed-in account. Signing in or out synchronizes the other tabs, and the API blocks actions from a screen belonging to an older account. To test different roles simultaneously, use separate browser profiles or different browsers.

JPG/PNG/PDF attachments are saved in the backend `uploads/` directory and have authenticated previews/downloads. Keep both the database and uploads when moving the application. Parts requests reach Central Stores; issuance updates stock and history. Outstanding parts requests must be processed before supervisor completion. Reports and CSV downloads use current server data.

Notifications are delivered inside the portal and refresh automatically. External email/SMS delivery is not configured.

## Validation

```sh
npm run build
npm run lint
npm run test:api
npm run test:ui
```

API tests start a real backend against a unique temporary MongoDB database. They verify the full workflow, forbidden actions, skipped stages, rejection reasons, department/ownership checks, concurrent stock issuance, file access, notifications, account permissions, password changes, and persistence after server restart.

Browser tests start an isolated backend and Vite proxy on available ports, use all eight roles, and verify real form submissions, approvals, inspections, stock issuance, supervisor completion, uploads, messages, persistent sessions, CSV contents, accounts, settings, and desktop/mobile layouts. They require Chrome with remote debugging on port 9222 and a local app page open beside that debugging session.

Both test suites preserve the live application's database and remove only their own temporary test databases. Browser screenshots/downloads are kept in the OS temporary directory. Set `BACKEND_DIR` if the backend is not in the adjacent `../backend` folder.
