# Maintenance Tracking System — Backend

Node.js + Express + Mongoose, connected to MongoDB Atlas.

## Setup

1. Copy the config template:
   ```bash
   cp config/db.config.example.json config/db.config.json
   ```
2. Open `config/db.config.json` and replace `<username>`, `<password>`, and `<cluster-address>`
   with your real Atlas values. The database name (`maintanace-request-system`) is already filled in.
3. Install dependencies:
   ```bash
   npm install
   ```

`config/db.config.json` is already listed in `.gitignore` — it will never be committed to Git,
so each teammate keeps their own copy locally.

## Running

```bash
npm start          # start the API server
npm run seed        # wipe and reseed the database with sample data
npm run validate    # check all schemas are structurally valid (no DB connection needed)
```

## Project structure

```
config/
  db.js                     MongoDB connection (reads db.config.json)
  db.config.example.json    Template — safe to commit
  db.config.json            Your real credentials — gitignored, never commit
models/                      One file per collection (Mongoose schemas)
  Request.js                 Embeds report, purchase_requests[], stock_requests[],
                              inspections[], attachments[]
  Inventory.js                Merged central + per-department stock, with an
                              embedded distribution_log[] on the central record
seed/seed.js                 Populates sample departments, staff, an item, inventory,
                              and one full sample request end-to-end
seed/validate_schemas.js     Sanity-checks every schema without needing a live DB
server.js                    Express entry point
```

## Next steps (not yet built)

- `routes/auth.js` — login/register against `User` + bcrypt
- `routes/requests.js` — create/forward/close a request, matching the
  escalation workflow (Staff → HOD → Dean → Maintenance Head → Supervisor → Technician)
- `routes/inventory.js` — stock requests pulling from `Inventory`, distribution
  from central to department
- JWT middleware for auth, and role checks based on `Staff.type_id`
