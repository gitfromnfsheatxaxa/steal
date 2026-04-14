/**
 * One-time repair script: patches existing plan_exercises records so
 * the new `name` field is populated.
 *
 * Run AFTER restarting PocketBase (so the migration adds the name field).
 *
 * Usage:
 *   node pocketbase/fix-exercise-names.mjs <email> <password>
 *
 * Example:
 *   node pocketbase/fix-exercise-names.mjs user@example.com mypassword
 */

const [, , email, password] = process.argv

if (!email || !password) {
  console.error("Usage: node fix-exercise-names.mjs <email> <password>")
  process.exit(1)
}

const BASE = "http://127.0.0.1:8090/api"

async function api(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(opts.headers ?? {}) },
    ...opts,
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`${res.status} ${path}: ${err}`)
  }
  return res.json()
}

// 1. Authenticate as regular user
const auth = await api("/collections/users/auth-with-password", {
  method: "POST",
  body: JSON.stringify({ identity: email, password }),
})
const token = auth.token
console.log(`✓ Authenticated as ${auth.record.email}`)

const headers = { Authorization: token }

// 2. Fetch all plan_exercises that have no name
let page = 1
let patched = 0
let skipped = 0

while (true) {
  const result = await api(
    `/collections/plan_exercises/records?page=${page}&perPage=100&sort=created`,
    { headers }
  )

  if (result.items.length === 0) break

  for (const record of result.items) {
    if (record.name && record.name.trim() !== "") {
      skipped++
      continue
    }

    // Generate a fallback name from order
    const fallback = `Exercise ${record.order ?? 1}`
    await api(`/collections/plan_exercises/records/${record.id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ name: fallback }),
    })
    console.log(`  patched ${record.id} → "${fallback}"`)
    patched++
  }

  if (page >= result.totalPages) break
  page++
}

console.log(`\n✓ Done. Patched: ${patched}  Already had name: ${skipped}`)
