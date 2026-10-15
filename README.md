# University maintenance portal

React and Vite frontend for reporting, reviewing, assigning, and tracking campus maintenance.

## Run locally

```sh
npm install
npm run dev
```

On Windows PowerShell, use `npm.cmd` if script execution policies block `npm`.

## Demo accounts

| Role | Username | Password |
| --- | --- | --- |
| General user | `user` | `user` |
| Department admin | `deptadmin` | `deptadmin` |
| Technician | `technician` | `technician` |
| Store keeper | `storekeeper` | `storekeeper` |
| Super admin | `admin` | `admin` |

These are local demonstration accounts, not production authentication. State is shared across navigation and role sign-ins in the same page session. Reloading resets requests, uploads, inventory changes, locations, settings, and demo password changes. The theme preference is saved locally. There is no backend, email/SMS service, database backup, or cross-device synchronization.

## Main workflows

- Staff see their own requests, a clear next step, and a three-step request form. JPG/PNG/PDF uploads contain real file data and support preview/download.
- Department admins review requests for their department and assign technicians. Technicians see their own tasks, record findings, request parts, and send repair reports.
- Parts requests reach Central Stores. Issuing them updates stock, transaction history, and the task’s parts status. Purchase requests and stock adjustments are also recorded in transaction history.
- Only the requester can confirm a finished repair. Feedback is saved on the request.
- Notifications and unread counts share state. New workflow events appear in the relevant users’ notifications.
- Request, report, and audit CSV exports download actual data. Reports use the current request data and selected filters.
- New locations appear in request forms. Portal settings update the header/support details; response targets apply to new and newly approved requests.

## Validation

```sh
npm run build
npm run lint
```

`npm run test:ui` runs browser smoke checks without extra dependencies. First start Vite at `http://127.0.0.1:5173` and open that page in a separate Chrome instance with remote debugging on port `9222` and a temporary user profile. The script uses Chrome DevTools Protocol through Node’s built-in WebSocket API.

The checks cover all five roles, ownership filtering, request validation, actual uploads/previews, messages, CSV contents, review/assignment, parts issuance, repair confirmation, notification counts, demo password changes, location creation, settings, and desktop/mobile layouts in both themes. Screenshots and downloads are saved in the operating system’s temporary directory.
