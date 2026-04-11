---
name: api-communication
description: Rules for calling existing backend. Auto-activate on fetch calls.
---
# API Rules
- Base URL from process.env.NEXT_PUBLIC_API_URL
- Always use the api.ts wrapper
- Proper error handling, retries, loading states
- Prefer TanStack Query for data fetching
