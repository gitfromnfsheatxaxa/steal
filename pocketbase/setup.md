# PocketBase Setup — Steal Therapy

## 1. Download PocketBase

Open **PowerShell** from the project root and run:

```powershell
.\pocketbase\download.ps1
```

This downloads the latest PocketBase Windows binary to `pocketbase\pocketbase.exe`.

> Alternatively, download manually from https://pocketbase.io/docs/ and place `pocketbase.exe` in the `pocketbase\` folder.

---

## 2. Start the server

```powershell
cd pocketbase
.\pocketbase.exe serve
```

PocketBase runs at `http://127.0.0.1:8090` by default. Keep this terminal open.

---

## 3. Create your admin account

Open `http://127.0.0.1:8090/_/` in your browser and create an admin account. You only do this once — credentials are stored in `pocketbase\pb_data\`.

---

## 4. Import the schema

1. In the Admin UI, go to **Settings → Import collections**
2. Paste the contents of `pocketbase\pb_schema.json` (or drag-and-drop the file)
3. Click **Review → Confirm** — this creates all 10 collections

Collections imported:
- `users` (auth)
- `profiles`, `goals`
- `exercises`
- `workout_plans`, `plan_days`, `plan_exercises`
- `plan_templates`
- `workout_sessions`, `session_sets`

---

## 5. Start the Next.js app

Open a **second terminal** at the project root:

```bash
npm run dev
```

App runs at `http://localhost:3000`.

---

## 6. Set up AI keys (for plan generation)

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8090
ANTHROPIC_API_KEY=sk-ant-...        # get from console.anthropic.com
# or: OPENAI_API_KEY=sk-...
AI_MODEL=claude-sonnet-4-20250514
```

The generate-plan API route tries Anthropic first, falls back to OpenAI if `ANTHROPIC_API_KEY` is missing.

---

## 7. Seed exercise data (optional but recommended)

The app generates plans by name — exercises are matched in the `exercises` collection by slug. Without seed data, plans will still be generated and saved but the exercise detail pages will be empty.

A seed script can be added later. For now, exercises are created automatically when the AI generates a plan and references an unknown slug.

---

## Dev workflow summary

| Terminal | Command | Purpose |
|---|---|---|
| 1 | `cd pocketbase && .\pocketbase.exe serve` | Backend API + Admin UI |
| 2 | `npm run dev` | Next.js frontend |

- Admin UI: `http://127.0.0.1:8090/_/`
- App: `http://localhost:3000`
- PocketBase API: `http://127.0.0.1:8090/api/`

---

## Troubleshooting

**`ERR_CONNECTION_REFUSED` on login/register**
PocketBase isn't running. Start it with `.\pocketbase.exe serve` in the `pocketbase\` folder.

**`pb_data` already exists after re-download**
That's fine — `pb_data\` holds your database. The binary download only extracts `pocketbase.exe` and doesn't touch data.

**Port conflict on 8090**
Run with a custom port: `.\pocketbase.exe serve --http=127.0.0.1:8091`
Then update `NEXT_PUBLIC_API_URL=http://127.0.0.1:8091` in `.env.local`.

**Collections not showing after import**
Refresh the Admin UI page. If still missing, check the JSON is valid and retry the import.
