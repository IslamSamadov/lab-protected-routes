# Notes — Protected Routes Lab

## The decision point: Option A vs Option B

I went with **Option B** — gave `ProtectedRoute` a `requiredRole` prop instead
of checking the role inside `app/admin/page.js` directly.

```jsx
<ProtectedRoute requiredRole="ADMIN">
  <AdminPanel />
</ProtectedRoute>
```

**Why:**

- The rule "who is allowed to see this page" is a policy decision, not page
  content. It belongs in one place, not copy-pasted into every page that
  needs a role check.
- If PostHub grew to ten admin-only pages, Option A means writing the same
  `user.role === "ADMIN" ? ... : <AccessDenied />` ternary ten times. The day
  someone forgets it on page #7, that page is silently wide open to any
  logged-in user — and nothing fails loudly to catch the mistake.
- With Option B, a protected-and-gated page is always one line:
  `<ProtectedRoute requiredRole="X">`. There's no way to "forget" the check,
  because the check lives in the wrapper everyone already has to use anyway.

**Tradeoff I'm accepting:**

- `ProtectedRoute` now has to know about specific role strings, which is one
  more thing for someone to understand when reading it for the first time.
  Option A keeps the logic visible exactly where it's used, which is more
  readable for a single page in a small app.
- For *this* app (one admin page), Option A would honestly be simpler and
  just as correct. I chose B because the prompt explicitly asks "what would
  you want if this grew to ten admin pages," and B is the answer that scales
  without a forgettable manual step.

## Other implementation notes

- `ProtectedRoute` waits for `loading` to resolve before deciding whether to
  redirect. Redirecting while `loading` is still `true` would kick out users
  who are actually logged in, just because `/me` hasn't come back yet.
- The role gate (`requiredRole`) is a **render decision**, not a redirect.
  A logged-in `USER` who hits `/admin` stays on `/admin` and sees
  "Access Denied" inline — they don't get bounced to `/login`, since they
  *are* authenticated, just not authorized for this page. Conflating those
  two would be confusing (it would look like login failed).
- In every "not yet allowed" branch, `ProtectedRoute` returns `null` instead
  of `children`, so there's no flash of protected content before the
  redirect or denial kicks in.

## Bugs hit while building this (and the actual cause)

- **Login failing with "wrong email or password, or backend not running"**
  even with correct credentials — actual cause was a frontend/backend port
  mismatch (`NEXT_PUBLIC_API_URL` pointing at the wrong port), not bad
  credentials. The error message conflates network failures with auth
  failures, which is worth remembering as a debugging trap for next time.
- **Admin login working but role check still failing** — the original
  `DataSeeder.java` had a single early `return` guarding *both* seed users,
  keyed off whether `demo@ironhack.com` already existed. Once demo existed,
  the seeder returned before ever reaching the admin block, so the admin
  user never got created. Fixed by giving each user its own independent
  `existsByEmail` check instead of one shared early exit.
- **CORS mismatch after changing the frontend's port** — Spring's
  `corsConfigurationSource()` only allows `http://localhost:3000` as an
  origin. Running the frontend on a different port (e.g. 3001) gets
  silently blocked by CORS even though `credentials: "include"` is set
  correctly on the frontend. Kept both servers on the README's default
  ports (`8080` backend, `3000` frontend) to avoid this entirely.

## Verified against the checklist

- [x] Logged-out user visiting `/posts` → redirected to `/login`
- [x] Logged-out user visiting `/admin` → redirected to `/login`
- [x] Logged-in `USER` visiting `/admin` → "Access Denied", panel never renders
- [x] Logged-in `ADMIN` visiting `/admin` → full panel
- [x] Navbar shows name + role + Sign Out when logged in
- [x] Navbar shows Login when logged out
- [x] Delete button: admin-only, removes post from local state on click
- [x] No flash of protected content before redirect
- [x] No console errors